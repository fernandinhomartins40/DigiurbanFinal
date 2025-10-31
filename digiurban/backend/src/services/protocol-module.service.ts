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
      // Converter attachments de array para string JSON se necessário
      const attachmentsData = rest.attachments
        ? (Array.isArray(rest.attachments) ? JSON.stringify(rest.attachments) : rest.attachments)
        : undefined;

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
          latitude: rest.latitude,
          longitude: rest.longitude,
          address: rest.address,
          attachments: attachmentsData,
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
      await tx.protocolHistorySimplified.create({
        data: {
          protocolId: protocol.id,
          action: 'CREATED',
          comment: 'Protocolo criado',
          newStatus: ProtocolStatus.VINCULADO,
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
      // AGRICULTURA - RuralProducer (Produtor Rural)
      RuralProducer: async () => {
        if (!formData.citizenId) {
          throw new Error('citizenId é obrigatório para cadastro de produtor rural');
        }

        const citizen = await tx.citizen.findFirst({
          where: {
            id: formData.citizenId,
            tenantId
          }
        });

        if (!citizen) {
          throw new Error('Cidadão não encontrado ou não pertence a este município');
        }

        const existingProducer = await tx.ruralProducer.findFirst({
          where: {
            tenantId,
            citizenId: formData.citizenId
          }
        });

        if (existingProducer) {
          throw new Error('Este cidadão já está cadastrado como produtor rural');
        }

        const mainCrop = formData.mainCrop || formData.principaisCulturas || formData.principaisProducoes || 'Não informado';
        const productionType = formData.productionType || formData.tipoProducao || formData.tipoProdutor || 'Agricultor Familiar';

        return tx.ruralProducer.create({
          data: {
            tenantId,
            citizenId: formData.citizenId,
            protocolId,
            name: formData.name || formData.nome || formData.producerName || formData.nomeProdutor || citizen.name,
            document: formData.document || formData.cpf || formData.producerCpf || citizen.cpf,
            email: formData.email || citizen.email,
            phone: formData.phone || formData.telefone || formData.producerPhone || citizen.phone || '',
            address: formData.address || formData.endereco || JSON.stringify(citizen.address),
            productionType,
            mainCrop,
            status: 'PENDING_APPROVAL',
            isActive: false,
          },
        });
      },

      RuralProperty: () => tx.ruralProperty.create({
        data: {
          tenantId,
          protocolId,
          name: formData.propertyName || formData.name,
          producerId: formData.producerId,
          size: formData.size ? parseFloat(formData.size) : 0,
          location: formData.location || formData.propertyLocation,
          plantedArea: formData.plantedArea ? parseFloat(formData.plantedArea) : null,
          mainCrops: formData.mainCrops ,
          status: 'PENDING_APPROVAL',
        },
      }),

      RuralProgram: () => tx.ruralProgram.create({
        data: {
          tenantId,
          protocolId,
          name: formData.name || formData.programName,
          programType: formData.programType || 'other',
          description: formData.description || '',
          objectives: formData.objectives || {},
          targetAudience: formData.targetAudience || 'Produtores Rurais',
          requirements: formData.requirements || {},
          benefits: formData.benefits || {},
          startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
          endDate: formData.endDate ? new Date(formData.endDate) : null,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          coordinator: formData.coordinator || 'A definir',
          maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
          currentParticipants: 0,
          status: 'PENDING_APPROVAL',
        },
      }),

      // Demais módulos omitidos por brevidade...
    };

    const creator = entityMap[entityName];
    if (!creator) {
      throw new Error(`Entidade ${entityName} não mapeada`);
    }

    return creator();
  }

  /**
   * Aprovar protocolo e ativar entidade do módulo
   */
  async approveProtocol(input: ApproveProtocolInput) {
    const { protocolId, userId, comment, additionalData } = input;

    return prisma.$transaction(async (tx) => {
      const protocol = await tx.protocolSimplified.findUnique({
        where: { id: protocolId },
      });

      if (!protocol) {
        throw new Error('Protocolo não encontrado');
      }

      // Atualizar status para CONCLUIDO (aprovação)
      await tx.protocolSimplified.update({
        where: { id: protocolId },
        data: {
          status: ProtocolStatus.CONCLUIDO,
          concludedAt: new Date(),
        },
      });

      // Ativar entidade do módulo
      if (protocol.moduleType) {
        const entityName = getModuleEntity(protocol.moduleType);
        if (entityName) {
          await this.activateModuleEntity(tx, entityName, protocolId);
        }
      }

      // Criar histórico
      await tx.protocolHistorySimplified.create({
        data: {
          protocolId,
          action: 'APPROVED',
          comment: comment || 'Protocolo aprovado e concluído',
          newStatus: ProtocolStatus.CONCLUIDO,
          userId,
        },
      });

      return protocol;
    });
  }

  /**
   * Rejeitar protocolo
   */
  async rejectProtocol(input: RejectProtocolInput) {
    const { protocolId, userId, reason } = input;

    return prisma.$transaction(async (tx) => {
      const protocol = await tx.protocolSimplified.findUnique({
        where: { id: protocolId },
      });

      if (!protocol) {
        throw new Error('Protocolo não encontrado');
      }

      // Usar CANCELADO para rejeição
      await tx.protocolSimplified.update({
        where: { id: protocolId },
        data: {
          status: ProtocolStatus.CANCELADO,
        },
      });

      // Criar histórico de rejeição
      await tx.protocolHistorySimplified.create({
        data: {
          protocolId,
          action: 'REJECTED',
          comment: reason,
          newStatus: ProtocolStatus.CANCELADO,
          userId,
        },
      });

      return protocol;
    });
  }

  /**
   * Ativar entidade do módulo após aprovação
   */
  private async activateModuleEntity(
    tx: Prisma.TransactionClient,
    entityName: string,
    protocolId: string
  ) {
    const entityMap: Record<string, any> = {
      RuralProducer: () => tx.ruralProducer.updateMany({
        where: { protocolId },
        data: { status: 'ACTIVE', isActive: true },
      }),
      // Demais módulos...
    };

    const activator = entityMap[entityName];
    if (activator) {
      return activator();
    }
  }

  /**
   * Buscar protocolos pendentes por tipo de módulo
   */
  async getPendingProtocolsByModule(
    tenantId: string,
    moduleType: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;

    const [protocols, total] = await Promise.all([
      prisma.protocolSimplified.findMany({
        where: {
          tenantId,
          moduleType,
          status: ProtocolStatus.VINCULADO,
        },
        include: {
          citizen: {
            select: {
              id: true,
              name: true,
              cpf: true,
              email: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
            },
          },
          department: {
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
          status: ProtocolStatus.VINCULADO,
        },
      }),
    ]);

    return {
      protocols,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

export const protocolModuleService = new ProtocolModuleService();
