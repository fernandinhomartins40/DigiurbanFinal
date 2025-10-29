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

  // 1. Buscar departamento de Obras Públicas
  const dept = await prisma.department.findFirst({
    where: {
      tenantId,
      code: 'OBRAS_PUBLICAS'
    }
  });

  if (!dept) {
    res.status(404).json({ error: 'Departamento de Obras Públicas não encontrado' });
    return;
  }

  // 2. Stats dos protocolos por módulo
  const protocolsByModule = await prisma.protocolSimplified.groupBy({
    by: ['moduleType', 'status'],
    where: {
      tenantId,
      departmentId: dept.id,
      moduleType: {
        in: MODULE_BY_DEPARTMENT.OBRAS_PUBLICAS || []
      },
    },
    _count: true,
  });

  // 3. Contagem de registros em cada módulo
  const [
    attendancesCount,
    roadRepairsCount,
    technicalInspectionsCount,
    publicWorksCount,
    workInspectionsCount,
  ] = await Promise.all([
    prisma.publicWorksAttendance.count({ where: { tenantId } }),
    prisma.roadRepairRequest.count({ where: { tenantId } }),
    prisma.technicalInspection.count({ where: { tenantId } }),
    prisma.publicWork.count({ where: { tenantId } }),
    prisma.workInspection.count({ where: { tenantId } }),
  ]);

  // 4. Stats específicas de obras públicas
  const [
    pendingAttendances,
    inProgressAttendances,
    completedAttendances,
    pendingRoadRepairs,
    inProgressRoadRepairs,
    completedRoadRepairs,
    pendingTechnicalInspections,
    scheduledTechnicalInspections,
    completedTechnicalInspections,
    plannedWorks,
    inProgressWorks,
    completedWorks,
    scheduledWorkInspections,
    completedWorkInspections,
    nonCompliantWorkInspections,
  ] = await Promise.all([
    prisma.publicWorksAttendance.count({ where: { tenantId, status: 'PENDING' } }),
    prisma.publicWorksAttendance.count({ where: { tenantId, status: 'IN_EXECUTION' } }),
    prisma.publicWorksAttendance.count({ where: { tenantId, status: 'COMPLETED' } }),
    prisma.roadRepairRequest.count({ where: { tenantId, status: 'PENDING' } }),
    prisma.roadRepairRequest.count({ where: { tenantId, status: 'IN_EXECUTION' } }),
    prisma.roadRepairRequest.count({ where: { tenantId, status: 'COMPLETED' } }),
    prisma.technicalInspection.count({ where: { tenantId, status: 'PENDING' } }),
    prisma.technicalInspection.count({ where: { tenantId, status: 'SCHEDULED' } }),
    prisma.technicalInspection.count({ where: { tenantId, status: 'COMPLETED' } }),
    prisma.publicWork.count({ where: { tenantId, status: 'PLANNED' } }),
    prisma.publicWork.count({ where: { tenantId, status: 'IN_PROGRESS' } }),
    prisma.publicWork.count({ where: { tenantId, status: 'COMPLETED' } }),
    prisma.workInspection.count({ where: { tenantId, status: 'SCHEDULED' } }),
    prisma.workInspection.count({ where: { tenantId, status: 'COMPLETED' } }),
    prisma.workInspection.count({ where: { tenantId, compliance: 'NAO_CONFORME' } }),
  ]);

  res.json({
    protocolsByModule,
    modules: {
      attendances: attendancesCount,
      roadRepairs: roadRepairsCount,
      technicalInspections: technicalInspectionsCount,
      publicWorks: publicWorksCount,
      workInspections: workInspectionsCount,
    },
    metrics: {
      attendances: {
        pending: pendingAttendances,
        inProgress: inProgressAttendances,
        completed: completedAttendances,
      },
      roadRepairs: {
        pending: pendingRoadRepairs,
        inProgress: inProgressRoadRepairs,
        completed: completedRoadRepairs,
      },
      technicalInspections: {
        pending: pendingTechnicalInspections,
        scheduled: scheduledTechnicalInspections,
        completed: completedTechnicalInspections,
      },
      publicWorks: {
        planned: plannedWorks,
        inProgress: inProgressWorks,
        completed: completedWorks,
      },
      workInspections: {
        scheduled: scheduledWorkInspections,
        completed: completedWorkInspections,
        nonCompliant: nonCompliantWorkInspections,
      },
    },
  });
}));

// ============================================================================
// ATENDIMENTOS DE OBRAS PÚBLICAS
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
    searchFields: ['citizenName', 'citizenCpf', 'protocol']
  });

  const [attendances, total] = await Promise.all([
    prisma.publicWorksAttendance.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.publicWorksAttendance.count({ where }),
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

  const attendance = await prisma.publicWorksAttendance.findFirst({
    where: { id, tenantId },
  });

  if (!attendance) {
    res.status(404).json({ error: 'Atendimento não encontrado' });
    return;
  }

  res.json(attendance);
}));

router.put('/atendimentos/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const attendance = await prisma.publicWorksAttendance.findFirst({
    where: { id, tenantId },
  });

  if (!attendance) {
    res.status(404).json({ error: 'Atendimento não encontrado' });
    return;
  }

  const updated = await prisma.publicWorksAttendance.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
}));

router.delete('/atendimentos/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const attendance = await prisma.publicWorksAttendance.findFirst({
    where: { id, tenantId },
  });

  if (!attendance) {
    res.status(404).json({ error: 'Atendimento não encontrado' });
    return;
  }

  await prisma.publicWorksAttendance.delete({
    where: { id },
  });

  res.json({ success: true });
}));

// ============================================================================
// REPAROS DE VIAS
// ============================================================================

router.get('/reparos-de-vias', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const page = parseInt(getStringParam(req.query.page)) || 1;
  const limit = parseInt(getStringParam(req.query.limit)) || 50;
  const search = getStringParam(req.query.search);
  const status = getStringParam(req.query.status);

  const where = createSafeWhereClause({
    tenantId,
    search,
    status,
    searchFields: ['citizenName', 'roadName', 'protocol']
  });

  const [roadRepairs, total] = await Promise.all([
    prisma.roadRepairRequest.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.roadRepairRequest.count({ where }),
  ]);

  res.json({
    data: roadRepairs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

router.get('/reparos-de-vias/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const roadRepair = await prisma.roadRepairRequest.findFirst({
    where: { id, tenantId },
  });

  if (!roadRepair) {
    res.status(404).json({ error: 'Solicitação de reparo não encontrada' });
    return;
  }

  res.json(roadRepair);
}));

router.put('/reparos-de-vias/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const roadRepair = await prisma.roadRepairRequest.findFirst({
    where: { id, tenantId },
  });

  if (!roadRepair) {
    res.status(404).json({ error: 'Solicitação de reparo não encontrada' });
    return;
  }

  const updated = await prisma.roadRepairRequest.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
}));

router.delete('/reparos-de-vias/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const roadRepair = await prisma.roadRepairRequest.findFirst({
    where: { id, tenantId },
  });

  if (!roadRepair) {
    res.status(404).json({ error: 'Solicitação de reparo não encontrada' });
    return;
  }

  await prisma.roadRepairRequest.delete({
    where: { id },
  });

  res.json({ success: true });
}));

// ============================================================================
// VISTORIAS TÉCNICAS
// ============================================================================

router.get('/vistorias-tecnicas', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const page = parseInt(getStringParam(req.query.page)) || 1;
  const limit = parseInt(getStringParam(req.query.limit)) || 50;
  const search = getStringParam(req.query.search);
  const status = getStringParam(req.query.status);

  const where = createSafeWhereClause({
    tenantId,
    search,
    status,
    searchFields: ['requestorName', 'protocol', 'location']
  });

  const [inspections, total] = await Promise.all([
    prisma.technicalInspection.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.technicalInspection.count({ where }),
  ]);

  res.json({
    data: inspections,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

router.get('/vistorias-tecnicas/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const inspection = await prisma.technicalInspection.findFirst({
    where: { id, tenantId },
  });

  if (!inspection) {
    res.status(404).json({ error: 'Vistoria não encontrada' });
    return;
  }

  res.json(inspection);
}));

router.put('/vistorias-tecnicas/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const inspection = await prisma.technicalInspection.findFirst({
    where: { id, tenantId },
  });

  if (!inspection) {
    res.status(404).json({ error: 'Vistoria não encontrada' });
    return;
  }

  const updated = await prisma.technicalInspection.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
}));

router.delete('/vistorias-tecnicas/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const inspection = await prisma.technicalInspection.findFirst({
    where: { id, tenantId },
  });

  if (!inspection) {
    res.status(404).json({ error: 'Vistoria não encontrada' });
    return;
  }

  await prisma.technicalInspection.delete({
    where: { id },
  });

  res.json({ success: true });
}));

// ============================================================================
// CADASTRO DE OBRAS
// ============================================================================

router.get('/cadastro-de-obras', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const page = parseInt(getStringParam(req.query.page)) || 1;
  const limit = parseInt(getStringParam(req.query.limit)) || 50;
  const search = getStringParam(req.query.search);
  const status = getStringParam(req.query.status);

  const where = createSafeWhereClause({
    tenantId,
    search,
    status,
    searchFields: ['title', 'contractor', 'location']
  });

  const [publicWorks, total] = await Promise.all([
    prisma.publicWork.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.publicWork.count({ where }),
  ]);

  res.json({
    data: publicWorks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

router.get('/cadastro-de-obras/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const publicWork = await prisma.publicWork.findFirst({
    where: { id, tenantId },
  });

  if (!publicWork) {
    res.status(404).json({ error: 'Obra não encontrada' });
    return;
  }

  res.json(publicWork);
}));

router.put('/cadastro-de-obras/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const publicWork = await prisma.publicWork.findFirst({
    where: { id, tenantId },
  });

  if (!publicWork) {
    res.status(404).json({ error: 'Obra não encontrada' });
    return;
  }

  const updated = await prisma.publicWork.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
}));

router.delete('/cadastro-de-obras/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const publicWork = await prisma.publicWork.findFirst({
    where: { id, tenantId },
  });

  if (!publicWork) {
    res.status(404).json({ error: 'Obra não encontrada' });
    return;
  }

  await prisma.publicWork.delete({
    where: { id },
  });

  res.json({ success: true });
}));

// ============================================================================
// INSPEÇÃO DE OBRAS
// ============================================================================

router.get('/inspecao-de-obras', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const page = parseInt(getStringParam(req.query.page)) || 1;
  const limit = parseInt(getStringParam(req.query.limit)) || 50;
  const search = getStringParam(req.query.search);
  const status = getStringParam(req.query.status);

  const where = createSafeWhereClause({
    tenantId,
    search,
    status,
    searchFields: ['workName', 'contractor', 'protocol']
  });

  const [workInspections, total] = await Promise.all([
    prisma.workInspection.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.workInspection.count({ where }),
  ]);

  res.json({
    data: workInspections,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

router.get('/inspecao-de-obras/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const workInspection = await prisma.workInspection.findFirst({
    where: { id, tenantId },
  });

  if (!workInspection) {
    res.status(404).json({ error: 'Inspeção não encontrada' });
    return;
  }

  res.json(workInspection);
}));

router.put('/inspecao-de-obras/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const workInspection = await prisma.workInspection.findFirst({
    where: { id, tenantId },
  });

  if (!workInspection) {
    res.status(404).json({ error: 'Inspeção não encontrada' });
    return;
  }

  const updated = await prisma.workInspection.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
}));

router.delete('/inspecao-de-obras/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const workInspection = await prisma.workInspection.findFirst({
    where: { id, tenantId },
  });

  if (!workInspection) {
    res.status(404).json({ error: 'Inspeção não encontrada' });
    return;
  }

  await prisma.workInspection.delete({
    where: { id },
  });

  res.json({ success: true });
}));

export default router;
