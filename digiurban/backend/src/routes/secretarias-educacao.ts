// ============================================================================
// SECRETARIAS-EDUCACAO.TS - INTEGRAÇÃO PROTOCOLO ↔ MÓDULOS DE EDUCAÇÃO
// ============================================================================

import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { adminAuthMiddleware } from '../middleware/admin-auth';
import { MODULE_BY_DEPARTMENT } from '../config/module-mapping';

const router = Router();

// Aplicar autenticação admin
router.use(adminAuthMiddleware);

// ============================================================================
// STATS - DASHBOARD DA SECRETARIA
// ============================================================================

router.get('/stats', async (req, res) => {
  try {
    const tenantId = req.tenantId!;

    // Buscar departamento de educação
    const department = await prisma.department.findFirst({
      where: {
        tenantId,
        code: 'EDUCACAO',
      },
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Departamento de Educação não encontrado',
      });
    }

    // Stats por módulo usando ProtocolSimplified
    const protocolsByModule = await prisma.protocolSimplified.groupBy({
      by: ['moduleType', 'status'],
      where: {
        tenantId,
        departmentId: department.id,
        moduleType: {
          in: MODULE_BY_DEPARTMENT.EDUCACAO || [],
        },
      },
      _count: true,
    });

    // Contar registros nos módulos
    const [
      educationAttendanceCount,
      studentCount,
      schoolTransportCount,
      disciplinaryRecordCount,
      schoolDocumentCount,
      studentTransferCount,
      attendanceRecordCount,
      gradeRecordCount,
      schoolManagementCount,
      schoolMealCount,
    ] = await Promise.all([
      prisma.educationAttendance.count({ where: { tenantId } }),
      prisma.student.count({ where: { tenantId, isActive: true } }),
      prisma.schoolTransport.count({ where: { tenantId, isActive: true } }),
      prisma.disciplinaryRecord.count({ where: { tenantId } }),
      prisma.schoolDocument.count({ where: { tenantId } }),
      prisma.studentTransfer.count({ where: { tenantId } }),
      prisma.attendanceRecord.count({ where: { tenantId } }),
      prisma.gradeRecord.count({ where: { tenantId } }),
      prisma.schoolManagement.count({ where: { tenantId } }),
      prisma.schoolMeal.count({ where: { tenantId } }),
    ]);

    // Contar escolas
    const schoolCount = await prisma.school.count({
      where: { tenantId, isActive: true },
    });

    return res.json({
      success: true,
      data: {
        protocolsByModule,
        modules: {
          educationAttendances: educationAttendanceCount,
          students: studentCount,
          schoolTransports: schoolTransportCount,
          disciplinaryRecords: disciplinaryRecordCount,
          schoolDocuments: schoolDocumentCount,
          studentTransfers: studentTransferCount,
          attendanceRecords: attendanceRecordCount,
          gradeRecords: gradeRecordCount,
          schoolManagements: schoolManagementCount,
          schoolMeals: schoolMealCount,
        },
        schools: schoolCount,
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar stats de educação:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas',
      message: error.message,
    });
  }
});

// ============================================================================
// EDUCATION ATTENDANCE - Atendimentos Educacionais
// ============================================================================

router.get('/education-attendances', async (req, res) => {
  try {
    const tenantId = req.tenantId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.educationAttendance.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.educationAttendance.count({ where: { tenantId } }),
    ]);

    return res.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar atendimentos:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar atendimentos',
      message: error.message,
    });
  }
});

// ============================================================================
// STUDENTS - Matrículas de Alunos
// ============================================================================

router.get('/students', async (req, res) => {
  try {
    const tenantId = req.tenantId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.student.findMany({
        where: { tenantId },
        include: {
          school: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.student.count({ where: { tenantId } }),
    ]);

    return res.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar alunos:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar alunos',
      message: error.message,
    });
  }
});

// ============================================================================
// SCHOOL TRANSPORTS - Transporte Escolar
// ============================================================================

router.get('/school-transports', async (req, res) => {
  try {
    const tenantId = req.tenantId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.schoolTransport.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.schoolTransport.count({ where: { tenantId } }),
    ]);

    return res.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar transportes:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar transportes',
      message: error.message,
    });
  }
});

// ============================================================================
// DISCIPLINARY RECORDS - Ocorrências Disciplinares
// ============================================================================

router.get('/disciplinary-records', async (req, res) => {
  try {
    const tenantId = req.tenantId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.disciplinaryRecord.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.disciplinaryRecord.count({ where: { tenantId } }),
    ]);

    return res.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar ocorrências:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar ocorrências',
      message: error.message,
    });
  }
});

// ============================================================================
// SCHOOL DOCUMENTS - Documentos Escolares
// ============================================================================

router.get('/school-documents', async (req, res) => {
  try {
    const tenantId = req.tenantId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.schoolDocument.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.schoolDocument.count({ where: { tenantId } }),
    ]);

    return res.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar documentos:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar documentos',
      message: error.message,
    });
  }
});

// ============================================================================
// STUDENT TRANSFERS - Transferências de Alunos
// ============================================================================

router.get('/student-transfers', async (req, res) => {
  try {
    const tenantId = req.tenantId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.studentTransfer.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.studentTransfer.count({ where: { tenantId } }),
    ]);

    return res.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar transferências:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar transferências',
      message: error.message,
    });
  }
});

// ============================================================================
// ATTENDANCE RECORDS - Registros de Frequência
// ============================================================================

router.get('/attendance-records', async (req, res) => {
  try {
    const tenantId = req.tenantId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.attendanceRecord.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.attendanceRecord.count({ where: { tenantId } }),
    ]);

    return res.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar frequências:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar frequências',
      message: error.message,
    });
  }
});

// ============================================================================
// GRADE RECORDS - Registros de Notas
// ============================================================================

router.get('/grade-records', async (req, res) => {
  try {
    const tenantId = req.tenantId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.gradeRecord.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.gradeRecord.count({ where: { tenantId } }),
    ]);

    return res.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar notas:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar notas',
      message: error.message,
    });
  }
});

// ============================================================================
// SCHOOL MANAGEMENT - Gestão Escolar
// ============================================================================

router.get('/school-management', async (req, res) => {
  try {
    const tenantId = req.tenantId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.schoolManagement.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.schoolManagement.count({ where: { tenantId } }),
    ]);

    return res.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar gestão escolar:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar gestão escolar',
      message: error.message,
    });
  }
});

// ============================================================================
// SCHOOL MEALS - Merenda Escolar
// ============================================================================

router.get('/school-meals', async (req, res) => {
  try {
    const tenantId = req.tenantId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.schoolMeal.findMany({
        where: { tenantId },
        include: {
          school: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.schoolMeal.count({ where: { tenantId } }),
    ]);

    return res.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar merendas:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar merendas',
      message: error.message,
    });
  }
});

export default router;
