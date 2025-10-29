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

  // 1. Buscar departamento de Meio Ambiente
  const dept = await prisma.department.findFirst({
    where: {
      tenantId,
      code: 'MEIO_AMBIENTE'
    }
  });

  if (!dept) {
    res.status(404).json({ error: 'Departamento de Meio Ambiente não encontrado' });
    return;
  }

  // 2. Stats dos protocolos por módulo
  const protocolsByModule = await prisma.protocolSimplified.groupBy({
    by: ['moduleType', 'status'],
    where: {
      tenantId,
      departmentId: dept.id,
      moduleType: {
        in: MODULE_BY_DEPARTMENT.MEIO_AMBIENTE || []
      },
    },
    _count: true,
  });

  // 3. Contagem de registros em cada módulo
  const [
    attendancesCount,
    licensesCount,
    complaintsCount,
    programsCount,
    treeCuttingsCount,
    inspectionsCount,
    protectedAreasCount,
  ] = await Promise.all([
    prisma.environmentalAttendance.count({ where: { tenantId } }),
    prisma.environmentalLicense.count({ where: { tenantId } }),
    prisma.environmentalComplaint.count({ where: { tenantId } }),
    prisma.environmentalProgram.count({ where: { tenantId } }),
    prisma.treeCuttingAuthorization.count({ where: { tenantId } }),
    prisma.environmentalInspection.count({ where: { tenantId } }),
    prisma.protectedArea.count({ where: { tenantId } }),
  ]);

  // 4. Stats específicas de meio ambiente
  const [
    pendingAttendances,
    underAnalysisLicenses,
    openComplaints,
    activePrograms,
    pendingTreeCuttings,
    scheduledInspections,
    activeProtectedAreas,
  ] = await Promise.all([
    prisma.environmentalAttendance.count({
      where: {
        tenantId,
        status: 'PENDING'
      }
    }),
    prisma.environmentalLicense.count({
      where: {
        tenantId,
        status: 'UNDER_ANALYSIS'
      }
    }),
    prisma.environmentalComplaint.count({
      where: {
        tenantId,
        status: 'OPEN'
      }
    }),
    prisma.environmentalProgram.count({
      where: {
        tenantId,
        status: 'ACTIVE'
      }
    }),
    prisma.treeCuttingAuthorization.count({
      where: {
        tenantId,
        status: 'UNDER_ANALYSIS'
      }
    }),
    prisma.environmentalInspection.count({
      where: {
        tenantId,
        status: 'SCHEDULED'
      }
    }),
    prisma.protectedArea.count({
      where: {
        tenantId,
        status: 'ACTIVE'
      }
    }),
  ]);

  res.json({
    protocolsByModule,
    modules: {
      attendances: attendancesCount,
      licenses: licensesCount,
      complaints: complaintsCount,
      programs: programsCount,
      treeCuttings: treeCuttingsCount,
      inspections: inspectionsCount,
      protectedAreas: protectedAreasCount,
    },
    metrics: {
      pendingAttendances,
      underAnalysisLicenses,
      openComplaints,
      activePrograms,
      pendingTreeCuttings,
      scheduledInspections,
      activeProtectedAreas,
    },
  });
}));

// ============================================================================
// ATENDIMENTOS AMBIENTAIS
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
    searchFields: ['citizenName', 'citizenCpf', 'protocol', 'subject']
  });

  const [attendances, total] = await Promise.all([
    prisma.environmentalAttendance.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.environmentalAttendance.count({ where }),
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

  const attendance = await prisma.environmentalAttendance.findFirst({
    where: { id, tenantId },
  });

  if (!attendance) {
    res.status(404).json({ error: 'Atendimento não encontrado' });
    return;
  }

  res.json(attendance);
}));

// ============================================================================
// LICENÇAS AMBIENTAIS
// ============================================================================

router.get('/licencas', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const page = parseInt(getStringParam(req.query.page)) || 1;
  const limit = parseInt(getStringParam(req.query.limit)) || 50;
  const search = getStringParam(req.query.search);
  const status = getStringParam(req.query.status);

  const where = createSafeWhereClause({
    tenantId,
    search,
    status,
    searchFields: ['applicantName', 'applicantCpf', 'licenseNumber', 'businessName']
  });

  const [licenses, total] = await Promise.all([
    prisma.environmentalLicense.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.environmentalLicense.count({ where }),
  ]);

  res.json({
    data: licenses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

router.get('/licencas/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const license = await prisma.environmentalLicense.findFirst({
    where: { id, tenantId },
  });

  if (!license) {
    res.status(404).json({ error: 'Licença não encontrada' });
    return;
  }

  res.json(license);
}));

router.put('/licencas/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const license = await prisma.environmentalLicense.findFirst({
    where: { id, tenantId },
  });

  if (!license) {
    res.status(404).json({ error: 'Licença não encontrada' });
    return;
  }

  const updated = await prisma.environmentalLicense.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
}));

router.delete('/licencas/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const license = await prisma.environmentalLicense.findFirst({
    where: { id, tenantId },
  });

  if (!license) {
    res.status(404).json({ error: 'Licença não encontrada' });
    return;
  }

  await prisma.environmentalLicense.delete({
    where: { id },
  });

  res.json({ message: 'Licença excluída com sucesso' });
}));

// ============================================================================
// DENÚNCIAS AMBIENTAIS
// ============================================================================

router.get('/denuncias', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const page = parseInt(getStringParam(req.query.page)) || 1;
  const limit = parseInt(getStringParam(req.query.limit)) || 50;
  const search = getStringParam(req.query.search);
  const status = getStringParam(req.query.status);

  const where = createSafeWhereClause({
    tenantId,
    search,
    status,
    searchFields: ['reporterName', 'complainantName', 'protocol', 'location']
  });

  const [complaints, total] = await Promise.all([
    prisma.environmentalComplaint.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.environmentalComplaint.count({ where }),
  ]);

  res.json({
    data: complaints,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

router.get('/denuncias/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const complaint = await prisma.environmentalComplaint.findFirst({
    where: { id, tenantId },
  });

  if (!complaint) {
    res.status(404).json({ error: 'Denúncia não encontrada' });
    return;
  }

  res.json(complaint);
}));

router.put('/denuncias/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const complaint = await prisma.environmentalComplaint.findFirst({
    where: { id, tenantId },
  });

  if (!complaint) {
    res.status(404).json({ error: 'Denúncia não encontrada' });
    return;
  }

  const updated = await prisma.environmentalComplaint.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
}));

router.delete('/denuncias/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const complaint = await prisma.environmentalComplaint.findFirst({
    where: { id, tenantId },
  });

  if (!complaint) {
    res.status(404).json({ error: 'Denúncia não encontrada' });
    return;
  }

  await prisma.environmentalComplaint.delete({
    where: { id },
  });

  res.json({ message: 'Denúncia excluída com sucesso' });
}));

// ============================================================================
// PROGRAMAS AMBIENTAIS
// ============================================================================

router.get('/programas', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const page = parseInt(getStringParam(req.query.page)) || 1;
  const limit = parseInt(getStringParam(req.query.limit)) || 50;
  const search = getStringParam(req.query.search);
  const status = getStringParam(req.query.status);

  const where = createSafeWhereClause({
    tenantId,
    search,
    status,
    searchFields: ['name', 'programType', 'coordinator']
  });

  const [programs, total] = await Promise.all([
    prisma.environmentalProgram.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.environmentalProgram.count({ where }),
  ]);

  res.json({
    data: programs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

router.get('/programas/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const program = await prisma.environmentalProgram.findFirst({
    where: { id, tenantId },
  });

  if (!program) {
    res.status(404).json({ error: 'Programa não encontrado' });
    return;
  }

  res.json(program);
}));

router.put('/programas/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const program = await prisma.environmentalProgram.findFirst({
    where: { id, tenantId },
  });

  if (!program) {
    res.status(404).json({ error: 'Programa não encontrado' });
    return;
  }

  const updated = await prisma.environmentalProgram.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
}));

router.delete('/programas/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const program = await prisma.environmentalProgram.findFirst({
    where: { id, tenantId },
  });

  if (!program) {
    res.status(404).json({ error: 'Programa não encontrado' });
    return;
  }

  await prisma.environmentalProgram.delete({
    where: { id },
  });

  res.json({ message: 'Programa excluído com sucesso' });
}));

// ============================================================================
// AUTORIZAÇÕES DE PODA E CORTE
// ============================================================================

router.get('/poda-corte', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const page = parseInt(getStringParam(req.query.page)) || 1;
  const limit = parseInt(getStringParam(req.query.limit)) || 50;
  const search = getStringParam(req.query.search);
  const status = getStringParam(req.query.status);

  const where = createSafeWhereClause({
    tenantId,
    search,
    status,
    searchFields: ['applicantName', 'applicantCpf', 'authorizationNumber', 'propertyAddress']
  });

  const [authorizations, total] = await Promise.all([
    prisma.treeCuttingAuthorization.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.treeCuttingAuthorization.count({ where }),
  ]);

  res.json({
    data: authorizations,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

router.get('/poda-corte/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const authorization = await prisma.treeCuttingAuthorization.findFirst({
    where: { id, tenantId },
  });

  if (!authorization) {
    res.status(404).json({ error: 'Autorização não encontrada' });
    return;
  }

  res.json(authorization);
}));

router.put('/poda-corte/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const authorization = await prisma.treeCuttingAuthorization.findFirst({
    where: { id, tenantId },
  });

  if (!authorization) {
    res.status(404).json({ error: 'Autorização não encontrada' });
    return;
  }

  const updated = await prisma.treeCuttingAuthorization.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
}));

router.delete('/poda-corte/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const authorization = await prisma.treeCuttingAuthorization.findFirst({
    where: { id, tenantId },
  });

  if (!authorization) {
    res.status(404).json({ error: 'Autorização não encontrada' });
    return;
  }

  await prisma.treeCuttingAuthorization.delete({
    where: { id },
  });

  res.json({ message: 'Autorização excluída com sucesso' });
}));

// ============================================================================
// VISTORIAS AMBIENTAIS
// ============================================================================

router.get('/vistorias', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const page = parseInt(getStringParam(req.query.page)) || 1;
  const limit = parseInt(getStringParam(req.query.limit)) || 50;
  const search = getStringParam(req.query.search);
  const status = getStringParam(req.query.status);

  const where = createSafeWhereClause({
    tenantId,
    search,
    status,
    searchFields: ['inspectionNumber', 'inspector', 'subject', 'location']
  });

  const [inspections, total] = await Promise.all([
    prisma.environmentalInspection.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.environmentalInspection.count({ where }),
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

router.get('/vistorias/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const inspection = await prisma.environmentalInspection.findFirst({
    where: { id, tenantId },
  });

  if (!inspection) {
    res.status(404).json({ error: 'Vistoria não encontrada' });
    return;
  }

  res.json(inspection);
}));

router.put('/vistorias/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const inspection = await prisma.environmentalInspection.findFirst({
    where: { id, tenantId },
  });

  if (!inspection) {
    res.status(404).json({ error: 'Vistoria não encontrada' });
    return;
  }

  const updated = await prisma.environmentalInspection.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
}));

router.delete('/vistorias/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const inspection = await prisma.environmentalInspection.findFirst({
    where: { id, tenantId },
  });

  if (!inspection) {
    res.status(404).json({ error: 'Vistoria não encontrada' });
    return;
  }

  await prisma.environmentalInspection.delete({
    where: { id },
  });

  res.json({ message: 'Vistoria excluída com sucesso' });
}));

// ============================================================================
// ÁREAS PROTEGIDAS
// ============================================================================

router.get('/areas-protegidas', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;
  const page = parseInt(getStringParam(req.query.page)) || 1;
  const limit = parseInt(getStringParam(req.query.limit)) || 50;
  const search = getStringParam(req.query.search);
  const status = getStringParam(req.query.status);

  const where = createSafeWhereClause({
    tenantId,
    search,
    status,
    searchFields: ['name', 'areaType', 'location', 'guardian']
  });

  const [protectedAreas, total] = await Promise.all([
    prisma.protectedArea.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.protectedArea.count({ where }),
  ]);

  res.json({
    data: protectedAreas,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

router.get('/areas-protegidas/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const protectedArea = await prisma.protectedArea.findFirst({
    where: { id, tenantId },
  });

  if (!protectedArea) {
    res.status(404).json({ error: 'Área protegida não encontrada' });
    return;
  }

  res.json(protectedArea);
}));

router.post('/areas-protegidas', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenantId = req.tenantId!;

  const protectedArea = await prisma.protectedArea.create({
    data: {
      ...req.body,
      tenantId,
    },
  });

  res.status(201).json(protectedArea);
}));

router.put('/areas-protegidas/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const protectedArea = await prisma.protectedArea.findFirst({
    where: { id, tenantId },
  });

  if (!protectedArea) {
    res.status(404).json({ error: 'Área protegida não encontrada' });
    return;
  }

  const updated = await prisma.protectedArea.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
}));

router.delete('/areas-protegidas/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tenantId = req.tenantId!;

  const protectedArea = await prisma.protectedArea.findFirst({
    where: { id, tenantId },
  });

  if (!protectedArea) {
    res.status(404).json({ error: 'Área protegida não encontrada' });
    return;
  }

  await prisma.protectedArea.delete({
    where: { id },
  });

  res.json({ message: 'Área protegida excluída com sucesso' });
}));

export default router;
