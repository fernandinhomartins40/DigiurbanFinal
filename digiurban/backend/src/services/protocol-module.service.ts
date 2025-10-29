/**
 * ============================================================================
 * PROTOCOL-MODULE SERVICE - Integração Protocolos ↔ Módulos
 * ============================================================================
 *
 * Conecta protocolos simplificados aos módulos padrões das secretarias.
 * Implementa o fluxo: Protocolo COM_DADOS → Módulo da Secretaria → Aprovação
 */

import { PrismaClient, ProtocolStatus, Prisma } from '@prisma/client';
import { getModuleEntity, isInformativeModule } from '../config/module-mapping';

const prisma = new PrismaClient();

// ============================================================================
// TYPES
// ============================================================================

export interface CreateProtocolWithModuleInput {
  tenantId: string;
  citizenId: string;
  serviceId: string;
  formData: Record<string, any>;
  createdById?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  attachments?: string[];
}

export interface ApproveProtocolInput {
  protocolId: string;
  userId: string;
  comment?: string;
  additionalData?: Record<string, any>;
}

export interface RejectProtocolInput {
  protocolId: string;
  userId: string;
  reason: string;
}

// ============================================================================
// SERVICE CLASS
// ============================================================================

export class ProtocolModuleService {
  /**
   * Criar protocolo e vincular ao módulo apropriado
   * Fluxo: ServiceSimplified → ProtocolSimplified → Módulo Padrão
   */
  async createProtocolWithModule(input: CreateProtocolWithModuleInput) {
    const { tenantId, citizenId, serviceId, formData, createdById, ...rest } = input;

    // 1. Buscar serviço
    const service = await prisma.serviceSimplified.findUnique({
      where: { id: serviceId },
      include: { department: true },
    });

    if (!service) {
      throw new Error('Serviço não encontrado');
    }

    if (!service.isActive) {
      throw new Error('Serviço inativo');
    }

    // 2. Verificar se serviço tem módulo
    const hasModule = service.moduleType && !isInformativeModule(service.moduleType);

    // 3. Gerar número do protocolo
    const year = new Date().getFullYear();
    const count = await prisma.protocolSimplified.count({
      where: { tenantId },
    });
    const protocolNumber = `${year}-${String(count + 1).padStart(6, '0')}`;

    // 4. Criar protocolo em transação
    const result = await prisma.$transaction(async (tx) => {
      // Criar protocolo
      const protocol = await tx.protocolSimplified.create({
        data: {
          number: protocolNumber,
          title: service.name,
          description: service.description || '',
          tenantId,
          citizenId,
          serviceId,
          departmentId: service.departmentId,
          status: ProtocolStatus.VINCULADO,
          moduleType: service.moduleType || null,
          customData: formData as Prisma.JsonObject,
          createdById,
          ...rest,
        },
      });

      // Se tem módulo, criar entrada pendente
      let moduleEntity = null;
      if (hasModule && service.moduleType) {
        const entityName = getModuleEntity(service.moduleType);

        if (entityName) {
          moduleEntity = await this.createModuleEntity(
            tx,
            entityName,
            {
              tenantId,
              protocolId: protocol.id,
              protocolNumber: protocol.number,
              formData,
              status: 'PENDING_APPROVAL',
            }
          );
        }
      }

      // Criar histórico
      await tx.protocolHistory.create({
        data: {
          protocolId: protocol.id,
          status: ProtocolStatus.VINCULADO,
          comment: 'Protocolo criado',
          userId: createdById,
        },
      });

      return {
        protocol,
        moduleEntity,
        hasModule,
      };
    });

    return result;
  }

  /**
   * Criar entidade no módulo apropriado
   */
  private async createModuleEntity(
    tx: Prisma.TransactionClient,
    entityName: string,
    data: {
      tenantId: string;
      protocolId: string;
      protocolNumber: string;
      formData: Record<string, any>;
      status: string;
    }
  ) {
    const { tenantId, protocolId, protocolNumber, formData, status } = data;

    // Mapear entityName para model Prisma
    const entityMap: Record<string, any> = {
      // AGRICULTURA
      RuralProducer: () => tx.ruralProducer.create({
        data: {
          tenantId,
          protocolId,
          name: formData.name || formData.producerName,
          document: formData.document || formData.producerCpf,
          email: formData.email,
          phone: formData.phone || formData.producerPhone,
          address: formData.address,
          productionType: formData.productionType,
          mainCrop: formData.mainCrop,
          status: 'PENDING_APPROVAL',
        },
      }),

      RuralProperty: () => tx.ruralProperty.create({
        data: {
          tenantId,
          protocolId,
          name: formData.propertyName || formData.name,
          producerId: formData.producerId,
          size: formData.size ? parseFloat(formData.size) : 0,
          location: formData.location || formData.propertyLocation,
          plantedArea: formData.plantedArea ? parseFloat(formData.plantedArea) : null,
          mainCrops: formData.mainCrops as Prisma.JsonValue,
          status: 'PENDING_APPROVAL',
        },
      }),

      RuralProgram: () => tx.ruralProgram.create({
        data: {
          tenantId,
          protocolId,
          name: formData.name || formData.programName,
          programType: formData.programType || 'other',
          description: formData.description,
          startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
          endDate: formData.endDate ? new Date(formData.endDate) : null,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          status: 'PENDING_APPROVAL',
        },
      }),

      RuralTraining: () => tx.ruralTraining.create({
        data: {
          tenantId,
          protocolId,
          title: formData.title || formData.name,
          trainingType: formData.trainingType || 'course',
          description: formData.description,
          instructor: formData.instructor,
          startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
          duration: formData.duration ? parseInt(formData.duration) : 0,
          maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : 0,
          location: formData.location,
        },
      }),

      TechnicalAssistance: () => tx.technicalAssistance.create({
        data: {
          tenantId,
          protocol: protocolNumber,
          serviceId: formData.serviceId,
          source: 'service',
          producerName: formData.producerName,
          producerCpf: formData.producerCpf,
          producerPhone: formData.producerPhone,
          propertyName: formData.propertyName || formData.producerName,
          propertyLocation: formData.propertyLocation || formData.location,
          propertyArea: formData.propertyArea ? parseFloat(formData.propertyArea) : null,
          propertySize: formData.propertyArea ? parseFloat(formData.propertyArea) : 0,
          location: formData.propertyLocation || formData.location,
          assistanceType: formData.assistanceType,
          subject: formData.assistanceType,
          description: formData.description,
          cropTypes: formData.cropTypes as Prisma.JsonValue,
          status: 'pending',
          priority: 'normal',
          technician: 'Não designado',
          visitDate: new Date(),
          recommendations: '',
          requestDate: new Date(),
        },
      }),

      // SAÚDE
      HealthAttendance: () => tx.healthAttendance.create({
        data: {
          tenantId,
          protocolId,
          protocol: protocolNumber,
          citizenName: formData.citizenName || formData.patientName,
          citizenCPF: formData.citizenCPF || formData.patientCpf,
          contact: formData.contact || formData.phone,
          type: formData.type || 'GENERAL',
          status: 'PENDING',
          description: formData.description || '',
          observations: formData.observations,
          medicalUnit: formData.medicalUnit,
          symptoms: formData.symptoms,
          urgency: formData.urgency || 'NORMAL',
          priority: formData.priority || 'MEDIUM',
        },
      }),

      HealthAppointment: () => tx.healthAppointment.create({
        data: {
          tenantId,
          protocolId,
          patientName: formData.patientName,
          patientCpf: formData.patientCpf,
          patientBirthDate: formData.patientBirthDate ? new Date(formData.patientBirthDate) : null,
          patientPhone: formData.patientPhone,
          appointmentDate: formData.appointmentDate ? new Date(formData.appointmentDate) : new Date(),
          appointmentTime: formData.appointmentTime || '08:00',
          speciality: formData.speciality || 'GENERAL',
          priority: formData.priority || 'NORMAL',
          status: 'SCHEDULED',
          symptoms: formData.symptoms,
          observations: formData.observations,
        },
      }),

      MedicationDispense: () => tx.medicationDispense.create({
        data: {
          tenantId,
          protocolId,
          patientName: formData.patientName,
          patientCpf: formData.patientCpf,
          medicationName: formData.medicationName,
          dosage: formData.dosage || '1x ao dia',
          quantity: formData.quantity ? parseInt(formData.quantity) : 1,
          pharmacistName: formData.pharmacistName || 'Farmacêutico',
          dispensedBy: formData.dispensedBy || 'Sistema',
          prescriptionId: formData.prescriptionId,
          unitId: formData.unitId,
          status: 'DISPENSED',
          observations: formData.observations,
        },
      }),

      HealthCampaign: () => tx.healthCampaign.create({
        data: {
          tenantId,
          protocolId,
          name: formData.name || formData.campaignName,
          description: formData.description,
          campaignType: formData.campaignType || 'VACCINATION',
          startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
          endDate: formData.endDate ? new Date(formData.endDate) : new Date(),
          targetAudience: formData.targetAudience,
          goals: formData.goals as Prisma.JsonValue || {},
          coordinatorName: formData.coordinatorName,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          status: 'ACTIVE',
        },
      }),

      HealthProgram: () => tx.healthProgram.create({
        data: {
          tenantId,
          protocolId,
          name: formData.name || formData.programName,
          description: formData.description,
          programType: formData.programType || 'CHRONIC_DISEASE',
          targetAudience: formData.targetAudience,
          coordinatorName: formData.coordinatorName,
          startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
          endDate: formData.endDate ? new Date(formData.endDate) : null,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          goals: formData.goals as Prisma.JsonValue,
          observations: formData.observations,
        },
      }),

      HealthTransport: () => tx.healthTransport.create({
        data: {
          tenantId,
          protocolId,
          patientName: formData.patientName,
          origin: formData.origin,
          destination: formData.destination,
          transportType: formData.transportType || 'TFD',
          urgencyLevel: formData.urgencyLevel || 'NORMAL',
          scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : new Date(),
          status: 'SCHEDULED',
          observations: formData.observations,
        },
      }),

      HealthExam: () => tx.healthExam.create({
        data: {
          tenantId,
          protocolId,
          patientName: formData.patientName,
          patientCpf: formData.patientCpf,
          patientPhone: formData.patientPhone,
          examType: formData.examType,
          examName: formData.examName,
          scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : null,
          priority: formData.priority || 'NORMAL',
          requestedBy: formData.requestedBy || 'Médico',
          healthUnit: formData.healthUnit,
          status: 'REQUESTED',
          observations: formData.observations,
        },
      }),

      HealthTransportRequest: () => tx.healthTransportRequest.create({
        data: {
          tenantId,
          protocolId,
          patientName: formData.patientName,
          patientCpf: formData.patientCpf,
          patientPhone: formData.patientPhone,
          origin: formData.origin,
          destination: formData.destination,
          transportType: formData.transportType || 'AMBULANCE',
          urgencyLevel: formData.urgencyLevel || 'NORMAL',
          scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : null,
          reason: formData.reason,
          status: 'REQUESTED',
          observations: formData.observations,
        },
      }),

      Vaccination: () => tx.vaccination.create({
        data: {
          tenantId,
          protocolId,
          patientId: formData.patientId,
          vaccine: formData.vaccine,
          dose: formData.dose || '1ª dose',
          appliedAt: formData.appliedAt ? new Date(formData.appliedAt) : new Date(),
          appliedBy: formData.appliedBy,
          lotNumber: formData.lotNumber,
          nextDose: formData.nextDose ? new Date(formData.nextDose) : null,
          campaignId: formData.campaignId,
        },
      }),

      Patient: () => tx.patient.create({
        data: {
          tenantId,
          protocolId,
          fullName: formData.fullName || formData.patientName,
          cpf: formData.cpf || formData.patientCpf,
          rg: formData.rg,
          birthDate: formData.birthDate ? new Date(formData.birthDate) : new Date(),
          gender: formData.gender,
          bloodType: formData.bloodType,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          susCardNumber: formData.susCardNumber,
          allergies: formData.allergies,
          chronicDiseases: formData.chronicDiseases,
          medications: formData.medications,
          emergencyContact: formData.emergencyContact,
          emergencyPhone: formData.emergencyPhone,
          registeredBy: formData.registeredBy || 'Sistema',
          observations: formData.observations,
        },
      }),

      CommunityHealthAgent: () => tx.communityHealthAgent.create({
        data: {
          tenantId,
          protocolId,
          fullName: formData.fullName,
          cpf: formData.cpf,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          assignedArea: formData.assignedArea,
          registrationNum: formData.registrationNum,
          hireDate: formData.hireDate ? new Date(formData.hireDate) : new Date(),
          healthUnit: formData.healthUnit,
          supervisor: formData.supervisor,
          familiesServed: formData.familiesServed ? parseInt(formData.familiesServed) : 0,
          workSchedule: formData.workSchedule as Prisma.JsonValue,
          observations: formData.observations,
        },
      }),
    };

    const createFn = entityMap[entityName];
    if (!createFn) {
      console.warn(`Entity ${entityName} not mapped for module creation`);
      return null;
    }

    return createFn();
  }

  /**
   * Aprovar protocolo e criar registro definitivo no módulo
   */
  async approveProtocol(input: ApproveProtocolInput) {
    const { protocolId, userId, comment, additionalData } = input;

    // Buscar protocolo
    const protocol = await prisma.protocolSimplified.findUnique({
      where: { id: protocolId },
      include: { service: true },
    });

    if (!protocol) {
      throw new Error('Protocolo não encontrado');
    }

    if (protocol.status === ProtocolStatus.CONCLUIDO) {
      throw new Error('Protocolo já foi concluído');
    }

    const result = await prisma.$transaction(async (tx) => {
      // Atualizar status do protocolo
      const updatedProtocol = await tx.protocolSimplified.update({
        where: { id: protocolId },
        data: {
          status: ProtocolStatus.CONCLUIDO,
        },
      });

      // Se tem módulo, atualizar status da entidade
      if (protocol.moduleType) {
        const entityName = getModuleEntity(protocol.moduleType);

        if (entityName) {
          await this.updateModuleEntityStatus(
            tx,
            entityName,
            protocolId,
            'ACTIVE',
            additionalData
          );
        }
      }

      // Criar histórico
      await tx.protocolHistory.create({
        data: {
          protocolId,
          status: ProtocolStatus.CONCLUIDO,
          comment: comment || 'Protocolo aprovado',
          userId,
        },
      });

      return updatedProtocol;
    });

    return result;
  }

  /**
   * Rejeitar protocolo
   */
  async rejectProtocol(input: RejectProtocolInput) {
    const { protocolId, userId, reason } = input;

    // Buscar protocolo
    const protocol = await prisma.protocolSimplified.findUnique({
      where: { id: protocolId },
    });

    if (!protocol) {
      throw new Error('Protocolo não encontrado');
    }

    const result = await prisma.$transaction(async (tx) => {
      // Atualizar status do protocolo
      const updatedProtocol = await tx.protocolSimplified.update({
        where: { id: protocolId },
        data: {
          status: ProtocolStatus.CANCELADO,
        },
      });

      // Se tem módulo, remover ou marcar como rejeitado
      if (protocol.moduleType) {
        const entityName = getModuleEntity(protocol.moduleType);

        if (entityName) {
          await this.updateModuleEntityStatus(
            tx,
            entityName,
            protocolId,
            'REJECTED'
          );
        }
      }

      // Criar histórico
      await tx.protocolHistory.create({
        data: {
          protocolId,
          status: ProtocolStatus.CANCELADO,
          comment: `Rejeitado: ${reason}`,
          userId,
        },
      });

      return updatedProtocol;
    });

    return result;
  }

  /**
   * Atualizar status da entidade no módulo
   */
  private async updateModuleEntityStatus(
    tx: Prisma.TransactionClient,
    entityName: string,
    protocolId: string,
    status: string,
    additionalData?: Record<string, any>
  ) {
    const updateMap: Record<string, any> = {
      RuralProducer: () => tx.ruralProducer.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      RuralProperty: () => tx.ruralProperty.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      RuralProgram: () => tx.ruralProgram.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      // SAÚDE
      HealthAttendance: () => tx.healthAttendance.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      HealthAppointment: () => tx.healthAppointment.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      MedicationDispense: () => tx.medicationDispense.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      HealthCampaign: () => tx.healthCampaign.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      HealthProgram: () => tx.healthProgram.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      HealthTransport: () => tx.healthTransport.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      HealthExam: () => tx.healthExam.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      HealthTransportRequest: () => tx.healthTransportRequest.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      Vaccination: () => tx.vaccination.updateMany({
        where: { protocolId },
        data: { ...additionalData },
      }),

      Patient: () => tx.patient.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      CommunityHealthAgent: () => tx.communityHealthAgent.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),
    };

    const updateFn = updateMap[entityName];
    if (updateFn) {
      return updateFn();
    }

    return null;
  }

  /**
   * Listar protocolos pendentes de um módulo
   */
  async getPendingProtocolsByModule(
    tenantId: string,
    moduleType: string,
    page = 1,
    limit = 20
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.protocolSimplified.findMany({
        where: {
          tenantId,
          moduleType,
          status: {
            in: [ProtocolStatus.VINCULADO, ProtocolStatus.PENDENCIA],
          },
        },
        include: {
          citizen: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.protocolSimplified.count({
        where: {
          tenantId,
          moduleType,
          status: {
            in: [ProtocolStatus.VINCULADO, ProtocolStatus.PENDENCIA],
          },
        },
      }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

// Exportar instância única
export const protocolModuleService = new ProtocolModuleService();
