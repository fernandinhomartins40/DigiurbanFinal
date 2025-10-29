import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AuthenticatedRequest, SuccessResponse, ErrorResponse, GuaranteedTenantRequest } from '../types';
import { validateCPF, validateStrongPassword } from '../utils/validators';
import { tenantMiddleware } from '../middleware/tenant';
import { asyncHandler } from '../utils/express-helpers';
import { BCRYPT_ROUNDS, JWT as JWT_CONFIG } from '../config/security';
import { loginRateLimiter, registerRateLimiter } from '../middleware/rate-limit';
import { accountLockoutMiddleware, recordFailedLogin, resetFailedAttempts } from '../middleware/account-lockout';
import { logLoginSuccess, logLoginFailed, AUDIT_EVENTS, logAuditEvent } from '../utils/audit-logger';
import { sanitizeForLog } from '../utils/logger';
import {
  buscarMunicipioValidado,
  gerarCnpjFicticio,
  gerarSlugMunicipio,
  obterMetadadosMunicipio,
} from '../services/municipio-validator';
import { UNASSIGNED_POOL_ID, isUnassignedPool } from '../config/tenants';

// ====================== ABORDAGEM HÍBRIDA ======================
// REGRA DE OURO: SEMPRE CRIAR, NUNCA REMOVER - mantendo sistema centralizado + compatibilidade Express

// CRIADO: tipo local para compatibilidade Express sem conflito de herança
type LocalTenantRequest = Request & {
  tenant?: {
    id: string;
    name: string;
    subdomain?: string;
    status: string;
    [key: string]: any;
  };
  tenantId?: string;
}

const router = Router();

// Schemas de validação com senha forte
const registerSchema = z.object({
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  // ✅ NOVO: Sistema híbrido - aceita municipioId OU código IBGE
  municipioId: z.string().optional(), // ID do tenant já existente
  codigoIbge: z.string().optional(), // Código IBGE (cria tenant automaticamente)
  nomeMunicipio: z.string().optional(), // Nome do município
  ufMunicipio: z.string().length(2).optional(), // UF (ex: SP, RJ)
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/\d/, 'Senha deve conter pelo menos um número')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Senha deve conter pelo menos um caractere especial'),
  address: z
    .object({
      street: z.string(),
      number: z.string(),
      neighborhood: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
    })
    .optional(),
}).refine(data => data.municipioId || (data.codigoIbge && data.nomeMunicipio && data.ufMunicipio), {
  message: 'É necessário informar municipioId OU (codigoIbge + nomeMunicipio + ufMunicipio)'
});

const loginSchema = z.object({
  login: z.string(), // CPF ou email
  password: z.string(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string()
    .min(8, 'Nova senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Nova senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Nova senha deve conter pelo menos uma letra minúscula')
    .regex(/\d/, 'Nova senha deve conter pelo menos um número')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Nova senha deve conter pelo menos um caractere especial'),
});

// Middleware para verificar tenant em todas as rotas
router.use(tenantMiddleware);

// POST /api/auth/citizen/register - Cadastro de cidadão (com rate limiting)
router.post('/register', registerRateLimiter, asyncHandler(async (req: LocalTenantRequest, res: Response) => {
  try {
    console.log('📝 Dados recebidos no cadastro:', sanitizeForLog(req.body));
    console.log('🏢 Tenant do request:', req.tenant);
    console.log('🆔 TenantId do request:', req.tenantId);

    const data = registerSchema.parse(req.body);

    let tenantSelecionado;

    // ✅ OPÇÃO 1: Tenant existente (município já está no DigiUrban)
    if (data.municipioId) {
      tenantSelecionado = await prisma.tenant.findFirst({
        where: {
          id: data.municipioId,
          status: { in: ['ACTIVE', 'TRIAL'] },
        },
      });

      if (!tenantSelecionado) {
        return res.status(400).json({
          success: false,
          error: 'MUNICIPIO_INVALIDO',
          message: 'Município selecionado não está disponível no momento'
        });
      }
    }
    // ✅ OPÇÃO 2: Criar tenant automaticamente baseado no código IBGE
    else if (data.codigoIbge && data.nomeMunicipio && data.ufMunicipio) {
      // 🔍 VALIDAR MUNICÍPIO: Verificar se existe no IBGE
      const municipioValido = buscarMunicipioValidado({
        codigoIbge: data.codigoIbge,
        nome: data.nomeMunicipio,
        uf: data.ufMunicipio,
      });

      if (!municipioValido) {
        return res.status(400).json({
          success: false,
          error: 'MUNICIPIO_INVALIDO',
          message: `Município "${data.nomeMunicipio} - ${data.ufMunicipio}" não encontrado no IBGE. Verifique se o nome e código IBGE estão corretos.`,
        });
      }

      // 🔍 BUSCA INTELIGENTE: Procurar tenant por código IBGE (prioridade), nome ou nome do tenant
      tenantSelecionado = await prisma.tenant.findFirst({
        where: {
          AND: [
            { status: { in: ['ACTIVE', 'TRIAL'] } }, // ✅ Apenas tenants ativos
            {
              OR: [
                { codigoIbge: municipioValido.codigo_ibge }, // ✅ Busca principal por código IBGE
                {
                  // Busca por nomeMunicipio e ufMunicipio (se preenchidos)
                  AND: [
                    { nomeMunicipio: municipioValido.nome },
                    { ufMunicipio: municipioValido.uf }
                  ]
                },
                {
                  // ✅ FALLBACK: Busca por nome do tenant contendo nome do município
                  // Ex: "Palmital - PR" encontra município "Palmital"
                  AND: [
                    { name: { contains: municipioValido.nome } },
                    {
                      OR: [
                        { ufMunicipio: municipioValido.uf },
                        { name: { contains: municipioValido.uf } }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
      });

      // ✅ SOLUÇÃO PROFISSIONAL: Se não existe tenant ativo, vincular ao UNASSIGNED_POOL
      if (!tenantSelecionado) {
        console.log(`⚠️  Município ${municipioValido.nome} - ${municipioValido.uf} não possui tenant ativo. Vinculando ao UNASSIGNED_POOL...`);

        // Buscar o tenant pool global
        tenantSelecionado = await prisma.tenant.findUnique({
          where: { id: UNASSIGNED_POOL_ID }
        });

        if (!tenantSelecionado) {
          return res.status(500).json({
            success: false,
            error: 'SYSTEM_ERROR',
            message: 'Sistema não configurado corretamente. Entre em contato com o suporte.'
          });
        }

        // Flag para indicar que é um cidadão não atribuído
        (req as any).isUnassignedCitizen = true;
        (req as any).requestedMunicipio = {
          nome: municipioValido.nome,
          uf: municipioValido.uf,
          codigoIbge: municipioValido.codigo_ibge
        };

        console.log(`✅ Cidadão será vinculado ao UNASSIGNED_POOL e aguardará ativação de ${municipioValido.nome} - ${municipioValido.uf}`);
      }
    }
    else {
      return res.status(400).json({
        success: false,
        error: 'DADOS_INCOMPLETOS',
        message: 'Informe municipioId ou (codigoIbge + nomeMunicipio + ufMunicipio)'
      });
    }

    // Validar CPF
    if (!validateCPF(data.cpf)) {
      return res.status(400).json({ error: 'CPF inválido' });
    }

    // Verificar se já existe cidadão com esse CPF no município
    const existingCitizen = await prisma.citizen.findFirst({
      where: {
        tenantId: tenantSelecionado.id,
        cpf: data.cpf,
      },
    });

    if (existingCitizen) {
      return res.status(400).json({ error: 'CPF já cadastrado neste município' });
    }

    // Verificar se já existe cidadão com esse email no município
    const existingEmail = await prisma.citizen.findFirst({
      where: {
        tenantId: tenantSelecionado.id,
        email: data.email,
      },
    });

    if (existingEmail) {
      return res.status(400).json({ error: 'Email já cadastrado neste município' });
    }

    // Hash da senha com rounds padronizados (OWASP 2024)
    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    // Criar cidadão com status de verificação pendente (Bronze)
    const citizen = await prisma.citizen.create({
      data: {
        tenantId: tenantSelecionado.id, // ✅ Usar tenant selecionado pelo usuário
        cpf: data.cpf,
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        address: data.address,
        isActive: true,
        verificationStatus: 'PENDING', // Bronze - pendente de validação administrativa
        registrationSource: 'SELF', // Auto-cadastro pelo portal do cidadão
      },
    });

    // Gerar token JWT com expiração configurada
    const token = jwt.sign(
      {
        citizenId: citizen.id,
        tenantId: tenantSelecionado.id, // ✅ Usar tenant selecionado
        type: 'citizen',
      },
      process.env.JWT_SECRET!,
      { expiresIn: JWT_CONFIG.CITIZEN_EXPIRES_IN }
    );

    // ✅ SEGURANÇA: Setar cookie httpOnly com o token
    res.cookie('digiurban_citizen_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000, // 8 horas
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.digiurban.com.br' : undefined,
    });

    // Remover senha da resposta
    const { password: _, ...citizenData } = citizen;

    // Log de auditoria: registro de cidadão
    await logAuditEvent({
      citizenId: citizen.id,
      tenantId: tenantSelecionado.id, // ✅ Usar tenant selecionado
      action: AUDIT_EVENTS.CITIZEN_REGISTERED,
      resource: '/api/auth/citizen/register',
      method: 'POST',
      details: {
        cpf: citizen.cpf,
        email: citizen.email,
        municipioSelecionado: tenantSelecionado.name, // ✅ Registrar município escolhido
      },
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      success: true,
    });

    // ✅ Mensagem diferenciada para cidadãos não atribuídos
    const isUnassigned = (req as any).isUnassignedCitizen;
    const requestedMunicipio = (req as any).requestedMunicipio;

    return res.status(201).json({
      success: true,
      message: isUnassigned
        ? `Cadastro realizado com sucesso! Sua cidade (${requestedMunicipio.nome} - ${requestedMunicipio.uf}) ainda não está disponível na plataforma. Você será notificado quando ela for ativada.`
        : `Cidadão cadastrado com sucesso em ${tenantSelecionado.name}`,
      data: {
        citizen: citizenData,
        municipio: {
          id: tenantSelecionado.id,
          name: isUnassigned ? `${requestedMunicipio.nome} - ${requestedMunicipio.uf}` : tenantSelecionado.name,
        },
      },
      tenantId: tenantSelecionado.id,
      // ✅ Flag indicando se é cidadão não atribuído (frontend pode exibir tela especial)
      isUnassigned: isUnassigned || false,
      ...(isUnassigned && {
        requestedMunicipio: {
          nome: requestedMunicipio.nome,
          uf: requestedMunicipio.uf,
          codigoIbge: requestedMunicipio.codigoIbge
        }
      })
    });
  } catch (error: unknown) {
    console.error('Erro no cadastro:', sanitizeForLog(error));

    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: 'issues' in error ? error.issues : [],
      });
    }

    // ✅ Tratamento específico para erros do Prisma
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any;

      // P2002: Unique constraint violation
      if (prismaError.code === 'P2002') {
        const fields = prismaError.meta?.target || [];
        return res.status(400).json({
          success: false,
          error: 'DUPLICATE_ENTRY',
          message: `Já existe um registro com ${fields.includes('cpf') ? 'este CPF' : fields.includes('email') ? 'este email' : 'estes dados'} neste município`,
          details: { fields }
        });
      }

      // P2003: Foreign key constraint violation
      if (prismaError.code === 'P2003') {
        return res.status(400).json({
          success: false,
          error: 'INVALID_REFERENCE',
          message: 'Município selecionado não encontrado',
        });
      }
    }

    return res.status(500).json({
      success: false,
      error: 'SYSTEM_ERROR',
      message: 'Erro interno do servidor'
    });
  }
}));

// POST /api/auth/citizen/login - Login INTELIGENTE de cidadão (sem precisar especificar tenant)
router.post('/login', loginRateLimiter, accountLockoutMiddleware('citizen'), asyncHandler(async (req: LocalTenantRequest, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    // ✅ SMART LOGIN: Buscar cidadão em QUALQUER tenant (igual admin)
    const citizen = await prisma.citizen.findFirst({
      where: {
        OR: [{ cpf: data.login }, { email: data.login }],
        isActive: true,
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            
            status: true,
          },
        },
      },
    });

    if (!citizen || !citizen.password) {
      // Registrar tentativa falhada (sem tenant específico)
      await logAuditEvent({
        action: AUDIT_EVENTS.LOGIN_FAILED,
        resource: '/api/auth/citizen/login',
        method: 'POST',
        tenantId: 'unknown',
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        success: false,
        details: { login: data.login, reason: 'Cidadão não encontrado' },
      });
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(data.password, citizen.password);
    if (!validPassword) {
      // Registrar tentativa falhada
      await recordFailedLogin('citizen', data.login, citizen.tenantId);
      await logLoginFailed(req, data.login, citizen.tenantId, 'Senha incorreta');
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Resetar contador de tentativas falhadas após sucesso
    await resetFailedAttempts('citizen', citizen.id);

    // Log de auditoria: login bem-sucedido
    await logLoginSuccess(req, 'citizen', citizen.id, citizen.tenantId);

    // Gerar token JWT com tenantId do cidadão
    const token = jwt.sign(
      {
        citizenId: citizen.id,
        tenantId: citizen.tenantId, // ✅ Usar tenant do cidadão
        type: 'citizen',
      },
      process.env.JWT_SECRET!,
      { expiresIn: JWT_CONFIG.CITIZEN_EXPIRES_IN }
    );

    // ✅ SEGURANÇA: Setar cookie httpOnly com o token
    res.cookie('digiurban_citizen_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000, // 8 horas
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.digiurban.com.br' : undefined,
    });

    // Remover senha da resposta
    const { password: _, ...citizenData } = citizen;

    return res.json({
      success: true,
      message: 'Login realizado com sucesso',
      citizen: citizenData,
      tenantId: citizen.tenantId, // ✅ RETORNAR tenantId para o frontend armazenar
    });
  } catch (error: unknown) {
    console.error('Erro no login:', sanitizeForLog(error));

    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: 'issues' in error ? error.issues : [],
      });
    }

    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// GET /api/auth/citizen/me - Dados do cidadão logado
router.get('/me', asyncHandler(async (req: LocalTenantRequest, res: Response) => {
  try {
    // ✅ Tentar obter token do cookie primeiro, depois do header (fallback)
    let token = req.cookies?.digiurban_citizen_token;

    // Fallback para header (compatibilidade temporária)
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { type: string; tenantId: string; citizenId: string };

    if (decoded.type !== 'citizen') {
      return res.status(401).json({ error: 'Token inválido para cidadão' });
    }

    const { tenant } = req;

    if (!tenant) {
      return res.status(400).json({ error: 'Tenant não identificado' });
    }

    // Buscar dados do cidadão
    const citizen = await prisma.citizen.findFirst({
      where: {
        id: decoded.citizenId,
        tenantId: tenant.id,
        isActive: true,
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            nomeMunicipio: true,
            ufMunicipio: true,
            codigoIbge: true,
            status: true,
          },
        },
        protocolsSimplified: {
          include: {
            service: true,
            department: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        familyAsHead: {
          include: {
            member: true,
          },
        },
        notifications: {
          where: { isRead: false },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!citizen) {
      return res.status(404).json({ error: 'Cidadão não encontrado' });
    }

    // Remover senha da resposta
    const { password: _, ...citizenData } = citizen;

    return res.json({
      citizen: citizenData,
      tenantId: citizen.tenantId,
      tenant: (citizen as any).tenant, // ✅ NOVO: Retornar dados completos do tenant (cast devido ao include)
    });
  } catch (error: unknown) {
    console.error('Erro ao buscar dados do cidadão:', error);

    if (error && typeof error === 'object' && 'name' in error && error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }

    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// POST /api/auth/citizen/change-password - Trocar senha
router.post('/change-password', asyncHandler(async (req: LocalTenantRequest, res: Response) => {
  try {
    // ✅ Tentar obter token do cookie primeiro, depois do header (fallback)
    let token = req.cookies?.digiurban_citizen_token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { type: string; tenantId: string; citizenId: string };

    if (decoded.type !== 'citizen') {
      return res.status(401).json({ error: 'Token inválido para cidadão' });
    }

    const data = changePasswordSchema.parse(req.body);
    const { tenant } = req;

    if (!tenant) {
      return res.status(400).json({ error: 'Tenant não identificado' });
    }

    // Buscar cidadão
    const citizen = await prisma.citizen.findFirst({
      where: {
        id: decoded.citizenId,
        tenantId: tenant.id,
        isActive: true,
      },
    });

    if (!citizen) {
      return res.status(404).json({ error: 'Cidadão não encontrado' });
    }

    // Verificar senha atual
    const validPassword = await bcrypt.compare(data.currentPassword, citizen.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }

    // Verificar se a nova senha é diferente da atual
    const isSamePassword = await bcrypt.compare(data.newPassword, citizen.password);
    if (isSamePassword) {
      return res.status(400).json({ error: 'A nova senha deve ser diferente da senha atual' });
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(data.newPassword, BCRYPT_ROUNDS);

    // Atualizar senha
    await prisma.citizen.update({
      where: { id: citizen.id },
      data: { password: hashedPassword },
    });

    // Log de auditoria: troca de senha
    await logAuditEvent({
      citizenId: citizen.id,
      tenantId: tenant.id,
      action: AUDIT_EVENTS.PASSWORD_CHANGE,
      resource: '/api/auth/citizen/change-password',
      method: 'POST',
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      success: true,
    });

    return res.json({
      success: true,
      message: 'Senha alterada com sucesso',
    });
  } catch (error: unknown) {
    console.error('Erro ao trocar senha:', error);

    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation error',
        details: error,
      });
    }

    if (error && typeof error === 'object' && 'name' in error && error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }

    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// POST /api/auth/citizen/logout - Logout (limpar cookie)
router.post('/logout', asyncHandler(async (req: LocalTenantRequest, res: Response) => {
  // ✅ Limpar cookie httpOnly
  res.clearCookie('digiurban_citizen_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
}));

export default router;
