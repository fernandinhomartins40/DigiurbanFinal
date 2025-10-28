import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma, UserRole } from '@prisma/client';
import { tenantMiddleware } from '../middleware/tenant';
import { adminAuthMiddleware, requireMinRole } from '../middleware/admin-auth';
import {
  AuthenticatedRequest,
  SuccessResponse,
  ErrorResponse,
} from '../types';

// ====================== TIPOS LOCAIS ISOLADOS ======================

interface WhereCondition {
  [key: string]: unknown;
}

// FASE 2 - Interface para serviços
// WhereClause interface removida - usando WhereCondition do sistema centralizado

const router = Router();

// Aplicar middleware de tenant em todas as rotas
router.use(tenantMiddleware);

/**
 * GET /api/services
 * Listar serviços (catálogo público - sem autenticação)
 * Query params opcionais:
 * - includeFeatures: "true" para incluir configurações de features
 */
router.get(
  '/',
  async (req, res: Response<SuccessResponse | ErrorResponse>) => {
    try {
      const { departmentId, search, includeFeatures } = req.query;

      let whereClause: WhereCondition = {
        tenantId: req.tenantId,
        isActive: true,
      };

      if (departmentId) {
        whereClause.departmentId = departmentId;
      }

      if (search) {
        whereClause.OR = [
          { name: { contains: search as string } },
          { description: { contains: search as string } },
        ];
      }

      // Include condicional baseado em flags
      const services = await prisma.service.findMany({
        where: whereClause,
        include: {
          department: {
            select: {
              id: true,
              name: true,
            },
          },
          // ========== INCLUDES CONDICIONAIS (só se includeFeatures=true) ==========
          ...(includeFeatures === 'true' && {
            customForm: true,
            locationConfig: true,
            scheduling: true,
            survey: true,
            workflow: true,
            customFields: true,
            documents: true,
            notifications: true,
          }),
        },
        orderBy: [{ priority: 'desc' }, { name: 'asc' }],
      });

      res.json({ data: services, success: true });
    } catch (error) {
      console.error('List services error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Erro interno do servidor',
      });
    }
  }
);

/**
 * GET /api/services/:id
 * Obter serviço específico (público - sem autenticação)
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findFirst({
      where: {
        id,
        tenantId: req.tenantId,
        isActive: true,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!service) {
      res.status(404).json({
        error: 'Not found',
        message: 'Serviço não encontrado',
      });
    }

    res.json({ service });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

/**
 * POST /api/services
 * Criar novo serviço (apenas MANAGER ou superior)
 * Suporta Feature Flags opcionais para recursos avançados
 */
router.post('/', adminAuthMiddleware, requireMinRole(UserRole.MANAGER), async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const {
      // Campos básicos (obrigatórios)
      name,
      description,
      departmentId,
      category,
      serviceType,
      requiresDocuments,
      requiredDocuments,
      estimatedDays,
      priority,
      icon,
      color,

      // Feature Flags (opcionais - padrão: false)
      hasCustomForm,
      hasLocation,
      hasScheduling,
      hasSurvey,
      hasCustomWorkflow,
      hasCustomFields,
      hasAdvancedDocs,
      hasNotifications,

      // Configurações de Features (opcionais - só se flags = true)
      customForm,
      locationConfig,
      scheduling,
      survey,
      workflow,
      customFields,
      documents,
      notifications,
    } = authReq.body;

    // ========== VALIDAÇÃO BÁSICA ==========
    if (!name || !departmentId) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Nome e departamento são obrigatórios',
      });
    }

    // Verificar se departamento existe
    const department = await prisma.department.findFirst({
      where: {
        id: departmentId,
        tenantId: authReq.tenantId,
        isActive: true,
      },
    });

    if (!department) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Departamento não encontrado',
      });
    }

    // Verificar permissões
    if (authReq.userRole === UserRole.MANAGER && authReq.user?.departmentId !== departmentId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Você só pode criar serviços do seu departamento',
      });
    }

    // ========== CRIAR SERVIÇO E FEATURES EM TRANSAÇÃO ==========
    const result = await prisma.$transaction(async (tx) => {
      // Criar serviço básico
      const service = await tx.service.create({
        data: {
          // Básico
          name,
          description: description || null,
          category: category || null,
          departmentId,
          tenantId: authReq.tenantId,
          serviceType: serviceType || 'REQUEST',
          requiresDocuments: requiresDocuments || false,
          requiredDocuments: requiredDocuments || null,
          estimatedDays: estimatedDays || null,
          priority: priority || 1,
          icon: icon || null,
          color: color || null,

          // Feature Flags (padrão: false se não fornecido)
          hasCustomForm: hasCustomForm || false,
          hasLocation: hasLocation || false,
          hasScheduling: hasScheduling || false,
          hasSurvey: hasSurvey || false,
          hasCustomWorkflow: hasCustomWorkflow || false,
          hasCustomFields: hasCustomFields || false,
          hasAdvancedDocs: hasAdvancedDocs || false,
          hasNotifications: hasNotifications || false,
        } as unknown as Prisma.ServiceUncheckedCreateInput,
        include: {
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const featuresCreated: Record<string, boolean> = {};

      // 1. Formulário Customizado
      if (hasCustomForm && customForm) {
        await tx.serviceForm.create({
        data: {
          serviceId: service.id,
          title: customForm.title,
          description: customForm.description || null,
          isRequired: customForm.isRequired || false,
          fields: customForm.fields,
          validation: customForm.validation || null,
          conditional: customForm.conditional || null,
          isMultiStep: customForm.isMultiStep || false,
          steps: customForm.steps || null,
        },
        });
        featuresCreated.customForm = true;
      }

      // 2. Geolocalização
      if (hasLocation && locationConfig) {
        await tx.serviceLocation.create({
        data: {
          serviceId: service.id,
          requiresLocation: locationConfig.requiresLocation || false,
          locationType: locationConfig.locationType || 'optional',
          hasGeofencing: locationConfig.hasGeofencing || false,
          allowedRadius: locationConfig.allowedRadius || null,
          centerLat: locationConfig.centerLat || null,
          centerLng: locationConfig.centerLng || null,
          requireAddress: locationConfig.requireAddress || false,
          requireReference: locationConfig.requireReference || false,
        },
        });
        featuresCreated.location = true;
      }

      // 3. Agendamento
      if (hasScheduling && scheduling) {
        await tx.serviceScheduling.create({
        data: {
          serviceId: service.id,
          allowScheduling: scheduling.allowScheduling !== false,
          type: scheduling.type || 'appointment',
          workingHours: scheduling.workingHours,
          blockouts: scheduling.blockouts || null,
          slotDuration: scheduling.slotDuration || 30,
          bufferTime: scheduling.bufferTime || 0,
          maxPerDay: scheduling.maxPerDay || null,
          maxPerSlot: scheduling.maxPerSlot || 1,
          advanceBooking: scheduling.advanceBooking || 30,
          minAdvanceDays: scheduling.minAdvance || 1,
          maxAdvanceDays: scheduling.maxAdvanceDays || 30,
          availableDays: scheduling.availableDays || JSON.stringify(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
          timeSlots: scheduling.timeSlots || JSON.stringify([]),
          sendReminder: scheduling.sendReminders !== false,
          reminderHours: scheduling.reminderHours || 24,
        },
        });
        featuresCreated.scheduling = true;
      }

      // 4. Pesquisa
      if (hasSurvey && survey) {
        await tx.serviceSurvey.create({
        data: {
          serviceId: service.id,
          title: survey.title,
          description: survey.description || null,
          type: survey.type || 'satisfaction',
          timing: survey.timing || 'after',
          isRequired: survey.isRequired || false,
          showAfter: survey.showAfter || 'completion',
          daysAfter: survey.daysAfter || null,
          questions: survey.questions,
        },
        });
        featuresCreated.survey = true;
      }

      // 5. Workflow
      if (hasCustomWorkflow && workflow) {
        await tx.serviceWorkflow.create({
        data: {
          serviceId: service.id,
          name: workflow.name,
          description: workflow.description || null,
          version: workflow.version ? parseInt(workflow.version) : 1,
          steps: workflow.stages || workflow.steps, // 'steps' é o campo correto no schema
          rules: workflow.transitions || workflow.rules,
          isActive: workflow.isActive !== false,
        },
        });
        featuresCreated.workflow = true;
      }

      // 6. Campos Customizados
      if (hasCustomFields && customFields && Array.isArray(customFields)) {
        await tx.serviceCustomField.createMany({
        data: customFields.map((field: any) => ({
          serviceId: service.id,
          key: field.key,
          label: field.label,
          type: field.type,
          helpText: field.helpText || null,
          required: field.required || false,
          validation: field.validation || null,
          options: field.options || null,
          defaultValue: field.defaultValue || null,
          order: field.order || 0,
          isVisible: field.isVisible !== false,
          section: field.section || null,
        })),
        });
        featuresCreated.customFields = true;
      }

      // 7. Documentos Avançados
      if (hasAdvancedDocs && documents && Array.isArray(documents)) {
        await tx.serviceDocument.createMany({
        data: documents.map((doc: any) => ({
          serviceId: service.id,
          name: doc.name,
          description: doc.description || null,
          category: doc.category || null,
          required: doc.required !== false,
          multiple: doc.multiple || false,
          minFiles: doc.minFiles || 1,
          maxFiles: doc.maxFiles || 1,
          acceptedTypes: doc.acceptedTypes,
          maxSize: doc.maxSize || 5242880,
          minSize: doc.minSize || null,
          validateWithAI: doc.validateWithAI || false,
          extractData: doc.extractData || null,
          aiProvider: doc.aiProvider || null,
          templateUrl: doc.templateUrl || null,
          exampleUrl: doc.exampleUrl || null,
          order: doc.order || 0,
        })),
        });
        featuresCreated.documents = true;
      }

      // 8. Notificações
      if (hasNotifications && notifications) {
        await tx.serviceNotification.create({
          data: {
            serviceId: service.id,
            enabled: true,
            templates: Array.isArray(notifications) ? notifications : [],
            triggers: Array.isArray(notifications)
              ? notifications.map((n: any) => ({ trigger: n.trigger, conditions: n.conditions }))
              : [],
          }
        });
        featuresCreated.notifications = true;
      }

      // Retornar serviço e features criados
      return { service, featuresCreated };
    });

    return res.status(201).json({
      message: 'Serviço criado com sucesso',
      service: result.service,
      featuresEnabled: {
        customForm: hasCustomForm || false,
        location: hasLocation || false,
        scheduling: hasScheduling || false,
        survey: hasSurvey || false,
        workflow: hasCustomWorkflow || false,
        customFields: hasCustomFields || false,
        advancedDocs: hasAdvancedDocs || false,
        notifications: hasNotifications || false,
      },
      featuresCreated: result.featuresCreated,
    });
  } catch (error) {
    console.error('Create service error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

/**
 * PUT /api/services/:id
 * Atualizar serviço (apenas MANAGER ou superior)
 */
router.put('/:id', adminAuthMiddleware, requireMinRole(UserRole.MANAGER), async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = authReq.params;
    const {
      // Campos básicos
      name,
      description,
      category,
      requiresDocuments,
      requiredDocuments,
      estimatedDays,
      priority,
      isActive,
      icon,
      color,

      // Feature Flags
      hasCustomForm,
      hasLocation,
      hasScheduling,
      hasSurvey,
      hasCustomWorkflow,
      hasCustomFields,
      hasAdvancedDocs,
      hasNotifications,
    } = authReq.body;

    // Verificar se serviço existe
    const service = await prisma.service.findFirst({
      where: {
        id,
        tenantId: authReq.tenantId,
      },
    });

    if (!service) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Serviço não encontrado',
      });
    }

    // Verificar permissões
    if (authReq.userRole === UserRole.MANAGER && authReq.user?.departmentId !== service.departmentId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Você só pode editar serviços do seu departamento',
      });
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name: name !== undefined ? name : service.name,
        description: description !== undefined ? description : service.description,
        category: category !== undefined ? category : service.category,
        requiresDocuments: requiresDocuments !== undefined ? requiresDocuments : service.requiresDocuments,
        requiredDocuments: requiredDocuments !== undefined ? requiredDocuments : service.requiredDocuments,
        estimatedDays: estimatedDays !== undefined ? estimatedDays : service.estimatedDays,
        priority: priority !== undefined ? priority : service.priority,
        isActive: isActive !== undefined ? isActive : service.isActive,
        icon: icon !== undefined ? icon : service.icon,
        color: color !== undefined ? color : service.color,

        // Feature Flags
        hasCustomForm: hasCustomForm !== undefined ? hasCustomForm : service.hasCustomForm,
        hasLocation: hasLocation !== undefined ? hasLocation : service.hasLocation,
        hasScheduling: hasScheduling !== undefined ? hasScheduling : service.hasScheduling,
        hasSurvey: hasSurvey !== undefined ? hasSurvey : service.hasSurvey,
        hasCustomWorkflow: hasCustomWorkflow !== undefined ? hasCustomWorkflow : service.hasCustomWorkflow,
        hasCustomFields: hasCustomFields !== undefined ? hasCustomFields : service.hasCustomFields,
        hasAdvancedDocs: hasAdvancedDocs !== undefined ? hasAdvancedDocs : service.hasAdvancedDocs,
        hasNotifications: hasNotifications !== undefined ? hasNotifications : service.hasNotifications,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.json({
      message: 'Serviço atualizado com sucesso',
      service: updatedService,
    });
  } catch (error) {
    console.error('Update service error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

/**
 * DELETE /api/services/:id
 * Desativar serviço (soft delete)
 */
router.delete('/:id', adminAuthMiddleware, requireMinRole(UserRole.MANAGER), async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = authReq.params;

    // Verificar se serviço existe
    const service = await prisma.service.findFirst({
      where: {
        id,
        tenantId: authReq.tenantId,
      },
    });

    if (!service) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Serviço não encontrado',
      });
    }

    // Verificar permissões
    if (authReq.userRole === UserRole.MANAGER && authReq.user?.departmentId !== service.departmentId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Você só pode desativar serviços do seu departamento',
      });
    }

    // Verificar se há protocolos ativos
    const activeProtocols = await prisma.protocol.count({
      where: {
        serviceId: id,
        status: {
          in: ['VINCULADO', 'PROGRESSO', 'ATUALIZACAO'],
        },
      },
    });

    if (activeProtocols > 0) {
      return res.status(400).json({
        error: 'Bad request',
        message: `Não é possível desativar o serviço. Existem ${activeProtocols} protocolos ativos.`,
      });
    }

    await prisma.service.update({
      where: { id },
      data: { isActive: false },
    });

    return res.json({
      message: 'Serviço desativado com sucesso',
    });
  } catch (error) {
    console.error('Delete service error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

/**
 * GET /api/services/department/:departmentId
 * Listar serviços de um departamento específico (público - sem autenticação)
 */
router.get('/department/:departmentId', async (req, res) => {
  try {
    const { departmentId } = req.params;

    const services = await prisma.service.findMany({
      where: {
        departmentId,
        tenantId: req.tenantId,
        isActive: true,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ priority: 'desc' }, { name: 'asc' }],
    });

    res.json({ data: services, success: true });
  } catch (error) {
    console.error('Get department services error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

export default router;
