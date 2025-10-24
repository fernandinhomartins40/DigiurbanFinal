import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface AgriculturalCommerce {
  id: string
  transaction_id: string
  type: 'SALE' | 'PURCHASE' | 'AUCTION' | 'DIRECT_MARKETING' | 'COOPERATIVE_SALE' | 'EXPORT' | 'CONTRACT_FARMING'
  status: 'NEGOTIATING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'PAYMENT_PENDING' | 'COMPLETED' | 'CANCELLED'
  seller: {
    id: string
    name: string
    type: 'PRODUCER' | 'COOPERATIVE' | 'ASSOCIATION' | 'TRADER' | 'PROCESSOR'
    contact: {
      phone: string
      email: string
      address: string
    }
    certifications: Array<'ORGANIC' | 'FAIR_TRADE' | 'RAINFOREST' | 'UTZ' | 'GLOBAL_GAP'>
  }
  buyer: {
    id: string
    name: string
    type: 'CONSUMER' | 'RETAILER' | 'WHOLESALER' | 'PROCESSOR' | 'EXPORTER' | 'INSTITUTIONAL'
    contact: {
      phone: string
      email: string
      address: string
    }
    preferences: Array<string>
  }
  products: Array<{
    id: string
    name: string
    variety: string
    category: 'FRUITS' | 'VEGETABLES' | 'GRAINS' | 'DAIRY' | 'MEAT' | 'PROCESSED' | 'ORGANIC'
    quantity: number
    unit: 'KG' | 'TON' | 'LITER' | 'UNIT' | 'BOX' | 'BAG'
    quality_grade: 'PREMIUM' | 'STANDARD' | 'COMMERCIAL' | 'INDUSTRIAL'
    origin: {
      property_id: string
      property_name: string
      municipality: string
      harvest_date: string
    }
    characteristics: {
      size?: string
      color?: string
      ripeness?: string
      moisture_content?: number
      protein_content?: number
      fat_content?: number
    }
    certifications: Array<{
      type: 'ORGANIC' | 'FAIR_TRADE' | 'QUALITY' | 'ORIGIN' | 'SAFETY'
      number: string
      issuer: string
      valid_until: string
    }>
    traceability: {
      lot_number: string
      production_date: string
      expiration_date?: string
      storage_conditions: string
      processing_steps: Array<{
        step: string
        date: string
        location: string
      }>
    }
  }>
  pricing: {
    unit_price: number
    total_amount: number
    currency: 'BRL' | 'USD' | 'EUR'
    pricing_method: 'FIXED' | 'MARKET_BASED' | 'AUCTION' | 'NEGOTIATED' | 'CONTRACT'
    price_factors: Array<{
      factor: 'QUALITY' | 'QUANTITY' | 'SEASONALITY' | 'DEMAND' | 'CERTIFICATION' | 'DISTANCE'
      impact: number
      description: string
    }>
    payment_terms: {
      method: 'CASH' | 'CREDIT' | 'INSTALLMENTS' | 'BARTER' | 'BANK_TRANSFER'
      due_date: string
      installments?: Array<{
        amount: number
        due_date: string
        status: 'PENDING' | 'PAID' | 'OVERDUE'
      }>
      discount_early_payment?: number
      penalty_late_payment?: number
    }
  }
  logistics: {
    delivery_method: 'PICKUP' | 'DELIVERY' | 'THIRD_PARTY' | 'COOPERATIVE'
    delivery_address: {
      street: string
      number: string
      city: string
      state: string
      zipcode: string
      coordinates?: {
        latitude: number
        longitude: number
      }
    }
    delivery_date: string
    estimated_time: string
    transportation: {
      vehicle_type: 'TRUCK' | 'VAN' | 'PICKUP' | 'REFRIGERATED' | 'CONTAINER'
      driver_name?: string
      driver_contact?: string
      license_plate?: string
      tracking_number?: string
    }
    packaging: {
      type: 'BOX' | 'BAG' | 'CONTAINER' | 'BULK' | 'PALLET'
      quantity: number
      weight: number
      special_requirements: Array<string>
    }
    insurance: {
      covered: boolean
      amount?: number
      policy_number?: string
    }
  }
  quality_control: {
    inspection_required: boolean
    inspection_date?: string
    inspector?: string
    samples_collected: boolean
    test_results: Array<{
      parameter: string
      value: string
      standard: string
      compliance: boolean
    }>
    acceptance_criteria: Array<{
      parameter: string
      min_value?: number
      max_value?: number
      acceptable_values?: Array<string>
    }>
    rejection_reasons?: Array<string>
  }
  market_info: {
    market_price_reference: number
    price_variation: number
    market_trend: 'RISING' | 'FALLING' | 'STABLE'
    seasonal_factor: number
    demand_level: 'LOW' | 'MEDIUM' | 'HIGH'
    competition_level: 'LOW' | 'MEDIUM' | 'HIGH'
  }
  documentation: {
    contract_signed: boolean
    invoice_issued: boolean
    delivery_receipt: boolean
    quality_certificate: boolean
    transport_documents: Array<{
      type: 'INVOICE' | 'RECEIPT' | 'CERTIFICATE' | 'PERMIT' | 'INSURANCE'
      file_path: string
      date: string
    }>
  }
  sustainability: {
    carbon_footprint?: number
    water_usage?: number
    packaging_recyclable: boolean
    local_sourcing: boolean
    fair_trade_practices: boolean
    environmental_impact_score: number
  }
  feedback: {
    seller_rating?: number
    buyer_rating?: number
    seller_comments?: string
    buyer_comments?: string
    quality_satisfaction?: number
    delivery_satisfaction?: number
    recommendation_likelihood?: number
  }
  created_at: string
  updated_at: string
}

export interface CreateAgriculturalCommerceData {
  type: 'SALE' | 'PURCHASE' | 'AUCTION' | 'DIRECT_MARKETING' | 'COOPERATIVE_SALE' | 'EXPORT' | 'CONTRACT_FARMING'
  seller_id: string
  buyer_id: string
  products: Array<{
    product_id: string
    quantity: number
    unit: 'KG' | 'TON' | 'LITER' | 'UNIT' | 'BOX' | 'BAG'
    quality_grade: 'PREMIUM' | 'STANDARD' | 'COMMERCIAL' | 'INDUSTRIAL'
    unit_price: number
  }>
  pricing: {
    pricing_method: 'FIXED' | 'MARKET_BASED' | 'AUCTION' | 'NEGOTIATED' | 'CONTRACT'
    payment_terms: {
      method: 'CASH' | 'CREDIT' | 'INSTALLMENTS' | 'BARTER' | 'BANK_TRANSFER'
      due_date: string
      installments?: Array<{
        amount: number
        due_date: string
      }>
    }
  }
  logistics: {
    delivery_method: 'PICKUP' | 'DELIVERY' | 'THIRD_PARTY' | 'COOPERATIVE'
    delivery_address: {
      street: string
      number: string
      city: string
      state: string
      zipcode: string
    }
    delivery_date: string
    packaging: {
      type: 'BOX' | 'BAG' | 'CONTAINER' | 'BULK' | 'PALLET'
      quantity: number
      special_requirements?: Array<string>
    }
  }
  quality_control?: {
    inspection_required: boolean
    acceptance_criteria: Array<{
      parameter: string
      min_value?: number
      max_value?: number
      acceptable_values?: Array<string>
    }>
  }
}

export interface AgriculturalCommerceFilters {
  transaction_id?: string
  type?: 'SALE' | 'PURCHASE' | 'AUCTION' | 'DIRECT_MARKETING' | 'COOPERATIVE_SALE' | 'EXPORT' | 'CONTRACT_FARMING'
  status?: 'NEGOTIATING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'PAYMENT_PENDING' | 'COMPLETED' | 'CANCELLED'
  seller_id?: string
  buyer_id?: string
  seller_type?: 'PRODUCER' | 'COOPERATIVE' | 'ASSOCIATION' | 'TRADER' | 'PROCESSOR'
  buyer_type?: 'CONSUMER' | 'RETAILER' | 'WHOLESALER' | 'PROCESSOR' | 'EXPORTER' | 'INSTITUTIONAL'
  product_name?: string
  product_category?: 'FRUITS' | 'VEGETABLES' | 'GRAINS' | 'DAIRY' | 'MEAT' | 'PROCESSED' | 'ORGANIC'
  quality_grade?: 'PREMIUM' | 'STANDARD' | 'COMMERCIAL' | 'INDUSTRIAL'
  min_amount?: number
  max_amount?: number
  currency?: 'BRL' | 'USD' | 'EUR'
  payment_method?: 'CASH' | 'CREDIT' | 'INSTALLMENTS' | 'BARTER' | 'BANK_TRANSFER'
  delivery_from?: string
  delivery_to?: string
  municipality?: string
  has_certification?: boolean
  certification_type?: 'ORGANIC' | 'FAIR_TRADE' | 'RAINFOREST' | 'UTZ' | 'GLOBAL_GAP'
  created_from?: string
  created_to?: string
}

export const useAgriculturalCommerce = () => {
  const [transactions, setTransactions] = useState<AgriculturalCommerce[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async (filters?: AgriculturalCommerceFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get<AgriculturalCommerce[]>('/agriculture/commerce', { params: filters })
      setTransactions(response.data as AgriculturalCommerce[])
    } catch (err) {
      setError('Falha ao carregar transações comerciais')
      console.error('Error fetching agricultural commerce:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getTransactionById = useCallback(async (id: string): Promise<AgriculturalCommerce | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get<AgriculturalCommerce>(`/agriculture/commerce/${id}`)
      return response.data as AgriculturalCommerce
    } catch (err) {
      setError('Falha ao carregar transação comercial')
      console.error('Error fetching agricultural commerce transaction:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createTransaction = useCallback(async (data: CreateAgriculturalCommerceData): Promise<AgriculturalCommerce | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post<AgriculturalCommerce>('/agriculture/commerce', data)
      const newTransaction = response.data as AgriculturalCommerce
      setTransactions(prev => [...prev, newTransaction])
      return newTransaction
    } catch (err) {
      setError('Falha ao criar transação comercial')
      console.error('Error creating agricultural commerce transaction:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTransaction = useCallback(async (id: string, data: Partial<CreateAgriculturalCommerceData>): Promise<AgriculturalCommerce | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put<AgriculturalCommerce>(`/agriculture/commerce/${id}`, data)
      const updatedTransaction = response.data as AgriculturalCommerce
      setTransactions(prev => prev.map(trans => trans.id === id ? updatedTransaction : trans))
      return updatedTransaction
    } catch (err) {
      setError('Falha ao atualizar transação comercial')
      console.error('Error updating agricultural commerce transaction:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteTransaction = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.delete(`/agriculture/commerce/${id}`)
      setTransactions(prev => prev.filter(trans => trans.id !== id))
      return true
    } catch (err) {
      setError('Falha ao excluir transação comercial')
      console.error('Error deleting agricultural commerce transaction:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: 'NEGOTIATING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'PAYMENT_PENDING' | 'COMPLETED' | 'CANCELLED'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch<AgriculturalCommerce>(`/agriculture/commerce/${id}/status`, { status })
      const updatedTransaction = response.data as AgriculturalCommerce
      setTransactions(prev => prev.map(trans => trans.id === id ? updatedTransaction : trans))
      return true
    } catch (err) {
      setError('Falha ao atualizar status da transação')
      console.error('Error updating transaction status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePricing = useCallback(async (id: string, pricing: {
    unit_price?: number
    total_amount?: number
    payment_terms?: {
      method: 'CASH' | 'CREDIT' | 'INSTALLMENTS' | 'BARTER' | 'BANK_TRANSFER'
      due_date: string
      installments?: Array<{
        amount: number
        due_date: string
      }>
    }
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch<AgriculturalCommerce>(`/agriculture/commerce/${id}/pricing`, pricing)
      const updatedTransaction = response.data as AgriculturalCommerce
      setTransactions(prev => prev.map(trans => trans.id === id ? updatedTransaction : trans))
      return true
    } catch (err) {
      setError('Falha ao atualizar preços')
      console.error('Error updating pricing:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateLogistics = useCallback(async (id: string, logistics: {
    delivery_date?: string
    transportation?: {
      vehicle_type: 'TRUCK' | 'VAN' | 'PICKUP' | 'REFRIGERATED' | 'CONTAINER'
      driver_name?: string
      driver_contact?: string
      license_plate?: string
      tracking_number?: string
    }
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch<AgriculturalCommerce>(`/agriculture/commerce/${id}/logistics`, logistics)
      const updatedTransaction = response.data as AgriculturalCommerce
      setTransactions(prev => prev.map(trans => trans.id === id ? updatedTransaction : trans))
      return true
    } catch (err) {
      setError('Falha ao atualizar logística')
      console.error('Error updating logistics:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const recordQualityInspection = useCallback(async (id: string, inspection: {
    inspection_date: string
    inspector: string
    samples_collected: boolean
    test_results: Array<{
      parameter: string
      value: string
      standard: string
      compliance: boolean
    }>
    rejection_reasons?: Array<string>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post<AgriculturalCommerce>(`/agriculture/commerce/${id}/quality-inspection`, inspection)
      const updatedTransaction = response.data as AgriculturalCommerce
      setTransactions(prev => prev.map(trans => trans.id === id ? updatedTransaction : trans))
      return true
    } catch (err) {
      setError('Falha ao registrar inspeção de qualidade')
      console.error('Error recording quality inspection:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const recordPayment = useCallback(async (id: string, payment: {
    installment_number?: number
    amount: number
    payment_date: string
    payment_method: string
    reference_number?: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post<AgriculturalCommerce>(`/agriculture/commerce/${id}/payments`, payment)
      const updatedTransaction = response.data as AgriculturalCommerce
      setTransactions(prev => prev.map(trans => trans.id === id ? updatedTransaction : trans))
      return true
    } catch (err) {
      setError('Falha ao registrar pagamento')
      console.error('Error recording payment:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addFeedback = useCallback(async (id: string, feedback: {
    rater_type: 'SELLER' | 'BUYER'
    rating: number
    comments: string
    quality_satisfaction?: number
    delivery_satisfaction?: number
    recommendation_likelihood?: number
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post<AgriculturalCommerce>(`/agriculture/commerce/${id}/feedback`, feedback)
      const updatedTransaction = response.data as AgriculturalCommerce
      setTransactions(prev => prev.map(trans => trans.id === id ? updatedTransaction : trans))
      return true
    } catch (err) {
      setError('Falha ao adicionar feedback')
      console.error('Error adding feedback:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getMarketPrice = useCallback(async (productName: string, municipality?: string): Promise<number | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get<{ price: number }>('/agriculture/market-prices', {
        params: { product: productName, municipality }
      })
      return (response.data as { price: number }).price
    } catch (err) {
      setError('Falha ao obter preço de mercado')
      console.error('Error getting market price:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const generateContract = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post<AgriculturalCommerce>(`/agriculture/commerce/${id}/contract`)
      const updatedTransaction = response.data as AgriculturalCommerce
      setTransactions(prev => prev.map(trans => trans.id === id ? updatedTransaction : trans))
      return true
    } catch (err) {
      setError('Falha ao gerar contrato')
      console.error('Error generating contract:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getTransactionsBySeller = useCallback((sellerId: string) => {
    return transactions.filter(transaction => transaction.seller.id === sellerId)
  }, [transactions])

  const getTransactionsByBuyer = useCallback((buyerId: string) => {
    return transactions.filter(transaction => transaction.buyer.id === buyerId)
  }, [transactions])

  const getActiveTransactions = useCallback(() => {
    return transactions.filter(transaction =>
      ['NEGOTIATING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED', 'PAYMENT_PENDING'].includes(transaction.status)
    )
  }, [transactions])

  const getTransactionsByProduct = useCallback((productName: string) => {
    return transactions.filter(transaction =>
      transaction.products.some(product => product.name === productName)
    )
  }, [transactions])

  const calculateTotalRevenue = useCallback((sellerId?: string) => {
    const filteredTransactions = sellerId
      ? transactions.filter(t => t.seller.id === sellerId && t.status === 'COMPLETED')
      : transactions.filter(t => t.status === 'COMPLETED')

    return filteredTransactions.reduce((total, transaction) => total + transaction.pricing.total_amount, 0)
  }, [transactions])

  const getAveragePrice = useCallback((productName: string) => {
    const productTransactions = transactions.filter(transaction =>
      transaction.products.some(product => product.name === productName) && transaction.status === 'COMPLETED'
    )

    if (productTransactions.length === 0) return 0

    const totalPrice = productTransactions.reduce((sum, transaction) => {
      const product = transaction.products.find(p => p.name === productName)
      return sum + (product ? transaction.pricing.unit_price : 0)
    }, 0)

    return totalPrice / productTransactions.length
  }, [transactions])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    updateStatus,
    updatePricing,
    updateLogistics,
    recordQualityInspection,
    recordPayment,
    addFeedback,
    getMarketPrice,
    generateContract,
    getTransactionsBySeller,
    getTransactionsByBuyer,
    getActiveTransactions,
    getTransactionsByProduct,
    calculateTotalRevenue,
    getAveragePrice
  }
}