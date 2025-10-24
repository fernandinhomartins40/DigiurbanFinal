import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

// Helper para rotas async
function handleAsync(fn: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
}

// ====================== ROTAS PÚBLICAS ======================
// Não requerem autenticação - acessíveis para cadastro de cidadãos

// Carregar lista completa de municípios brasileiros
const municipiosBrasilPath = path.join(__dirname, '../data/municipios-brasil.json');
let municipiosBrasil: any[] = [];

try {
  console.log('📂 Carregando de:', municipiosBrasilPath);
  const data = fs.readFileSync(municipiosBrasilPath, 'utf8');
  municipiosBrasil = JSON.parse(data);
  console.log(`✅ Carregados ${municipiosBrasil.length} municípios brasileiros`);
  if (municipiosBrasil.length > 0) {
    console.log('📍 Exemplo:', municipiosBrasil[0]);
  }
} catch (error) {
  console.error('❌ Erro ao carregar municípios brasileiros:', error);
  municipiosBrasil = [];
}

// Função para remover acentos e normalizar texto
function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// GET /api/public/municipios-brasil - Listar todos os municípios brasileiros
router.get(
  '/municipios-brasil',
  handleAsync(async (req, res) => {
    const search = typeof req.query.search === 'string' ? req.query.search : '';
    const uf = typeof req.query.uf === 'string' ? req.query.uf.toUpperCase() : '';

    let resultados = municipiosBrasil;

    // Filtrar por UF se fornecido
    if (uf) {
      resultados = resultados.filter(m => m.uf === uf);
    }

    // Busca inteligente por nome (sem acentos)
    if (search && search.length >= 2) {
      const searchNormalized = normalizeString(search);
      resultados = resultados.filter(m => {
        const nomeNormalized = normalizeString(m.nome);
        return nomeNormalized.includes(searchNormalized);
      });
    }

    // Ordenar por população (maiores primeiro) e limitar a 50
    resultados = resultados
      .sort((a, b) => (b.populacao || 0) - (a.populacao || 0))
      .slice(0, 50);

    res.json({
      success: true,
      data: {
        municipios: resultados,
        total: resultados.length,
      },
    });
  })
);

// GET /api/public/municipios-disponiveis - Municípios com DigiUrban ativo
router.get(
  '/municipios-disponiveis',
  handleAsync(async (req, res) => {
    const search = typeof req.query.search === 'string' ? req.query.search : '';

    const whereClause: any = {
      status: { in: ['ACTIVE', 'TRIAL'] },
    };

    if (search && search.length >= 2) {
      whereClause.name = { contains: search, mode: 'insensitive' };
    }

    const tenantsAtivos = await prisma.tenant.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        
        population: true,
      },
      orderBy: { name: 'asc' },
      take: 50,
    });

    res.json({
      success: true,
      data: {
        municipios: tenantsAtivos,
        total: tenantsAtivos.length,
      },
    });
  })
);

// GET /api/public/municipio/:id - Verificar se município está disponível
router.get(
  '/municipio/:id',
  handleAsync(async (req, res) => {
    const { id } = req.params;

    const municipio = await prisma.tenant.findFirst({
      where: {
        id,
        status: { in: ['ACTIVE', 'TRIAL'] },
      },
      select: {
        id: true,
        name: true,
        
        population: true,
      },
    });

    if (!municipio) {
      res.status(404).json({
        success: false,
        error: 'MUNICIPIO_NAO_ENCONTRADO',
        message: 'Município não encontrado ou não disponível',
      });
      return;
    }

    res.json({
      success: true,
      data: { municipio },
    });
  })
);

export default router;


