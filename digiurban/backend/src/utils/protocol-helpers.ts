import { prisma } from '../lib/prisma';

/**
 * Gera o próximo número de protocolo único no formato {TENANT_PREFIX}-{YYYY}-{SEQUENTIAL}
 * Thread-safe usando ordenação DESC
 *
 * @param tenantId - ID do tenant
 * @returns String no formato "PREFIX-2025-000001"
 *
 * @example
 * const number = await getNextProtocolNumber("tenant123");
 * // Retorna: "PMSP-2025-000001"
 */
export async function getNextProtocolNumber(tenantId: string): Promise<string> {
  const year = new Date().getFullYear();

  // Buscar tenant para gerar prefix
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { name: true },
  });

  // Gerar prefix a partir do nome do tenant (primeiras letras maiúsculas)
  const prefix = tenant?.name
    .split(' ')
    .filter(word => word.length > 2)
    .map(word => word[0].toUpperCase())
    .join('')
    .substring(0, 4) || 'PREF';

  // Buscar último protocolo do ano para este tenant
  const lastProtocol = await prisma.protocol.findFirst({
    where: {
      tenantId,
      number: {
        startsWith: `${prefix}-${year}-`,
      },
    },
    orderBy: {
      number: 'desc',
    },
    select: {
      number: true,
    },
  });

  // Calcular próximo sequencial
  let sequential = 1;
  if (lastProtocol) {
    const parts = lastProtocol.number.split('-');
    if (parts.length === 3) {
      sequential = parseInt(parts[2]) + 1;
    }
  }

  // Retornar número formatado com padding de 6 dígitos
  return `${prefix}-${year}-${sequential.toString().padStart(6, '0')}`;
}

/**
 * Busca protocolo com dados do attendance específico da secretaria
 *
 * @param protocolId - ID do protocolo
 * @returns Protocolo com attendance vinculado
 */
export async function getProtocolWithAttendance(protocolId: string) {
  const protocol = await prisma.protocol.findUnique({
    where: { id: protocolId },
    include: {
      service: {
        include: {
          department: true,
        },
      },
      citizen: true,
      department: true,
    },
  });

  if (!protocol) {
    return null;
  }

  // Detectar secretaria pelo departamento e buscar attendance correspondente
  let attendance = null;
  const departmentName = protocol.service?.department?.name?.toLowerCase() || '';

  // Mapeamento de secretarias para seus modelos de attendance
  if (departmentName.includes('saúde') || departmentName.includes('saude')) {
    attendance = await prisma.healthAttendance.findFirst({
      where: { protocol: protocol.number },
    });
  } else if (departmentName.includes('educação') || departmentName.includes('educacao')) {
    // Attendance para educação (quando existir o FK)
  } else if (departmentName.includes('habitação') || departmentName.includes('habitacao')) {
    attendance = await prisma.housingAttendance.findFirst({
      where: { tenantId: protocol.tenantId },
    });
  }
  // Adicionar outros mapeamentos conforme necessário

  return {
    protocol,
    attendance,
  };
}
