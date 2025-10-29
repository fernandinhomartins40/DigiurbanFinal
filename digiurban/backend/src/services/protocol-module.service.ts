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

      // EDUCAÇÃO
      EducationAttendance: () => tx.educationAttendance.create({
        data: {
          tenantId,
          protocolId,
          citizenName: formData.citizenName,
          citizenCpf: formData.citizenCpf,
          citizenPhone: formData.citizenPhone,
          citizenEmail: formData.citizenEmail,
          serviceType: formData.serviceType,
          description: formData.description,
          status: 'PENDING',
          priority: formData.priority || 'NORMAL',
          scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : null,
          observations: formData.observations,
        },
      }),

      Student: () => tx.student.create({
        data: {
          tenantId,
          protocolId,
          name: formData.name || formData.studentName,
          birthDate: formData.birthDate ? new Date(formData.birthDate) : new Date(),
          cpf: formData.cpf,
          rg: formData.rg,
          parentName: formData.parentName,
          parentPhone: formData.parentPhone,
          parentEmail: formData.parentEmail,
          address: formData.address,
          medicalInfo: formData.medicalInfo as Prisma.JsonValue,
          schoolId: formData.schoolId,
          isActive: false,
        },
      }),

      SchoolTransport: () => tx.schoolTransport.create({
        data: {
          tenantId,
          protocolId,
          route: formData.route,
          driver: formData.driver,
          vehicle: formData.vehicle,
          capacity: formData.capacity ? parseInt(formData.capacity) : 0,
          shift: formData.shift,
          stops: formData.stops as Prisma.JsonValue,
          isActive: false,
        },
      }),

      DisciplinaryRecord: () => tx.disciplinaryRecord.create({
        data: {
          tenantId,
          protocolId,
          studentId: formData.studentId,
          schoolId: formData.schoolId,
          incidentType: formData.incidentType,
          severity: formData.severity,
          description: formData.description,
          incidentDate: formData.incidentDate ? new Date(formData.incidentDate) : new Date(),
          time: formData.time,
          location: formData.location,
          witnesses: formData.witnesses,
          measures: formData.measures,
          responsibleTeacher: formData.responsibleTeacher,
          parentNotified: false,
          resolved: false,
          status: 'PENDING',
        },
      }),

      SchoolDocument: () => tx.schoolDocument.create({
        data: {
          tenantId,
          protocolId,
          studentId: formData.studentId,
          studentName: formData.studentName,
          documentType: formData.documentType,
          issueDate: new Date(),
          validUntil: formData.validUntil ? new Date(formData.validUntil) : null,
          status: 'PENDING',
          observations: formData.observations,
          fileUrl: formData.fileUrl,
        },
      }),

      StudentTransfer: () => tx.studentTransfer.create({
        data: {
          tenantId,
          protocolId,
          studentId: formData.studentId,
          studentName: formData.studentName,
          currentSchool: formData.currentSchool,
          targetSchool: formData.targetSchool,
          grade: formData.grade,
          transferReason: formData.transferReason,
          requestDate: new Date(),
          transferDate: formData.transferDate ? new Date(formData.transferDate) : null,
          status: 'PENDING',
          documents: formData.documents as Prisma.JsonValue,
          observations: formData.observations,
        },
      }),

      AttendanceRecord: () => tx.attendanceRecord.create({
        data: {
          tenantId,
          protocolId,
          studentId: formData.studentId,
          studentName: formData.studentName,
          schoolId: formData.schoolId,
          classId: formData.classId,
          month: formData.month ? parseInt(formData.month) : new Date().getMonth() + 1,
          year: formData.year ? parseInt(formData.year) : new Date().getFullYear(),
          totalDays: formData.totalDays ? parseInt(formData.totalDays) : 0,
          presentDays: formData.presentDays ? parseInt(formData.presentDays) : 0,
          absentDays: formData.absentDays ? parseInt(formData.absentDays) : 0,
          percentage: formData.percentage ? parseFloat(formData.percentage) : 0,
          status: 'ACTIVE',
          observations: formData.observations,
        },
      }),

      GradeRecord: () => tx.gradeRecord.create({
        data: {
          tenantId,
          protocolId,
          studentId: formData.studentId,
          studentName: formData.studentName,
          schoolId: formData.schoolId,
          classId: formData.classId,
          subject: formData.subject,
          period: formData.period,
          grade: formData.grade ? parseFloat(formData.grade) : 0,
          maxGrade: formData.maxGrade ? parseFloat(formData.maxGrade) : 10,
          status: formData.status || 'APPROVED',
          observations: formData.observations,
          teacherName: formData.teacherName,
        },
      }),

      SchoolManagement: () => tx.schoolManagement.create({
        data: {
          tenantId,
          protocolId,
          schoolId: formData.schoolId,
          schoolName: formData.schoolName,
          managementType: formData.managementType,
          requestDate: new Date(),
          description: formData.description,
          status: 'PENDING',
          priority: formData.priority || 'NORMAL',
          assignedTo: formData.assignedTo,
          completedDate: formData.completedDate ? new Date(formData.completedDate) : null,
          observations: formData.observations,
          documents: formData.documents as Prisma.JsonValue,
        },
      }),

      SchoolMeal: () => tx.schoolMeal.create({
        data: {
          tenantId,
          protocolId,
          schoolId: formData.schoolId,
          date: formData.date ? new Date(formData.date) : new Date(),
          shift: formData.shift,
          menu: formData.menu as Prisma.JsonValue,
          studentsServed: formData.studentsServed ? parseInt(formData.studentsServed) : 0,
          cost: formData.cost ? parseFloat(formData.cost) : null,
        },
      }),

      // ASSISTÊNCIA SOCIAL
      SocialAssistanceAttendance: () => tx.socialAssistanceAttendance.create({
        data: {
          tenantId,
          protocolId,
          protocol: protocolNumber,
          citizenId: formData.citizenId,
          citizenName: formData.citizenName,
          citizenCpf: formData.citizenCpf,
          contact: formData.contact as Prisma.JsonValue,
          familyIncome: formData.familyIncome ? parseFloat(formData.familyIncome) : null,
          familySize: formData.familySize ? parseInt(formData.familySize) : null,
          serviceType: formData.serviceType,
          attendanceType: formData.attendanceType,
          subject: formData.subject,
          description: formData.description,
          vulnerability: formData.vulnerability,
          urgency: formData.urgency || 'NORMAL',
          referredBy: formData.referredBy,
          socialWorker: formData.socialWorker,
          socialWorkerId: formData.socialWorkerId,
          assessment: formData.assessment as Prisma.JsonValue,
          interventionPlan: formData.interventionPlan as Prisma.JsonValue,
          referrals: formData.referrals as Prisma.JsonValue,
          followUpPlan: formData.followUpPlan as Prisma.JsonValue,
          followUpNeeded: formData.followUpNeeded || false,
          followUpDate: formData.followUpDate ? new Date(formData.followUpDate) : null,
          priority: formData.priority,
          status: 'PENDING',
          observations: formData.observations,
        },
      }),

      VulnerableFamily: () => tx.vulnerableFamily.create({
        data: {
          tenantId,
          protocolId,
          citizenId: formData.citizenId,
          familyCode: formData.familyCode,
          responsibleName: formData.responsibleName || formData.citizenName,
          memberCount: formData.memberCount ? parseInt(formData.memberCount) : 1,
          monthlyIncome: formData.monthlyIncome ? parseFloat(formData.monthlyIncome) : null,
          riskLevel: formData.riskLevel || 'LOW',
          vulnerabilityType: formData.vulnerabilityType,
          socialWorker: formData.socialWorker,
          status: 'ACTIVE',
          observations: formData.observations,
          lastVisitDate: formData.lastVisitDate ? new Date(formData.lastVisitDate) : null,
          nextVisitDate: formData.nextVisitDate ? new Date(formData.nextVisitDate) : null,
        },
      }),

      BenefitRequest: () => tx.benefitRequest.create({
        data: {
          tenantId,
          protocolId,
          familyId: formData.familyId,
          benefitType: formData.benefitType,
          requestDate: new Date(),
          status: 'PENDING',
          urgency: formData.urgency || 'NORMAL',
          reason: formData.reason,
          documentsProvided: formData.documentsProvided as Prisma.JsonValue,
          observations: formData.observations,
        },
      }),

      EmergencyDelivery: () => tx.emergencyDelivery.create({
        data: {
          tenantId,
          protocolId,
          benefitRequestId: formData.benefitRequestId,
          citizenId: formData.citizenId,
          deliveryType: formData.deliveryType,
          quantity: formData.quantity ? parseInt(formData.quantity) : 1,
          deliveryDate: formData.deliveryDate ? new Date(formData.deliveryDate) : new Date(),
          recipientName: formData.recipientName,
          recipientSignature: formData.recipientSignature,
          deliveredBy: formData.deliveredBy,
          urgency: formData.urgency,
          status: 'PENDING',
          observations: formData.observations,
        },
      }),

      SocialGroupEnrollment: () => tx.socialGroupEnrollment.create({
        data: {
          tenantId,
          protocolId,
          citizenId: formData.citizenId,
          participantName: formData.participantName || formData.citizenName,
          participantCpf: formData.participantCpf || formData.citizenCpf,
          groupName: formData.groupName,
          groupType: formData.groupType,
          enrollmentDate: new Date(),
          status: 'ACTIVE',
          frequency: formData.frequency,
          observations: formData.observations,
          instructor: formData.instructor,
          schedule: formData.schedule as Prisma.JsonValue,
        },
      }),

      HomeVisit: () => tx.homeVisit.create({
        data: {
          tenantId,
          protocolId,
          familyId: formData.familyId,
          socialWorkerId: formData.socialWorkerId,
          visitDate: formData.visitDate ? new Date(formData.visitDate) : new Date(),
          socialWorker: formData.socialWorker,
          visitType: formData.visitType || 'ROUTINE',
          visitPurpose: formData.visitPurpose || formData.purpose,
          purpose: formData.purpose,
          findings: formData.findings,
          recommendations: formData.recommendations,
          nextVisitDate: formData.nextVisitDate ? new Date(formData.nextVisitDate) : null,
          status: 'SCHEDULED',
        },
      }),

      SocialProgramEnrollment: () => tx.socialProgramEnrollment.create({
        data: {
          tenantId,
          protocolId,
          citizenId: formData.citizenId,
          beneficiaryName: formData.beneficiaryName || formData.citizenName,
          beneficiaryCpf: formData.beneficiaryCpf || formData.citizenCpf,
          programName: formData.programName,
          programType: formData.programType,
          enrollmentDate: new Date(),
          status: 'PENDING',
          monthlyIncome: formData.monthlyIncome ? parseFloat(formData.monthlyIncome) : null,
          familySize: formData.familySize ? parseInt(formData.familySize) : null,
          priority: formData.priority || 'NORMAL',
          approvedDate: formData.approvedDate ? new Date(formData.approvedDate) : null,
          startDate: formData.startDate ? new Date(formData.startDate) : null,
          endDate: formData.endDate ? new Date(formData.endDate) : null,
          benefits: formData.benefits as Prisma.JsonValue,
          observations: formData.observations,
        },
      }),

      SocialAppointment: () => tx.socialAppointment.create({
        data: {
          tenantId,
          protocolId,
          citizenId: formData.citizenId,
          citizenName: formData.citizenName,
          citizenCpf: formData.citizenCpf,
          appointmentType: formData.appointmentType,
          appointmentDate: formData.appointmentDate ? new Date(formData.appointmentDate) : new Date(),
          socialWorker: formData.socialWorker,
          socialWorkerId: formData.socialWorkerId,
          purpose: formData.purpose,
          status: 'SCHEDULED',
          notes: formData.notes,
          result: formData.result,
          followUpNeeded: formData.followUpNeeded || false,
          followUpDate: formData.followUpDate ? new Date(formData.followUpDate) : null,
        },
      }),

      SocialEquipment: () => tx.socialEquipment.create({
        data: {
          tenantId,
          protocolId,
          equipmentName: formData.equipmentName,
          equipmentType: formData.equipmentType,
          address: formData.address,
          coordinates: formData.coordinates as Prisma.JsonValue,
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
          currentOccupancy: formData.currentOccupancy ? parseInt(formData.currentOccupancy) : 0,
          coordinator: formData.coordinator,
          coordinatorId: formData.coordinatorId,
          phone: formData.phone,
          email: formData.email,
          services: formData.services as Prisma.JsonValue,
          schedule: formData.schedule as Prisma.JsonValue,
          status: 'ACTIVE',
          isActive: true,
          observations: formData.observations,
        },
      }),

      // CULTURA
      CulturalAttendance: () => tx.culturalAttendance.create({
        data: {
          tenantId,
          protocolId,
          protocol: protocolNumber,
          citizenId: formData.citizenId,
          citizenName: formData.citizenName,
          contact: formData.contact,
          phone: formData.phone,
          email: formData.email,
          type: formData.type,
          status: 'PENDING',
          description: formData.description,
          observations: formData.observations,
          responsible: formData.responsible,
          attachments: formData.attachments as Prisma.JsonValue,
          subject: formData.subject,
          category: formData.category,
          requestedLocation: formData.requestedLocation,
          eventDate: formData.eventDate ? new Date(formData.eventDate) : null,
          estimatedAudience: formData.estimatedAudience ? parseInt(formData.estimatedAudience) : null,
          requestedBudget: formData.requestedBudget ? parseFloat(formData.requestedBudget) : null,
          priority: formData.priority || 'MEDIUM',
          followUpDate: formData.followUpDate ? new Date(formData.followUpDate) : null,
          serviceId: formData.serviceId,
          source: 'service',
        },
      }),

      CulturalSpaceReservation: () => tx.culturalSpaceReservation.create({
        data: {
          tenantId,
          protocolId,
          spaceId: formData.spaceId,
          spaceName: formData.spaceName,
          requesterName: formData.requesterName,
          cpf: formData.cpf,
          phone: formData.phone,
          email: formData.email,
          eventName: formData.eventName,
          eventType: formData.eventType,
          description: formData.description,
          startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
          endDate: formData.endDate ? new Date(formData.endDate) : new Date(),
          startTime: formData.startTime,
          endTime: formData.endTime,
          expectedPeople: formData.expectedPeople ? parseInt(formData.expectedPeople) : 0,
          needsEquipment: formData.needsEquipment || false,
          equipment: formData.equipment as Prisma.JsonValue,
          status: 'PENDING',
          observations: formData.observations,
        },
      }),

      CulturalWorkshopEnrollment: () => tx.culturalWorkshopEnrollment.create({
        data: {
          tenantId,
          protocolId,
          workshopId: formData.workshopId,
          citizenName: formData.citizenName,
          cpf: formData.cpf,
          birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          hasExperience: formData.hasExperience || false,
          experience: formData.experience,
          motivation: formData.motivation,
          status: 'PENDING',
        },
      }),

      ArtisticGroup: () => tx.artisticGroup.create({
        data: {
          tenantId,
          protocolId,
          name: formData.name,
          category: formData.category,
          foundationDate: formData.foundationDate ? new Date(formData.foundationDate) : null,
          responsible: formData.responsible,
          contact: formData.contact,
          members: formData.members as Prisma.JsonValue,
          status: 'ACTIVE',
        },
      }),

      CulturalProject: () => tx.culturalProject.create({
        data: {
          tenantId,
          protocolId,
          name: formData.name,
          type: formData.type,
          description: formData.description,
          responsible: formData.responsible,
          startDate: formData.startDate ? new Date(formData.startDate) : null,
          endDate: formData.endDate ? new Date(formData.endDate) : null,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          currentStatus: 'PLANNING',
          status: 'ACTIVE',
          protocol: protocolNumber,
          contact: formData.contact as Prisma.JsonValue,
          funding: formData.funding as Prisma.JsonValue,
          targetAudience: formData.targetAudience,
          participants: formData.participants ? parseInt(formData.participants) : null,
          serviceId: formData.serviceId,
          source: 'service',
        },
      }),

      CulturalProjectSubmission: () => tx.culturalProjectSubmission.create({
        data: {
          tenantId,
          protocolId,
          projectName: formData.projectName,
          projectType: formData.projectType,
          description: formData.description,
          responsible: formData.responsible,
          cpf: formData.cpf,
          phone: formData.phone,
          email: formData.email,
          organization: formData.organization,
          budget: formData.budget ? parseFloat(formData.budget) : 0,
          fundingSource: formData.fundingSource,
          targetAudience: formData.targetAudience,
          expectedImpact: formData.expectedImpact,
          startDate: formData.startDate ? new Date(formData.startDate) : null,
          endDate: formData.endDate ? new Date(formData.endDate) : null,
          attachments: formData.attachments as Prisma.JsonValue,
          status: 'UNDER_REVIEW',
        },
      }),

      CulturalEvent: () => tx.culturalEvent.create({
        data: {
          tenantId,
          protocolId,
          spaceId: formData.spaceId,
          projectId: formData.projectId,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          type: formData.type,
          startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
          endDate: formData.endDate ? new Date(formData.endDate) : new Date(),
          schedule: formData.schedule as Prisma.JsonValue,
          duration: formData.duration ? parseInt(formData.duration) : null,
          venue: formData.venue,
          address: formData.address as Prisma.JsonValue,
          coordinates: formData.coordinates as Prisma.JsonValue,
          capacity: formData.capacity ? parseInt(formData.capacity) : 0,
          targetAudience: formData.targetAudience,
          ageRating: formData.ageRating,
          ticketPrice: formData.ticketPrice ? parseFloat(formData.ticketPrice) : null,
          freeEvent: formData.freeEvent !== false,
          organizer: formData.organizer as Prisma.JsonValue,
          producer: formData.producer,
          contact: formData.contact as Prisma.JsonValue,
          performers: formData.performers as Prisma.JsonValue,
          guests: formData.guests as Prisma.JsonValue,
          requirements: formData.requirements as Prisma.JsonValue,
          setup: formData.setup as Prisma.JsonValue,
          technical: formData.technical as Prisma.JsonValue,
          status: 'planned',
          approved: false,
          observations: formData.observations,
          protocol: protocolNumber,
          serviceId: formData.serviceId,
          source: 'service',
        },
      }),

      CulturalManifestation: () => tx.culturalManifestation.create({
        data: {
          tenantId,
          protocolId,
          name: formData.name,
          type: formData.type,
          description: formData.description,
          currentSituation: formData.currentSituation,
          knowledgeHolders: formData.knowledgeHolders as Prisma.JsonValue,
          safeguardActions: formData.safeguardActions as Prisma.JsonValue,
          status: 'ACTIVE',
        },
      }),

      // SEGURANÇA PÚBLICA
      SecurityAttendance: () => tx.securityAttendance.create({
        data: {
          tenantId,
          protocolId,
          protocol: protocolNumber,
          citizenName: formData.citizenName,
          citizenCpf: formData.citizenCpf,
          contact: formData.contact || formData.phone,
          serviceType: formData.serviceType,
          attendanceType: formData.attendanceType,
          subject: formData.subject,
          description: formData.description,
          urgency: formData.urgency || 'NORMAL',
          location: formData.location,
          evidence: formData.evidence as Prisma.JsonValue,
          status: 'PENDING',
          referredTo: formData.referredTo,
        },
      }),

      SecurityOccurrence: () => tx.securityOccurrence.create({
        data: {
          tenantId,
          protocolId,
          protocol: protocolNumber,
          occurrenceType: formData.occurrenceType,
          severity: formData.severity || 'MEDIUM',
          description: formData.description,
          location: formData.location,
          coordinates: formData.coordinates as Prisma.JsonValue,
          reporterName: formData.reporterName,
          reporterPhone: formData.reporterPhone,
          reporterCpf: formData.reporterCpf,
          victimInfo: formData.victimInfo as Prisma.JsonValue,
          officerName: formData.officerName,
          occurrenceDate: formData.occurrenceDate ? new Date(formData.occurrenceDate) : new Date(),
          status: 'OPEN',
          evidence: formData.evidence as Prisma.JsonValue,
          witnesses: formData.witnesses as Prisma.JsonValue,
        },
      }),

      PatrolRequest: () => tx.patrolRequest.create({
        data: {
          tenantId,
          protocolId,
          type: formData.type,
          reason: formData.reason,
          location: formData.location,
          coordinates: formData.coordinates as Prisma.JsonValue,
          area: formData.area,
          requestedDate: formData.requestedDate ? new Date(formData.requestedDate) : null,
          requestedTime: formData.requestedTime,
          frequency: formData.frequency,
          duration: formData.duration,
          requesterName: formData.requesterName,
          requesterPhone: formData.requesterPhone,
          requesterEmail: formData.requesterEmail,
          requesterAddress: formData.requesterAddress,
          description: formData.description,
          concerns: formData.concerns as Prisma.JsonValue,
          additionalInfo: formData.additionalInfo,
          status: 'pending',
          priority: formData.priority || 'normal',
          protocol: protocolNumber,
          serviceId: formData.serviceId,
          source: 'service',
        },
      }),

      CameraRequest: () => tx.cameraRequest.create({
        data: {
          tenantId,
          protocolId,
          type: formData.type,
          purpose: formData.purpose,
          location: formData.location,
          coordinates: formData.coordinates as Prisma.JsonValue,
          area: formData.area,
          address: formData.address,
          cameraType: formData.cameraType,
          quantity: formData.quantity ? parseInt(formData.quantity) : 1,
          justification: formData.justification,
          incidentDate: formData.incidentDate ? new Date(formData.incidentDate) : null,
          incidentTime: formData.incidentTime,
          timeRange: formData.timeRange as Prisma.JsonValue,
          incidentDescription: formData.incidentDescription,
          requesterName: formData.requesterName,
          requesterPhone: formData.requesterPhone,
          requesterEmail: formData.requesterEmail,
          requesterDocument: formData.requesterDocument,
          requesterType: formData.requesterType,
          status: 'pending',
          priority: formData.priority || 'normal',
          protocol: protocolNumber,
          serviceId: formData.serviceId,
          source: 'service',
        },
      }),

      AnonymousTip: () => tx.anonymousTip.create({
        data: {
          tenantId,
          protocolId,
          type: formData.type,
          category: formData.category,
          description: formData.description,
          location: formData.location,
          coordinates: formData.coordinates as Prisma.JsonValue,
          suspectInfo: formData.suspectInfo as Prisma.JsonValue,
          vehicleInfo: formData.vehicleInfo as Prisma.JsonValue,
          timeframe: formData.timeframe,
          frequency: formData.frequency,
          hasEvidence: formData.hasEvidence || false,
          evidenceType: formData.evidenceType as Prisma.JsonValue,
          evidenceNotes: formData.evidenceNotes,
          isUrgent: formData.isUrgent || false,
          dangerLevel: formData.dangerLevel,
          tipNumber: `TIP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          status: 'received',
          priority: formData.priority || 'normal',
          protocol: protocolNumber,
          serviceId: formData.serviceId,
          source: 'service',
          isAnonymous: formData.isAnonymous !== false,
          anonymityLevel: formData.anonymityLevel || 'full',
          feedbackCode: `FB-${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
        },
      }),

      CriticalPoint: () => tx.criticalPoint.create({
        data: {
          tenantId,
          protocolId,
          name: formData.name,
          location: formData.location,
          address: formData.address,
          coordinates: formData.coordinates as Prisma.JsonValue,
          pointType: formData.pointType,
          riskType: formData.riskType as Prisma.JsonValue,
          riskLevel: formData.riskLevel,
          description: formData.description,
          recommendations: formData.recommendations || '',
          recommendedActions: formData.recommendedActions as Prisma.JsonValue,
          patrolFrequency: formData.patrolFrequency,
          monitoringLevel: formData.monitoringLevel || 'NORMAL',
          isActive: true,
          observations: formData.observations,
        },
      }),

      SecurityAlert: () => tx.securityAlert.create({
        data: {
          tenantId,
          protocolId,
          title: formData.title,
          alertType: formData.alertType,
          message: formData.message,
          description: formData.description,
          location: formData.location,
          targetArea: formData.targetArea,
          coordinates: formData.coordinates as Prisma.JsonValue,
          severity: formData.severity,
          priority: formData.priority || 'MEDIUM',
          isActive: true,
          startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
          endDate: formData.endDate ? new Date(formData.endDate) : null,
          validUntil: formData.validUntil ? new Date(formData.validUntil) : null,
          targetAudience: formData.targetAudience,
          affectedAreas: formData.affectedAreas as Prisma.JsonValue,
          channels: formData.channels as Prisma.JsonValue || ['web', 'app'],
          createdBy: formData.createdBy || 'Sistema',
        },
      }),

      SecurityPatrol: () => tx.securityPatrol.create({
        data: {
          tenantId,
          protocolId,
          patrolType: formData.patrolType,
          route: formData.route,
          startTime: formData.startTime ? new Date(formData.startTime) : new Date(),
          endTime: formData.endTime ? new Date(formData.endTime) : null,
          guardId: formData.guardId,
          guardName: formData.guardName,
          officerName: formData.officerName || formData.guardName,
          officerBadge: formData.officerBadge,
          vehicle: formData.vehicle,
          status: 'ACTIVE',
          checkpoints: formData.checkpoints as Prisma.JsonValue,
          incidents: formData.incidents as Prisma.JsonValue,
          observations: formData.observations,
          gpsTrack: formData.gpsTrack as Prisma.JsonValue,
        },
      }),

      MunicipalGuard: () => tx.municipalGuard.create({
        data: {
          tenantId,
          protocolId,
          name: formData.name,
          badge: formData.badge || `GM-${Date.now()}`,
          cpf: formData.cpf,
          rg: formData.rg,
          birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          position: formData.position || 'guard',
          admissionDate: formData.admissionDate ? new Date(formData.admissionDate) : new Date(),
          status: 'active',
          specialties: formData.specialties as Prisma.JsonValue,
          certifications: formData.certifications as Prisma.JsonValue,
          assignedVehicle: formData.assignedVehicle,
          assignedRadio: formData.assignedRadio,
          equipment: formData.equipment as Prisma.JsonValue,
          shift: formData.shift,
          workSchedule: formData.workSchedule as Prisma.JsonValue,
          availability: 'available',
          notes: formData.notes,
          emergencyContact: formData.emergencyContact as Prisma.JsonValue,
          isActive: true,
        },
      }),

      SurveillanceSystem: () => tx.surveillanceSystem.create({
        data: {
          tenantId,
          protocolId,
          systemName: formData.systemName,
          systemCode: formData.systemCode || `SYS-${Date.now()}`,
          type: formData.type,
          location: formData.location,
          address: formData.address,
          coordinates: formData.coordinates as Prisma.JsonValue,
          area: formData.area,
          zone: formData.zone,
          manufacturer: formData.manufacturer,
          model: formData.model,
          installationDate: formData.installationDate ? new Date(formData.installationDate) : null,
          warrantyExpires: formData.warrantyExpires ? new Date(formData.warrantyExpires) : null,
          cameraType: formData.cameraType,
          resolution: formData.resolution,
          hasNightVision: formData.hasNightVision || false,
          hasAudio: formData.hasAudio || false,
          recordingDays: formData.recordingDays ? parseInt(formData.recordingDays) : null,
          status: 'operational',
          coverageArea: formData.coverageArea,
          viewAngle: formData.viewAngle,
          range: formData.range,
          ipAddress: formData.ipAddress,
          connectionType: formData.connectionType,
          bandwidth: formData.bandwidth,
          isMonitored: formData.isMonitored !== false,
          monitoringCenter: formData.monitoringCenter,
          alerts: formData.alerts as Prisma.JsonValue,
          integratedWith: formData.integratedWith as Prisma.JsonValue,
          apiAccess: formData.apiAccess || false,
          notes: formData.notes,
          technicalSpecs: formData.technicalSpecs as Prisma.JsonValue,
          isActive: true,
          createdBy: formData.createdBy || 'Sistema',
        },
      }),

      // ESPORTES
      SportsAttendance: () => tx.sportsAttendance.create({
        data: {
          tenantId,
          protocolId,
          protocol: protocolNumber,
          citizenName: formData.citizenName,
          contact: formData.contact || formData.phone,
          type: formData.type || 'GENERAL',
          status: 'PENDING',
          description: formData.description,
          observations: formData.observations,
          sportType: formData.sportType,
          sport: formData.sport,
          eventDate: formData.eventDate ? new Date(formData.eventDate) : null,
          location: formData.location,
          expectedParticipants: formData.expectedParticipants ? parseInt(formData.expectedParticipants) : null,
          followUpNeeded: formData.followUpNeeded || false,
          followUpDate: formData.followUpDate ? new Date(formData.followUpDate) : null,
          priority: formData.priority || 'MEDIUM',
          serviceId: formData.serviceId,
          source: 'service',
        },
      }),

      Athlete: () => tx.athlete.create({
        data: {
          tenantId,
          protocolId,
          name: formData.name || formData.athleteName,
          birthDate: formData.birthDate ? new Date(formData.birthDate) : new Date(),
          cpf: formData.cpf,
          rg: formData.rg,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          sport: formData.sport,
          category: formData.category,
          team: formData.team,
          teamId: formData.teamId,
          position: formData.position,
          medicalInfo: formData.medicalInfo as Prisma.JsonValue,
          emergencyContact: formData.emergencyContact as Prisma.JsonValue,
          federationNumber: formData.federationNumber,
          federationExpiry: formData.federationExpiry ? new Date(formData.federationExpiry) : null,
          medicalCertificate: formData.medicalCertificate as Prisma.JsonValue,
          modalityId: formData.modalityId,
          isActive: false,
          protocol: protocolNumber,
          serviceId: formData.serviceId,
          source: 'service',
        },
      }),

      SportsTeam: () => tx.sportsTeam.create({
        data: {
          tenantId,
          protocolId,
          name: formData.name || formData.teamName,
          sport: formData.sport,
          category: formData.category,
          gender: formData.gender,
          ageGroup: formData.ageGroup,
          coach: formData.coach,
          coachCpf: formData.coachCpf,
          coachPhone: formData.coachPhone,
          foundationDate: formData.foundationDate ? new Date(formData.foundationDate) : null,
          trainingSchedule: formData.trainingSchedule as Prisma.JsonValue,
          maxPlayers: formData.maxPlayers ? parseInt(formData.maxPlayers) : null,
          currentPlayers: 0,
          status: 'PENDING_APPROVAL',
          homeVenue: formData.homeVenue,
          description: formData.description,
          achievements: formData.achievements as Prisma.JsonValue,
          roster: formData.roster as Prisma.JsonValue,
          modalityId: formData.modalityId,
          isActive: false,
          protocol: protocolNumber,
          serviceId: formData.serviceId,
          source: 'service',
        },
      }),

      SportsModality: () => tx.sportsModality.create({
        data: {
          tenantId,
          protocolId,
          name: formData.name || formData.modalityName,
          description: formData.description,
          category: formData.category || 'individual',
          isActive: false,
        },
      }),

      SportsSchool: () => tx.sportsSchool.create({
        data: {
          tenantId,
          protocolId,
          name: formData.name || formData.schoolName,
          sport: formData.sport,
          description: formData.description,
          targetAge: formData.targetAge,
          instructor: formData.instructor,
          instructorCpf: formData.instructorCpf,
          maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : 0,
          currentStudents: 0,
          schedule: (formData.schedule || {}) as Prisma.InputJsonValue,
          location: formData.location,
          monthlyFee: formData.monthlyFee ? parseFloat(formData.monthlyFee) : null,
          equipment: formData.equipment as Prisma.InputJsonValue,
          requirements: formData.requirements,
          startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
          endDate: formData.endDate ? new Date(formData.endDate) : null,
          status: 'PENDING_APPROVAL',
          isActive: false,
        },
      }),

      SportsInfrastructure: () => tx.sportsInfrastructure.create({
        data: {
          tenantId,
          protocolId,
          name: formData.name || formData.facilityName,
          type: formData.type,
          sports: (formData.sports || []) as Prisma.InputJsonValue,
          modalities: formData.modalities as Prisma.InputJsonValue,
          address: formData.address,
          coordinates: formData.coordinates as Prisma.InputJsonValue,
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
          dimensions: formData.dimensions,
          surface: formData.surface,
          lighting: formData.lighting || false,
          covered: formData.covered || false,
          accessibility: formData.accessibility || false,
          equipment: formData.equipment as Prisma.InputJsonValue,
          facilities: formData.facilities as Prisma.InputJsonValue,
          operatingHours: formData.operatingHours,
          status: 'PENDING_APPROVAL',
          maintenanceSchedule: formData.maintenanceSchedule as Prisma.InputJsonValue,
          lastMaintenance: formData.lastMaintenance ? new Date(formData.lastMaintenance) : null,
          bookingRules: formData.bookingRules as Prisma.InputJsonValue,
          contact: formData.contact,
          manager: formData.manager,
          isPublic: formData.isPublic !== false,
        },
      }),

      Competition: () => tx.competition.create({
        data: {
          tenantId,
          protocolId,
          name: formData.name || formData.competitionName,
          sport: formData.sport,
          competitionType: formData.competitionType || formData.type,
          type: formData.type,
          startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
          endDate: formData.endDate ? new Date(formData.endDate) : new Date(),
          category: formData.category,
          ageGroup: formData.ageGroup,
          maxTeams: formData.maxTeams ? parseInt(formData.maxTeams) : null,
          registeredTeams: 0,
          registrationFee: formData.registrationFee ? parseFloat(formData.registrationFee) : null,
          entryFee: formData.entryFee ? parseFloat(formData.entryFee) : null,
          prizes: formData.prizes as Prisma.InputJsonValue,
          rules: formData.rules,
          status: 'PENDING_APPROVAL',
          organizer: formData.organizer,
          venue: formData.venue,
          location: formData.location,
          contact: formData.contact as Prisma.InputJsonValue,
          results: formData.results as Prisma.InputJsonValue,
          modalityId: formData.modalityId,
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

      // EDUCAÇÃO
      EducationAttendance: () => tx.educationAttendance.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      Student: () => tx.student.updateMany({
        where: { protocolId },
        data: { isActive: true, ...additionalData },
      }),

      SchoolTransport: () => tx.schoolTransport.updateMany({
        where: { protocolId },
        data: { isActive: true, ...additionalData },
      }),

      DisciplinaryRecord: () => tx.disciplinaryRecord.updateMany({
        where: { protocolId },
        data: { status, resolved: true, ...additionalData },
      }),

      SchoolDocument: () => tx.schoolDocument.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      StudentTransfer: () => tx.studentTransfer.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      AttendanceRecord: () => tx.attendanceRecord.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      GradeRecord: () => tx.gradeRecord.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      SchoolManagement: () => tx.schoolManagement.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      SchoolMeal: () => tx.schoolMeal.updateMany({
        where: { protocolId },
        data: { ...additionalData },
      }),

      // ASSISTÊNCIA SOCIAL
      SocialAssistanceAttendance: () => tx.socialAssistanceAttendance.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      VulnerableFamily: () => tx.vulnerableFamily.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      BenefitRequest: () => tx.benefitRequest.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      EmergencyDelivery: () => tx.emergencyDelivery.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      SocialGroupEnrollment: () => tx.socialGroupEnrollment.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      HomeVisit: () => tx.homeVisit.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      SocialProgramEnrollment: () => tx.socialProgramEnrollment.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      SocialAppointment: () => tx.socialAppointment.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      SocialEquipment: () => tx.socialEquipment.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      // CULTURA
      CulturalAttendance: () => tx.culturalAttendance.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      CulturalSpaceReservation: () => tx.culturalSpaceReservation.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      CulturalWorkshopEnrollment: () => tx.culturalWorkshopEnrollment.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      ArtisticGroup: () => tx.artisticGroup.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      CulturalProject: () => tx.culturalProject.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      CulturalProjectSubmission: () => tx.culturalProjectSubmission.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      CulturalEvent: () => tx.culturalEvent.updateMany({
        where: { protocolId },
        data: { status, approved: status === 'ACTIVE', ...additionalData },
      }),

      CulturalManifestation: () => tx.culturalManifestation.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      // SEGURANÇA PÚBLICA
      SecurityAttendance: () => tx.securityAttendance.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      SecurityOccurrence: () => tx.securityOccurrence.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      PatrolRequest: () => tx.patrolRequest.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      CameraRequest: () => tx.cameraRequest.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      AnonymousTip: () => tx.anonymousTip.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      CriticalPoint: () => tx.criticalPoint.updateMany({
        where: { protocolId },
        data: { isActive: status === 'ACTIVE', ...additionalData },
      }),

      SecurityAlert: () => tx.securityAlert.updateMany({
        where: { protocolId },
        data: { isActive: status === 'ACTIVE', ...additionalData },
      }),

      SecurityPatrol: () => tx.securityPatrol.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      MunicipalGuard: () => tx.municipalGuard.updateMany({
        where: { protocolId },
        data: { status, isActive: status === 'active', ...additionalData },
      }),

      SurveillanceSystem: () => tx.surveillanceSystem.updateMany({
        where: { protocolId },
        data: { status, isActive: status === 'operational', ...additionalData },
      }),

      // ESPORTES
      SportsAttendance: () => tx.sportsAttendance.updateMany({
        where: { protocolId },
        data: { ...additionalData },
      }),

      Athlete: () => tx.athlete.updateMany({
        where: { protocolId },
        data: { isActive: status === 'ACTIVE', ...additionalData },
      }),

      SportsTeam: () => tx.sportsTeam.updateMany({
        where: { protocolId },
        data: { status, isActive: status === 'ACTIVE', ...additionalData },
      }),

      SportsModality: () => tx.sportsModality.updateMany({
        where: { protocolId },
        data: { isActive: status === 'ACTIVE', ...additionalData },
      }),

      SportsSchool: () => tx.sportsSchool.updateMany({
        where: { protocolId },
        data: { status, isActive: status === 'ACTIVE', ...additionalData },
      }),

      SportsInfrastructure: () => tx.sportsInfrastructure.updateMany({
        where: { protocolId },
        data: { status, ...additionalData },
      }),

      Competition: () => tx.competition.updateMany({
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
