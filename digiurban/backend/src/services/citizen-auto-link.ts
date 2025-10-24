/**
 * SERVIÇO DE AUTO-VINCULAÇÃO INTELIGENTE DE CIDADÃOS
 *
 * Este serviço é responsável por vincular automaticamente cidadãos do UNASSIGNED_POOL
 * aos tenants corretos baseado na cidade de cadastro.
 *
 * Pode ser chamado:
 * 1. Manualmente pelo Super Admin (botão de auto-vinculação)
 * 2. Automaticamente após a criação de um novo tenant
 */

import { PrismaClient, Prisma } from '@prisma/client';
import { UNASSIGNED_POOL_ID } from '../config/tenants';

const prisma = new PrismaClient();

interface AutoLinkResult {
  success: boolean;
  message: string;
  summary: {
    totalProcessed: number;
    linked: number;
    notLinked: number;
  };
  details: {
    linked: Array<{
      citizenId: string;
      name: string;
      email: string;
      linkedTo: {
        tenantId: string;
        tenantName: string;
        municipio: string;
        uf: string;
      };
    }>;
    notLinked: Array<{
      citizenId: string;
      name: string;
      city?: string;
      state?: string;
      reason: string;
    }>;
  };
}

/**
 * Vincula automaticamente cidadãos do UNASSIGNED_POOL aos tenants corretos
 *
 * @param tenantId - Opcional: Se fornecido, vincula apenas cidadãos desta cidade ao tenant específico
 * @returns Resultado da operação com estatísticas
 */
export async function autoLinkCitizens(tenantId?: string): Promise<AutoLinkResult> {
  const linked: AutoLinkResult['details']['linked'] = [];
  const notLinked: AutoLinkResult['details']['notLinked'] = [];

  try {
    // 1. Buscar cidadãos no UNASSIGNED_POOL com endereço
    const unlinkedCitizens = await prisma.citizen.findMany({
      where: {
        tenantId: UNASSIGNED_POOL_ID,
        address: {
          not: Prisma.JsonNull
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true
      }
    });

    if (unlinkedCitizens.length === 0) {
      return {
        success: true,
        message: 'Nenhum cidadão aguardando vinculação',
        summary: {
          totalProcessed: 0,
          linked: 0,
          notLinked: 0
        },
        details: { linked: [], notLinked: [] }
      };
    }

    // 2. Buscar tenants ativos (ou tenant específico se fornecido)
    const tenantWhere: any = {
      AND: [
        { id: { not: UNASSIGNED_POOL_ID } },
        { nomeMunicipio: { not: null } },
        { status: { in: ['ACTIVE', 'TRIAL'] } }
      ]
    };

    if (tenantId) {
      tenantWhere.AND.push({ id: tenantId });
    }

    const tenants = await prisma.tenant.findMany({
      where: tenantWhere,
      select: {
        id: true,
        name: true,
        nomeMunicipio: true,
        ufMunicipio: true
      }
    });

    // 3. Criar mapa de municípios -> tenantId
    const municipioMap = new Map<string, typeof tenants[0]>();
    tenants.forEach(tenant => {
      if (tenant.nomeMunicipio && tenant.ufMunicipio) {
        const key = `${tenant.nomeMunicipio.toLowerCase()}-${tenant.ufMunicipio.toLowerCase()}`;
        municipioMap.set(key, tenant);
      }
    });

    // 4. Processar cada cidadão
    for (const citizen of unlinkedCitizens) {
      try {
        const address = citizen.address as any;

        // Validar endereço
        if (!address || !address.city || !address.state) {
          notLinked.push({
            citizenId: citizen.id,
            name: citizen.name,
            reason: 'Endereço incompleto (falta cidade ou estado)'
          });
          continue;
        }

        // Buscar tenant correspondente
        const cityKey = `${address.city.toLowerCase()}-${address.state.toLowerCase()}`;
        const matchingTenant = municipioMap.get(cityKey);

        if (matchingTenant) {
          // Vincular cidadão ao tenant
          await prisma.citizen.update({
            where: { id: citizen.id },
            data: { tenantId: matchingTenant.id }
          });

          linked.push({
            citizenId: citizen.id,
            name: citizen.name,
            email: citizen.email,
            linkedTo: {
              tenantId: matchingTenant.id,
              tenantName: matchingTenant.name,
              municipio: matchingTenant.nomeMunicipio!,
              uf: matchingTenant.ufMunicipio!
            }
          });

          console.log(`✅ Cidadão ${citizen.name} vinculado a ${matchingTenant.name}`);
        } else {
          notLinked.push({
            citizenId: citizen.id,
            name: citizen.name,
            city: address.city,
            state: address.state,
            reason: 'Nenhum tenant encontrado para esta cidade'
          });
        }
      } catch (error) {
        console.error(`❌ Erro ao processar cidadão ${citizen.id}:`, error);
        notLinked.push({
          citizenId: citizen.id,
          name: citizen.name,
          reason: 'Erro ao processar'
        });
      }
    }

    const message = tenantId
      ? `Vinculação ao tenant específico concluída: ${linked.length} cidadãos vinculados`
      : `Vinculação automática concluída: ${linked.length} cidadãos vinculados, ${notLinked.length} não vinculados`;

    return {
      success: true,
      message,
      summary: {
        totalProcessed: unlinkedCitizens.length,
        linked: linked.length,
        notLinked: notLinked.length
      },
      details: {
        linked,
        notLinked
      }
    };
  } catch (error) {
    console.error('❌ Erro na auto-vinculação:', error);
    throw error;
  }
}

/**
 * Hook chamado automaticamente após criação de tenant
 * Vincula cidadãos do UNASSIGNED_POOL que correspondem ao município do novo tenant
 */
export async function onTenantCreated(tenantId: string): Promise<void> {
  try {
    console.log(`🔗 Iniciando auto-vinculação para tenant ${tenantId}...`);

    const result = await autoLinkCitizens(tenantId);

    if (result.summary.linked > 0) {
      console.log(`✅ ${result.summary.linked} cidadãos foram automaticamente vinculados ao novo tenant`);
    } else {
      console.log(`ℹ️  Nenhum cidadão aguardando vinculação para este município`);
    }
  } catch (error) {
    console.error('❌ Erro no hook de auto-vinculação:', error);
    // Não lançar erro para não bloquear criação do tenant
  }
}
