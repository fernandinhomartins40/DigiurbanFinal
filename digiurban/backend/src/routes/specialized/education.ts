// ============================================================================
// FASE 2 - MIGRAÇÃO COMPLETA EDUCATION.TS - PADRÃO MODERNO 2024
// ============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';

import {
  adminAuthMiddleware,
  requirePermission,
  addDataFilter,
} from '../../middleware/admin-auth';
import { tenantMiddleware } from '../../middleware/tenant';

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
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

// Interfaces específicas para where clauses de educação
interface SchoolWhereInput {
  tenantId: string;
  type?: string;
  shift?: string;
  isActive?: boolean;
  name?: { contains: string; mode?: 'insensitive' };
}

interface StudentWhereInput {
  tenantId: string;
  schoolId?: string;
  isActive?: boolean;
  name?: { contains: string; mode?: 'insensitive' };
  cpf?: { contains: string };
  OR?: Array<{
    name?: { contains: string; mode?: 'insensitive' };
    cpf?: { contains: string };
  }>;
}

interface AttendanceWhereInput {
  tenantId: string;
  studentId?: string;
  classId?: string;
  date?: Date;
}

interface TransportWhereInput {
  tenantId: string;
  shift?: string;
  isActive?: boolean;
}

interface MealWhereInput {
  tenantId: string;
  date?: Date;
  shift?: string;
}

interface IncidentWhereInput {
  tenantId: string;
  studentId?: string;
  classId?: string;
  type?: string;
  severity?: string;
}

interface EventWhereInput {
  tenantId: string;
  type?: string;
  schoolId?: string;
  isHoliday?: boolean;
}

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
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    pagination
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

function isFullyAuthenticatedRequest(req: AuthenticatedRequest): boolean {
  return !!(req.user && req.tenantId);
}

function isAuthenticatedRequest(req: any): req is AuthenticatedRequest & {
  user: User;
  tenant: Tenant;
} {
  return !!(req.user && req.tenant);
}

function handleAsyncRoute(fn: (req: any, res: Response) => Promise<void>) {
  return (req: any, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
}


// Middleware global
router.use(tenantMiddleware);
router.use(adminAuthMiddleware);

// ====================== SCHEMAS DE VALIDAÇÃO ======================

const schoolSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  code: z.string().min(2, 'Código deve ter pelo menos 2 caracteres'),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  principalName: z.string().min(2, 'Nome do diretor é obrigatório'),
  capacity: z.number().int().min(1, 'Capacidade deve ser maior que 0'),
  type: z.enum(['infantil', 'fundamental1', 'fundamental2', 'medio']),
  shift: z.enum(['matutino', 'vespertino', 'noturno', 'integral']),
  isActive: z.boolean().default(true),
});

const studentSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  birthDate: z.string().transform(str => new Date(str)),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  parentName: z.string().min(2, 'Nome do responsável é obrigatório'),
  parentPhone: z.string().min(10, 'Telefone do responsável é obrigatório'),
  parentEmail: z.string().email().optional(),
  address: z.string().min(5, 'Endereço é obrigatório'),
  schoolId: z.string().min(1, 'Escola é obrigatória'),
  medicalInfo: z.object({
    allergies: z.array(z.string()),
    chronicConditions: z.array(z.string()),
    medications: z.array(z.string()),
    emergencyContacts: z.array(z.object({
      name: z.string(),
      relationship: z.string(),
      phone: z.string()
    })),
    bloodType: z.string().optional(),
    observations: z.string().optional(),
    lastUpdate: z.string().datetime()
  }).optional(),
  isActive: z.boolean().default(true),
});

const attendanceSchema = z.object({
  studentId: z.string().min(1, 'Aluno é obrigatório'),
  classId: z.string().min(1, 'Turma é obrigatória'),
  date: z.string().transform(str => new Date(str)),
  present: z.boolean(),
  justification: z.string().optional(),
});

const schoolTransportSchema = z.object({
  route: z.string().min(2, 'Nome da rota é obrigatório'),
  driver: z.string().min(2, 'Nome do motorista é obrigatório'),
  vehicle: z.string().min(2, 'Veículo é obrigatório'),
  capacity: z.number().int().min(1, 'Capacidade deve ser maior que 0'),
  shift: z.enum(['matutino', 'vespertino', 'integral']),
  stops: z
    .array(
      z.object({
        name: z.string(),
        address: z.string(),
        time: z.string(),
      })
    )
    .optional(),
});

const schoolMealSchema = z.object({
  schoolId: z.string().optional(),
  date: z.string().transform(str => new Date(str)).optional(),
  shift: z.enum(['matutino', 'vespertino', 'integral']),
  menu: z.object({
    breakfast: z.string().optional(),
    lunch: z.string().optional(),
    snack: z.string().optional(),
  }),
  studentsServed: z.number().int().min(0).default(0),
  cost: z.number().min(0).optional(),
});

const schoolIncidentSchema = z.object({
  studentId: z.string().min(1, 'Aluno é obrigatório'),
  classId: z.string().min(1, 'Turma é obrigatória'),
  type: z.enum(['disciplinar', 'academico', 'saude', 'bullying', 'outro']),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  severity: z.enum(['baixa', 'media', 'alta']).default('media'),
  actionTaken: z.string().optional(),
  parentNotified: z.boolean().default(false),
});

const schoolEventSchema = z.object({
  title: z.string().min(2, 'Título é obrigatório'),
  description: z.string().optional(),
  date: z.string().transform(str => new Date(str)),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  type: z.enum(['reuniao', 'evento', 'feriado', 'recesso', 'formatura', 'festa']),
  schoolId: z.string().optional(),
  isHoliday: z.boolean().default(false),
});

// ====================== HELPER FUNCTIONS ======================

const validateSchemaAndRespond = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  res: Response
): T | null => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      value: err.input,
    }));
    res.status(400).json(createValidationErrorResponse(errors));
    return null;
  }
  return result.data;
};

// ====================== ESCOLAS ======================

// GET /api/specialized/education/schools
router.get(
  '/schools',
  requirePermission('education:read'),
  handleAsyncRoute(async (req, res) => {
    if (!isFullyAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('AUTH_ERROR', 'Acesso não autorizado'));
      return;
    }

    const type = getStringParam(req.query.type);
    const shift = getStringParam(req.query.shift);
    const isActive = getStringParam(req.query.isActive);
    const page = getNumberParam(req.query.page) || 1;
    const limit = getNumberParam(req.query.limit) || 20;

    const offset = (page - 1) * limit;

    const where: SchoolWhereInput = { tenantId: req.tenantId };
    if (type) where.type = type;
    if (shift) where.shift = shift;
    if (isActive !== '') where.isActive = isActive === 'true';

    const [schools, total] = await Promise.all([
      prisma.school.findMany({
        where,
        include: {
          _count: {
            select: {
              classes: true,
              students: true,
            },
          },
        },
        orderBy: { name: 'asc' },
        skip: offset,
        take: limit,
      }),
      prisma.school.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json(
      createPaginatedResponse(schools, {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      })
    );
  })
);

// POST /api/specialized/education/schools
router.post(
  '/schools',
  requirePermission('education:write'),
  handleAsyncRoute(async (req, res) => {
    if (!isFullyAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('AUTH_ERROR', 'Acesso não autorizado'));
      return;
    }

    const validatedData = validateSchemaAndRespond(schoolSchema, req.body, res);
    if (!validatedData) return;

    // Verificar se o código da escola já existe
    const existingSchool = await prisma.school.findFirst({
      where: {
        tenantId: req.tenantId,
        code: validatedData.code,
      },
    });

    if (existingSchool) {
      res.status(409).json(createErrorResponse('CONFLICT', 'Código da escola já existe'));
      return;
    }

    const school = await prisma.school.create({
      data: {
        ...validatedData,
        tenantId: req.tenantId,
      },
      include: {
        _count: {
          select: {
            classes: true,
            students: true,
          },
        },
      },
    });

    res.status(201).json(createSuccessResponse(school, 'Escola criada com sucesso'));
  })
);

// ====================== ESTUDANTES ======================

// GET /api/specialized/education/students
router.get(
  '/students',
  requirePermission('education:read'),
  handleAsyncRoute(async (req, res) => {
    if (!isFullyAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('AUTH_ERROR', 'Acesso não autorizado'));
      return;
    }

    const schoolId = getStringParam(req.query.schoolId);
    const isActive = getStringParam(req.query.isActive);
    const search = getStringParam(req.query.search);
    const page = getNumberParam(req.query.page) || 1;
    const limit = getNumberParam(req.query.limit) || 20;

    const offset = (page - 1) * limit;

    const where: StudentWhereInput = { tenantId: req.tenantId };
    if (schoolId && isValidId(schoolId)) where.schoolId = schoolId;
    if (isActive !== '') where.isActive = isActive === 'true';
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search } },
      ];
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          school: {
            select: { name: true, code: true },
          },
          _count: {
            select: {
              enrollments: true,
              attendances: true,
              incidents: true,
            },
          },
        },
        orderBy: { name: 'asc' },
        skip: offset,
        take: limit,
      }),
      prisma.student.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json(
      createPaginatedResponse(students, {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      })
    );
  })
);

// POST /api/specialized/education/students
router.post(
  '/students',
  requirePermission('education:write'),
  handleAsyncRoute(async (req, res) => {
    if (!isFullyAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('AUTH_ERROR', 'Acesso não autorizado'));
      return;
    }

    const validatedData = validateSchemaAndRespond(studentSchema, req.body, res);
    if (!validatedData) return;

    // Verificar se a escola existe
    const school = await prisma.school.findFirst({
      where: {
        id: validatedData.schoolId,
        tenantId: req.tenantId,
      },
    });

    if (!school) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Escola não encontrada'));
      return;
    }

    // Verificar CPF duplicado se fornecido
    if (validatedData.cpf) {
      const existingStudent = await prisma.student.findFirst({
        where: {
          tenantId: req.tenantId,
          cpf: validatedData.cpf,
        },
      });

      if (existingStudent) {
        res.status(409).json(createErrorResponse('CONFLICT', 'CPF já cadastrado'));
        return;
      }
    }

    const student = await prisma.student.create({
      data: {
        tenantId: req.tenantId,
        name: validatedData.name,
        birthDate: validatedData.birthDate,
        parentName: validatedData.parentName,
        parentPhone: validatedData.parentPhone,
        address: validatedData.address,
        schoolId: validatedData.schoolId,
        isActive: validatedData.isActive ?? true,
        ...(validatedData.cpf && { cpf: validatedData.cpf }),
        ...(validatedData.rg && { rg: validatedData.rg }),
        ...(validatedData.parentEmail && { parentEmail: validatedData.parentEmail }),
        ...(validatedData.medicalInfo && { medicalInfo: validatedData.medicalInfo as Prisma.InputJsonValue }),
      },
      include: {
        school: {
          select: { name: true, code: true },
        },
      },
    });

    res.status(201).json(createSuccessResponse(student, 'Estudante cadastrado com sucesso'));
  })
);

// ====================== FREQUÊNCIA ======================

// GET /api/specialized/education/attendance
router.get(
  '/attendance',
  requirePermission('education:read'),
  handleAsyncRoute(async (req, res) => {
    if (!isFullyAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('AUTH_ERROR', 'Acesso não autorizado'));
      return;
    }

    const studentId = getStringParam(req.query.studentId);
    const classId = getStringParam(req.query.classId);
    const date = getStringParam(req.query.date);
    const page = getNumberParam(req.query.page) || 1;
    const limit = getNumberParam(req.query.limit) || 20;

    const offset = (page - 1) * limit;

    const where: AttendanceWhereInput = { tenantId: req.tenantId };
    if (studentId && isValidId(studentId)) where.studentId = studentId;
    if (classId && isValidId(classId)) where.classId = classId;
    if (date) where.date = new Date(date);

    const [attendances, total] = await Promise.all([
      prisma.studentAttendance.findMany({
        where,
        include: {
          student: {
            select: { name: true, cpf: true },
          },
          class: {
            select: { name: true, grade: true, shift: true },
          },
        },
        orderBy: { date: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.studentAttendance.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json(
      createPaginatedResponse(attendances, {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      })
    );
  })
);

// POST /api/specialized/education/attendance
router.post(
  '/attendance',
  requirePermission('education:write'),
  handleAsyncRoute(async (req, res) => {
    const validatedData = validateSchemaAndRespond(attendanceSchema, req.body, res);
    if (!validatedData) return;

    // Verificar se já existe frequência para este aluno/turma/data
    const existingAttendance = await prisma.studentAttendance.findFirst({
      where: {
        tenantId: req.tenantId,
        studentId: validatedData.studentId,
        classId: validatedData.classId,
        date: validatedData.date,
      },
    });

    if (existingAttendance) {
      // Atualizar existente
      const attendance = await prisma.studentAttendance.update({
        where: { id: existingAttendance.id },
        data: {
          present: validatedData.present,
          justification: validatedData.justification,
        },
        include: {
          student: {
            select: { name: true },
          },
          class: {
            select: { name: true },
          },
        },
      });

      res.json(createSuccessResponse(attendance, 'Frequência atualizada com sucesso'));
      return;
    }

    // Criar nova frequência
    const attendance = await prisma.studentAttendance.create({
      data: {
        tenantId: req.tenantId,
        studentId: validatedData.studentId,
        classId: validatedData.classId,
        date: validatedData.date || new Date(),
        present: validatedData.present,
        ...(validatedData.justification && { justification: validatedData.justification }),
      },
      include: {
        student: {
          select: { name: true },
        },
        class: {
          select: { name: true },
        },
      },
    });

    res.status(201).json(createSuccessResponse(attendance, 'Frequência registrada com sucesso'));
  })
);

// ====================== TRANSPORTE ESCOLAR ======================

// GET /api/specialized/education/transport
router.get(
  '/transport',
  requirePermission('education:read'),
  handleAsyncRoute(async (req, res) => {
    if (!isFullyAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('AUTH_ERROR', 'Acesso não autorizado'));
      return;
    }

    const shift = getStringParam(req.query.shift);
    const isActive = getStringParam(req.query.isActive);

    const where: TransportWhereInput = { tenantId: req.tenantId };
    if (shift) where.shift = shift;
    if (isActive !== '') where.isActive = isActive === 'true';

    const transports = await prisma.schoolTransport.findMany({
      where,
      orderBy: { route: 'asc' },
    });

    res.json(createSuccessResponse(transports));
  })
);

// POST /api/specialized/education/transport
router.post(
  '/transport',
  requirePermission('education:write'),
  handleAsyncRoute(async (req, res) => {
    if (!isFullyAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('AUTH_ERROR', 'Acesso não autorizado'));
      return;
    }

    const validatedData = validateSchemaAndRespond(schoolTransportSchema, req.body, res);
    if (!validatedData) return;

    const transport = await prisma.schoolTransport.create({
      data: {
        ...validatedData,
        tenantId: req.tenantId,
      },
    });

    res.status(201).json(createSuccessResponse(transport, 'Rota de transporte criada com sucesso'));
  })
);

// ====================== MERENDA ESCOLAR ======================

// GET /api/specialized/education/meals
router.get(
  '/meals',
  requirePermission('education:read'),
  handleAsyncRoute(async (req, res) => {
    if (!isFullyAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('AUTH_ERROR', 'Acesso não autorizado'));
      return;
    }

    const date = getStringParam(req.query.date);
    const shift = getStringParam(req.query.shift);
    const page = getNumberParam(req.query.page) || 1;
    const limit = getNumberParam(req.query.limit) || 20;

    const offset = (page - 1) * limit;

    const where: MealWhereInput = { tenantId: req.tenantId };
    if (date) where.date = new Date(date);
    if (shift) where.shift = shift;

    const [meals, total] = await Promise.all([
      prisma.schoolMeal.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.schoolMeal.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json(
      createPaginatedResponse(meals, {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      })
    );
  })
);

// POST /api/specialized/education/meals
router.post(
  '/meals',
  requirePermission('education:write'),
  handleAsyncRoute(async (req, res) => {
    if (!isFullyAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('AUTH_ERROR', 'Acesso não autorizado'));
      return;
    }

    const validatedData = validateSchemaAndRespond(schoolMealSchema, req.body, res);
    if (!validatedData) return;

    const meal = await prisma.schoolMeal.create({
      data: {
        tenantId: req.tenantId,
        date: validatedData.date || new Date(),
        shift: validatedData.shift,
        menu: validatedData.menu as Prisma.InputJsonValue,
        studentsServed: validatedData.studentsServed,
        ...(validatedData.schoolId && { schoolId: validatedData.schoolId }),
        ...(validatedData.cost && { cost: validatedData.cost }),
      },
    });

    res.status(201).json(createSuccessResponse(meal, 'Menu escolar cadastrado com sucesso'));
  })
);

// ====================== INCIDENTES ESCOLARES ======================

// GET /api/specialized/education/incidents
router.get(
  '/incidents',
  requirePermission('education:read'),
  handleAsyncRoute(async (req, res) => {
    if (!isFullyAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('AUTH_ERROR', 'Acesso não autorizado'));
      return;
    }

    const studentId = getStringParam(req.query.studentId);
    const classId = getStringParam(req.query.classId);
    const type = getStringParam(req.query.type);
    const severity = getStringParam(req.query.severity);
    const page = getNumberParam(req.query.page) || 1;
    const limit = getNumberParam(req.query.limit) || 20;

    const offset = (page - 1) * limit;

    const where: IncidentWhereInput = { tenantId: req.tenantId };
    if (studentId && isValidId(studentId)) where.studentId = studentId;
    if (classId && isValidId(classId)) where.classId = classId;
    if (type) where.type = type;
    if (severity) where.severity = severity;

    const [incidents, total] = await Promise.all([
      prisma.schoolIncident.findMany({
        where,
        include: {
          student: {
            select: { name: true },
          },
          class: {
            select: { name: true, grade: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.schoolIncident.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json(
      createPaginatedResponse(incidents, {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      })
    );
  })
);

// POST /api/specialized/education/incidents
router.post(
  '/incidents',
  requirePermission('education:write'),
  handleAsyncRoute(async (req, res) => {
    if (!isFullyAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('AUTH_ERROR', 'Acesso não autorizado'));
      return;
    }

    const validatedData = validateSchemaAndRespond(schoolIncidentSchema, req.body, res);
    if (!validatedData) return;

    const incident = await prisma.schoolIncident.create({
      data: {
        ...validatedData,
        tenantId: req.tenantId,
      },
      include: {
        student: {
          select: { name: true },
        },
        class: {
          select: { name: true },
        },
      },
    });

    res.status(201).json(createSuccessResponse(incident, 'Incidente registrado com sucesso'));
  })
);

// ====================== EVENTOS ESCOLARES ======================

// GET /api/specialized/education/events
router.get(
  '/events',
  requirePermission('education:read'),
  handleAsyncRoute(async (req, res) => {
    if (!isFullyAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('AUTH_ERROR', 'Acesso não autorizado'));
      return;
    }

    const type = getStringParam(req.query.type);
    const schoolId = getStringParam(req.query.schoolId);
    const isHoliday = getStringParam(req.query.isHoliday);

    const where: EventWhereInput = { tenantId: req.tenantId };
    if (type) where.type = type;
    if (schoolId && isValidId(schoolId)) where.schoolId = schoolId;
    if (isHoliday !== '') where.isHoliday = isHoliday === 'true';

    const events = await prisma.schoolEvent.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    res.json(createSuccessResponse(events));
  })
);

// POST /api/specialized/education/events
router.post(
  '/events',
  requirePermission('education:write'),
  handleAsyncRoute(async (req, res) => {
    if (!isFullyAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('AUTH_ERROR', 'Acesso não autorizado'));
      return;
    }

    const validatedData = validateSchemaAndRespond(schoolEventSchema, req.body, res);
    if (!validatedData) return;

    // CRIADO: remover schoolId se não fornecido (Prisma não aceita undefined explícito)
    const { schoolId, ...restData } = validatedData;
    const event = await prisma.schoolEvent.create({
      data: {
        ...restData,
        tenantId: req.tenantId,
        ...(schoolId ? { schoolId } : {}),
      } as unknown as Prisma.SchoolEventUncheckedCreateInput,
    });

    res.status(201).json(createSuccessResponse(event, 'Evento cadastrado com sucesso'));
  })
);

// ====================== RELATÓRIOS E ESTATÍSTICAS ======================

// GET /api/specialized/education/stats
router.get(
  '/stats',
  requirePermission('education:read'),
  handleAsyncRoute(async (req, res) => {
    if (!isFullyAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('AUTH_ERROR', 'Acesso não autorizado'));
      return;
    }

    const tenantId = req.tenantId;

    const [
      totalSchools,
      totalStudents,
      totalClasses,
      totalAttendances,
      totalIncidents,
      totalTransports,
      totalEvents,
    ] = await Promise.all([
      prisma.school.count({ where: { tenantId, isActive: true } }),
      prisma.student.count({ where: { tenantId, isActive: true } }),
      prisma.schoolClass.count({ where: { tenantId, isActive: true } }),
      prisma.studentAttendance.count({
        where: {
          tenantId,
          date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.schoolIncident.count({
        where: {
          tenantId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.schoolTransport.count({ where: { tenantId, isActive: true } }),
      prisma.schoolEvent.count({
        where: {
          tenantId,
          date: {
            gte: new Date(),
          },
        },
      }),
    ]);

    const stats = {
      overview: {
        totalSchools,
        totalStudents,
        totalClasses,
        totalTransports,
      },
      monthly: {
        attendances: totalAttendances,
        incidents: totalIncidents,
      },
      upcoming: {
        events: totalEvents,
      },
    };

    res.json(createSuccessResponse(stats));
  })
);

export default router;
