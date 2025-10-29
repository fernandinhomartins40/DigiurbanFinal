/**
 * ROTAS DE PROTOCOLOS - VERS\u00c3O SIMPLIFICADA
 *
 * Endpoints REST para gest\u00e3o de protocolos
 */

import { Router, Request, Response } from 'express'
import { protocolServiceSimplified } from '../services/protocol-simplified.service'
import { ProtocolStatus } from '@prisma/client'

const router = Router()

// Middleware de autentica\u00e7\u00e3o (assumindo que existe)
// import { authenticate } from '../middleware/auth'

// ========================================
// CRIAR PROTOCOLO
// ========================================

/**
 * POST /api/protocols-simplified
 *
 * Cria um novo protocolo
 *
 * Body: {
 *   title: string,
 *   description?: string,
 *   citizenId: string,
 *   serviceId: string,
 *   priority?: number,
 *   formData?: object,
 *   latitude?: number,
 *   longitude?: number,
 *   address?: string,
 *   documents?: any,
 *   attachments?: string
 * }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const protocol = await protocolServiceSimplified.createProtocol(req.body)

    return res.status(201).json({
      success: true,
      data: protocol,
      message: `Protocolo ${protocol.number} criado com sucesso`
    })
  } catch (error: any) {
    console.error('Erro ao criar protocolo:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao criar protocolo'
    })
  }
})

// ========================================
// BUSCAR PROTOCOLO
// ========================================

/**
 * GET /api/protocols-simplified/:number
 *
 * Busca protocolo por n\u00famero
 */
router.get('/:number', async (req: Request, res: Response) => {
  try {
    const { number } = req.params

    const protocol = await protocolServiceSimplified.findByNumber(number)

    if (!protocol) {
      return res.status(404).json({
        success: false,
        error: 'Protocolo n\u00e3o encontrado'
      })
    }

    return res.json({
      success: true,
      data: protocol
    })
  } catch (error: any) {
    console.error('Erro ao buscar protocolo:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar protocolo'
    })
  }
})

// ========================================
// ATUALIZAR STATUS
// ========================================

/**
 * PATCH /api/protocols-simplified/:id/status
 *
 * Atualiza status do protocolo
 *
 * Body: {
 *   status: ProtocolStatus,
 *   comment?: string,
 *   userId?: string
 * }
 */
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status, comment, userId } = req.body

    if (!status || !Object.values(ProtocolStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status inv\u00e1lido'
      })
    }

    const protocol = await protocolServiceSimplified.updateStatus({
      protocolId: id,
      newStatus: status,
      comment,
      userId
    })

    return res.json({
      success: true,
      data: protocol,
      message: 'Status atualizado com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao atualizar status:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao atualizar status'
    })
  }
})

// ========================================
// ADICIONAR COMENT\u00c1RIO
// ========================================

/**
 * POST /api/protocols-simplified/:id/comments
 *
 * Adiciona coment\u00e1rio ao protocolo
 *
 * Body: {
 *   comment: string,
 *   userId?: string
 * }
 */
router.post('/:id/comments', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { comment, userId } = req.body

    if (!comment) {
      return res.status(400).json({
        success: false,
        error: 'Coment\u00e1rio \u00e9 obrigat\u00f3rio'
      })
    }

    await protocolServiceSimplified.addComment(id, comment, userId)

    return res.json({
      success: true,
      message: 'Coment\u00e1rio adicionado com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao adicionar coment\u00e1rio:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao adicionar coment\u00e1rio'
    })
  }
})

// ========================================
// ATRIBUIR PROTOCOLO
// ========================================

/**
 * PATCH /api/protocols-simplified/:id/assign
 *
 * Atribui protocolo a um usu\u00e1rio
 *
 * Body: {
 *   assignedUserId: string,
 *   userId?: string
 * }
 */
router.patch('/:id/assign', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { assignedUserId, userId } = req.body

    if (!assignedUserId) {
      return res.status(400).json({
        success: false,
        error: 'assignedUserId \u00e9 obrigat\u00f3rio'
      })
    }

    const protocol = await protocolServiceSimplified.assignProtocol(
      id,
      assignedUserId,
      userId
    )

    return res.json({
      success: true,
      data: protocol,
      message: 'Protocolo atribu\u00eddo com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao atribuir protocolo:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao atribuir protocolo'
    })
  }
})

// ========================================
// LISTAR PROTOCOLOS
// ========================================

/**
 * GET /api/protocols-simplified/department/:departmentId
 *
 * Lista protocolos por departamento
 *
 * Query params:
 * - status?: ProtocolStatus
 * - moduleType?: string
 * - citizenId?: string
 * - assignedUserId?: string
 */
router.get('/department/:departmentId', async (req: Request, res: Response) => {
  try {
    const { departmentId } = req.params
    const filters = req.query as any

    const protocols = await protocolServiceSimplified.listByDepartment(
      departmentId,
      filters
    )

    return res.json({
      success: true,
      data: protocols,
      count: protocols.length
    })
  } catch (error: any) {
    console.error('Erro ao listar protocolos:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao listar protocolos'
    })
  }
})

/**
 * GET /api/protocols-simplified/module/:departmentId/:moduleType
 *
 * Lista protocolos por m\u00f3dulo
 */
router.get('/module/:departmentId/:moduleType', async (req: Request, res: Response) => {
  try {
    const { departmentId, moduleType } = req.params

    const protocols = await protocolServiceSimplified.listByModule(
      departmentId,
      moduleType
    )

    return res.json({
      success: true,
      data: protocols,
      count: protocols.length
    })
  } catch (error: any) {
    console.error('Erro ao listar protocolos:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao listar protocolos'
    })
  }
})

/**
 * GET /api/protocols-simplified/citizen/:citizenId
 *
 * Lista protocolos do cidad\u00e3o
 */
router.get('/citizen/:citizenId', async (req: Request, res: Response) => {
  try {
    const { citizenId } = req.params

    const protocols = await protocolServiceSimplified.listByCitizen(citizenId)

    return res.json({
      success: true,
      data: protocols,
      count: protocols.length
    })
  } catch (error: any) {
    console.error('Erro ao listar protocolos:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao listar protocolos'
    })
  }
})

// ========================================
// HIST\u00d3RICO
// ========================================

/**
 * GET /api/protocols-simplified/:id/history
 *
 * Obt\u00e9m hist\u00f3rico completo do protocolo
 */
router.get('/:id/history', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const history = await protocolServiceSimplified.getHistory(id)

    return res.json({
      success: true,
      data: history
    })
  } catch (error: any) {
    console.error('Erro ao buscar hist\u00f3rico:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar hist\u00f3rico'
    })
  }
})

// ========================================
// AVALIA\u00c7\u00c3O
// ========================================

/**
 * POST /api/protocols-simplified/:id/evaluate
 *
 * Avalia protocolo
 *
 * Body: {
 *   rating: number (1-5),
 *   comment?: string,
 *   wouldRecommend?: boolean
 * }
 */
router.post('/:id/evaluate', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { rating, comment, wouldRecommend } = req.body

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating deve ser entre 1 e 5'
      })
    }

    const evaluation = await protocolServiceSimplified.evaluateProtocol(
      id,
      rating,
      comment,
      wouldRecommend
    )

    return res.status(201).json({
      success: true,
      data: evaluation,
      message: 'Avalia\u00e7\u00e3o registrada com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao avaliar protocolo:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao avaliar protocolo'
    })
  }
})

// ========================================
// ESTAT\u00cdSTICAS
// ========================================

/**
 * GET /api/protocols-simplified/stats/:departmentId
 *
 * Obt\u00e9m estat\u00edsticas de protocolos por departamento
 *
 * Query params:
 * - startDate?: ISO string
 * - endDate?: ISO string
 */
router.get('/stats/:departmentId', async (req: Request, res: Response) => {
  try {
    const { departmentId } = req.params
    const { startDate, endDate } = req.query

    const stats = await protocolServiceSimplified.getDepartmentStats(
      departmentId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    )

    return res.json({
      success: true,
      data: stats
    })
  } catch (error: any) {
    console.error('Erro ao buscar estat\u00edsticas:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar estat\u00edsticas'
    })
  }
})

export default router
