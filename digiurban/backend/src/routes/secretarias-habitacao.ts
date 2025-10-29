import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { tenantMiddleware } from '../middleware/tenant';
import { authenticateToken, requireManager } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/express-helpers';
import { MODULE_BY_DEPARTMENT } from '../config/module-mapping';

const router = Router();

// Apply middleware
router.use(tenantMiddleware);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getStringParam(param: unknown): string {
  if (Array.isArray(param)) return String(param[0] || '');
  if (typeof param === 'string') return param;
  return '';
}

interface PrismaWhereClause {
  tenantId: string;
  OR?: Array<Record<string, { contains: string; mode: 'insensitive' }>>;
  status?: string;
  type?: string;
  [key: string]: unknown;
}

function createSafeWhereClause(params: {
  tenantId: string;
  search?: string;
  status?: string;
  type?: string;
  searchFields?: string[];
}): PrismaWhereClause {
  const where: PrismaWhereClause = {
    tenantId: params.tenantId
  };

  if (params.search && params.searchFields) {
    const searchConditions: Array<Record<string, { contains: string; mode: 'insensitive' }>> = [];
    params.searchFields.forEach(field => {
      searchConditions.push({
        [field]: { contains: params.search!, mode: 'insensitive' }
      });
    });
    if (searchConditions.length > 0) {
      where.OR = searchConditions;
    }
  }

  if (params.status) {
    where.status = params.status;
  }

  if (params.type) {
    where.type = params.type;
  }

  return where;
}

// ============================================================================
// STATS - Dashboard principal
// ============================================================================

router.get('/stats', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId;

  if (!tenantId) {
    res.status(400).json({ error: 'TenantId é obrigatório' });
    return;
  }

  // 1. Buscar departamento de Habitação
  const dept = await prisma.department.findFirst({
    where: {
      tenantId,
      code: 'HABITACAO'
    }
  });

  if (!dept) {
    res.status(404).json({ error: 'Departamento de Habitação não encontrado' });
    return;
  }

  // 2. Stats dos protocolos por módulo
  const protocolsByModule = await prisma.protocolSimplified.groupBy({
    by: ['moduleType', 'status'],
    where: {
      tenantId,
      departmentId: dept.id,
      moduleType: {
        in: MODULE_BY_DEPARTMENT.HABITACAO || []
      },
    },
    _count: true,
  });

  // 3. Contagem de registros em cada módulo
  const [
    attendancesCount,
    applicationsCount,
    landRegularizationsCount,
    rentAssistancesCount,
    housingUnitsCount,
    registrationsCount,
  ] = await Promise.all([
    prisma.housingAttendance.count({ where: { tenantId } }),
    prisma.housingApplication.count({ where: { tenantId } }),
    prisma.landRegularization.count({ where: { tenantId } }),
    prisma.rentAssistance.count({ where: { tenantId } }),
    prisma.housingUnit.count({ where: { tenantId } }),
    prisma.housingRegistration.count({ where: { tenantId } }),
  ]);

  // 4. Stats específicas de habitação
  const [
    pendingApplications,
    approvedApplications,
    activeRentAssistances,
    availableUnits,
    activeRegistrations,
    underAnalysisRegularizations,
  ] = await Promise.all([
    prisma.housingApplication.count({
      where: {
        tenantId,
        status: 'UNDER_ANALYSIS'
      }
    }),
    prisma.housingApplication.count({
      where: {
        tenantId,
        status: 'APPROVED'
      }
    }),
    prisma.rentAssistance.count({
      where: {
        tenantId,
        status: 'APPROVED'
      }
    }),
    prisma.housingUnit.count({
      where: {
        tenantId,
        status: 'AVAILABLE'
      }
    }),
    prisma.housingRegistration.count({
      where: {
        tenantId,
        status: 'REGISTERED'
      }
    }),
    prisma.landRegularization.count({
      where: {
        tenantId,
        status: 'UNDER_ANALYSIS'
      }
    }),
  ]);

  res.json({
    protocolsByModule,
    modules: {
      attendances: attendancesCount,
      applications: applicationsCount,
      landRegularizations: landRegularizationsCount,
      rentAssistances: rentAssistancesCount,
      housingUnits: housingUnitsCount,
      registrations: registrationsCount,
    },
    metrics: {
      pendingApplications,
      approvedApplications,
      activeRentAssistances,
      availableUnits,
      activeRegistrations,
      underAnalysisRegularizations,
    },
  });
}));

// ============================================================================
// ATENDIMENTOS DE HABITAÇÃO
// ============================================================================

router.get('/atendimentos', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const page = parseInt(getStringParam(req.query.page)) || 1;
  const limit = parseInt(getStringParam(req.query.limit)) || 50;
  const search = getStringParam(req.query.search);
  const status = getStringParam(req.query.status);

  const where = createSafeWhereClause({
    tenantId,
    search,
    status,
    searchFields: ['citizenName', 'citizenCPF', 'protocol']
  });

  const [attendances, total] = await Promise.all([
    prisma.housingAttendance.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.housingAttendance.count({ where }),
  ]);

  res.json({
    data: attendances,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

router.get('/atendimentos/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const attendance = await prisma.housingAttendance.findFirst({
    where: { id, tenantId },
  });

  if (!attendance) {
    res.status(404).json({ error: 'Atendimento não encontrado' });
    return;
  }

  res.json(attendance);
}));

// ============================================================================
// PROGRAMAS HABITACIONAIS (HousingApplication)
// ============================================================================

router.get('/programas-habitacionais', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const page = parseInt(getStringParam(req.query.page)) || 1;
  const limit = parseInt(getStringParam(req.query.limit)) || 50;
  const search = getStringParam(req.query.search);
  const status = getStringParam(req.query.status);

  const where = createSafeWhereClause({
    tenantId,
    search,
    status,
    searchFields: ['applicantName', 'applicantCpf', 'protocol']
  });

  const [applications, total] = await Promise.all([
    prisma.housingApplication.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.housingApplication.count({ where }),
  ]);

  res.json({
    data: applications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

router.get('/programas-habitacionais/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const application = await prisma.housingApplication.findFirst({
    where: { id, tenantId },
  });

  if (!application) {
    res.status(404).json({ error: 'Inscrição não encontrada' });
    return;
  }

  res.json(application);
}));

router.put('/programas-habitacionais/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const application = await prisma.housingApplication.findFirst({
    where: { id, tenantId },
  });

  if (!application) {
    res.status(404).json({ error: 'Inscrição não encontrada' });
    return;
  }

  const updated = await prisma.housingApplication.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
}));

router.delete('/programas-habitacionais/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const application = await prisma.housingApplication.findFirst({
    where: { id, tenantId },
  });

  if (!application) {
    res.status(404).json({ error: 'Inscrição não encontrada' });
    return;
  }

  await prisma.housingApplication.delete({
    where: { id },
  });

  res.json({ message: 'Inscrição excluída com sucesso' });
}));

// ============================================================================
// REGULARIZAÇÃO FUNDIÁRIA (LandRegularization)
// ============================================================================

router.get('/regularizacao-fundiaria', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const page = parseInt(getStringParam(req.query.page)) || 1;
  const limit = parseInt(getStringParam(req.query.limit)) || 50;
  const search = getStringParam(req.query.search);
  const status = getStringParam(req.query.status);

  const where = createSafeWhereClause({
    tenantId,
    search,
    status,
    searchFields: ['applicantName', 'applicantCpf', 'protocol', 'propertyAddress']
  });

  const [regularizations, total] = await Promise.all([
    prisma.landRegularization.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.landRegularization.count({ where }),
  ]);

  res.json({
    data: regularizations,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

router.get('/regularizacao-fundiaria/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const regularization = await prisma.landRegularization.findFirst({
    where: { id, tenantId },
  });

  if (!regularization) {
    res.status(404).json({ error: 'Regularização não encontrada' });
    return;
  }

  res.json(regularization);
}));

router.put('/regularizacao-fundiaria/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const regularization = await prisma.landRegularization.findFirst({
    where: { id, tenantId },
  });

  if (!regularization) {
    res.status(404).json({ error: 'Regularização não encontrada' });
    return;
  }

  const updated = await prisma.landRegularization.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
}));

router.delete('/regularizacao-fundiaria/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const regularization = await prisma.landRegularization.findFirst({
    where: { id, tenantId },
  });

  if (!regularization) {
    res.status(404).json({ error: 'Regularização não encontrada' });
    return;
  }

  await prisma.landRegularization.delete({
    where: { id },
  });

  res.json({ message: 'Regularização excluída com sucesso' });
}));

// ============================================================================
// AUXÍLIO ALUGUEL (RentAssistance)
// ============================================================================

router.get('/auxilio-aluguel', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const page = parseInt(getStringParam(req.query.page)) || 1;
  const limit = parseInt(getStringParam(req.query.limit)) || 50;
  const search = getStringParam(req.query.search);
  const status = getStringParam(req.query.status);

  const where = createSafeWhereClause({
    tenantId,
    search,
    status,
    searchFields: ['applicantName', 'applicantCpf', 'protocol']
  });

  const [assistances, total] = await Promise.all([
    prisma.rentAssistance.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.rentAssistance.count({ where }),
  ]);

  res.json({
    data: assistances,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

router.get('/auxilio-aluguel/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const assistance = await prisma.rentAssistance.findFirst({
    where: { id, tenantId },
  });

  if (!assistance) {
    res.status(404).json({ error: 'Auxílio não encontrado' });
    return;
  }

  res.json(assistance);
}));

router.put('/auxilio-aluguel/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const assistance = await prisma.rentAssistance.findFirst({
    where: { id, tenantId },
  });

  if (!assistance) {
    res.status(404).json({ error: 'Auxílio não encontrado' });
    return;
  }

  const updated = await prisma.rentAssistance.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
}));

router.delete('/auxilio-aluguel/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const assistance = await prisma.rentAssistance.findFirst({
    where: { id, tenantId },
  });

  if (!assistance) {
    res.status(404).json({ error: 'Auxílio não encontrado' });
    return;
  }

  await prisma.rentAssistance.delete({
    where: { id },
  });

  res.json({ message: 'Auxílio excluído com sucesso' });
}));

// ============================================================================
// UNIDADES HABITACIONAIS (HousingUnit)
// ============================================================================

router.get('/unidades-habitacionais', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const page = parseInt(getStringParam(req.query.page)) || 1;
  const limit = parseInt(getStringParam(req.query.limit)) || 50;
  const search = getStringParam(req.query.search);
  const status = getStringParam(req.query.status);

  const where = createSafeWhereClause({
    tenantId,
    search,
    status,
    searchFields: ['unitCode', 'address', 'neighborhood']
  });

  const [units, total] = await Promise.all([
    prisma.housingUnit.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.housingUnit.count({ where }),
  ]);

  res.json({
    data: units,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

router.get('/unidades-habitacionais/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const unit = await prisma.housingUnit.findFirst({
    where: { id, tenantId },
  });

  if (!unit) {
    res.status(404).json({ error: 'Unidade não encontrada' });
    return;
  }

  res.json(unit);
}));

router.post('/unidades-habitacionais', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;

  const unit = await prisma.housingUnit.create({
    data: {
      ...req.body,
      tenantId,
    },
  });

  res.status(201).json(unit);
}));

router.put('/unidades-habitacionais/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const unit = await prisma.housingUnit.findFirst({
    where: { id, tenantId },
  });

  if (!unit) {
    res.status(404).json({ error: 'Unidade não encontrada' });
    return;
  }

  const updated = await prisma.housingUnit.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
}));

router.delete('/unidades-habitacionais/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const unit = await prisma.housingUnit.findFirst({
    where: { id, tenantId },
  });

  if (!unit) {
    res.status(404).json({ error: 'Unidade não encontrada' });
    return;
  }

  await prisma.housingUnit.delete({
    where: { id },
  });

  res.json({ message: 'Unidade excluída com sucesso' });
}));

// ============================================================================
// FILA DE HABITAÇÃO (HousingRegistration)
// ============================================================================

router.get('/fila-habitacao', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const page = parseInt(getStringParam(req.query.page)) || 1;
  const limit = parseInt(getStringParam(req.query.limit)) || 50;
  const search = getStringParam(req.query.search);
  const status = getStringParam(req.query.status);

  const where = createSafeWhereClause({
    tenantId,
    search,
    status,
    searchFields: ['familyHeadName', 'familyHeadCPF']
  });

  const [registrations, total] = await Promise.all([
    prisma.housingRegistration.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { registrationDate: 'asc' },
      include: {
        program: true,
      },
    }),
    prisma.housingRegistration.count({ where }),
  ]);

  res.json({
    data: registrations,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

router.get('/fila-habitacao/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const registration = await prisma.housingRegistration.findFirst({
    where: { id, tenantId },
    include: {
      program: true,
    },
  });

  if (!registration) {
    res.status(404).json({ error: 'Registro não encontrado' });
    return;
  }

  res.json(registration);
}));

router.put('/fila-habitacao/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const registration = await prisma.housingRegistration.findFirst({
    where: { id, tenantId },
  });

  if (!registration) {
    res.status(404).json({ error: 'Registro não encontrado' });
    return;
  }

  const updated = await prisma.housingRegistration.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
}));

router.delete('/fila-habitacao/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const registration = await prisma.housingRegistration.findFirst({
    where: { id, tenantId },
  });

  if (!registration) {
    res.status(404).json({ error: 'Registro não encontrado' });
    return;
  }

  await prisma.housingRegistration.delete({
    where: { id },
  });

  res.json({ message: 'Registro excluído com sucesso' });
}));

export default router;
