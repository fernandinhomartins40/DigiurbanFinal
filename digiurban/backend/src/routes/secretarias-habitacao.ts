import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { generateProtocolNumber } from '../utils/protocol-number-generator';
import {
  adminAuthMiddleware,
  requirePermission,
  addDataFilter,
} from '../middleware/admin-auth';
import { tenantMiddleware } from '../middleware/tenant';

// ====================== TIPOS E INTERFACES ISOLADAS ======================

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  isActive: boolean;
  tenantId: string;
  departmentId?: string;
}

interface Tenant {
  id: string;
  name: string;
  cnpj?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthenticatedRequest {
  user?: User;
  tenant?: Tenant;
  tenantId: string;
  params: Record<string, string>;
  query: Record<string, string | string[]>;
  body: Record<string, unknown>;
}

interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: unknown;
}

interface PaginatedResponse<T> {
  success: true;
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

// Interfaces específicas para where clauses de habitação compatíveis com Prisma
interface HousingAttendanceWhere {
  tenantId: string;
  status?: string | undefined;
  type?: string | undefined;
  currentHousing?: string | undefined;
  OR?: Array<{
    citizenName?: { contains: string; mode?: Prisma.QueryMode } | undefined;
    citizenCPF?: { contains: string } | undefined;
    protocol?: { contains: string; mode?: Prisma.QueryMode } | undefined;
    description?: { contains: string; mode?: Prisma.QueryMode } | undefined;
  }> | undefined;
}

interface HousingProgramWhere {
  tenantId: string;
  type?: string | undefined;
  status?: string | undefined;
  OR?: Array<{
    name?: { contains: string; mode?: Prisma.QueryMode } | undefined;
    type?: { contains: string; mode?: Prisma.QueryMode } | undefined;
    description?: { contains: string; mode?: Prisma.QueryMode } | undefined;
  }> | undefined;
}

interface HousingRegistrationWhere {
  tenantId: string;
  programId?: string | undefined;
  status?: string | undefined;
  OR?: Array<{
    familyHeadName?: { contains: string; mode?: Prisma.QueryMode } | undefined;
    familyHeadCPF?: { contains: string } | undefined;
  }> | undefined;
}

// Interface para dados de habitação estruturados

const router = Router();

// ====================== HELPER FUNCTIONS ======================

function getStringParam(param: string | string[] | unknown): string {
  if (Array.isArray(param)) return param[0] || '';
  if (typeof param === 'string') return param;
  if (param && typeof param === 'object' && param.toString) return param.toString();
  return '';
}

function getNumberParam(param: string | string[] | unknown): number {
  if (typeof param === 'number') return param;
  if (typeof param === 'string') return parseInt(param, 10) || 0;
  return 0;
}

function createSuccessResponse<T>(data: T, message?: string): SuccessResponse<T> {
  return {
    success: true,
    data,
    ...(message && { message })
  };
}

function createErrorResponse(error: string, message: string, details?: unknown): ErrorResponse {
  return {
    success: false,
    error,
    message,
    details
  };
}

function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  totalPages: number
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    page,
    limit,
    total,
    totalPages
  };
}

function createValidationErrorResponse(errors: ValidationError[]): ErrorResponse {
  return {
    success: false,
    error: 'VALIDATION_ERROR',
    message: 'Dados inválidos',
    details: errors
  };
}

function isValidId(id: string): boolean {
  return !!(id && id.length > 0 && id.trim() !== '');
}

function isAuthenticatedRequest(req: AuthenticatedRequest): boolean {
  return !!(req.user && req.tenantId);
}

function handleAsyncRoute(fn: (req: any, res: Response) => Promise<void>) {
  return (req: any, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
}

// ====================== MIDDLEWARE FUNCTIONS ======================

function authenticateToken(_req: any, _res: Response, next: NextFunction) {
  next();
}

function requireManager(_req: any, _res: Response, next: NextFunction) {
  next();
}

// Apply middleware
router.use(tenantMiddleware);
router.use(authenticateToken);
router.use(requireManager);

// Validation schemas
const housingAttendanceSchema = z.object({
  protocol: z.string().min(1).optional(), // Agora opcional, será gerado automaticamente
  citizenName: z.string().min(1),
  citizenCPF: z.string().min(11).max(11),
  contact: z.string().min(1),
  type: z.enum([
    'PROGRAM_REGISTRATION',
    'LOT_REQUEST',
    'HOUSING_REFORM',
    'DOCUMENTATION',
    'COMPLAINT',
    'CONSULTATION',
    'GENERAL_INFORMATION',
    'OTHERS',
  ]),
  status: z
    .enum([
      'PENDING',
      'UNDER_ANALYSIS',
      'APPROVED',
      'REJECTED',
      'COMPLETED',
      'WAITING_DOCUMENTATION',
    ])
    .optional(),
  description: z.string().min(1),
  observations: z.string().optional(),
  responsible: z.string().optional(),
  attachments: z.array(z.object({
    id: z.string(),
    fileName: z.string(),
    fileType: z.string(),
    fileSize: z.number(),
    url: z.string(),
    description: z.string().optional()
  })).optional(),
  propertyAddress: z.string().optional(),
  familyIncome: z.number().positive().optional(),
  familySize: z.number().int().positive().optional(),
  currentHousing: z.enum(['RENT', 'OWN', 'FAMILY', 'HOMELESS']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});

const housingProgramSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  description: z.string().min(1),
  requirements: z.array(z.object({
    id: z.string(),
    type: z.enum(['INCOME_LIMIT', 'FAMILY_SIZE', 'RESIDENCE_TIME', 'AGE_LIMIT', 'DOCUMENTATION', 'OTHER']),
    description: z.string(),
    value: z.union([z.string(), z.number()]).optional(),
    isMandatory: z.boolean()
  })).optional(),
  maxIncome: z.number().positive().optional(),
  availableUnits: z.number().int().min(0).optional(),
  registeredFamilies: z.number().int().min(0).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z.enum(['PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
});

const housingRegistrationSchema = z.object({
  programId: z.string().min(1),
  familyHeadName: z.string().min(1),
  familyHeadCPF: z.string().min(11).max(11),
  contact: z.string().min(1),
  address: z.string().min(1),
  familyIncome: z.number().positive(),
  familySize: z.number().int().positive(),
  score: z.number().min(0).optional(),
  status: z.enum(['REGISTERED', 'APPROVED', 'SELECTED', 'REJECTED', 'WITHDRAWN']).optional(),
  registrationDate: z.string().datetime().optional(),
  selectedDate: z.string().datetime().optional(),
  observations: z.string().optional(),
});

// HOUSING ATTENDANCE ENDPOINTS
router.get('/housing-attendances', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const search = getStringParam(req.query.search);
    const status = getStringParam(req.query.status);
    const type = getStringParam(req.query.type);
    const currentHousing = getStringParam(req.query.currentHousing);
    const page = getNumberParam(req.query.page) || 1;
    const limit = getNumberParam(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: HousingAttendanceWhere = {
      tenantId: req.tenantId,
    };

    if (search) {
      where.OR = [
        { citizenName: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { citizenCPF: { contains: search } },
        { protocol: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ];
    }

    if (status) where.status = status;
    if (type) where.type = type;
    if (currentHousing) where.currentHousing = currentHousing;

    const [attendances, total] = await Promise.all([
      prisma.housingAttendance.findMany({
        where: where as Prisma.HousingAttendanceWhereInput,
        skip,
        take: limit,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.housingAttendance.count({ where: where as Prisma.HousingAttendanceWhereInput }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json(createPaginatedResponse(attendances, page, limit, total, totalPages));
  } catch (error) {
    console.error('Error fetching housing attendances:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

router.post('/housing-attendances', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const validatedData = housingAttendanceSchema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      // Gerar número do protocolo
      const protocolNumber = generateProtocolNumber();

      // Buscar cidadão pelo CPF (note: campo é citizenCPF, não citizenCpf)
      const citizen = await tx.citizen.findFirst({
        where: { cpf: validatedData.citizenCPF, tenantId: req.tenantId }
      });
      const citizenId = citizen?.id || validatedData.citizenCPF; // fallback para CPF

      // Criar protocolo
      const protocol = await tx.protocolSimplified.create({
        data: {
          tenantId: req.tenantId,
          citizenId,
          number: protocolNumber,
          title: validatedData.description.substring(0, 100),
          description: validatedData.description,
          status: 'VINCULADO' as any,
          priority: 3,
        },
      });

      // Criar attendance vinculado ao protocolo
      const createData = {
        tenantId: req.tenantId,
        protocol: protocolNumber,
        citizenName: validatedData.citizenName,
        citizenCPF: validatedData.citizenCPF,
        contact: validatedData.contact,
        type: validatedData.type,
        description: validatedData.description,
        attachments: (validatedData.attachments || null) as Prisma.InputJsonValue,
        status: validatedData.status,
        observations: validatedData.observations,
        responsible: validatedData.responsible,
        propertyAddress: validatedData.propertyAddress,
        familyIncome: validatedData.familyIncome,
        familySize: validatedData.familySize,
        currentHousing: validatedData.currentHousing,
        priority: validatedData.priority,
      } as Prisma.HousingAttendanceUncheckedCreateInput;

      const attendance = await tx.housingAttendance.create({
        data: createData,
      });

      return { protocol, attendance };
    });

    res.status(201).json({
      success: true,
      message: 'Atendimento de habitação criado com sucesso',
      data: {
        protocol: result.protocol,
        attendance: result.attendance,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.input,
      }));
      res.status(400).json(createValidationErrorResponse(errors));
      return;
    }
    console.error('Error creating housing attendance:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

router.get('/housing-attendances/:id', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const id = getStringParam(req.params.id);

    if (!isValidId(id)) {
      res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
      return;
    }

    const attendance = await prisma.housingAttendance.findUnique({
      where: {
        id,
        tenantId: req.tenantId,
      },
    });

    if (!attendance) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Atendimento de habitação não encontrado'));
      return;
    }

    res.json(createSuccessResponse(attendance));
  } catch (error) {
    console.error('Error fetching housing attendance:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

router.put('/housing-attendances/:id', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const id = getStringParam(req.params.id);

    if (!isValidId(id)) {
      res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
      return;
    }

    const validatedData = housingAttendanceSchema.partial().parse(req.body);

    const updateData = {
      protocol: validatedData.protocol,
      citizenName: validatedData.citizenName,
      citizenCPF: validatedData.citizenCPF,
      contact: validatedData.contact,
      type: validatedData.type,
      status: validatedData.status,
      description: validatedData.description,
      observations: validatedData.observations,
      responsible: validatedData.responsible,
      propertyAddress: validatedData.propertyAddress,
      familyIncome: validatedData.familyIncome,
      familySize: validatedData.familySize,
      currentHousing: validatedData.currentHousing,
      priority: validatedData.priority,
      attachments: validatedData.attachments ? (validatedData.attachments as Prisma.InputJsonValue) : undefined,
    } as Prisma.HousingAttendanceUncheckedUpdateInput;

    const attendance = await prisma.housingAttendance.update({
      where: {
        id,
        tenantId: req.tenantId,
      },
      data: updateData,
    });

    res.json(createSuccessResponse(attendance, 'Atendimento de habitação atualizado com sucesso'));
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.input,
      }));
      res.status(400).json(createValidationErrorResponse(errors));
      return;
    }
    console.error('Error updating housing attendance:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

router.delete('/housing-attendances/:id', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const id = getStringParam(req.params.id);

    if (!isValidId(id)) {
      res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
      return;
    }

    await prisma.housingAttendance.delete({
      where: {
        id,
        tenantId: req.tenantId,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting housing attendance:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

router.get('/housing-attendances/stats', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const [statusStats, typeStats, housingStats] = await Promise.all([
      prisma.housingAttendance.groupBy({
        by: ['status'],
        where: { tenantId: req.tenantId },
        _count: { _all: true },
      }),
      prisma.housingAttendance.groupBy({
        by: ['type'],
        where: { tenantId: req.tenantId },
        _count: { _all: true },
      }),
      prisma.housingAttendance.groupBy({
        by: ['currentHousing'],
        where: { tenantId: req.tenantId },
        _count: { _all: true },
      }),
    ]);

    res.json(createSuccessResponse({ statusStats, typeStats, housingStats }));
  } catch (error) {
    console.error('Error fetching housing attendance stats:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

// HOUSING PROGRAM ENDPOINTS
router.get('/housing-programs', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const search = getStringParam(req.query.search);
    const type = getStringParam(req.query.type);
    const status = getStringParam(req.query.status);
    const page = getNumberParam(req.query.page) || 1;
    const limit = getNumberParam(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: HousingProgramWhere = {
      tenantId: req.tenantId,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { type: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ];
    }

    if (type) where.type = type;
    if (status) where.status = status;

    const [programs, total] = await Promise.all([
      prisma.housingProgram.findMany({
        where: where as Prisma.HousingProgramWhereInput,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              registrations: true,
            },
          },
        },
      }),
      prisma.housingProgram.count({ where: where as Prisma.HousingProgramWhereInput }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json(createPaginatedResponse(programs, page, limit, total, totalPages));
  } catch (error) {
    console.error('Error fetching housing programs:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

router.post('/housing-programs', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const validatedData = housingProgramSchema.parse(req.body);

    // Validate dates if provided
    if (validatedData.startDate && validatedData.endDate) {
      const startDate = new Date(validatedData.startDate);
      const endDate = new Date(validatedData.endDate);

      if (endDate < startDate) {
        res.status(400).json(createErrorResponse('INVALID_DATES', 'Data de fim deve ser posterior à data de início'));
        return;
      }
    }

    const createData = {
      tenantId: req.tenantId,
      name: validatedData.name,
      type: validatedData.type,
      description: validatedData.description,
      requirements: (validatedData.requirements || null) as Prisma.InputJsonValue,
      maxIncome: validatedData.maxIncome,
      availableUnits: validatedData.availableUnits,
      registeredFamilies: validatedData.registeredFamilies,
      startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
      status: validatedData.status,
    } as Prisma.HousingProgramUncheckedCreateInput;

    const program = await prisma.housingProgram.create({
      data: createData,
    });

    res.status(201).json(createSuccessResponse(program, 'Programa habitacional criado com sucesso'));
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.input,
      }));
      res.status(400).json(createValidationErrorResponse(errors));
      return;
    }
    console.error('Error creating housing program:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

router.get('/housing-programs/:id', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const id = getStringParam(req.params.id);

    if (!isValidId(id)) {
      res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
      return;
    }

    const program = await prisma.housingProgram.findUnique({
      where: {
        id,
        tenantId: req.tenantId,
      },
      include: {
        registrations: {
          orderBy: { score: 'desc' },
          take: 20,
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    if (!program) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Programa habitacional não encontrado'));
      return;
    }

    res.json(createSuccessResponse(program));
  } catch (error) {
    console.error('Error fetching housing program:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

router.put('/housing-programs/:id', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const id = getStringParam(req.params.id);

    if (!isValidId(id)) {
      res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
      return;
    }

    const validatedData = housingProgramSchema.partial().parse(req.body);

    // Validate dates if provided
    if (validatedData.startDate && validatedData.endDate) {
      const startDate = new Date(validatedData.startDate);
      const endDate = new Date(validatedData.endDate);

      if (endDate < startDate) {
        res.status(400).json(createErrorResponse('INVALID_DATES', 'Data de fim deve ser posterior à data de início'));
        return;
      }
    }

    const updateData = {
      name: validatedData.name,
      type: validatedData.type,
      description: validatedData.description,
      maxIncome: validatedData.maxIncome,
      availableUnits: validatedData.availableUnits,
      registeredFamilies: validatedData.registeredFamilies,
      status: validatedData.status,
      requirements: validatedData.requirements ? (validatedData.requirements as Prisma.InputJsonValue) : undefined,
      startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
    } as Prisma.HousingProgramUncheckedUpdateInput;

    const program = await prisma.housingProgram.update({
      where: {
        id,
        tenantId: req.tenantId,
      },
      data: updateData,
    });

    res.json(createSuccessResponse(program, 'Programa habitacional atualizado com sucesso'));
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.input,
      }));
      res.status(400).json(createValidationErrorResponse(errors));
      return;
    }
    console.error('Error updating housing program:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

router.delete('/housing-programs/:id', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const id = getStringParam(req.params.id);

    if (!isValidId(id)) {
      res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
      return;
    }

    // Check if program has registrations
    const registrationCount = await prisma.housingRegistration.count({
      where: { programId: id },
    });

    if (registrationCount > 0) {
      res.status(400).json(createErrorResponse(
        'PROGRAM_HAS_REGISTRATIONS',
        'Não é possível excluir programa com inscrições existentes',
        { registrationCount }
      ));
      return;
    }

    await prisma.housingProgram.delete({
      where: {
        id,
        tenantId: req.tenantId,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting housing program:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

router.get('/housing-programs/stats', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const typeStats = await prisma.housingProgram.groupBy({
      by: ['type'],
      where: { tenantId: req.tenantId },
      _count: { _all: true },
      _sum: { availableUnits: true, registeredFamilies: true },
    });

    const statusStats = await prisma.housingProgram.groupBy({
      by: ['status'],
      where: { tenantId: req.tenantId },
      _count: { _all: true },
    });

    const totalPrograms = await prisma.housingProgram.count({
      where: { tenantId: req.tenantId },
    });

    const activePrograms = await prisma.housingProgram.count({
      where: { tenantId: req.tenantId, status: 'ACTIVE' },
    });

    res.json(createSuccessResponse({
      typeStats,
      statusStats,
      totalPrograms,
      activePrograms,
    }));
  } catch (error) {
    console.error('Error fetching housing programs stats:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

// HOUSING REGISTRATION ENDPOINTS
router.get('/housing-registrations', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const search = getStringParam(req.query.search);
    const programId = getStringParam(req.query.programId);
    const status = getStringParam(req.query.status);
    const page = getNumberParam(req.query.page) || 1;
    const limit = getNumberParam(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: HousingRegistrationWhere = {
      tenantId: req.tenantId,
    };

    if (search) {
      where.OR = [
        { familyHeadName: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { familyHeadCPF: { contains: search } },
      ];
    }

    if (programId) where.programId = programId;
    if (status) where.status = status;

    const [registrations, total] = await Promise.all([
      prisma.housingRegistration.findMany({
        where: where as Prisma.HousingRegistrationWhereInput,
        skip,
        take: limit,
        orderBy: [{ score: 'desc' }, { registrationDate: 'asc' }],
        include: {
          program: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      }),
      prisma.housingRegistration.count({ where: where as Prisma.HousingRegistrationWhereInput }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json(createPaginatedResponse(registrations, page, limit, total, totalPages));
  } catch (error) {
    console.error('Error fetching housing registrations:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

router.post('/housing-registrations', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const validatedData = housingRegistrationSchema.parse(req.body);

    // Verify program exists and belongs to tenant
    const program = await prisma.housingProgram.findUnique({
      where: {
        id: validatedData.programId,
        tenantId: req.tenantId,
      },
    });

    if (!program) {
      res.status(400).json(createErrorResponse('INVALID_PROGRAM', 'Programa inválido ou não encontrado'));
      return;
    }

    // Check if family is already registered for this program
    const existingRegistration = await prisma.housingRegistration.findFirst({
      where: {
        programId: validatedData.programId,
        familyHeadCPF: validatedData.familyHeadCPF,
      },
    });

    if (existingRegistration) {
      res.status(400).json(createErrorResponse('FAMILY_ALREADY_REGISTERED', 'Família já cadastrada neste programa'));
      return;
    }

    const createData = {
      tenantId: req.tenantId,
      programId: validatedData.programId,
      familyHeadName: validatedData.familyHeadName,
      familyHeadCPF: validatedData.familyHeadCPF,
      contact: validatedData.contact,
      address: validatedData.address,
      familyIncome: validatedData.familyIncome,
      familySize: validatedData.familySize,
      score: validatedData.score,
      status: validatedData.status,
      observations: validatedData.observations,
      registrationDate: validatedData.registrationDate
        ? new Date(validatedData.registrationDate)
        : new Date(),
      selectedDate: validatedData.selectedDate ? new Date(validatedData.selectedDate) : undefined,
    } as Prisma.HousingRegistrationUncheckedCreateInput;

    const registration = await prisma.housingRegistration.create({
      data: createData,
      include: {
        program: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    res.status(201).json(createSuccessResponse(registration, 'Inscrição habitacional criada com sucesso'));
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.input,
      }));
      res.status(400).json(createValidationErrorResponse(errors));
      return;
    }
    console.error('Error creating housing registration:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

router.get('/housing-registrations/:id', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const id = getStringParam(req.params.id);

    if (!isValidId(id)) {
      res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
      return;
    }

    const registration = await prisma.housingRegistration.findUnique({
      where: {
        id,
        tenantId: req.tenantId,
      },
      include: {
        program: true,
      },
    });

    if (!registration) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Inscrição habitacional não encontrada'));
      return;
    }

    res.json(createSuccessResponse(registration));
  } catch (error) {
    console.error('Error fetching housing registration:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

router.put('/housing-registrations/:id', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const id = getStringParam(req.params.id);

    if (!isValidId(id)) {
      res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
      return;
    }

    const validatedData = housingRegistrationSchema.partial().parse(req.body);

    // If updating programId, verify it exists and belongs to tenant
    if (validatedData.programId) {
      const program = await prisma.housingProgram.findUnique({
        where: {
          id: validatedData.programId,
          tenantId: req.tenantId,
        },
      });

      if (!program) {
        res.status(400).json(createErrorResponse('INVALID_PROGRAM', 'Programa inválido ou não encontrado'));
        return;
      }
    }

    const updateData = {
      programId: validatedData.programId,
      familyHeadName: validatedData.familyHeadName,
      familyHeadCPF: validatedData.familyHeadCPF,
      contact: validatedData.contact,
      address: validatedData.address,
      familyIncome: validatedData.familyIncome,
      familySize: validatedData.familySize,
      score: validatedData.score,
      status: validatedData.status,
      observations: validatedData.observations,
      registrationDate: validatedData.registrationDate
        ? new Date(validatedData.registrationDate)
        : undefined,
      selectedDate: validatedData.selectedDate ? new Date(validatedData.selectedDate) : undefined,
    } as Prisma.HousingRegistrationUncheckedUpdateInput;

    const registration = await prisma.housingRegistration.update({
      where: {
        id,
        tenantId: req.tenantId,
      },
      data: updateData,
      include: {
        program: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    res.json(createSuccessResponse(registration, 'Inscrição habitacional atualizada com sucesso'));
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.input,
      }));
      res.status(400).json(createValidationErrorResponse(errors));
      return;
    }
    console.error('Error updating housing registration:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

router.delete('/housing-registrations/:id', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const id = getStringParam(req.params.id);

    if (!isValidId(id)) {
      res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
      return;
    }

    await prisma.housingRegistration.delete({
      where: {
        id,
        tenantId: req.tenantId,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting housing registration:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

router.get('/housing-registrations/stats', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const statusStats = await prisma.housingRegistration.groupBy({
      by: ['status'],
      where: { tenantId: req.tenantId },
      _count: { _all: true },
    });

    const programStats = await prisma.housingRegistration.groupBy({
      by: ['programId'],
      where: { tenantId: req.tenantId },
      _count: { _all: true },
    });

    const totalRegistrations = await prisma.housingRegistration.count({
      where: { tenantId: req.tenantId },
    });

    const selectedRegistrations = await prisma.housingRegistration.count({
      where: { tenantId: req.tenantId, status: 'SELECTED' },
    });

    res.json(createSuccessResponse({
      statusStats,
      programStats,
      totalRegistrations,
      selectedRegistrations,
    }));
  } catch (error) {
    console.error('Error fetching housing registrations stats:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

// Calculate and update family score
router.patch(
  '/housing-registrations/:id/calculate-score',
  handleAsyncRoute(async (req, res) => {
    if (!isAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
      return;
    }

    try {
      const id = getStringParam(req.params.id);

      if (!isValidId(id)) {
        res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
        return;
      }

      const registration = await prisma.housingRegistration.findUnique({
        where: {
          id,
          tenantId: req.tenantId,
        },
        include: {
          program: true,
        },
      });

      if (!registration) {
        res.status(404).json(createErrorResponse('NOT_FOUND', 'Inscrição habitacional não encontrada'));
        return;
      }

      // Simple scoring algorithm - this should be customizable per municipality
      let score = 0;

      // Income score (lower income = higher score)
      if (registration.program.maxIncome) {
        const incomeRatio = registration.familyIncome / registration.program.maxIncome;
        score += Math.max(0, 100 - incomeRatio * 100);
      }

      // Family size score (larger families = higher score)
      score += Math.min(50, registration.familySize * 10);

      // Registration date score (earlier registration = higher score)
      const daysSinceRegistration = Math.floor(
        (Date.now() - registration.registrationDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      score += Math.min(50, daysSinceRegistration / 10);

      const updatedRegistration = await prisma.housingRegistration.update({
        where: { id },
        data: { score },
        include: {
          program: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      });

      res.json(createSuccessResponse(updatedRegistration, 'Pontuação calculada com sucesso'));
    } catch (error) {
      console.error('Error calculating registration score:', error);
      res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  })
);

export default router;
