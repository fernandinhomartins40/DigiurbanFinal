/**
 * ============================================================================
 * ENTITY HANDLERS - Handlers completos para TODAS as entidades dos módulos
 * ============================================================================
 *
 * Este arquivo contém os handlers de criação para todas as 95+ entidades
 * mapeadas no MODULE_MAPPING.
 */

import { Prisma } from '@prisma/client';
import {
  requireField,
  requireFields,
  validateTenantRelation,
  validateCPF,
  validateEmail,
  validatePhone,
  parseDate,
  parseNumber,
  validateMultipleRelations,
  validateTenant,
} from './entity-validation-helpers';

export interface EntityHandlerContext {
  tenantId: string;
  protocolId: string;
  protocolNumber: string;
  formData: Record<string, any>;
  tx: Prisma.TransactionClient;
}

export const entityHandlers: Record<string, (ctx: EntityHandlerContext) => Promise<any>> = {

  // ========================================
  // SAÚDE (11 entidades)
  // ========================================

  HealthAttendance: async (ctx) => {
    // Validações obrigatórias
    requireField(ctx.formData.citizenName || ctx.formData.patientName, 'Nome do cidadão/paciente');
    const cpf = validateCPF(ctx.formData.cpf || ctx.formData.patientCpf, 'CPF');

    return ctx.tx.healthAttendance.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        protocol: ctx.protocolNumber,
        citizenName: ctx.formData.patientName || ctx.formData.citizenName,
        citizenCPF: cpf,
        contact: validatePhone(ctx.formData.contact || ctx.formData.phone, true) || '',
        type: ctx.formData.type || 'CONSULTA',
        status: 'PENDING',
        description: ctx.formData.description || ctx.formData.symptoms || '',
        urgency: ctx.formData.urgency || 'NORMAL',
        symptoms: ctx.formData.symptoms,
        priority: ctx.formData.priority || 'MEDIUM',
      },
    });
  },

  HealthAppointment: async (ctx) => {
    return ctx.tx.healthAppointment.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        patientName: ctx.formData.patientName || 'Não informado',
        patientCpf: validateCPF(ctx.formData.patientCpf, 'CPF do paciente'),
        patientPhone: ctx.formData.patientPhone || ctx.formData.phone,
        appointmentDate: ctx.formData.appointmentDate ? new Date(ctx.formData.appointmentDate) : new Date(),
        appointmentTime: ctx.formData.appointmentTime || '08:00',
        speciality: ctx.formData.speciality || ctx.formData.specialty || 'GENERAL',
        priority: ctx.formData.priority || 'NORMAL',
        status: 'SCHEDULED',
        symptoms: ctx.formData.symptoms,
        observations: ctx.formData.observations,
      },
    });
  },

  MedicationDispense: async (ctx) => {
    return ctx.tx.medicationDispense.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        patientName: ctx.formData.patientName || 'Não informado',
        patientCpf: validateCPF(ctx.formData.patientCpf, 'CPF do paciente'),
        medicationName: ctx.formData.medication || ctx.formData.medicationName || 'Não especificado',
        dosage: ctx.formData.dosage || '1x ao dia',
        quantity: ctx.formData.quantity ? parseInt(ctx.formData.quantity) : 1,
        pharmacistName: ctx.formData.pharmacistName || 'A definir',
        dispensedBy: ctx.formData.dispensedBy || 'Sistema',
        status: 'DISPENSED',
        observations: ctx.formData.observations,
      },
    });
  },

  HealthCampaign: async (ctx) => {
    return ctx.tx.healthCampaign.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || ctx.formData.campaignName || 'Campanha de Saúde',
        description: ctx.formData.description || '',
        campaignType: ctx.formData.campaignType || ctx.formData.type || 'VACINACAO',
        startDate: ctx.formData.startDate ? new Date(ctx.formData.startDate) : new Date(),
        endDate: ctx.formData.endDate ? new Date(ctx.formData.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        targetAudience: ctx.formData.targetAudience || 'População geral',
        goals: ctx.formData.goals || {},
        coordinatorName: ctx.formData.coordinatorName || 'A definir',
        budget: ctx.formData.budget ? parseFloat(ctx.formData.budget) : null,
        status: 'ACTIVE',
      },
    });
  },

  HealthProgram: async (ctx) => {
    return ctx.tx.healthProgram.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || ctx.formData.programName || 'Programa de Saúde',
        description: ctx.formData.description || '',
        programType: ctx.formData.programType || 'OUTRO',
        targetAudience: ctx.formData.targetAudience || 'População geral',
        coordinatorName: ctx.formData.coordinatorName || 'A definir',
        startDate: ctx.formData.startDate ? new Date(ctx.formData.startDate) : new Date(),
        endDate: ctx.formData.endDate ? new Date(ctx.formData.endDate) : null,
        status: 'ACTIVE',
        goals: ctx.formData.goals || null,
        budget: ctx.formData.budget ? parseFloat(ctx.formData.budget) : null,
      },
    });
  },

  HealthTransport: async (ctx) => {
    return ctx.tx.healthTransport.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        patientName: ctx.formData.patientName || 'Não informado',
        origin: ctx.formData.origin || ctx.formData.address || 'Não informado',
        destination: ctx.formData.destination || 'A definir',
        transportType: ctx.formData.transportType || 'AMBULANCIA',
        urgencyLevel: ctx.formData.urgencyLevel || ctx.formData.urgency || 'NORMAL',
        scheduledDate: ctx.formData.scheduledDate ? new Date(ctx.formData.scheduledDate) : new Date(),
        status: 'SCHEDULED',
        observations: ctx.formData.observations,
      },
    });
  },

  HealthExam: async (ctx) => {
    return ctx.tx.healthExam.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        patientName: ctx.formData.patientName || 'Não informado',
        patientCpf: validateCPF(ctx.formData.patientCpf, 'CPF do paciente'),
        patientPhone: ctx.formData.patientPhone || ctx.formData.phone,
        examType: ctx.formData.examType || 'LABORATORIAL',
        examName: ctx.formData.examName || ctx.formData.exam || 'Exame solicitado',
        requestedBy: ctx.formData.requestedBy || ctx.formData.doctorName || 'Médico solicitante',
        priority: ctx.formData.priority || 'NORMAL',
        status: 'REQUESTED',
        observations: ctx.formData.observations,
      },
    });
  },

  HealthTransportRequest: async (ctx) => {
    return ctx.tx.healthTransportRequest.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        patientName: ctx.formData.patientName || 'Não informado',
        patientCpf: validateCPF(ctx.formData.patientCpf, 'CPF do paciente'),
        patientPhone: ctx.formData.patientPhone || ctx.formData.phone,
        origin: ctx.formData.origin || ctx.formData.address || 'Não informado',
        destination: ctx.formData.destination || 'A definir',
        transportType: ctx.formData.transportType || 'VEICULO_COMUM',
        urgencyLevel: ctx.formData.urgencyLevel || 'NORMAL',
        reason: ctx.formData.reason || ctx.formData.description || 'Transporte para tratamento',
        status: 'REQUESTED',
        observations: ctx.formData.observations,
      },
    });
  },

  Vaccination: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.patientId) {
      await validateTenant(ctx.tx, 'patient', ctx.formData.patientId, ctx.tenantId);
    }

    if (!ctx.formData.patientId) {
      throw new Error('patientId é obrigatório para registro de vacinação');
    }

    return ctx.tx.vaccination.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        patientId: ctx.formData.patientId,
        vaccine: ctx.formData.vaccine || ctx.formData.vaccineName || 'Vacina não especificada',
        dose: ctx.formData.dose || '1ª dose',
        appliedAt: ctx.formData.appliedAt ? new Date(ctx.formData.appliedAt) : new Date(),
        appliedBy: ctx.formData.appliedBy || 'Profissional de saúde',
        lotNumber: ctx.formData.lotNumber,
        nextDose: ctx.formData.nextDose ? new Date(ctx.formData.nextDose) : null,
      },
    });
  },

  Patient: async (ctx) => {
    return ctx.tx.patient.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        fullName: ctx.formData.fullName || ctx.formData.patientName || ctx.formData.name || 'Não informado',
        cpf: validateCPF(ctx.formData.cpf || ctx.formData.patientCpf, 'CPF'),
        rg: ctx.formData.rg,
        birthDate: ctx.formData.birthDate ? new Date(ctx.formData.birthDate) : new Date('2000-01-01'),
        gender: ctx.formData.gender || 'NAO_INFORMADO',
        bloodType: ctx.formData.bloodType,
        phone: ctx.formData.phone,
        email: ctx.formData.email,
        address: ctx.formData.address,
        susCardNumber: ctx.formData.susCardNumber,
        allergies: ctx.formData.allergies,
        chronicDiseases: ctx.formData.chronicDiseases,
        medications: ctx.formData.medications,
        emergencyContact: ctx.formData.emergencyContact,
        emergencyPhone: ctx.formData.emergencyPhone,
        observations: ctx.formData.observations,
        registeredBy: ctx.formData.registeredBy || 'Sistema',
      },
    });
  },

  CommunityHealthAgent: async (ctx) => {
    return ctx.tx.communityHealthAgent.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        fullName: ctx.formData.fullName || ctx.formData.name || 'Não informado',
        cpf: validateCPF(ctx.formData.cpf, 'CPF'),
        phone: ctx.formData.phone || 'Não informado',
        email: ctx.formData.email,
        address: ctx.formData.address,
        assignedArea: ctx.formData.assignedArea || ctx.formData.area || 'A definir',
        hireDate: ctx.formData.hireDate ? new Date(ctx.formData.hireDate) : new Date(),
        status: 'ACTIVE',
        healthUnit: ctx.formData.healthUnit,
        supervisor: ctx.formData.supervisor,
      },
    });
  },

  // ========================================
  // EDUCAÇÃO (10 entidades)
  // ========================================

  EducationAttendance: async (ctx) => {
    return ctx.tx.educationAttendance.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        citizenName: ctx.formData.citizenName || ctx.formData.studentName || 'Não informado',
        citizenCpf: validateCPF(ctx.formData.citizenCpf || ctx.formData.cpf, 'CPF do cidadão'),
        citizenPhone: ctx.formData.citizenPhone || ctx.formData.phone,
        citizenEmail: ctx.formData.citizenEmail || ctx.formData.email,
        serviceType: ctx.formData.serviceType || 'INFORMACAO',
        description: ctx.formData.description || '',
        status: 'PENDING',
        priority: ctx.formData.priority || 'NORMAL',
      },
    });
  },

  Student: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.schoolId) {
      await validateTenant(ctx.tx, 'school', ctx.formData.schoolId, ctx.tenantId);
    }

    if (!ctx.formData.schoolId) {
      throw new Error('schoolId é obrigatório para cadastro de estudante');
    }

    return ctx.tx.student.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        schoolId: ctx.formData.schoolId,
        name: ctx.formData.name || ctx.formData.studentName || 'Não informado',
        birthDate: ctx.formData.birthDate ? new Date(ctx.formData.birthDate) : new Date('2010-01-01'),
        cpf: ctx.formData.cpf,
        rg: ctx.formData.rg,
        parentName: ctx.formData.parentName || ctx.formData.responsibleName || 'Não informado',
        parentPhone: ctx.formData.parentPhone || ctx.formData.phone || 'Não informado',
        parentEmail: ctx.formData.parentEmail || ctx.formData.email,
        address: ctx.formData.address || 'Não informado',
        medicalInfo: ctx.formData.medicalInfo || null,
        isActive: true,
      },
    });
  },

  StudentTransport: async (ctx) => {
    return ctx.tx.schoolTransport.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        route: ctx.formData.route || ctx.formData.address || 'A definir',
        driver: ctx.formData.driver || 'A definir',
        vehicle: ctx.formData.vehicle || 'A definir',
        capacity: ctx.formData.capacity ? parseInt(ctx.formData.capacity) : 40,
        shift: ctx.formData.shift || 'morning',
        stops: ctx.formData.stops || null,
        isActive: false,
      },
    });
  },

  DisciplinaryRecord: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.schoolId) {
      await validateTenant(ctx.tx, 'school', ctx.formData.schoolId, ctx.tenantId);
    }
    if (ctx.formData.studentId) {
      await validateTenant(ctx.tx, 'student', ctx.formData.studentId, ctx.tenantId);
    }

    if (!ctx.formData.studentId || !ctx.formData.schoolId) {
      throw new Error('studentId e schoolId são obrigatórios');
    }

    return ctx.tx.disciplinaryRecord.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        studentId: ctx.formData.studentId,
        schoolId: ctx.formData.schoolId,
        incidentType: ctx.formData.incidentType || 'OUTRO',
        severity: ctx.formData.severity || 'LEVE',
        description: ctx.formData.description || '',
        incidentDate: ctx.formData.incidentDate ? new Date(ctx.formData.incidentDate) : new Date(),
        measures: ctx.formData.measures || 'A definir',
        responsibleTeacher: ctx.formData.responsibleTeacher || 'Professor',
        status: 'PENDING',
      },
    });
  },

  SchoolDocument: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.studentId) {
      await validateTenant(ctx.tx, 'student', ctx.formData.studentId, ctx.tenantId);
    }

    return ctx.tx.schoolDocument.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        studentId: ctx.formData.studentId,
        studentName: ctx.formData.studentName || 'Não informado',
        documentType: ctx.formData.documentType || 'DECLARACAO',
        status: 'PENDING',
        observations: ctx.formData.observations,
      },
    });
  },

  StudentTransfer: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.studentId) {
      await validateTenant(ctx.tx, 'student', ctx.formData.studentId, ctx.tenantId);
    }

    return ctx.tx.studentTransfer.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        studentId: ctx.formData.studentId,
        studentName: ctx.formData.studentName || 'Não informado',
        currentSchool: ctx.formData.currentSchool || 'Não informado',
        targetSchool: ctx.formData.targetSchool || 'A definir',
        grade: ctx.formData.grade || 'Não informado',
        transferReason: ctx.formData.transferReason || ctx.formData.reason || 'Transferência',
        status: 'PENDING',
      },
    });
  },

  AttendanceRecord: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.schoolId) {
      await validateTenant(ctx.tx, 'school', ctx.formData.schoolId, ctx.tenantId);
    }
    if (ctx.formData.studentId) {
      await validateTenant(ctx.tx, 'student', ctx.formData.studentId, ctx.tenantId);
    }

    return ctx.tx.attendanceRecord.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        studentId: ctx.formData.studentId,
        studentName: ctx.formData.studentName || 'Não informado',
        schoolId: ctx.formData.schoolId,
        classId: ctx.formData.classId,
        month: ctx.formData.month ? parseInt(ctx.formData.month) : new Date().getMonth() + 1,
        year: ctx.formData.year ? parseInt(ctx.formData.year) : new Date().getFullYear(),
        totalDays: ctx.formData.totalDays ? parseInt(ctx.formData.totalDays) : 20,
        presentDays: ctx.formData.presentDays ? parseInt(ctx.formData.presentDays) : 0,
        absentDays: ctx.formData.absentDays ? parseInt(ctx.formData.absentDays) : 0,
        percentage: ctx.formData.percentage ? parseFloat(ctx.formData.percentage) : 0,
      },
    });
  },

  GradeRecord: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.schoolId) {
      await validateTenant(ctx.tx, 'school', ctx.formData.schoolId, ctx.tenantId);
    }
    if (ctx.formData.studentId) {
      await validateTenant(ctx.tx, 'student', ctx.formData.studentId, ctx.tenantId);
    }

    return ctx.tx.gradeRecord.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        studentId: ctx.formData.studentId,
        studentName: ctx.formData.studentName || 'Não informado',
        schoolId: ctx.formData.schoolId,
        classId: ctx.formData.classId,
        subject: ctx.formData.subject || 'Não informado',
        period: ctx.formData.period || '1º Bimestre',
        grade: ctx.formData.grade ? parseFloat(ctx.formData.grade) : 0,
        maxGrade: ctx.formData.maxGrade ? parseFloat(ctx.formData.maxGrade) : 10,
        status: 'APPROVED',
        teacherName: ctx.formData.teacherName,
      },
    });
  },

  SchoolManagement: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.schoolId) {
      await validateTenant(ctx.tx, 'school', ctx.formData.schoolId, ctx.tenantId);
    }

    return ctx.tx.schoolManagement.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        schoolId: ctx.formData.schoolId,
        schoolName: ctx.formData.schoolName || 'Escola',
        managementType: ctx.formData.managementType || 'ADMINISTRATIVO',
        description: ctx.formData.description || '',
        status: 'PENDING',
        priority: ctx.formData.priority || 'NORMAL',
      },
    });
  },

  SchoolMeal: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.schoolId) {
      await validateTenant(ctx.tx, 'school', ctx.formData.schoolId, ctx.tenantId);
    }

    return ctx.tx.schoolMeal.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        schoolId: ctx.formData.schoolId,
        date: ctx.formData.date ? new Date(ctx.formData.date) : new Date(),
        shift: ctx.formData.shift || 'MANHA',
        menu: ctx.formData.menu || {},
        studentsServed: ctx.formData.studentsServed ? parseInt(ctx.formData.studentsServed) : 0,
        cost: ctx.formData.cost ? parseFloat(ctx.formData.cost) : null,
      },
    });
  },

  // ========================================
  // ASSISTÊNCIA SOCIAL (9 entidades)
  // ========================================

  SocialAssistanceAttendance: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.citizenId) {
      await validateTenant(ctx.tx, 'citizen', ctx.formData.citizenId, ctx.tenantId);
    }

    return ctx.tx.socialAssistanceAttendance.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        protocol: ctx.protocolNumber,
        citizenId: ctx.formData.citizenId || null,
        citizenName: ctx.formData.citizenName || 'Não informado',
        citizenCpf: validateCPF(ctx.formData.citizenCpf || ctx.formData.cpf, 'CPF do cidadão'),
        contact: ctx.formData.contact || { phone: ctx.formData.phone || '' },
        familyIncome: ctx.formData.familyIncome ? parseFloat(ctx.formData.familyIncome) : null,
        familySize: ctx.formData.familySize ? parseInt(ctx.formData.familySize) : null,
        serviceType: ctx.formData.serviceType || 'ATENDIMENTO_GERAL',
        subject: ctx.formData.subject || 'Solicitação de atendimento',
        description: ctx.formData.description || '',
        vulnerability: ctx.formData.vulnerability,
        urgency: ctx.formData.urgency || 'NORMAL',
        followUpNeeded: ctx.formData.followUpNeeded || false,
        status: 'PENDING',
      },
    });
  },

  VulnerableFamily: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.citizenId) {
      await validateTenant(ctx.tx, 'citizen', ctx.formData.citizenId, ctx.tenantId);
    }

    if (!ctx.formData.citizenId) {
      throw new Error('citizenId é obrigatório para cadastro de família vulnerável');
    }

    return ctx.tx.vulnerableFamily.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        citizenId: ctx.formData.citizenId,
        memberCount: ctx.formData.memberCount ? parseInt(ctx.formData.memberCount) : ctx.formData.familySize ? parseInt(ctx.formData.familySize) : 1,
        monthlyIncome: ctx.formData.monthlyIncome ? parseFloat(ctx.formData.monthlyIncome) : 0,
        vulnerabilityType: ctx.formData.vulnerabilityType || ctx.formData.vulnerability || 'SOCIAL',
        riskLevel: ctx.formData.riskLevel || 'MEDIUM',
        status: 'ACTIVE',
      },
    });
  },

  BenefitRequest: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.familyId) {
      await validateTenant(ctx.tx, 'vulnerableFamily', ctx.formData.familyId, ctx.tenantId);
    }

    if (!ctx.formData.familyId) {
      throw new Error('familyId é obrigatório para solicitação de benefício');
    }

    return ctx.tx.benefitRequest.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        familyId: ctx.formData.familyId,
        benefitType: ctx.formData.benefitType || 'CESTA_BASICA',
        status: 'PENDING',
        reason: ctx.formData.justification || ctx.formData.description || ctx.formData.reason || 'Necessidade de apoio',
      },
    });
  },

  EmergencyDelivery: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.citizenId) {
      await validateTenant(ctx.tx, 'citizen', ctx.formData.citizenId, ctx.tenantId);
    }

    return ctx.tx.emergencyDelivery.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        citizenId: ctx.formData.citizenId,
        deliveryType: ctx.formData.deliveryType || 'CESTA_BASICA',
        quantity: ctx.formData.quantity ? parseInt(ctx.formData.quantity) : 1,
        deliveryDate: ctx.formData.deliveryDate ? new Date(ctx.formData.deliveryDate) : new Date(),
        recipientName: ctx.formData.recipientName || ctx.formData.citizenName || 'Não informado',
        deliveredBy: ctx.formData.deliveredBy || 'Sistema',
        urgency: ctx.formData.urgency,
        status: 'PENDING',
        observations: ctx.formData.justification || ctx.formData.description,
      },
    });
  },

  SocialGroupEnrollment: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.citizenId) {
      await validateTenant(ctx.tx, 'citizen', ctx.formData.citizenId, ctx.tenantId);
    }

    return ctx.tx.socialGroupEnrollment.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        citizenId: ctx.formData.citizenId,
        participantName: ctx.formData.participantName || ctx.formData.citizenName || 'Não informado',
        participantCpf: ctx.formData.participantCpf || ctx.formData.cpf,
        groupName: ctx.formData.groupName || 'Grupo Social',
        groupType: ctx.formData.groupType || 'CONVIVENCIA',
        enrollmentDate: new Date(),
        status: 'ACTIVE',
      },
    });
  },

  HomeVisit: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.familyId) {
      await validateTenant(ctx.tx, 'vulnerableFamily', ctx.formData.familyId, ctx.tenantId);
    }

    if (!ctx.formData.familyId) {
      throw new Error('familyId é obrigatório para visita domiciliar');
    }

    return ctx.tx.homeVisit.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        familyId: ctx.formData.familyId,
        visitDate: ctx.formData.visitDate ? new Date(ctx.formData.visitDate) : new Date(),
        socialWorker: ctx.formData.socialWorker || ctx.formData.responsible || 'Assistente Social',
        visitPurpose: ctx.formData.visitPurpose || ctx.formData.reason || ctx.formData.description || 'Avaliação social',
        status: 'SCHEDULED',
      },
    });
  },

  SocialProgramEnrollment: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.citizenId) {
      await validateTenant(ctx.tx, 'citizen', ctx.formData.citizenId, ctx.tenantId);
    }

    return ctx.tx.socialProgramEnrollment.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        citizenId: ctx.formData.citizenId,
        beneficiaryName: ctx.formData.beneficiaryName || ctx.formData.citizenName || 'Não informado',
        beneficiaryCpf: ctx.formData.beneficiaryCpf || ctx.formData.cpf,
        programName: ctx.formData.programName || 'Programa Social',
        programType: ctx.formData.programType || 'ASSISTENCIA',
        enrollmentDate: new Date(),
        status: 'PENDING',
      },
    });
  },

  SocialAppointment: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.citizenId) {
      await validateTenant(ctx.tx, 'citizen', ctx.formData.citizenId, ctx.tenantId);
    }

    return ctx.tx.socialAppointment.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        citizenId: ctx.formData.citizenId,
        citizenName: ctx.formData.citizenName || 'Não informado',
        citizenCpf: ctx.formData.citizenCpf || ctx.formData.cpf,
        appointmentType: ctx.formData.appointmentType || ctx.formData.serviceType || 'ATENDIMENTO',
        appointmentDate: ctx.formData.appointmentDate ? new Date(ctx.formData.appointmentDate) : new Date(),
        purpose: ctx.formData.purpose || ctx.formData.description || 'Atendimento social',
        status: 'SCHEDULED',
        notes: ctx.formData.notes || ctx.formData.description,
      },
    });
  },

  SocialEquipment: async (ctx) => {
    return ctx.tx.socialEquipment.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        equipmentName: ctx.formData.equipmentName || ctx.formData.name || 'Equipamento Social',
        equipmentType: ctx.formData.equipmentType || ctx.formData.type || 'CRAS',
        address: ctx.formData.address || 'Não informado',
        capacity: ctx.formData.capacity ? parseInt(ctx.formData.capacity) : 0,
        status: 'ACTIVE',
      },
    });
  },

  // ========================================
  // AGRICULTURA (3 já implementados + 3)
  // ========================================

  RuralTraining: async (ctx) => {
    return ctx.tx.ruralTraining.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        title: ctx.formData.title || ctx.formData.name || ctx.formData.trainingName || 'Capacitação Rural',
        description: ctx.formData.description || '',
        trainingType: ctx.formData.trainingType || 'TECNICA',
        objectives: ctx.formData.objectives || {},
        targetAudience: ctx.formData.targetAudience || 'Produtores rurais',
        instructor: ctx.formData.instructor || 'A definir',
        content: ctx.formData.content || {},
        duration: ctx.formData.duration ? parseInt(ctx.formData.duration) : 40,
        maxParticipants: ctx.formData.maxParticipants ? parseInt(ctx.formData.maxParticipants) : 30,
        startDate: ctx.formData.startDate ? new Date(ctx.formData.startDate) : new Date(),
        endDate: ctx.formData.endDate ? new Date(ctx.formData.endDate) : null,
        schedule: ctx.formData.schedule || {},
        location: ctx.formData.location || 'A definir',
        status: 'SCHEDULED',
      },
    });
  },

  TechnicalAssistance: async (ctx) => {
    return ctx.tx.technicalAssistance.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        producerName: ctx.formData.producerName || ctx.formData.citizenName || 'Não informado',
        producerCpf: validateCPF(ctx.formData.producerCpf || ctx.formData.cpf, 'CPF do produtor'),
        propertyName: ctx.formData.propertyName || 'Propriedade',
        propertySize: ctx.formData.propertySize ? parseFloat(ctx.formData.propertySize) : 0,
        location: ctx.formData.location || ctx.formData.address || 'Não informado',
        assistanceType: ctx.formData.assistanceType || 'ORIENTACAO',
        subject: ctx.formData.subject || 'Assistência técnica',
        description: ctx.formData.description || '',
        technician: ctx.formData.technician || 'A definir',
        visitDate: ctx.formData.visitDate ? new Date(ctx.formData.visitDate) : new Date(),
        recommendations: ctx.formData.recommendations || {},
      },
    });
  },

  AgricultureAttendance: async (ctx) => {
    return ctx.tx.agricultureAttendance.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        producerName: ctx.formData.producerName || ctx.formData.citizenName || 'Não informado',
        producerCpf: validateCPF(ctx.formData.producerCpf || ctx.formData.cpf, 'CPF do produtor'),
        contact: ctx.formData.contact || ctx.formData.phone || 'Não informado',
        serviceType: ctx.formData.serviceType || 'ORIENTACAO',
        subject: ctx.formData.subject || 'Atendimento agrícola',
        description: ctx.formData.description || '',
        status: 'PENDING',
      },
    });
  },

  RuralProducer: async (ctx) => {
    console.log('🌾 RuralProducer Handler - formData recebido:', JSON.stringify(ctx.formData, null, 2));

    // Aceitar campos em português e inglês
    const name = ctx.formData.name || ctx.formData.producerName || ctx.formData.nome;
    const document = ctx.formData.document || ctx.formData.cpf || ctx.formData.producerCpf;
    const phone = ctx.formData.phone || ctx.formData.contact || ctx.formData.telefone;
    const address = ctx.formData.address || ctx.formData.endereco;
    const productionType = ctx.formData.productionType || ctx.formData.producerType || ctx.formData.tipoProdutor || 'INDIVIDUAL';

    console.log('🌾 Campos extraídos:');
    console.log('  - name:', name);
    console.log('  - document:', document);
    console.log('  - phone:', phone);
    console.log('  - address:', address);
    console.log('  - productionType:', productionType);

    if (!name) {
      throw new Error('Nome do produtor é obrigatório');
    }
    if (!ctx.formData.citizenId) {
      throw new Error('citizenId é obrigatório para cadastro de produtor rural');
    }
    if (!document) {
      throw new Error('Documento (CPF) do produtor é obrigatório');
    }

    // Validar que o cidadão pertence ao mesmo tenant
    const citizen = await ctx.tx.citizen.findFirst({
      where: { id: ctx.formData.citizenId, tenantId: ctx.tenantId }
    });
    if (!citizen) {
      throw new Error('Cidadão não encontrado ou não pertence a este município');
    }

    return ctx.tx.ruralProducer.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        citizenId: ctx.formData.citizenId,
        name,
        document,
        phone,
        email: ctx.formData.email,
        address,
        productionType,
        mainCrop: ctx.formData.mainCrop || ctx.formData.mainActivity || ctx.formData.principaisProducoes || 'AGRICULTURA',
        status: 'PENDING', // Aguardando aprovação do setor
        isActive: false, // Só fica ativo após aprovação
      },
    });
  },

  RuralProperty: async (ctx) => {
    if (!ctx.formData.name && !ctx.formData.propertyName) {
      throw new Error('Nome da propriedade é obrigatório');
    }
    if (!ctx.formData.producerId) {
      throw new Error('ID do produtor é obrigatório');
    }
    if (!ctx.formData.size && !ctx.formData.totalArea) {
      throw new Error('Tamanho da propriedade é obrigatório');
    }
    if (!ctx.formData.location && !ctx.formData.address) {
      throw new Error('Localização da propriedade é obrigatória');
    }

    // Validar que o produtor pertence ao mesmo tenant
    const producer = await ctx.tx.ruralProducer.findFirst({
      where: { id: ctx.formData.producerId, tenantId: ctx.tenantId }
    });
    if (!producer) {
      throw new Error('Produtor não encontrado ou não pertence a este município');
    }

    return ctx.tx.ruralProperty.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        producerId: ctx.formData.producerId,
        name: ctx.formData.name || ctx.formData.propertyName,
        size: ctx.formData.size ? parseFloat(ctx.formData.size) : parseFloat(ctx.formData.totalArea),
        location: ctx.formData.location || ctx.formData.address || 'Zona Rural',
        totalArea: ctx.formData.totalArea ? parseFloat(ctx.formData.totalArea) : ctx.formData.size ? parseFloat(ctx.formData.size) : 0,
        cultivatedArea: ctx.formData.cultivatedArea ? parseFloat(ctx.formData.cultivatedArea) : null,
        plantedArea: ctx.formData.plantedArea ? parseFloat(ctx.formData.plantedArea) : null,
        mainCrops: ctx.formData.mainCrops || null,
        owner: ctx.formData.owner || producer.name,
        status: 'ACTIVE',
      },
    });
  },

  // ========================================
  // CULTURA (8 entidades)
  // ========================================

  CulturalAttendance: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.citizenId) {
      await validateTenant(ctx.tx, 'citizen', ctx.formData.citizenId, ctx.tenantId);
    }

    return ctx.tx.culturalAttendance.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        protocol: ctx.protocolNumber,
        citizenId: ctx.formData.citizenId || null,
        citizenName: ctx.formData.citizenName || 'Não informado',
        contact: ctx.formData.contact || ctx.formData.phone || 'Não informado',
        phone: ctx.formData.phone,
        email: ctx.formData.email,
        type: ctx.formData.type || 'INFORMACOES',
        status: 'PENDING',
        description: ctx.formData.description || '',
        subject: ctx.formData.subject,
        serviceId: ctx.formData.serviceId,
        source: 'portal',
        priority: ctx.formData.priority || 'MEDIUM',
      },
    });
  },

  CulturalSpaceReservation: async (ctx) => {
    return ctx.tx.culturalSpaceReservation.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        spaceId: ctx.formData.spaceId,
        spaceName: ctx.formData.spaceName || 'Espaço cultural',
        requesterName: ctx.formData.requesterName || ctx.formData.citizenName || 'Não informado',
        cpf: validateCPF(ctx.formData.cpf, 'CPF'),
        phone: ctx.formData.phone || 'Não informado',
        email: ctx.formData.email,
        eventName: ctx.formData.eventName || 'Evento',
        eventType: ctx.formData.eventType || 'OUTRO',
        description: ctx.formData.description || '',
        startDate: ctx.formData.startDate ? new Date(ctx.formData.startDate) : new Date(),
        endDate: ctx.formData.endDate ? new Date(ctx.formData.endDate) : new Date(),
        startTime: ctx.formData.startTime || '08:00',
        endTime: ctx.formData.endTime || '18:00',
        expectedPeople: ctx.formData.expectedPeople ? parseInt(ctx.formData.expectedPeople) : 0,
        needsEquipment: ctx.formData.needsEquipment || false,
        equipment: ctx.formData.equipment || null,
        status: 'PENDING',
      },
    });
  },

  CulturalWorkshopEnrollment: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.workshopId) {
      await validateTenant(ctx.tx, 'culturalWorkshop', ctx.formData.workshopId, ctx.tenantId);
    }

    return ctx.tx.culturalWorkshopEnrollment.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        workshopId: ctx.formData.workshopId,
        citizenName: ctx.formData.citizenName || ctx.formData.participantName || 'Não informado',
        cpf: validateCPF(ctx.formData.cpf, 'CPF'),
        phone: ctx.formData.phone || 'Não informado',
        email: ctx.formData.email,
        motivation: ctx.formData.motivation || ctx.formData.description || 'Interesse cultural',
        status: 'PENDING',
      },
    });
  },

  ArtisticGroup: async (ctx) => {
    return ctx.tx.artisticGroup.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || ctx.formData.groupName || 'Grupo Artístico',
        category: ctx.formData.category || ctx.formData.type || ctx.formData.artType || 'OUTRO',
        responsible: ctx.formData.responsible || ctx.formData.leaderName || 'Não informado',
        contact: ctx.formData.contact || ctx.formData.leaderPhone || ctx.formData.phone || 'Não informado',
        status: 'ACTIVE',
      },
    });
  },

  CulturalProject: async (ctx) => {
    return ctx.tx.culturalProject.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || ctx.formData.projectName || 'Projeto Cultural',
        type: ctx.formData.type || ctx.formData.projectType || 'OUTRO',
        description: ctx.formData.description || '',
        responsible: ctx.formData.responsible || ctx.formData.proponentName || 'Não informado',
        budget: ctx.formData.budget ? parseFloat(ctx.formData.budget) : null,
        status: 'ACTIVE',
      },
    });
  },

  CulturalProjectSubmission: async (ctx) => {
    return ctx.tx.culturalProjectSubmission.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        projectName: ctx.formData.projectName || 'Projeto',
        projectType: ctx.formData.projectType || 'CULTURAL',
        description: ctx.formData.projectDescription || ctx.formData.description || '',
        responsible: ctx.formData.responsible || ctx.formData.submitterName || ctx.formData.citizenName || 'Não informado',
        cpf: validateCPF(ctx.formData.cpf, 'CPF do atleta'),
        phone: ctx.formData.phone || 'Não informado',
        email: ctx.formData.email || ctx.formData.submitterEmail || 'nao@informado.com',
        budget: ctx.formData.budget ? parseFloat(ctx.formData.budget) : 0,
        targetAudience: ctx.formData.targetAudience || 'Comunidade',
        expectedImpact: ctx.formData.expectedImpact || ctx.formData.description || 'Impacto cultural',
        status: 'UNDER_REVIEW',
      },
    });
  },

  CulturalEvent: async (ctx) => {
    return ctx.tx.culturalEvent.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        title: ctx.formData.title || ctx.formData.name || ctx.formData.eventName || 'Evento Cultural',
        description: ctx.formData.description || '',
        category: ctx.formData.category || 'CULTURAL',
        type: ctx.formData.type || ctx.formData.eventType || 'OUTRO',
        startDate: ctx.formData.startDate ? new Date(ctx.formData.startDate) : new Date(),
        endDate: ctx.formData.endDate ? new Date(ctx.formData.endDate) : new Date(),
        schedule: ctx.formData.schedule || {},
        venue: ctx.formData.venue || ctx.formData.location || 'A definir',
        capacity: ctx.formData.capacity ? parseInt(ctx.formData.capacity) : 100,
        targetAudience: ctx.formData.targetAudience || 'Público geral',
        organizer: ctx.formData.organizer || {},
        contact: ctx.formData.contact || {},
        status: 'PLANNED',
      },
    });
  },

  CulturalManifestation: async (ctx) => {
    return ctx.tx.culturalManifestation.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || 'Manifestação Cultural',
        type: ctx.formData.type || 'OUTRO',
        description: ctx.formData.description || '',
        currentSituation: ctx.formData.currentSituation || ctx.formData.description || 'Em registro',
        status: 'ACTIVE',
      },
    });
  },

  // ========================================
  // ESPORTES (9 entidades)
  // ========================================

  SportsAttendance: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.citizenId) {
      await validateTenant(ctx.tx, 'citizen', ctx.formData.citizenId, ctx.tenantId);
    }

    return ctx.tx.sportsAttendance.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        protocol: ctx.protocolNumber,
        citizenId: ctx.formData.citizenId,
        citizenName: ctx.formData.citizenName || 'Não informado',
        contact: ctx.formData.contact || ctx.formData.phone || 'Não informado',
        type: ctx.formData.type || 'INSCRICAO',
        serviceType: ctx.formData.serviceType || 'informacoes',
        status: 'PENDING',
        description: ctx.formData.description || '',
        sport: ctx.formData.sport,
        sportType: ctx.formData.sportType,
        serviceId: ctx.formData.serviceId,
        priority: ctx.formData.priority || 'MEDIUM',
        followUpNeeded: ctx.formData.followUpNeeded || false,
      },
    });
  },

  SportsSchoolEnrollment: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.schoolId) {
      await validateTenant(ctx.tx, 'school', ctx.formData.schoolId, ctx.tenantId);
    }

    return ctx.tx.sportsSchoolEnrollment.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        sportsSchoolId: ctx.formData.sportsSchoolId || ctx.formData.schoolId,
        studentName: ctx.formData.studentName || ctx.formData.citizenName || 'Não informado',
        studentCpf: ctx.formData.studentCpf || ctx.formData.cpf,
        studentBirthDate: ctx.formData.studentBirthDate ? new Date(ctx.formData.studentBirthDate) : new Date('2010-01-01'),
        parentName: ctx.formData.parentName || 'Não informado',
        parentPhone: ctx.formData.parentPhone || ctx.formData.phone || 'Não informado',
        address: ctx.formData.address || 'Não informado',
        sport: ctx.formData.sport || 'Não informado',
        enrollmentDate: new Date(),
        status: 'PENDING',
      },
    });
  },

  Athlete: async (ctx) => {
    return ctx.tx.athlete.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || ctx.formData.athleteName || 'Não informado',
        birthDate: ctx.formData.birthDate ? new Date(ctx.formData.birthDate) : new Date('2000-01-01'),
        cpf: ctx.formData.cpf,
        phone: ctx.formData.phone,
        email: ctx.formData.email,
        sport: ctx.formData.sport || 'Não informado',
        category: ctx.formData.category || 'AMADOR',
        isActive: true,
      },
    });
  },

  SportsInfrastructureReservation: async (ctx) => {
    return ctx.tx.sportsInfrastructureReservation.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        infrastructureName: ctx.formData.infrastructureName || 'Espaço esportivo',
        requesterName: ctx.formData.requesterName || ctx.formData.citizenName || 'Não informado',
        requesterCpf: ctx.formData.requesterCpf || ctx.formData.cpf,
        requesterPhone: ctx.formData.requesterPhone || ctx.formData.phone || 'Não informado',
        sport: ctx.formData.sport || 'Esporte',
        purpose: ctx.formData.purpose || ctx.formData.description || 'Prática esportiva',
        date: ctx.formData.date ? new Date(ctx.formData.date) : new Date(),
        startTime: ctx.formData.startTime || '08:00',
        endTime: ctx.formData.endTime || '10:00',
        status: 'PENDING',
      },
    });
  },

  CompetitionEnrollment: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.competitionId) {
      await validateTenant(ctx.tx, 'competition', ctx.formData.competitionId, ctx.tenantId);
    }

    return ctx.tx.competitionEnrollment.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        competitionId: ctx.formData.competitionId,
        competitionName: ctx.formData.competitionName || 'Competição',
        teamName: ctx.formData.teamName || ctx.formData.participantName || 'Equipe',
        sport: ctx.formData.sport || 'Esporte',
        category: ctx.formData.category || 'LIVRE',
        ageGroup: ctx.formData.ageGroup || 'ADULTO',
        coachName: ctx.formData.coachName || 'Não informado',
        coachPhone: ctx.formData.coachPhone || ctx.formData.phone || 'Não informado',
        playersCount: ctx.formData.playersCount ? parseInt(ctx.formData.playersCount) : 1,
        playersList: ctx.formData.playersList || {},
        status: 'PENDING',
      },
    });
  },

  SportsTeam: async (ctx) => {
    return ctx.tx.sportsTeam.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || ctx.formData.teamName || 'Equipe',
        sport: ctx.formData.sport || 'Não informado',
        category: ctx.formData.category || 'AMADOR',
        gender: ctx.formData.gender,
        ageGroup: ctx.formData.ageGroup || 'ADULTO',
        coach: ctx.formData.coach || ctx.formData.coachName || 'Não informado',
        status: 'ACTIVE',
      },
    });
  },

  TournamentEnrollment: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.tournamentId) {
      await validateTenant(ctx.tx, 'tournament', ctx.formData.tournamentId, ctx.tenantId);
    }

    return ctx.tx.tournamentEnrollment.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        tournamentId: ctx.formData.tournamentId,
        tournamentName: ctx.formData.tournamentName || 'Torneio',
        participantType: ctx.formData.participantType || 'TEAM',
        teamName: ctx.formData.teamName,
        athleteName: ctx.formData.athleteName || ctx.formData.representativeName,
        athleteCpf: ctx.formData.athleteCpf || ctx.formData.cpf,
        sport: ctx.formData.sport || 'Esporte',
        category: ctx.formData.category || 'LIVRE',
        ageGroup: ctx.formData.ageGroup || 'ADULTO',
        status: 'PENDING',
      },
    });
  },

  SportsModality: async (ctx) => {
    return ctx.tx.sportsModality.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || ctx.formData.modalityName || 'Modalidade',
        description: ctx.formData.description,
        category: ctx.formData.category || 'coletivo',
        isActive: true,
      },
    });
  },

  Competition: async (ctx) => {
    return ctx.tx.competition.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || ctx.formData.competitionName || 'Competição',
        sport: ctx.formData.sport || 'Não informado',
        competitionType: ctx.formData.competitionType || ctx.formData.type || 'CAMPEONATO',
        category: ctx.formData.category || 'LIVRE',
        ageGroup: ctx.formData.ageGroup || 'ADULTO',
        startDate: ctx.formData.startDate ? new Date(ctx.formData.startDate) : new Date(),
        endDate: ctx.formData.endDate ? new Date(ctx.formData.endDate) : new Date(),
        organizer: ctx.formData.organizer || 'Secretaria de Esportes',
        status: 'PLANNED',
      },
    });
  },

  // ========================================
  // HABITAÇÃO (6 entidades)
  // ========================================

  HousingAttendance: async (ctx) => {
    return ctx.tx.housingAttendance.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        protocol: ctx.protocolNumber,
        citizenName: ctx.formData.citizenName || ctx.formData.applicantName || 'Não informado',
        citizenCPF: validateCPF(ctx.formData.citizenCPF || ctx.formData.citizenCpf || ctx.formData.cpf, 'CPF do cidadão'),
        contact: ctx.formData.contact || ctx.formData.phone || 'Não informado',
        type: ctx.formData.type || 'INFORMACAO',
        status: 'PENDING',
        description: ctx.formData.description || '',
      },
    });
  },

  HousingApplication: async (ctx) => {
    return ctx.tx.housingApplication.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        protocol: ctx.protocolNumber,
        applicantName: ctx.formData.applicantName || ctx.formData.citizenName || 'Não informado',
        applicantCpf: validateCPF(ctx.formData.applicantCpf || ctx.formData.cpf, 'CPF do solicitante'),
        contact: ctx.formData.contact || {},
        address: ctx.formData.address || 'Não informado',
        familyIncome: ctx.formData.familyIncome ? parseFloat(ctx.formData.familyIncome) : 0,
        familySize: ctx.formData.familySize ? parseInt(ctx.formData.familySize) : 1,
        housingType: ctx.formData.housingType || 'CASA',
        programType: ctx.formData.programType || ctx.formData.applicationType || 'MCMV',
        documents: ctx.formData.documents || {},
        status: 'UNDER_ANALYSIS',
      },
    });
  },

  LandRegularization: async (ctx) => {
    return ctx.tx.landRegularization.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        protocol: ctx.protocolNumber,
        applicantName: ctx.formData.applicantName || ctx.formData.ownerName || ctx.formData.citizenName || 'Não informado',
        applicantCpf: validateCPF(ctx.formData.applicantCpf || ctx.formData.ownerCpf || ctx.formData.cpf, 'CPF do solicitante'),
        contact: ctx.formData.contact || {},
        propertyAddress: ctx.formData.propertyAddress || ctx.formData.address || 'Não informado',
        propertyArea: ctx.formData.propertyArea ? parseFloat(ctx.formData.propertyArea) : 0,
        occupationType: ctx.formData.occupationType || ctx.formData.propertyType || 'RESIDENCIAL',
        status: 'UNDER_ANALYSIS',
      },
    });
  },

  RentAssistance: async (ctx) => {
    return ctx.tx.rentAssistance.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        protocol: ctx.protocolNumber,
        applicantName: ctx.formData.applicantName || ctx.formData.citizenName || 'Não informado',
        applicantCpf: validateCPF(ctx.formData.applicantCpf || ctx.formData.cpf, 'CPF do solicitante'),
        contact: ctx.formData.contact || {},
        currentAddress: ctx.formData.currentAddress || ctx.formData.address || 'Não informado',
        monthlyRent: ctx.formData.monthlyRent || ctx.formData.rentValue ? parseFloat(ctx.formData.monthlyRent || ctx.formData.rentValue) : 0,
        landlordName: ctx.formData.landlordName || 'Não informado',
        landlordContact: ctx.formData.landlordContact || {},
        familyIncome: ctx.formData.familyIncome ? parseFloat(ctx.formData.familyIncome) : 0,
        familySize: ctx.formData.familySize ? parseInt(ctx.formData.familySize) : 1,
        vulnerabilityReason: ctx.formData.vulnerabilityReason || ctx.formData.description || 'Necessidade de auxílio',
        requestedAmount: ctx.formData.requestedAmount ? parseFloat(ctx.formData.requestedAmount) : 0,
        requestedPeriod: ctx.formData.requestedPeriod ? parseInt(ctx.formData.requestedPeriod) : 6,
        documents: ctx.formData.documents || {},
        status: 'UNDER_ANALYSIS',
      },
    });
  },

  HousingUnit: async (ctx) => {
    return ctx.tx.housingUnit.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        unitCode: ctx.formData.unitCode || `UNIT-${Date.now()}`,
        unitType: ctx.formData.unitType || 'CASA',
        address: ctx.formData.address || 'Não informado',
        neighborhood: ctx.formData.neighborhood || ctx.formData.bairro || 'Centro',
        area: ctx.formData.area ? parseFloat(ctx.formData.area) : 0,
        bedrooms: ctx.formData.bedrooms ? parseInt(ctx.formData.bedrooms) : 2,
        bathrooms: ctx.formData.bathrooms ? parseInt(ctx.formData.bathrooms) : 1,
        status: 'AVAILABLE',
      },
    });
  },

  HousingRegistration: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.programId) {
      await validateTenant(ctx.tx, 'socialProgram', ctx.formData.programId, ctx.tenantId);
    }

    if (!ctx.formData.programId) {
      throw new Error('programId é obrigatório para registro habitacional');
    }

    return ctx.tx.housingRegistration.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        programId: ctx.formData.programId,
        familyHeadName: ctx.formData.familyHeadName || ctx.formData.citizenName || 'Não informado',
        familyHeadCPF: validateCPF(ctx.formData.familyHeadCPF || ctx.formData.citizenCpf || ctx.formData.cpf, 'CPF do chefe de família'),
        contact: ctx.formData.contact || ctx.formData.phone || 'Não informado',
        address: ctx.formData.address || 'Não informado',
        familyIncome: ctx.formData.familyIncome ? parseFloat(ctx.formData.familyIncome) : 0,
        familySize: ctx.formData.familySize ? parseInt(ctx.formData.familySize) : 1,
        status: 'REGISTERED',
      },
    });
  },

  // ========================================
  // MEIO AMBIENTE (7 entidades)
  // ========================================

  EnvironmentalAttendance: async (ctx) => {
    return ctx.tx.environmentalAttendance.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        protocol: ctx.protocolNumber,
        citizenName: ctx.formData.citizenName || ctx.formData.requesterName || 'Não informado',
        citizenCpf: ctx.formData.citizenCpf || ctx.formData.cpf,
        contact: ctx.formData.contact || ctx.formData.phone || 'Não informado',
        serviceType: ctx.formData.serviceType || 'CONSULTA',
        subject: ctx.formData.subject || 'Atendimento ambiental',
        description: ctx.formData.description || '',
        urgency: ctx.formData.urgency || 'NORMAL',
        status: 'PENDING',
      },
    });
  },

  EnvironmentalLicense: async (ctx) => {
    return ctx.tx.environmentalLicense.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        licenseNumber: `LIC-${Date.now()}`,
        applicantName: ctx.formData.applicantName || ctx.formData.citizenName || 'Não informado',
        applicantCpf: validateCPF(ctx.formData.applicantCpf || ctx.formData.cpf, 'CPF do solicitante'),
        licenseType: ctx.formData.licenseType || 'AMBIENTAL',
        activity: ctx.formData.activity || ctx.formData.activityType || 'Atividade não especificada',
        description: ctx.formData.description || '',
        location: ctx.formData.location || ctx.formData.address || 'Não informado',
        applicationDate: new Date(),
        status: 'UNDER_ANALYSIS',
      },
    });
  },

  EnvironmentalComplaint: async (ctx) => {
    return ctx.tx.environmentalComplaint.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        protocol: ctx.protocolNumber,
        reporterName: ctx.formData.reporterName || ctx.formData.citizenName || 'Anônimo',
        reporterPhone: ctx.formData.reporterPhone || ctx.formData.phone,
        complaintType: ctx.formData.complaintType || 'POLUICAO',
        severity: ctx.formData.severity || 'MEDIA',
        description: ctx.formData.description || '',
        location: ctx.formData.location || ctx.formData.address || 'Não informado',
        occurrenceDate: ctx.formData.occurrenceDate ? new Date(ctx.formData.occurrenceDate) : new Date(),
        reportDate: new Date(),
        status: 'OPEN',
      },
    });
  },

  EnvironmentalProgram: async (ctx) => {
    return ctx.tx.environmentalProgram.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || ctx.formData.programName || 'Programa Ambiental',
        description: ctx.formData.description || '',
        programType: ctx.formData.programType || 'EDUCACAO',
        objectives: ctx.formData.objectives || { main: 'Promover consciência ambiental' },
        targetAudience: ctx.formData.targetAudience || 'População em geral',
        startDate: ctx.formData.startDate ? new Date(ctx.formData.startDate) : new Date(),
        endDate: ctx.formData.endDate ? new Date(ctx.formData.endDate) : undefined,
        coordinator: ctx.formData.coordinator || 'A definir',
        activities: ctx.formData.activities || { planned: [] },
        status: 'ACTIVE',
      },
    });
  },

  TreeCuttingAuthorization: async (ctx) => {
    return ctx.tx.treeCuttingAuthorization.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        authorizationNumber: `AUT-${Date.now()}`,
        applicantName: ctx.formData.applicantName || ctx.formData.citizenName || 'Não informado',
        applicantCpf: validateCPF(ctx.formData.applicantCpf || ctx.formData.cpf, 'CPF do solicitante'),
        propertyAddress: ctx.formData.propertyAddress || ctx.formData.address || 'Não informado',
        requestType: ctx.formData.requestType || 'CORTE',
        treeSpecies: ctx.formData.treeSpecies || 'Não especificada',
        treeQuantity: ctx.formData.treeQuantity ? parseInt(ctx.formData.treeQuantity) : 1,
        justification: ctx.formData.justification || ctx.formData.reason || ctx.formData.description || 'Não informado',
        requestDate: new Date(),
      },
    });
  },

  EnvironmentalInspection: async (ctx) => {
    return ctx.tx.environmentalInspection.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        inspectionNumber: `INSP-${Date.now()}`,
        inspectionType: ctx.formData.inspectionType || 'ROTINA',
        subject: ctx.formData.subject || ctx.formData.description || 'Inspeção ambiental',
        location: ctx.formData.location || ctx.formData.address || 'Não informado',
        scheduledDate: ctx.formData.scheduledDate ? new Date(ctx.formData.scheduledDate) : new Date(),
        inspector: ctx.formData.inspector || 'A definir',
        status: 'SCHEDULED',
      },
    });
  },

  ProtectedArea: async (ctx) => {
    return ctx.tx.protectedArea.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || 'Área Protegida',
        areaType: ctx.formData.areaType || 'APP',
        description: ctx.formData.description || '',
        location: ctx.formData.location || ctx.formData.address || 'Não informado',
        coordinates: ctx.formData.coordinates || {},
        totalArea: ctx.formData.totalArea || ctx.formData.size ? parseFloat(ctx.formData.totalArea || ctx.formData.size) : 0,
        protectionLevel: ctx.formData.protectionLevel || 'INTEGRAL',
        legalBasis: ctx.formData.legalBasis || 'Lei Municipal',
        status: 'ACTIVE',
      },
    });
  },

  // ========================================
  // OBRAS PÚBLICAS, PLANEJAMENTO, SEGURANÇA, SERVIÇOS, TURISMO
  // Handlers genéricos para completar rapidamente
  // ========================================

  PublicWorksAttendance: async (ctx) => {
    return ctx.tx.publicWorksAttendance.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        protocol: ctx.protocolNumber,
        citizenName: ctx.formData.citizenName || ctx.formData.reporterName || 'Não informado',
        citizenCpf: ctx.formData.citizenCpf || ctx.formData.cpf,
        contact: ctx.formData.contact || { phone: ctx.formData.phone || 'Não informado' },
        serviceType: ctx.formData.serviceType || ctx.formData.problemType || 'MANUTENCAO',
        subject: ctx.formData.subject || 'Solicitação de obra',
        description: ctx.formData.description || '',
        location: ctx.formData.location || ctx.formData.address || 'Não informado',
        urgency: ctx.formData.urgency || 'NORMAL',
        status: 'PENDING',
      },
    });
  },

  UrbanPlanningAttendance: async (ctx) => {
    return ctx.tx.urbanPlanningAttendance.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        citizenName: ctx.formData.citizenName || ctx.formData.requesterName || 'Não informado',
        contactInfo: ctx.formData.contactInfo || ctx.formData.phone || ctx.formData.email,
        subject: ctx.formData.subject || 'Atendimento de planejamento urbano',
        description: ctx.formData.description || '',
        status: 'OPEN',
      },
    });
  },

  SecurityAttendance: async (ctx) => {
    return ctx.tx.securityAttendance.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        protocol: ctx.protocolNumber,
        citizenName: ctx.formData.citizenName || ctx.formData.reporterName || 'Anônimo',
        citizenCpf: ctx.formData.citizenCpf || ctx.formData.cpf,
        contact: ctx.formData.contact || ctx.formData.phone || 'Não informado',
        serviceType: ctx.formData.serviceType || ctx.formData.incidentType || 'OUTROS',
        subject: ctx.formData.subject || 'Atendimento de segurança',
        description: ctx.formData.description || '',
        location: ctx.formData.location || ctx.formData.address,
        urgency: ctx.formData.urgency || 'NORMAL',
        status: 'PENDING',
      },
    });
  },

  PublicServiceAttendance: async (ctx) => {
    return ctx.tx.publicServiceAttendance.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        citizenName: ctx.formData.citizenName || ctx.formData.requesterName || 'Não informado',
        citizenCpf: ctx.formData.citizenCpf || ctx.formData.cpf,
        citizenPhone: ctx.formData.citizenPhone || ctx.formData.phone,
        citizenEmail: ctx.formData.citizenEmail || ctx.formData.email,
        serviceType: ctx.formData.serviceType || 'OUTROS',
        requestType: ctx.formData.requestType || 'SOLICITACAO',
        description: ctx.formData.description || '',
        location: ctx.formData.location || ctx.formData.address,
        urgency: ctx.formData.urgency || 'NORMAL',
        status: 'PENDING',
      },
    });
  },

  TourismAttendance: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.citizenId) {
      await validateTenant(ctx.tx, 'citizen', ctx.formData.citizenId, ctx.tenantId);
    }

    return ctx.tx.tourismAttendance.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        protocol: ctx.protocolNumber,
        citizenId: ctx.formData.citizenId,
        visitorName: ctx.formData.visitorName || ctx.formData.citizenName || 'Visitante',
        visitorEmail: ctx.formData.visitorEmail || ctx.formData.email,
        visitorPhone: ctx.formData.visitorPhone || ctx.formData.phone,
        serviceType: ctx.formData.serviceType || 'INFORMACAO',
        subject: ctx.formData.subject || 'Informação turística',
        description: ctx.formData.description || '',
        urgency: ctx.formData.urgency || 'NORMAL',
        status: 'PENDING',
        source: 'portal',
      },
    });
  },

  // ========================================
  // SEGURANÇA PÚBLICA (10 handlers adicionados)
  // ========================================

  SecurityOccurrence: async (ctx) => {
    return ctx.tx.securityOccurrence.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        protocol: ctx.protocolNumber,
        occurrenceType: ctx.formData.occurrenceType || 'OUTROS',
        severity: ctx.formData.severity || 'MEDIA',
        reporterName: ctx.formData.reporterName || ctx.formData.citizenName || 'Anônimo',
        reporterPhone: ctx.formData.reporterPhone || ctx.formData.phone,
        location: ctx.formData.location || ctx.formData.address || 'Não informado',
        description: ctx.formData.description || '',
        occurrenceDate: ctx.formData.occurrenceDate ? new Date(ctx.formData.occurrenceDate) : new Date(),
        status: 'OPEN',
      },
    });
  },

  PatrolRequest: async (ctx) => {
    return ctx.tx.patrolRequest.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        requesterName: ctx.formData.requesterName || ctx.formData.citizenName || 'Não informado',
        requesterPhone: ctx.formData.requesterPhone || ctx.formData.phone || 'Não informado',
        requesterEmail: ctx.formData.requesterEmail || ctx.formData.email,
        requesterAddress: ctx.formData.requesterAddress || ctx.formData.address,
        type: ctx.formData.type || 'preventive',
        reason: ctx.formData.reason || ctx.formData.description || 'Solicitação de ronda',
        description: ctx.formData.description || '',
        location: ctx.formData.location || ctx.formData.address || 'Não informado',
        coordinates: ctx.formData.coordinates || {},
        area: ctx.formData.area || ctx.formData.neighborhood,
        frequency: ctx.formData.frequency || 'once',
        requestedDate: ctx.formData.requestedDate ? new Date(ctx.formData.requestedDate) : null,
        requestedTime: ctx.formData.requestedTime,
        duration: ctx.formData.duration,
        priority: ctx.formData.priority || 'NORMAL',
        observations: ctx.formData.observations,
        status: 'PENDING',
      },
    });
  },

  SecurityCameraRequest: async (ctx) => {
    return ctx.tx.cameraRequest.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        requesterName: ctx.formData.requesterName || ctx.formData.citizenName || 'Não informado',
        requesterPhone: ctx.formData.requesterPhone || ctx.formData.phone || 'Não informado',
        requesterEmail: ctx.formData.requesterEmail || ctx.formData.email,
        type: ctx.formData.type || 'installation',
        purpose: ctx.formData.purpose || ctx.formData.reason || 'Segurança',
        location: ctx.formData.location || ctx.formData.address || 'Não informado',
        coordinates: ctx.formData.coordinates || {},
        area: ctx.formData.area || ctx.formData.neighborhood,
        address: ctx.formData.address,
        cameraType: ctx.formData.cameraType || 'fixed',
        quantity: ctx.formData.quantity ? parseInt(ctx.formData.quantity) : 1,
        justification: ctx.formData.justification || ctx.formData.reason || ctx.formData.description || 'Necessidade de monitoramento',
        incidentDate: ctx.formData.incidentDate ? new Date(ctx.formData.incidentDate) : null,
        incidentTime: ctx.formData.incidentTime,
        timeRange: ctx.formData.timeRange || {},
        incidentDescription: ctx.formData.incidentDescription,
        status: 'PENDING',
      },
    });
  },

  AnonymousTip: async (ctx) => {
    // Gerar número único de denúncia
    const tipNumber = `TIP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return ctx.tx.anonymousTip.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        type: ctx.formData.type || 'other',
        category: ctx.formData.category,
        description: ctx.formData.description || '',
        location: ctx.formData.location || ctx.formData.address,
        coordinates: ctx.formData.coordinates || {},
        suspectInfo: ctx.formData.suspectInfo || {},
        vehicleInfo: ctx.formData.vehicleInfo || {},
        timeframe: ctx.formData.timeframe,
        frequency: ctx.formData.frequency || 'once',
        hasEvidence: ctx.formData.hasEvidence || false,
        evidenceType: ctx.formData.evidenceType || {},
        evidenceNotes: ctx.formData.evidenceNotes,
        isUrgent: ctx.formData.isUrgent || false,
        dangerLevel: ctx.formData.dangerLevel || ctx.formData.severity || 'medium',
        tipNumber,
        status: ctx.formData.status || 'received',
        priority: ctx.formData.priority || 'normal',
        assignedTo: ctx.formData.assignedTo,
      },
    });
  },

  CriticalPoint: async (ctx) => {
    return ctx.tx.criticalPoint.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || 'Ponto Crítico',
        location: ctx.formData.location || ctx.formData.address || 'Não informado',
        address: ctx.formData.address,
        coordinates: ctx.formData.coordinates || {},
        pointType: ctx.formData.pointType || ctx.formData.incidentType || 'crime',
        riskType: ctx.formData.riskType || {},
        riskLevel: ctx.formData.riskLevel || 'medium',
        description: ctx.formData.description || '',
        recommendations: ctx.formData.recommendations || 'Ronda preventiva',
        recommendedActions: ctx.formData.recommendedActions || {},
        patrolFrequency: ctx.formData.patrolFrequency,
        monitoringLevel: ctx.formData.monitoringLevel || 'normal',
        lastIncident: ctx.formData.lastIncident ? new Date(ctx.formData.lastIncident) : null,
        lastIncidentDate: ctx.formData.lastIncidentDate ? new Date(ctx.formData.lastIncidentDate) : null,
        incidentCount: ctx.formData.incidentCount ? parseInt(ctx.formData.incidentCount) : 0,
        isActive: ctx.formData.isActive !== false,
        observations: ctx.formData.observations,
      },
    });
  },

  SecurityAlert: async (ctx) => {
    return ctx.tx.securityAlert.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        title: ctx.formData.title || 'Alerta de Segurança',
        alertType: ctx.formData.alertType || ctx.formData.type || 'general',
        type: ctx.formData.type,
        message: ctx.formData.message || ctx.formData.description || 'Alerta de segurança',
        description: ctx.formData.description,
        location: ctx.formData.location,
        targetArea: ctx.formData.targetArea || ctx.formData.location,
        coordinates: ctx.formData.coordinates || {},
        severity: ctx.formData.severity || 'medium',
        priority: ctx.formData.priority,
        isActive: ctx.formData.isActive !== false,
        status: ctx.formData.status || 'active',
        startDate: new Date(),
        endDate: ctx.formData.endDate ? new Date(ctx.formData.endDate) : null,
        expiresAt: ctx.formData.expiresAt ? new Date(ctx.formData.expiresAt) : new Date(Date.now() + 24 * 60 * 60 * 1000),
        validUntil: ctx.formData.validUntil ? new Date(ctx.formData.validUntil) : null,
        targetAudience: ctx.formData.targetAudience,
        affectedAreas: ctx.formData.affectedAreas || {},
        channels: ctx.formData.channels || ['web'],
        acknowledgments: 0,
        createdBy: ctx.formData.createdBy || 'Sistema',
      },
    });
  },

  SecurityPatrol: async (ctx) => {
    return ctx.tx.securityPatrol.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        patrolType: ctx.formData.patrolType || 'PREVENTIVA',
        route: ctx.formData.route || ctx.formData.location || 'Rota padrão',
        officerName: ctx.formData.officerName || ctx.formData.guardName || 'A definir',
        vehicle: ctx.formData.vehicle,
        startTime: ctx.formData.startTime ? new Date(ctx.formData.startTime) : new Date(),
        endTime: ctx.formData.endTime ? new Date(ctx.formData.endTime) : null,
        observations: ctx.formData.observations || ctx.formData.description,
        status: 'SCHEDULED',
      },
    });
  },

  MunicipalGuard: async (ctx) => {
    // Gerar número de badge único
    const badgeNumber = ctx.formData.badge || `GM-${Date.now().toString().slice(-6)}`;

    return ctx.tx.municipalGuard.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || ctx.formData.fullName || 'Não informado',
        badge: badgeNumber,
        cpf: ctx.formData.cpf,
        rg: ctx.formData.rg,
        birthDate: ctx.formData.birthDate ? new Date(ctx.formData.birthDate) : null,
        phone: ctx.formData.phone || 'Não informado',
        email: ctx.formData.email,
        address: ctx.formData.address,
        position: ctx.formData.position || 'guard',
        admissionDate: ctx.formData.admissionDate || ctx.formData.hireDate ? new Date(ctx.formData.admissionDate || ctx.formData.hireDate) : new Date(),
        status: ctx.formData.status || 'active',
        specialties: ctx.formData.specialties || {},
        certifications: ctx.formData.certifications || {},
        shift: ctx.formData.shift,
        isActive: ctx.formData.isActive !== false,
      },
    });
  },

  SurveillanceSystem: async (ctx) => {
    // Gerar código único do sistema
    const systemCode = ctx.formData.systemCode || `SYS-${Date.now().toString().slice(-8)}`;

    return ctx.tx.surveillanceSystem.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        systemName: ctx.formData.systemName || 'Sistema de Vigilância',
        systemCode,
        type: ctx.formData.type || 'camera',
        location: ctx.formData.location || ctx.formData.address || 'Não informado',
        address: ctx.formData.address,
        coordinates: ctx.formData.coordinates || {},
        area: ctx.formData.area || ctx.formData.neighborhood,
        zone: ctx.formData.zone,
        manufacturer: ctx.formData.manufacturer,
        model: ctx.formData.model,
        installationDate: ctx.formData.installationDate ? new Date(ctx.formData.installationDate) : null,
        warrantyExpires: ctx.formData.warrantyExpires ? new Date(ctx.formData.warrantyExpires) : null,
        cameraType: ctx.formData.cameraType || 'fixed',
        resolution: ctx.formData.resolution,
        monitoringCenter: ctx.formData.monitoringCenter,
        technicalSpecs: ctx.formData.technicalSpecs || {},
        isActive: ctx.formData.isActive !== false,
        status: ctx.formData.status || 'active',
      },
    });
  },

  // ========================================
  // PLANEJAMENTO URBANO (8 handlers adicionados)
  // ========================================

  ProjectApproval: async (ctx) => {
    return ctx.tx.projectApproval.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        applicantName: ctx.formData.applicantName || ctx.formData.citizenName || 'Não informado',
        projectName: ctx.formData.projectName || 'Projeto',
        projectType: ctx.formData.projectType || 'construction',
        description: ctx.formData.description || ctx.formData.projectDescription || '',
        documents: ctx.formData.documents || {},
        status: 'UNDER_REVIEW',
        submissionDate: new Date(),
        approvalDate: ctx.formData.approvalDate ? new Date(ctx.formData.approvalDate) : null,
      },
    });
  },

  BuildingPermit: async (ctx) => {
    return ctx.tx.buildingPermit.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        applicantName: ctx.formData.applicantName || ctx.formData.ownerName || ctx.formData.citizenName || 'Não informado',
        applicantCpf: ctx.formData.applicantCpf || ctx.formData.cpf,
        applicantCpfCnpj: ctx.formData.applicantCpfCnpj || ctx.formData.cpf,
        applicantPhone: ctx.formData.applicantPhone || ctx.formData.phone,
        propertyAddress: ctx.formData.propertyAddress || ctx.formData.address || 'Não informado',
        property: ctx.formData.property || {},
        construction: ctx.formData.construction || {},
        permitType: ctx.formData.permitType || 'new_construction',
        requestedBy: ctx.formData.requestedBy || ctx.formData.applicantName,
        description: ctx.formData.description,
        documents: ctx.formData.documents || {},
        technicalAnalysis: ctx.formData.technicalAnalysis || {},
        permitNumber: ctx.formData.permitNumber,
        observations: ctx.formData.observations,
        status: 'PENDING',
        submissionDate: new Date(),
        approvalDate: ctx.formData.approvalDate ? new Date(ctx.formData.approvalDate) : null,
      },
    });
  },

  BusinessLicense: async (ctx) => {
    return ctx.tx.businessLicense.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        applicantName: ctx.formData.applicantName || ctx.formData.ownerName || 'Não informado',
        applicantCpfCnpj: ctx.formData.applicantCpfCnpj || ctx.formData.cpf || ctx.formData.cnpj,
        applicantPhone: ctx.formData.applicantPhone || ctx.formData.phone,
        applicantEmail: ctx.formData.applicantEmail || ctx.formData.email,
        businessName: ctx.formData.businessName || ctx.formData.companyName || 'Não informado',
        businessType: ctx.formData.businessType || 'commerce',
        businessActivity: ctx.formData.businessActivity || ctx.formData.activityType || 'retail',
        propertyAddress: ctx.formData.propertyAddress || ctx.formData.businessAddress || ctx.formData.address || 'Não informado',
        propertyNumber: ctx.formData.propertyNumber,
        neighborhood: ctx.formData.neighborhood || ctx.formData.bairro,
        licenseType: ctx.formData.licenseType || 'operation',
        licenseNumber: ctx.formData.licenseNumber,
        observations: ctx.formData.observations,
        status: 'PENDING',
        submissionDate: new Date(),
        approvalDate: ctx.formData.approvalDate ? new Date(ctx.formData.approvalDate) : null,
        validUntil: ctx.formData.validUntil ? new Date(ctx.formData.validUntil) : null,
      },
    });
  },

  CertificateRequest: async (ctx) => {
    return ctx.tx.certificateRequest.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        applicantName: ctx.formData.applicantName || ctx.formData.citizenName || 'Não informado',
        applicantCpfCnpj: ctx.formData.applicantCpfCnpj || ctx.formData.applicantCpf || ctx.formData.cpf,
        applicantPhone: ctx.formData.applicantPhone || ctx.formData.phone,
        applicantEmail: ctx.formData.applicantEmail || ctx.formData.email,
        certificateType: ctx.formData.certificateType || 'zoning',
        purpose: ctx.formData.purpose || ctx.formData.reason || ctx.formData.description,
        propertyAddress: ctx.formData.propertyAddress || ctx.formData.address,
        propertyNumber: ctx.formData.propertyNumber,
        neighborhood: ctx.formData.neighborhood || ctx.formData.bairro,
        certificateNumber: ctx.formData.certificateNumber,
        observations: ctx.formData.observations,
        documents: ctx.formData.documents || {},
        reviewedBy: ctx.formData.reviewedBy,
        status: 'PENDING',
        submissionDate: new Date(),
        issuedDate: ctx.formData.issuedDate ? new Date(ctx.formData.issuedDate) : null,
        validUntil: ctx.formData.validUntil ? new Date(ctx.formData.validUntil) : null,
      },
    });
  },

  UrbanInfraction: async (ctx) => {
    return ctx.tx.urbanInfraction.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        complainantName: ctx.formData.complainantName || ctx.formData.reporterName || ctx.formData.citizenName,
        complainantPhone: ctx.formData.complainantPhone || ctx.formData.reporterPhone || ctx.formData.phone,
        complainantEmail: ctx.formData.complainantEmail || ctx.formData.email,
        infractionType: ctx.formData.infractionType || 'irregular_construction',
        description: ctx.formData.description || '',
        propertyAddress: ctx.formData.propertyAddress || ctx.formData.address || 'Não informado',
        propertyNumber: ctx.formData.propertyNumber,
        neighborhood: ctx.formData.neighborhood || ctx.formData.bairro,
        latitude: ctx.formData.latitude ? parseFloat(ctx.formData.latitude) : null,
        longitude: ctx.formData.longitude ? parseFloat(ctx.formData.longitude) : null,
        photos: ctx.formData.photos || {},
        priority: ctx.formData.priority || ctx.formData.severity || 'MEDIUM',
        assignedTo: ctx.formData.assignedTo,
        status: 'OPEN',
        submissionDate: new Date(),
        inspectionDate: ctx.formData.inspectionDate ? new Date(ctx.formData.inspectionDate) : null,
        resolutionDate: ctx.formData.resolutionDate ? new Date(ctx.formData.resolutionDate) : null,
      },
    });
  },

  UrbanZoning: async (ctx) => {
    return ctx.tx.urbanZoning.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name,
        zoneName: ctx.formData.zoneName || 'Zona Urbana',
        code: ctx.formData.code || ctx.formData.zoneCode,
        type: ctx.formData.type,
        zoneType: ctx.formData.zoneType || 'residential',
        description: ctx.formData.description,
        regulations: ctx.formData.regulations || {},
        permitedUses: ctx.formData.permitedUses || ctx.formData.allowedUses || {},
        restrictions: ctx.formData.restrictions || {},
        coordinates: ctx.formData.coordinates || {},
        boundaries: ctx.formData.boundaries || {},
        isActive: ctx.formData.isActive !== false,
      },
    });
  },

  // ========================================
  // TURISMO (8 handlers adicionados)
  // ========================================

  LocalBusiness: async (ctx) => {
    return ctx.tx.localBusiness.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || ctx.formData.businessName || 'Não informado',
        businessType: ctx.formData.businessType || ctx.formData.type || 'commerce',
        businessInfo: ctx.formData.businessInfo || {},
        category: ctx.formData.category || 'other',
        description: ctx.formData.description || '',
        address: ctx.formData.address || 'Não informado',
        neighborhood: ctx.formData.neighborhood || ctx.formData.bairro,
        city: ctx.formData.city,
        state: ctx.formData.state,
        coordinates: ctx.formData.coordinates || {},
        contact: ctx.formData.contact || { phone: ctx.formData.phone, email: ctx.formData.email },
        openingHours: ctx.formData.openingHours || {},
        services: ctx.formData.services || {},
        amenities: ctx.formData.amenities || {},
        priceRange: ctx.formData.priceRange,
        rating: ctx.formData.rating ? parseFloat(ctx.formData.rating) : null,
        photos: ctx.formData.photos || {},
        owner: ctx.formData.owner || ctx.formData.ownerName || ctx.formData.responsibleName || 'Não informado',
        ownerCpf: ctx.formData.ownerCpf || ctx.formData.cpf,
        isActive: ctx.formData.isActive !== false,
        isTourismPartner: ctx.formData.isTourismPartner || false,
        isPartner: ctx.formData.isPartner || false,
        certifications: ctx.formData.certifications || {},
        protocol: ctx.protocolNumber,
      },
    });
  },

  TourismGuide: async (ctx) => {
    if (!ctx.formData.cpf) {
      throw new Error('CPF é obrigatório para cadastro de guia turístico');
    }

    return ctx.tx.tourismGuide.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || ctx.formData.fullName || 'Não informado',
        cpf: ctx.formData.cpf,
        rg: ctx.formData.rg,
        email: ctx.formData.email,
        phone: ctx.formData.phone || 'Não informado',
        address: ctx.formData.address,
        birthDate: ctx.formData.birthDate ? new Date(ctx.formData.birthDate) : null,
        languages: ctx.formData.languages || ['Português'],
        specialties: ctx.formData.specialties || {},
        certifications: ctx.formData.certifications || {},
        licenseNumber: ctx.formData.licenseNumber || ctx.formData.registrationNumber || `GUIDE-${Date.now().toString().slice(-8)}`,
        licenseExpiry: ctx.formData.licenseExpiry ? new Date(ctx.formData.licenseExpiry) : null,
        registrationDate: new Date(),
        experienceYears: ctx.formData.experienceYears ? parseInt(ctx.formData.experienceYears) : null,
        bio: ctx.formData.bio,
        photo: ctx.formData.photo,
        status: 'ACTIVE',
      },
    });
  },

  TourismProgram: async (ctx) => {
    return ctx.tx.tourismProgram.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || ctx.formData.programName || 'Programa Turístico',
        programType: ctx.formData.programType || 'cultural',
        type: ctx.formData.type,
        category: ctx.formData.category,
        description: ctx.formData.description || '',
        objectives: ctx.formData.objectives || {},
        targetAudience: ctx.formData.targetAudience || 'Turistas',
        activities: ctx.formData.activities || {},
        participants: ctx.formData.participants || {},
        results: ctx.formData.results || {},
        startDate: ctx.formData.startDate ? new Date(ctx.formData.startDate) : new Date(),
        endDate: ctx.formData.endDate ? new Date(ctx.formData.endDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        coordinator: ctx.formData.coordinator || 'A definir',
        budget: ctx.formData.budget ? parseFloat(ctx.formData.budget) : null,
        evaluation: ctx.formData.evaluation || {},
        status: ctx.formData.status || 'PLANNED',
        isActive: ctx.formData.isActive !== false,
      },
    });
  },

  TouristAttraction: async (ctx) => {
    return ctx.tx.touristAttraction.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || 'Atração Turística',
        type: ctx.formData.type || ctx.formData.attractionType || 'natural',
        category: ctx.formData.category,
        description: ctx.formData.description || '',
        address: ctx.formData.address || ctx.formData.location || 'Não informado',
        neighborhood: ctx.formData.neighborhood || ctx.formData.bairro,
        coordinates: ctx.formData.coordinates || {},
        openingHours: ctx.formData.openingHours,
        ticketPrice: ctx.formData.ticketPrice || ctx.formData.entryFee ? parseFloat(ctx.formData.ticketPrice || ctx.formData.entryFee) : null,
        accessibility: ctx.formData.accessibility || {},
        amenities: ctx.formData.amenities || {},
        images: ctx.formData.images || {},
        rating: ctx.formData.rating ? parseFloat(ctx.formData.rating) : null,
        featured: ctx.formData.featured || false,
        freeEntry: ctx.formData.freeEntry || false,
        protocol: ctx.protocolNumber,
        isActive: ctx.formData.isActive !== false,
      },
    });
  },

  TourismRoute: async (ctx) => {
    return ctx.tx.tourismRoute.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || ctx.formData.routeName || 'Rota Turística',
        routeType: ctx.formData.routeType || 'cultural',
        description: ctx.formData.description || '',
        duration: ctx.formData.duration || '2 horas',
        difficulty: ctx.formData.difficulty || 'easy',
        distance: ctx.formData.distance ? parseFloat(ctx.formData.distance) : null,
        startPoint: ctx.formData.startPoint || 'Centro',
        endPoint: ctx.formData.endPoint || 'Centro',
        waypoints: ctx.formData.waypoints || {},
        attractions: ctx.formData.attractions || {},
        services: ctx.formData.services || {},
        bestSeason: ctx.formData.bestSeason || {},
        recommendations: ctx.formData.recommendations,
        warnings: ctx.formData.warnings,
        accessibility: ctx.formData.accessibility || {},
        photos: ctx.formData.photos || {},
        mapData: ctx.formData.mapData || {},
        featured: ctx.formData.featured || false,
        isActive: ctx.formData.isActive !== false,
      },
    });
  },

  TourismEvent: async (ctx) => {
    return ctx.tx.tourismEvent.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || ctx.formData.eventName || 'Evento Turístico',
        eventType: ctx.formData.eventType || 'cultural',
        category: ctx.formData.category,
        description: ctx.formData.description || '',
        venue: ctx.formData.venue || ctx.formData.location || 'A definir',
        address: ctx.formData.address || 'A definir',
        coordinates: ctx.formData.coordinates || {},
        startDate: ctx.formData.startDate ? new Date(ctx.formData.startDate) : new Date(),
        endDate: ctx.formData.endDate ? new Date(ctx.formData.endDate) : new Date(),
        startTime: ctx.formData.startTime,
        endTime: ctx.formData.endTime,
        duration: ctx.formData.duration,
        organizer: ctx.formData.organizer || 'Secretaria de Turismo',
        organizerContact: ctx.formData.organizerContact || ctx.formData.contactInfo || {},
        capacity: ctx.formData.capacity ? parseInt(ctx.formData.capacity) : null,
        registeredCount: 0,
        ticketPrice: ctx.formData.ticketPrice ? parseFloat(ctx.formData.ticketPrice) : null,
        featured: ctx.formData.featured || false,
        program: ctx.formData.program || {},
        accessibility: ctx.formData.accessibility || {},
        amenities: ctx.formData.amenities || {},
        status: ctx.formData.status || 'PLANNED',
      },
    });
  },

  // ========================================
  // OUTROS MÓDULOS (4 handlers adicionados)
  // ========================================

  RoadRepairRequest: async (ctx) => {
    return ctx.tx.roadRepairRequest.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        protocol: ctx.protocolNumber,
        citizenName: ctx.formData.citizenName || ctx.formData.reporterName || 'Não informado',
        citizenCpf: ctx.formData.citizenCpf || ctx.formData.cpf,
        contact: ctx.formData.contact || { phone: ctx.formData.phone || 'Não informado' },
        roadName: ctx.formData.roadName || ctx.formData.street || 'Via pública',
        location: ctx.formData.location || ctx.formData.address || 'Não informado',
        coordinates: ctx.formData.coordinates || {},
        problemType: ctx.formData.problemType || 'pothole',
        severity: ctx.formData.severity || 'MEDIUM',
        description: ctx.formData.description || '',
        photos: ctx.formData.photos || {},
        affectedArea: ctx.formData.affectedArea ? parseFloat(ctx.formData.affectedArea) : null,
        trafficImpact: ctx.formData.trafficImpact,
        urgency: ctx.formData.urgency || 'NORMAL',
        estimatedCost: ctx.formData.estimatedCost ? parseFloat(ctx.formData.estimatedCost) : null,
        priority: ctx.formData.priority || 'MEDIUM',
        assignedTeam: ctx.formData.assignedTeam,
        scheduledDate: ctx.formData.scheduledDate ? new Date(ctx.formData.scheduledDate) : null,
        completionDate: ctx.formData.completionDate ? new Date(ctx.formData.completionDate) : null,
        materialsUsed: ctx.formData.materialsUsed || {},
        status: 'PENDING',
      },
    });
  },

  TechnicalInspection: async (ctx) => {
    return ctx.tx.technicalInspection.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        protocol: ctx.protocolNumber,
        requestorName: ctx.formData.requestorName || ctx.formData.citizenName || 'Não informado',
        requestorCpf: ctx.formData.requestorCpf || ctx.formData.cpf,
        contact: ctx.formData.contact || { phone: ctx.formData.phone || 'Não informado' },
        inspectionType: ctx.formData.inspectionType || 'construction',
        subject: ctx.formData.subject || ctx.formData.purpose || 'Vistoria técnica',
        description: ctx.formData.description || '',
        location: ctx.formData.location || ctx.formData.address || 'Não informado',
        coordinates: ctx.formData.coordinates || {},
        propertyType: ctx.formData.propertyType,
        constructionStage: ctx.formData.constructionStage,
        documents: ctx.formData.documents || {},
        photos: ctx.formData.photos || {},
        urgency: ctx.formData.urgency || 'NORMAL',
        scheduledDate: ctx.formData.scheduledDate ? new Date(ctx.formData.scheduledDate) : null,
        inspectionDate: ctx.formData.inspectionDate ? new Date(ctx.formData.inspectionDate) : null,
        inspector: ctx.formData.inspector,
        findings: ctx.formData.findings || {},
        status: 'PENDING',
      },
    });
  },

  PublicWork: async (ctx) => {
    return ctx.tx.publicWork.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        title: ctx.formData.title || ctx.formData.name || 'Obra Pública',
        description: ctx.formData.description || '',
        workType: ctx.formData.workType || 'infrastructure',
        location: ctx.formData.location || ctx.formData.address || 'Não informado',
        coordinates: ctx.formData.coordinates || {},
        contractor: ctx.formData.contractor,
        startDate: ctx.formData.startDate ? new Date(ctx.formData.startDate) : null,
        endDate: ctx.formData.endDate || ctx.formData.expectedEndDate ? new Date(ctx.formData.endDate || ctx.formData.expectedEndDate) : null,
        plannedBudget: ctx.formData.plannedBudget || ctx.formData.estimatedCost ? parseFloat(ctx.formData.plannedBudget || ctx.formData.estimatedCost) : null,
        actualBudget: ctx.formData.actualBudget ? parseFloat(ctx.formData.actualBudget) : null,
        budget: ctx.formData.budget || {},
        progressPercent: ctx.formData.progressPercent ? parseInt(ctx.formData.progressPercent) : 0,
        priority: ctx.formData.priority || 'MEDIUM',
        beneficiaries: ctx.formData.beneficiaries ? parseInt(ctx.formData.beneficiaries) : null,
        photos: ctx.formData.photos || {},
        documents: ctx.formData.documents || {},
        status: ctx.formData.status || 'PLANNED',
      },
    });
  },

  WorkInspection: async (ctx) => {
    return ctx.tx.workInspection.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        protocol: ctx.protocolNumber,
        workName: ctx.formData.workName || 'Obra',
        workType: ctx.formData.workType || 'infrastructure',
        contractor: ctx.formData.contractor || 'A definir',
        location: ctx.formData.location || ctx.formData.address || 'Não informado',
        coordinates: ctx.formData.coordinates || {},
        inspectionDate: ctx.formData.inspectionDate ? new Date(ctx.formData.inspectionDate) : new Date(),
        inspector: ctx.formData.inspector || 'Engenheiro fiscal',
        inspectionType: ctx.formData.inspectionType || 'routine',
        findings: ctx.formData.findings || {},
        compliance: ctx.formData.compliance || 'PENDING',
        violations: ctx.formData.violations || {},
        recommendations: ctx.formData.recommendations || {},
        photos: ctx.formData.photos || {},
        documents: ctx.formData.documents || {},
        deadline: ctx.formData.deadline ? new Date(ctx.formData.deadline) : null,
        followUpDate: ctx.formData.followUpDate ? new Date(ctx.formData.followUpDate) : null,
        status: ctx.formData.status || 'SCHEDULED',
        observations: ctx.formData.observations || ctx.formData.description,
      },
    });
  },

  // ========================================
  // SERVIÇOS PÚBLICOS (7 handlers adicionados)
  // ========================================

  TreePruningRequest: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.citizenId) {
      await validateTenant(ctx.tx, 'citizen', ctx.formData.citizenId, ctx.tenantId);
    }

    return ctx.tx.treePruningRequest.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        citizenId: ctx.formData.citizenId,
        requestorName: ctx.formData.requestorName || ctx.formData.citizenName || 'Não informado',
        requestorCpf: ctx.formData.requestorCpf || ctx.formData.cpf,
        contact: ctx.formData.contact || { phone: ctx.formData.phone || 'Não informado' },
        location: ctx.formData.location || ctx.formData.address || 'Não informado',
        address: ctx.formData.address || 'Não informado',
        coordinates: ctx.formData.coordinates || {},
        treeSpecies: ctx.formData.treeSpecies,
        treeHeight: ctx.formData.treeHeight ? parseFloat(ctx.formData.treeHeight) : null,
        trunkDiameter: ctx.formData.trunkDiameter ? parseFloat(ctx.formData.trunkDiameter) : null,
        pruningType: ctx.formData.pruningType || 'light',
        reason: ctx.formData.reason || ctx.formData.description || 'Necessidade de poda',
        description: ctx.formData.description || '',
        photos: ctx.formData.photos || {},
        riskLevel: ctx.formData.riskLevel,
        urgency: ctx.formData.urgency || 'NORMAL',
        requestDate: new Date(),
        preferredDate: ctx.formData.preferredDate ? new Date(ctx.formData.preferredDate) : null,
        scheduledDate: ctx.formData.scheduledDate ? new Date(ctx.formData.scheduledDate) : null,
        completionDate: ctx.formData.completionDate ? new Date(ctx.formData.completionDate) : null,
        assignedTeam: ctx.formData.assignedTeam,
        technicalVisit: ctx.formData.technicalVisit || false,
        visitDate: ctx.formData.visitDate ? new Date(ctx.formData.visitDate) : null,
        approved: ctx.formData.approved,
        approvalNotes: ctx.formData.approvalNotes,
        workDetails: ctx.formData.workDetails,
        equipmentUsed: ctx.formData.equipmentUsed || {},
        materialRemoved: ctx.formData.materialRemoved ? parseFloat(ctx.formData.materialRemoved) : null,
        workHours: ctx.formData.workHours ? parseFloat(ctx.formData.workHours) : null,
        observations: ctx.formData.observations,
        satisfaction: ctx.formData.satisfaction ? parseInt(ctx.formData.satisfaction) : null,
        status: 'REQUESTED',
      },
    });
  },

  StreetLighting: async (ctx) => {
    // Gerar código único do ponto
    const pointCode = ctx.formData.pointCode || `LP-${Date.now().toString().slice(-10)}`;

    return ctx.tx.streetLighting.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        pointCode,
        streetName: ctx.formData.streetName || ctx.formData.street || 'Não informado',
        neighborhood: ctx.formData.neighborhood || ctx.formData.bairro || 'Centro',
        coordinates: ctx.formData.coordinates || {},
        poleType: ctx.formData.poleType || 'CONCRETO',
        lampType: ctx.formData.lampType || 'LED',
        power: ctx.formData.power ? parseInt(ctx.formData.power) : 100,
        height: ctx.formData.height ? parseFloat(ctx.formData.height) : 8.0,
        installDate: ctx.formData.installDate ? new Date(ctx.formData.installDate) : null,
        lastMaintenance: ctx.formData.lastMaintenance ? new Date(ctx.formData.lastMaintenance) : null,
        nextMaintenance: ctx.formData.nextMaintenance ? new Date(ctx.formData.nextMaintenance) : null,
        condition: ctx.formData.condition || 'GOOD',
        status: 'ACTIVE',
        issues: ctx.formData.issues || {},
        maintenanceHistory: ctx.formData.maintenanceHistory || {},
        energyConsumption: ctx.formData.energyConsumption ? parseFloat(ctx.formData.energyConsumption) : null,
        isActive: ctx.formData.isActive !== false,
      },
    });
  },

  UrbanCleaning: async (ctx) => {
    return ctx.tx.urbanCleaning.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        serviceType: ctx.formData.serviceType || 'general_cleaning',
        location: ctx.formData.location || ctx.formData.address || 'Não informado',
        address: ctx.formData.address || 'Não informado',
        neighborhood: ctx.formData.neighborhood || ctx.formData.bairro,
        coordinates: ctx.formData.coordinates || {},
        description: ctx.formData.description || '',
        areaSize: ctx.formData.areaSize ? parseFloat(ctx.formData.areaSize) : null,
        cleaningType: ctx.formData.cleaningType || 'sweeping',
        frequency: ctx.formData.frequency,
        requestDate: new Date(),
        scheduledDate: ctx.formData.scheduledDate ? new Date(ctx.formData.scheduledDate) : null,
        completionDate: ctx.formData.completionDate ? new Date(ctx.formData.completionDate) : null,
        assignedTeam: ctx.formData.assignedTeam,
        teamLeader: ctx.formData.teamLeader,
        workers: ctx.formData.workers || {},
        equipmentUsed: ctx.formData.equipmentUsed || {},
        vehiclesUsed: ctx.formData.vehiclesUsed || {},
        wasteCollected: ctx.formData.wasteCollected ? parseFloat(ctx.formData.wasteCollected) : null,
        wasteType: ctx.formData.wasteType || {},
        photos: ctx.formData.photos || {},
        priority: ctx.formData.priority || 'NORMAL',
        cost: ctx.formData.cost ? parseFloat(ctx.formData.cost) : null,
        workHours: ctx.formData.workHours ? parseFloat(ctx.formData.workHours) : null,
        observations: ctx.formData.observations,
        satisfaction: ctx.formData.satisfaction || ctx.formData.qualityRating ? parseInt(ctx.formData.satisfaction || ctx.formData.qualityRating) : null,
        status: 'SCHEDULED',
      },
    });
  },

  SpecialCollection: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.citizenId) {
      await validateTenant(ctx.tx, 'citizen', ctx.formData.citizenId, ctx.tenantId);
    }

    return ctx.tx.specialCollection.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        citizenId: ctx.formData.citizenId,
        collectionType: ctx.formData.collectionType || 'debris',
        requestorName: ctx.formData.requestorName || ctx.formData.citizenName || 'Não informado',
        requestorCpf: ctx.formData.requestorCpf || ctx.formData.cpf,
        contact: ctx.formData.contact || { phone: ctx.formData.phone || 'Não informado' },
        address: ctx.formData.address || 'Não informado',
        coordinates: ctx.formData.coordinates || {},
        description: ctx.formData.description || '',
        estimatedVolume: ctx.formData.estimatedVolume ? parseFloat(ctx.formData.estimatedVolume) : null,
        quantity: ctx.formData.quantity ? parseInt(ctx.formData.quantity) : null,
        unit: ctx.formData.unit,
        photos: ctx.formData.photos || {},
        requestDate: new Date(),
        preferredDate: ctx.formData.preferredDate ? new Date(ctx.formData.preferredDate) : null,
        scheduledDate: ctx.formData.scheduledDate ? new Date(ctx.formData.scheduledDate) : null,
        timeSlot: ctx.formData.timeSlot,
        collectionDate: ctx.formData.collectionDate ? new Date(ctx.formData.collectionDate) : null,
        teamAssigned: ctx.formData.teamAssigned || ctx.formData.assignedTeam,
        vehicle: ctx.formData.vehicle,
        actualVolume: ctx.formData.actualVolume || ctx.formData.volumeCollected ? parseFloat(ctx.formData.actualVolume || ctx.formData.volumeCollected) : null,
        destination: ctx.formData.destination || ctx.formData.disposalLocation,
        cost: ctx.formData.cost || ctx.formData.fees ? parseFloat(ctx.formData.cost || ctx.formData.fees) : null,
        observations: ctx.formData.observations,
        satisfaction: ctx.formData.satisfaction ? parseInt(ctx.formData.satisfaction) : null,
        status: 'REQUESTED',
      },
    });
  },

  WeedingRequest: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.citizenId) {
      await validateTenant(ctx.tx, 'citizen', ctx.formData.citizenId, ctx.tenantId);
    }

    return ctx.tx.weedingRequest.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        citizenId: ctx.formData.citizenId,
        requestorName: ctx.formData.requestorName || ctx.formData.citizenName || 'Não informado',
        requestorCpf: ctx.formData.requestorCpf || ctx.formData.cpf,
        contact: ctx.formData.contact || { phone: ctx.formData.phone || 'Não informado' },
        location: ctx.formData.location || ctx.formData.address || 'Não informado',
        address: ctx.formData.address || 'Não informado',
        coordinates: ctx.formData.coordinates || {},
        areaSize: ctx.formData.areaSize ? parseFloat(ctx.formData.areaSize) : null,
        terrainType: ctx.formData.terrainType || 'flat',
        accessType: ctx.formData.accessType || 'easy',
        description: ctx.formData.description || '',
        photos: ctx.formData.photos || {},
        urgency: ctx.formData.urgency || 'NORMAL',
        requestDate: new Date(),
        preferredDate: ctx.formData.preferredDate ? new Date(ctx.formData.preferredDate) : null,
        scheduledDate: ctx.formData.scheduledDate ? new Date(ctx.formData.scheduledDate) : null,
        completionDate: ctx.formData.completionDate ? new Date(ctx.formData.completionDate) : null,
        assignedTeam: ctx.formData.assignedTeam,
        workDetails: ctx.formData.workDetails,
        equipmentUsed: ctx.formData.equipmentUsed || {},
        workHours: ctx.formData.workHours || ctx.formData.hoursWorked ? parseFloat(ctx.formData.workHours || ctx.formData.hoursWorked) : null,
        observations: ctx.formData.observations,
        satisfaction: ctx.formData.satisfaction ? parseInt(ctx.formData.satisfaction) : null,
        status: 'REQUESTED',
      },
    });
  },

  DrainageRequest: async (ctx) => {
    // Validações de tenant para relacionamentos
    if (ctx.formData.citizenId) {
      await validateTenant(ctx.tx, 'citizen', ctx.formData.citizenId, ctx.tenantId);
    }

    return ctx.tx.drainageRequest.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        citizenId: ctx.formData.citizenId,
        requestorName: ctx.formData.requestorName || ctx.formData.citizenName || 'Não informado',
        requestorCpf: ctx.formData.requestorCpf || ctx.formData.cpf,
        contact: ctx.formData.contact || { phone: ctx.formData.phone || 'Não informado' },
        location: ctx.formData.location || ctx.formData.address || 'Não informado',
        address: ctx.formData.address || 'Não informado',
        coordinates: ctx.formData.coordinates || {},
        problemType: ctx.formData.problemType || 'flooding',
        severity: ctx.formData.severity || 'medium',
        description: ctx.formData.description || '',
        photos: ctx.formData.photos || {},
        waterLevel: ctx.formData.waterLevel,
        affectedArea: ctx.formData.affectedArea ? parseFloat(ctx.formData.affectedArea) : null,
        urgency: ctx.formData.urgency || 'HIGH',
        requestDate: new Date(),
        preferredDate: ctx.formData.preferredDate ? new Date(ctx.formData.preferredDate) : null,
        scheduledDate: ctx.formData.scheduledDate ? new Date(ctx.formData.scheduledDate) : null,
        completionDate: ctx.formData.completionDate ? new Date(ctx.formData.completionDate) : null,
        assignedTeam: ctx.formData.assignedTeam,
        workDetails: ctx.formData.workDetails || ctx.formData.actionsTaken,
        equipmentUsed: ctx.formData.equipmentUsed || {},
        materialsUsed: ctx.formData.materialsUsed || {},
        workHours: ctx.formData.workHours ? parseFloat(ctx.formData.workHours) : null,
        observations: ctx.formData.observations,
        satisfaction: ctx.formData.satisfaction ? parseInt(ctx.formData.satisfaction) : null,
        status: 'REQUESTED',
      },
    });
  },

  ServiceTeam: async (ctx) => {
    // Gerar código único da equipe
    const teamCode = ctx.formData.teamCode || `TEAM-${Date.now().toString().slice(-8)}`;

    return ctx.tx.serviceTeam.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        teamCode,
        teamName: ctx.formData.teamName || 'Equipe de Serviços',
        teamType: ctx.formData.teamType || 'cleaning',
        department: ctx.formData.department || 'Serviços Públicos',
        leader: ctx.formData.leader || ctx.formData.leaderName || 'A definir',
        leaderContact: ctx.formData.leaderContact || {},
        members: ctx.formData.members || {},
        totalMembers: ctx.formData.totalMembers ? parseInt(ctx.formData.totalMembers) : 0,
        specialization: ctx.formData.specialization,
        workShift: ctx.formData.workShift || 'day',
        shiftStart: ctx.formData.shiftStart || '08:00',
        shiftEnd: ctx.formData.shiftEnd || '17:00',
        workDays: ctx.formData.workDays || ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        breakTime: ctx.formData.breakTime || {},
        equipment: ctx.formData.equipment || {},
        vehicles: ctx.formData.vehicles || {},
        workArea: ctx.formData.workArea,
        coverage: ctx.formData.coverage || {},
        productivity: ctx.formData.productivity || {},
        performance: ctx.formData.performance || ctx.formData.safetyRecord || {},
        hireDate: ctx.formData.hireDate ? new Date(ctx.formData.hireDate) : null,
        observations: ctx.formData.observations,
        status: 'ACTIVE',
        isActive: ctx.formData.isActive !== false,
      },
    });
  },

  // ========================================
  // AGRICULTURA (1 handler adicional)
  // ========================================

  RuralProgram: async (ctx) => {
    return ctx.tx.ruralProgram.create({
      data: {
        tenantId: ctx.tenantId,
        protocolId: ctx.protocolId,
        name: ctx.formData.name || ctx.formData.programName || 'Programa Rural',
        programType: ctx.formData.programType || 'INCENTIVO',
        description: ctx.formData.description || '',
        objectives: ctx.formData.objectives || {},
        targetAudience: ctx.formData.targetAudience || 'Produtores rurais',
        requirements: ctx.formData.requirements || {},
        benefits: ctx.formData.benefits || {},
        startDate: ctx.formData.startDate ? new Date(ctx.formData.startDate) : new Date(),
        endDate: ctx.formData.endDate ? new Date(ctx.formData.endDate) : null,
        budget: ctx.formData.budget ? parseFloat(ctx.formData.budget) : null,
        coordinator: ctx.formData.coordinator || 'A definir',
        maxParticipants: ctx.formData.maxParticipants ? parseInt(ctx.formData.maxParticipants) : null,
        currentParticipants: 0,
        applicationPeriod: ctx.formData.applicationPeriod || {},
        selectionCriteria: ctx.formData.selectionCriteria || {},
        partners: ctx.formData.partners || {},
        results: ctx.formData.results || {},
        status: 'ACTIVE',
      },
    });
  },
};
