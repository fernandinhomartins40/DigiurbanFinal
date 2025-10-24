// ============================================================================
// FASE 2 - MIGRAÇÃO COMPLETA HEALTH.TS - PADRÃO MODERNO 2024
// ============================================================================

// ============================================================================
// HEALTH.TS - ISOLAMENTO PROFISSIONAL COMPLETO
// ============================================================================

import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Prisma, HealthAttendanceType } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { AuthenticatedRequest, SuccessResponse, ErrorResponse } from '../../types';
import { asyncHandler } from '../../utils/express-helpers';
import { tenantMiddleware } from '../../middleware/tenant';
import { adminAuthMiddleware, requirePermission as requirePermissionMiddleware } from '../../middleware/admin-auth';

// ====================== TIPOS E INTERFACES ISOLADAS ======================

// ====================== HELPER FUNCTIONS ======================

const requirePermission = requirePermissionMiddleware;

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Funções de resposta locais
function createSuccessResponse<T>(data: T, message?: string): SuccessResponse<T> {
  return { success: true, data, message };
}

function createErrorResponse(error: string, details?: any): ErrorResponse {
  return { success: false, error, message: error, details };
}

function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: { page, limit, total, totalPages },
    total,
    page,
    limit,
    totalPages,
  };
}

function createValidationErrorResponse(errors: any[]): ErrorResponse {
  return createErrorResponse('Validation failed', errors);
}

// Helper para query params seguros
function getStringParam(param: any): string {
  if (Array.isArray(param)) return param[0] || '';
  if (typeof param === 'string') return param;
  if (param && typeof param === 'object' && param.toString) return param.toString();
  return '';
}

// Helper para criar where clauses seguras
function createSafeWhereClause(params: {
  tenantId?: string;
  search?: string;
  status?: string;
  type?: string;
  category?: string;
  isActive?: string;
  searchFields?: string[];
}): any {
  const where: any = {};

  if (params.tenantId) {
    where.tenantId = params.tenantId;
  }

  if (params.search && params.searchFields) {
    where.OR = params.searchFields.map(field => ({
      [field]: {
        contains: params.search,
        mode: 'insensitive'
      }
    }));
  }

  if (params.status) {
    where.status = params.status;
  }

  if (params.type) {
    where.type = params.type;
  }

  if (params.category) {
    where.category = params.category;
  }

  if (params.isActive !== undefined) {
    where.isActive = params.isActive === 'true';
  }

  return where;
}

// FASE 2 - Interfaces para dados de saúde especializados
interface DoctorScheduleSlot {
  dayOfWeek: number; // 0-6 (domingo a sábado)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isAvailable: boolean;
  slotDuration: number; // em minutos
}

interface MedicalPrescription {
  doctorCrm: string;
  patientCpf: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  diagnosis: string;
  observations?: string;
  issueDate: string;
  isValid: boolean;
}

// Interfaces para where clauses específicas de saúde
interface HealthWhereInput {
  tenantId: string;
  isActive?: boolean;
  status?: string;
  patientId?: string;
  doctorId?: string;
  specialtyId?: string;
  appointmentDate?: {
    gte?: Date;
    lte?: Date;
  };
}

// Interfaces para resultados de groupBy
interface GroupByResult {
  _count: Record<string, number>;
  [key: string]: unknown;
}
import { isFullyAuthenticatedRequest, isValidId, hasRequiredProperties } from '../../utils/guards';

const router = Router();

// Middleware global
router.use(tenantMiddleware);
router.use(adminAuthMiddleware);

// ====================== TIPOS E INTERFACES ======================

interface HealthAppointmentCreateData {
  patientId: string;
  doctorId: string;
  specialtyId: string;
  type: 'consulta' | 'emergencia' | 'retorno' | 'exame';
  priority?: 'baixa' | 'normal' | 'alta' | 'urgente';
  date: Date;
  duration?: number;
  observations?: string;
  diagnosis?: string;
  treatment?: string;
}

interface HealthProfessionalCreateData {
  name: string;
  crm?: string;
  specialtyId: string;
  phone?: string;
  email?: string;
  schedule: Record<string, unknown>;
  isActive?: boolean;
}

interface MedicationDispensingCreateData {
  patientId: string;
  pharmacistId?: string;
  medication: string;
  dosage: string;
  quantity: number;
  prescription?: Record<string, unknown>;
}

interface VaccinationCampaignCreateData {
  name: string;
  vaccine: string;
  startDate: Date;
  endDate: Date;
  targetGroup: 'infantil' | 'idosos' | 'geral';
  description?: string;
}

interface VaccinationCreateData {
  campaignId?: string;
  patientId: string;
  vaccine: string;
  dose: string;
  appliedBy: string;
  lotNumber?: string;
}

interface HealthTransportCreateData {
  patientId: string;
  destination: string;
  date: Date;
  type: 'consulta' | 'exame' | 'cirurgia' | 'emergencia';
  driver?: string;
  vehicle?: string;
}

// ====================== SCHEMAS DE VALIDAÇÃO ======================

const medicalSpecialtySchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  code: z.string().min(2, 'Código deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

const healthProfessionalSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  crm: z.string().optional(),
  specialtyId: z.string().min(1, 'Especialidade é obrigatória'),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  schedule: z.record(z.string(), z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
    isAvailable: z.boolean(),
    slotDuration: z.number().positive()
  })),
  isActive: z.boolean().default(true),
});

const healthAppointmentSchema = z.object({
  patientId: z.string().min(1, 'Paciente é obrigatório'),
  doctorId: z.string().min(1, 'Médico é obrigatório'),
  specialtyId: z.string().min(1, 'Especialidade é obrigatória'),
  type: z.enum(['consulta', 'emergencia', 'retorno', 'exame']),
  priority: z.enum(['baixa', 'normal', 'alta', 'urgente']).default('normal'),
  date: z.string().transform(str => new Date(str)),
  duration: z.number().int().min(15).max(240).default(30),
  observations: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
});

const medicationDispensingSchema = z.object({
  patientId: z.string().min(1, 'Paciente é obrigatório'),
  pharmacistId: z.string().optional(),
  medication: z.string().min(1, 'Medicamento é obrigatório'),
  dosage: z.string().min(1, 'Dosagem é obrigatória'),
  quantity: z.number().int().min(1, 'Quantidade deve ser maior que 0'),
  dispensedAt: z.string().transform(str => new Date(str)).optional(),
  prescription: z.any().optional(),
  batchNumber: z.string().optional(),
  expiryDate: z.string().transform(str => new Date(str)).optional(),
});

const vaccinationCampaignSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  vaccine: z.string().min(1, 'Vacina é obrigatória'),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)),
  targetGroup: z.enum(['infantil', 'idosos', 'geral']),
  goal: z.number().int().min(1).optional(),
  description: z.string().optional(),
});

const vaccinationSchema = z.object({
  campaignId: z.string().optional(),
  patientId: z.string().min(1, 'Paciente é obrigatório'),
  vaccine: z.string().min(1, 'Vacina é obrigatória'),
  dose: z.string().min(1, 'Dose é obrigatória'),
  appliedBy: z.string().min(1, 'Aplicador é obrigatório'),
  appliedAt: z.string().transform(str => new Date(str)).optional(),
  lotNumber: z.string().optional(),
  nextDose: z.string().transform(str => new Date(str)).optional(),
});

const healthTransportSchema = z.object({
  patientId: z.string().min(1, 'Paciente é obrigatório'),
  destination: z.string().min(1, 'Destino é obrigatório'),
  date: z.string().transform(str => new Date(str)),
  type: z.enum(['consulta', 'exame', 'cirurgia', 'emergencia']),
  driver: z.string().optional(),
  vehicle: z.string().optional(),
});

const healthAttendanceSchema = z.object({
  citizenName: z.string().min(1, 'Nome do cidadão é obrigatório'),
  citizenCPF: z.string().min(11, 'CPF é obrigatório'),
  contact: z.string().min(1, 'Contato é obrigatório'),
  type: z.nativeEnum(HealthAttendanceType),
  description: z.string().min(10, 'Descrição é obrigatória'),
  observations: z.string().optional(),
  responsible: z.string().optional(),
  urgency: z.enum(['NORMAL', 'HIGH', 'CRITICAL']).default('NORMAL'),
  medicalUnit: z.string().optional(),
  appointmentDate: z.string().transform(str => new Date(str)).optional(),
  symptoms: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
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

// ====================== ESPECIALIDADES MÉDICAS ======================

// GET /api/specialized/health/specialties
router.get(
  '/specialties',
  requirePermission('health:read'),
  asyncHandler(async (req, res) => {
    const isActive = getStringParam(req.query.isActive);

    const where: HealthWhereInput = { tenantId: req.tenantId! };
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const specialties = await prisma.medicalSpecialty.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    res.json(createSuccessResponse(specialties));
  })
);

// POST /api/specialized/health/specialties
router.post(
  '/specialties',
  requirePermission('health:write'),
  asyncHandler(async (req, res) => {
    const validatedData = validateSchemaAndRespond(medicalSpecialtySchema, req.body, res);
    if (!validatedData) return;

    // Verificar se código já existe
    const existingSpecialty = await prisma.medicalSpecialty.findFirst({
      where: {
        tenantId: req.tenantId,
        code: validatedData.code,
      },
    });

    if (existingSpecialty) {
      res.status(409).json(createErrorResponse('CONFLICT', 'Código da especialidade já existe'));
      return;
    }

    const specialty = await prisma.medicalSpecialty.create({
      data: {
        ...validatedData,
        tenantId: req.tenantId!,
      },
    });

    res
      .status(201)
      .json(createSuccessResponse(specialty, 'Especialidade médica criada com sucesso'));
  })
);

// ====================== PROFISSIONAIS DE SAÚDE ======================

// GET /api/specialized/health/professionals
router.get(
  '/professionals',
  requirePermission('health:read'),
  asyncHandler(async (req, res) => {
    const specialtyId = getStringParam(req.query.specialtyId);
    const isActive = getStringParam(req.query.isActive);
    const page = getStringParam(req.query.page) || '1';
    const limit = getStringParam(req.query.limit) || '20';

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: HealthWhereInput = { tenantId: req.tenantId! };
    if (specialtyId && isValidId(specialtyId as string)) where.specialtyId = specialtyId;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const [professionals, total] = await Promise.all([
      prisma.healthProfessional.findMany({
        where,
        include: {
          specialty: {
            select: { name: true, code: true },
          },
        },
        orderBy: { name: 'asc' },
        skip: offset,
        take: limitNum,
      }),
      prisma.healthProfessional.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json(createPaginatedResponse(professionals, pageNum, limitNum, total));
  })
);

// POST /api/specialized/health/professionals
router.post(
  '/professionals',
  requirePermission('health:write'),
  asyncHandler(async (req, res) => {
    const validatedData = validateSchemaAndRespond(healthProfessionalSchema, req.body, res);
    if (!validatedData) return;

    // Verificar se a especialidade existe
    const specialty = await prisma.medicalSpecialty.findFirst({
      where: {
        id: validatedData.specialtyId,
        tenantId: req.tenantId,
      },
    });

    if (!specialty) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Especialidade não encontrada'));
      return;
    }

    // Verificar CRM duplicado se fornecido
    if (validatedData.crm) {
      const existingProfessional = await prisma.healthProfessional.findFirst({
        where: {
          tenantId: req.tenantId,
          crm: validatedData.crm,
        },
      });

      if (existingProfessional) {
        res.status(409).json(createErrorResponse('CONFLICT', 'CRM já cadastrado'));
        return;
      }
    }

    const professional = await prisma.healthProfessional.create({
      data: {
        ...validatedData,
        tenantId: req.tenantId!,
      },
      include: {
        specialty: {
          select: { name: true, code: true },
        },
      },
    });

    res
      .status(201)
      .json(createSuccessResponse(professional, 'Profissional de saúde cadastrado com sucesso'));
  })
);

// ====================== CONSULTAS MÉDICAS ======================

// GET /api/specialized/health/appointments
router.get(
  '/appointments',
  requirePermission('health:read'),
  asyncHandler(async (req, res) => {
    const doctorId = getStringParam(req.query.doctorId);
    const patientId = getStringParam(req.query.patientId);
    const specialtyId = getStringParam(req.query.specialtyId);
    const type = getStringParam(req.query.type);
    const priority = getStringParam(req.query.priority);
    const date = getStringParam(req.query.date);
    const page = getStringParam(req.query.page) || '1';
    const limit = getStringParam(req.query.limit) || '20';

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    const where = createSafeWhereClause({
      tenantId: req.tenantId,
      searchFields: []
    });

    if (doctorId) where.doctorId = doctorId;
    if (patientId) where.patientId = patientId;
    if (specialtyId) where.specialtyId = specialtyId;
    if (type) where.type = type;
    if (priority) where.priority = priority;
    if (date) {
      const startOfDay = new Date(date as string);
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);
      where.createdAt = {
        gte: startOfDay,
        lt: endOfDay,
      };
    }

    const [appointments, total] = await Promise.all([
      prisma.healthAppointment.findMany({
        where,
        include: {
          doctor: {
            select: { name: true, crm: true, speciality: true },
          },
        },
        orderBy: [{ createdAt: 'asc' }, { appointmentDate: 'asc' }],
        skip: offset,
        take: limitNum,
      }),
      prisma.healthAppointment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json(
createPaginatedResponse(appointments, pageNum, limitNum, total)
    );
  })
);

// POST /api/specialized/health/appointments
router.post(
  '/appointments',
  requirePermission('health:write'),
  asyncHandler(async (req, res) => {
    const validatedData = validateSchemaAndRespond(healthAppointmentSchema, req.body, res);
    if (!validatedData) return;

    // Verificar se o paciente existe
    const patient = await prisma.citizen.findFirst({
      where: {
        id: validatedData.patientId,
        tenantId: req.tenantId,
      },
    });

    if (!patient) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Paciente não encontrado'));
      return;
    }

    // Verificar se o médico existe
    const doctor = await prisma.healthProfessional.findFirst({
      where: {
        id: validatedData.doctorId,
        tenantId: req.tenantId,
      },
    });

    if (!doctor) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Médico não encontrado'));
      return;
    }

    // Verificar conflitos de horário
    const conflictingAppointment = await prisma.healthAppointment.findFirst({
      where: {
        tenantId: req.tenantId,
        doctorId: validatedData.doctorId,
        appointmentDate: {
          gte: validatedData.date,
          lt: new Date(validatedData.date.getTime() + (validatedData.duration || 30) * 60000),
        },
      },
    });

    if (conflictingAppointment) {
      res
        .status(409)
        .json(createErrorResponse('CONFLICT', 'Médico já possui consulta neste horário'));
      return;
    }

    const appointment = await prisma.healthAppointment.create({
      data: {
        tenantId: req.tenantId!,
        patientName: validatedData.patientId, // Simulando nome do paciente com ID
        patientCpf: '', // Será preenchido com dados reais
        appointmentDate: validatedData.date,
        appointmentTime: validatedData.date.toTimeString().slice(0, 5),
        doctorId: validatedData.doctorId,
        speciality: validatedData.type.toUpperCase(),
        priority: validatedData.priority.toUpperCase(),
        status: 'SCHEDULED',
        symptoms: '',
        observations: validatedData.observations,
        diagnosis: validatedData.diagnosis,
        treatment: validatedData.treatment,
      },
      include: {
        doctor: {
          select: { name: true, crm: true },
        },
      },
    });

    res.status(201).json(createSuccessResponse(appointment, 'Consulta agendada com sucesso'));
  })
);

// PUT /api/specialized/health/appointments/:id
router.put(
  '/appointments/:id',
  requirePermission('health:write'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { diagnosis, treatment, observations, status } = req.body;

    if (!isValidId(id)) {
      res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
      return;
    }

    const appointment = await prisma.healthAppointment.findFirst({
      where: { id, tenantId: req.tenantId },
    });

    if (!appointment) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Consulta não encontrada'));
      return;
    }

    const updatedAppointment = await prisma.healthAppointment.update({
      where: { id },
      data: {
        diagnosis: diagnosis || appointment.diagnosis,
        treatment: treatment || appointment.treatment,
        observations: observations || appointment.observations,
        status: status || appointment.status,
      },
      include: {
        doctor: {
          select: { name: true, crm: true },
        },
      },
    });

    res.json(createSuccessResponse(updatedAppointment, 'Consulta atualizada com sucesso'));
  })
);

// ====================== DISPENSAÇÃO DE MEDICAMENTOS ======================

// GET /api/specialized/health/medications
router.get(
  '/medications',
  requirePermission('health:read'),
  asyncHandler(async (req, res) => {
    const patientId = getStringParam(req.query.patientId);
    const medication = getStringParam(req.query.medication);
    const page = getStringParam(req.query.page) || '1';
    const limit = getStringParam(req.query.limit) || '20';

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    const where = createSafeWhereClause({
      tenantId: req.tenantId,
      search: medication,
      searchFields: ['name', 'activeIngredient']
    });

    const [dispensings, total] = await Promise.all([
      prisma.medication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum,
      }),
      prisma.medication.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json(
createPaginatedResponse(dispensings, pageNum, limitNum, total)
    );
  })
);

// POST /api/specialized/health/medications
router.post(
  '/medications',
  requirePermission('health:write'),
  asyncHandler(async (req, res) => {
    const validatedData = validateSchemaAndRespond(medicationDispensingSchema, req.body, res);
    if (!validatedData) return;

    // Verificar se o paciente existe
    const patient = await prisma.citizen.findFirst({
      where: {
        id: validatedData.patientId,
        tenantId: req.tenantId,
      },
    });

    if (!patient) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Paciente não encontrado'));
      return;
    }

    const dispensing = await prisma.medicationDispensing.create({
      data: {
        patientId: validatedData.patientId,
        medication: validatedData.medication,
        dosage: validatedData.dosage,
        quantity: validatedData.quantity,
        pharmacistId: validatedData.pharmacistId,
        prescription: validatedData.prescription,
        dispensedAt: validatedData.dispensedAt || new Date(),
        batchNumber: validatedData.batchNumber,
        expiryDate: validatedData.expiryDate,
        tenantId: req.tenantId!,
      },
    });

    res.status(201).json(createSuccessResponse(dispensing, 'Medicamento dispensado com sucesso'));
  })
);

// ====================== CAMPANHAS DE VACINAÇÃO ======================

// GET /api/specialized/health/vaccination-campaigns
router.get(
  '/vaccination-campaigns',
  requirePermission('health:read'),
  asyncHandler(async (req, res) => {
    const targetGroup = getStringParam(req.query.targetGroup);
    const isActive = getStringParam(req.query.isActive);
    const now = new Date();

    const where: any = { tenantId: req.tenantId };
    if (targetGroup) where.targetGroup = targetGroup;

    // Filtrar campanhas ativas (dentro do período)
    if (isActive === 'true') {
      where.AND = [
        { startDate: { lte: now } },
        { endDate: { gte: now } },
      ];
    }

    const campaigns = await prisma.vaccinationCampaign.findMany({
      where,
      orderBy: { startDate: 'desc' },
    });

    res.json(createSuccessResponse(campaigns));
  })
);

// POST /api/specialized/health/vaccination-campaigns
router.post(
  '/vaccination-campaigns',
  requirePermission('health:write'),
  asyncHandler(async (req, res) => {
    const validatedData = vaccinationCampaignSchema.parse(req.body);

    // Verificar se as datas são válidas
    if (validatedData.endDate <= validatedData.startDate) {
      res.status(400).json(createErrorResponse('INVALID_DATE', 'Data de término deve ser posterior à data de início'));
      return;
    }

    const campaignData = {
      name: validatedData.name,
      vaccine: validatedData.vaccine,
      targetGroup: validatedData.targetGroup,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      goal: validatedData.goal || 0,
      tenantId: req.tenant!.id,
    } as Prisma.VaccinationCampaignUncheckedCreateInput;

    const campaign = await prisma.vaccinationCampaign.create({
      data: campaignData,
    });

    res
      .status(201)
      .json(createSuccessResponse(campaign, 'Campanha de vacinação criada com sucesso'));
  })
);

// ====================== VACINAÇÕES ======================

// GET /api/specialized/health/vaccinations
router.get(
  '/vaccinations',
  requirePermission('health:read'),
  asyncHandler(async (req, res) => {
    const campaignId = getStringParam(req.query.campaignId);
    const patientId = getStringParam(req.query.patientId);
    const vaccine = getStringParam(req.query.vaccine);
    const page = getStringParam(req.query.page) || '1';
    const limit = getStringParam(req.query.limit) || '20';

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: any = { tenantId: req.tenantId };
    if (campaignId && isValidId(campaignId as string)) where.campaignId = campaignId;
    if (patientId && isValidId(patientId as string)) where.patientId = patientId;
    if (vaccine) where.vaccine = { contains: vaccine as string, mode: 'insensitive' };

    const [vaccinations, total] = await Promise.all([
      prisma.vaccination.findMany({
        where,
        include: {
          patient: {
            select: { name: true, cpf: true },
          },
          campaign: {
            select: { name: true, vaccine: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum,
      }),
      prisma.vaccination.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json(
createPaginatedResponse(vaccinations, pageNum, limitNum, total)
    );
  })
);

// POST /api/specialized/health/vaccinations
router.post(
  '/vaccinations',
  requirePermission('health:write'),
  asyncHandler(async (req, res) => {
    const validatedData = validateSchemaAndRespond(vaccinationSchema, req.body, res);
    if (!validatedData) return;

    // Verificar se o paciente existe
    const patient = await prisma.citizen.findFirst({
      where: {
        id: validatedData.patientId,
        tenantId: req.tenantId,
      },
    });

    if (!patient) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Paciente não encontrado'));
      return;
    }

    // Verificar se a campanha existe (se fornecida)
    if (validatedData.campaignId) {
      const campaign = await prisma.vaccinationCampaign.findFirst({
        where: {
          id: validatedData.campaignId,
          tenantId: req.tenantId,
        },
      });

      if (!campaign) {
        res.status(404).json(createErrorResponse('NOT_FOUND', 'Campanha não encontrada'));
        return;
      }
    }

    const vaccination = await prisma.vaccination.create({
      data: {
        campaignId: validatedData.campaignId,
        patientId: validatedData.patientId,
        vaccine: validatedData.vaccine,
        dose: validatedData.dose,
        appliedAt: validatedData.appliedAt || new Date(),
        appliedBy: validatedData.appliedBy,
        lotNumber: validatedData.lotNumber,
        nextDose: validatedData.nextDose,
        tenantId: req.tenantId!,
      },
      include: {
        campaign: {
          select: { name: true, vaccine: true },
        },
      },
    });

    res.status(201).json(createSuccessResponse(vaccination, 'Vacinação registrada com sucesso'));
  })
);

// ====================== TRANSPORTE SANITÁRIO ======================
// COMMENTED OUT - HealthTransport model does not exist in Prisma schema
/*

// GET /api/specialized/health/transport
router.get(
  '/transport',
  requirePermission('health:read'),
  asyncHandler(async (req, res) => {
    const patientId = getStringParam(req.query.patientId);
    const type = getStringParam(req.query.type);
    const date = getStringParam(req.query.date);
    const page = getStringParam(req.query.page) || '1';
    const limit = getStringParam(req.query.limit) || '20';

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: HealthWhereInput = { tenantId: req.tenantId! };
    if (patientId && isValidId(patientId as string)) where.patientId = patientId;
    if (type) where.type = type;
    if (date) {
      const startOfDay = new Date(date as string);
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);
      where.date = {
        gte: startOfDay,
        lt: endOfDay,
      };
    }

    const [transports, total] = await Promise.all([
      prisma.healthTransport.findMany({
        where,
        include: {
          patient: {
            select: { name: true, cpf: true, phone: true },
          },
        },
        orderBy: { date: 'asc' },
        skip: offset,
        take: limitNum,
      }),
      prisma.healthTransport.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json(
createPaginatedResponse(transports, pageNum, limitNum, total)
    );
  })
);

// POST /api/specialized/health/transport
router.post(
  '/transport',
  requirePermission('health:write'),
  asyncHandler(async (req, res) => {
    const validatedData = validateSchemaAndRespond(healthTransportSchema, req.body, res);
    if (!validatedData) return;

    // Verificar se o paciente existe
    const patient = await prisma.citizen.findFirst({
      where: {
        id: validatedData.patientId,
        tenantId: req.tenantId,
      },
    });

    if (!patient) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Paciente não encontrado'));
      return;
    }

    const transport = await prisma.healthTransport.create({
      data: {
        ...validatedData,
        tenantId: req.tenantId,
      },
      include: {
      },
    });

    res
      .status(201)
      .json(createSuccessResponse(transport, 'Transporte sanitário agendado com sucesso'));
  })
);
*/

// ====================== ATENDIMENTOS DE SAÚDE ======================

// GET /api/specialized/health/attendances
router.get(
  '/attendances',
  requirePermission('health:read'),
  asyncHandler(async (req, res) => {
    const attendanceType = getStringParam(req.query.attendanceType);
    const priority = getStringParam(req.query.priority);
    const citizenId = getStringParam(req.query.citizenId);
    const page = getStringParam(req.query.page) || '1';
    const limit = getStringParam(req.query.limit) || '20';

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: any = { tenantId: req.tenantId };
    if (attendanceType) where.type = attendanceType;
    if (priority) where.priority = priority;
    if (citizenId) where.citizenCPF = { contains: citizenId, mode: 'insensitive' };

    const [attendances, total] = await Promise.all([
      prisma.healthAttendance.findMany({
        where,
        include: {
        },
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        skip: offset,
        take: limitNum,
      }),
      prisma.healthAttendance.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json(
createPaginatedResponse(attendances, pageNum, limitNum, total)
    );
  })
);

// POST /api/specialized/health/attendances
router.post(
  '/attendances',
  requirePermission('health:write'),
  asyncHandler(async (req, res) => {
    const validatedData = validateSchemaAndRespond(healthAttendanceSchema, req.body, res);
    if (!validatedData) return;

    // Verificar se o cidadão existe (opcional - baseado no CPF)
    const citizen = await prisma.citizen.findFirst({
      where: {
        cpf: validatedData.citizenCPF,
        tenantId: req.tenantId,
      },
    });

    // Nota: Não bloqueamos se o cidadão não existir, apenas registramos o atendimento

    const attendance = await prisma.healthAttendance.create({
      data: {
        protocol: `HEALTH-${Date.now()}`,
        citizenName: validatedData.citizenName,
        citizenCPF: validatedData.citizenCPF,
        contact: validatedData.contact,
        type: validatedData.type,
        description: validatedData.description,
        observations: validatedData.observations,
        responsible: validatedData.responsible,
        urgency: validatedData.urgency,
        medicalUnit: validatedData.medicalUnit,
        appointmentDate: validatedData.appointmentDate,
        symptoms: validatedData.symptoms,
        priority: validatedData.priority,
        tenantId: req.tenantId!,
      },
    });

    res
      .status(201)
      .json(createSuccessResponse(attendance, 'Atendimento de saúde registrado com sucesso'));
  })
);

// ====================== ESTATÍSTICAS E RELATÓRIOS ======================

// GET /api/specialized/health/stats
router.get(
  '/stats',
  requirePermission('health:read'),
  asyncHandler(async (req, res) => {
    const tenantId = req.tenantId;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    const [
      totalProfessionals,
      activeProfessionals,
      totalAppointments,
      monthlyAppointments,
      weeklyAppointments,
      urgentAppointments,
      totalVaccinations,
      monthlyVaccinations,
      activeCampaigns,
      medicationsDispensed,
      transportScheduled,
      highPriorityAttendances,
      // appointmentsByType e appointmentsBySpecialty foram simplificados
    ] = await Promise.all([
      // Total de profissionais
      prisma.medicalSpecialty.count({
        where: { tenantId },
      }),
      // Profissionais ativos
      prisma.medicalSpecialty.count({
        where: { tenantId, isActive: true },
      }),
      // Total de consultas
      prisma.healthAppointment.count({
        where: { tenantId },
      }),
      // Consultas do mês
      prisma.healthAppointment.count({
        where: {
          tenantId,
          appointmentDate: { gte: startOfMonth },
        },
      }),
      // Consultas da semana
      prisma.healthAppointment.count({
        where: {
          tenantId,
          appointmentDate: { gte: startOfWeek },
        },
      }),
      // Consultas urgentes pendentes
      prisma.healthAppointment.count({
        where: {
          tenantId,
          priority: 'urgente',
          status: { notIn: ['concluida', 'cancelada'] },
        },
      }),
      // Total de vacinações
      prisma.vaccination.count({
        where: { tenantId },
      }),
      // Vacinações do mês
      prisma.vaccination.count({
        where: {
          tenantId,
          createdAt: { gte: startOfMonth },
        },
      }),
      // Campanhas ativas
      prisma.vaccinationCampaign.count({
        where: {
          tenantId,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      }),
      // Medicamentos dispensados este mês
      prisma.medication.count({
        where: {
          tenantId,
          createdAt: { gte: startOfMonth },
        },
      }),
      // Transportes agendados (modelo não implementado)
      Promise.resolve(0),
      // Atendimentos de alta prioridade não resolvidos
      prisma.healthAttendance.count({
        where: {
          tenantId,
          priority: { in: ['HIGH', 'CRITICAL'] },
        },
      }),
      // Distribuição por especialidade (simplificada)
      Promise.resolve([]),
    ]);

    const stats = {
      overview: {
        totalProfessionals,
        activeProfessionals,
        totalAppointments,
        monthlyAppointments,
        weeklyAppointments,
        totalVaccinations,
        monthlyVaccinations,
      },
      urgent: {
        urgentAppointments,
        highPriorityAttendances,
      },
      services: {
        activeCampaigns,
        medicationsDispensed,
        transportScheduled,
      },
      distribution: {
        appointmentsByType: {} as Record<string, number>,
        appointmentsBySpecialty: {} as Record<string, number>,
      },
    };

    res.json(createSuccessResponse(stats));
  })
);

export default router;
