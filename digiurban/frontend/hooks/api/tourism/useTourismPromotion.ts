import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface TourismPromotion {
  id: string
  campaign_id: string
  title: string
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'SCHEDULED' | 'EXPIRED' | 'PAUSED'
  type: 'ADVERTISING' | 'PUBLIC_RELATIONS' | 'DIGITAL_MARKETING' | 'EVENT_MARKETING' | 'TRADE_SHOWS' | 'PARTNERSHIPS'
  category: 'DESTINATION_MARKETING' | 'ATTRACTION_PROMOTION' | 'EVENT_PROMOTION' | 'ACCOMMODATION_PROMOTION' | 'PACKAGE_PROMOTION'
  target_market: {
    geographic: Array<'LOCAL' | 'REGIONAL' | 'NATIONAL' | 'INTERNATIONAL'>
    demographic: Array<'FAMILIES' | 'COUPLES' | 'YOUNG_ADULTS' | 'SENIORS' | 'BUSINESS_TRAVELERS' | 'ADVENTURE_SEEKERS'>
    psychographic: Array<'LUXURY_SEEKERS' | 'BUDGET_CONSCIOUS' | 'ECO_TOURISTS' | 'CULTURAL_ENTHUSIASTS' | 'ADVENTURE_LOVERS'>
    behavioral: Array<'FREQUENT_TRAVELERS' | 'OCCASIONAL_TRAVELERS' | 'FIRST_TIME_VISITORS' | 'REPEAT_VISITORS'>
  }
  objectives: {
    primary_goal: 'BRAND_AWARENESS' | 'VISITOR_INCREASE' | 'REVENUE_GROWTH' | 'MARKET_PENETRATION' | 'SEASONALITY_BALANCE'
    specific_targets: Array<{
      metric: string
      target_value: number
      measurement_unit: string
      deadline: string
    }>
    kpis: Array<{
      name: string
      current_value: number
      target_value: number
      measurement_frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY'
    }>
  }
  timeline: {
    start_date: string
    end_date: string
    phases: Array<{
      name: string
      start_date: string
      end_date: string
      activities: Array<string>
      budget_allocation: number
    }>
    milestones: Array<{
      name: string
      date: string
      deliverable: string
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
    }>
  }
  channels: {
    digital: Array<{
      platform: 'WEBSITE' | 'SOCIAL_MEDIA' | 'EMAIL' | 'SEARCH_ENGINE' | 'DISPLAY_ADS' | 'VIDEO_PLATFORM'
      specific_channel: string
      budget_allocation: number
      expected_reach: number
      content_type: Array<'TEXT' | 'IMAGE' | 'VIDEO' | 'INFOGRAPHIC' | 'INTERACTIVE'>
    }>
    traditional: Array<{
      medium: 'TV' | 'RADIO' | 'PRINT' | 'OUTDOOR' | 'DIRECT_MAIL'
      specific_outlet: string
      budget_allocation: number
      expected_reach: number
      frequency: number
    }>
    events: Array<{
      type: 'TRADE_SHOW' | 'CONFERENCE' | 'FESTIVAL' | 'ROADSHOW' | 'WORKSHOP'
      name: string
      location: string
      date: string
      budget: number
      expected_attendance: number
    }>
  }
  content: {
    messaging: {
      main_message: string
      key_selling_points: Array<string>
      call_to_action: string
      tone_of_voice: 'PROFESSIONAL' | 'FRIENDLY' | 'EXCITING' | 'LUXURIOUS' | 'ADVENTUROUS'
    }
    creative_assets: Array<{
      type: 'LOGO' | 'BANNER' | 'POSTER' | 'BROCHURE' | 'VIDEO' | 'INFOGRAPHIC' | 'SOCIAL_MEDIA_POST'
      title: string
      file_path: string
      dimensions?: string
      usage_rights: 'INTERNAL' | 'EXTERNAL' | 'COMMERCIAL' | 'EDITORIAL'
      languages: Array<'PT' | 'EN' | 'ES' | 'FR' | 'DE' | 'IT'>
    }>
    website_content: {
      landing_pages: Array<{
        url: string
        title: string
        content_type: 'DESTINATION' | 'ATTRACTION' | 'EVENT' | 'PACKAGE'
        conversion_goal: string
      }>
      blog_posts: Array<{
        title: string
        publication_date: string
        author: string
        topic: string
        seo_keywords: Array<string>
      }>
    }
  }
  budget: {
    total_budget: number
    currency: 'BRL' | 'USD' | 'EUR'
    allocation: {
      content_creation: number
      media_buying: number
      production: number
      distribution: number
      events: number
      personnel: number
      technology: number
      contingency: number
    }
    spent_to_date: number
    remaining_budget: number
  }
  partnerships: Array<{
    partner_name: string
    partner_type: 'MEDIA_OUTLET' | 'INFLUENCER' | 'TRAVEL_AGENCY' | 'HOTEL' | 'AIRLINE' | 'GOVERNMENT' | 'NGO'
    contribution_type: 'FINANCIAL' | 'IN_KIND' | 'PROMOTIONAL' | 'CONTENT' | 'DISTRIBUTION'
    value: number
    duration: string
    contact_person: string
    deliverables: Array<string>
  }>
  performance: {
    reach: {
      total_impressions: number
      unique_reach: number
      frequency: number
      reach_by_channel: Array<{
        channel: string
        impressions: number
        reach: number
      }>
    }
    engagement: {
      total_engagements: number
      engagement_rate: number
      shares: number
      comments: number
      likes: number
      click_through_rate: number
    }
    conversions: {
      website_visits: number
      inquiries: number
      bookings: number
      conversion_rate: number
      cost_per_conversion: number
    }
    brand_metrics: {
      brand_awareness: number
      brand_consideration: number
      brand_preference: number
      net_promoter_score: number
    }
  }
  roi_analysis: {
    total_investment: number
    revenue_generated: number
    cost_per_visitor: number
    return_on_investment: number
    payback_period: number
    lifetime_value_increase: number
  }
  monitoring: {
    tracking_setup: Array<{
      platform: string
      metrics_tracked: Array<string>
      tracking_codes: Array<string>
    }>
    reporting_schedule: {
      frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY'
      stakeholders: Array<string>
      report_format: 'DASHBOARD' | 'PDF' | 'PRESENTATION' | 'EMAIL'
    }
    quality_control: Array<{
      checkpoint: string
      responsible: string
      criteria: Array<string>
    }>
  }
  competitive_analysis: {
    competitors: Array<{
      name: string
      market_share: number
      promotional_activities: Array<string>
      strengths: Array<string>
      weaknesses: Array<string>
    }>
    market_positioning: string
    differentiation_strategy: Array<string>
  }
  legal_compliance: {
    regulations_followed: Array<string>
    approvals_required: Array<{
      authority: string
      approval_type: string
      status: 'PENDING' | 'APPROVED' | 'REJECTED'
      date: string
    }>
    intellectual_property: Array<{
      asset_type: 'TRADEMARK' | 'COPYRIGHT' | 'LICENSE'
      description: string
      owner: string
      usage_rights: string
    }>
  }
  feedback: {
    stakeholder_feedback: Array<{
      stakeholder: string
      feedback_date: string
      rating: number
      comments: string
      suggestions: Array<string>
    }>
    market_research: Array<{
      study_name: string
      methodology: string
      sample_size: number
      key_findings: Array<string>
      recommendations: Array<string>
    }>
    sentiment_analysis: {
      overall_sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
      sentiment_score: number
      positive_mentions: number
      negative_mentions: number
      neutral_mentions: number
    }
  }
  post_campaign: {
    evaluation_completed: boolean
    lessons_learned: Array<string>
    recommendations: Array<string>
    future_improvements: Array<string>
    replication_potential: boolean
  }
  created_at: string
  updated_at: string
}

export interface CreateTourismPromotionData {
  title: string
  type: 'ADVERTISING' | 'PUBLIC_RELATIONS' | 'DIGITAL_MARKETING' | 'EVENT_MARKETING' | 'TRADE_SHOWS' | 'PARTNERSHIPS'
  category: 'DESTINATION_MARKETING' | 'ATTRACTION_PROMOTION' | 'EVENT_PROMOTION' | 'ACCOMMODATION_PROMOTION' | 'PACKAGE_PROMOTION'
  target_market: {
    geographic: Array<'LOCAL' | 'REGIONAL' | 'NATIONAL' | 'INTERNATIONAL'>
    demographic: Array<'FAMILIES' | 'COUPLES' | 'YOUNG_ADULTS' | 'SENIORS' | 'BUSINESS_TRAVELERS' | 'ADVENTURE_SEEKERS'>
    psychographic: Array<'LUXURY_SEEKERS' | 'BUDGET_CONSCIOUS' | 'ECO_TOURISTS' | 'CULTURAL_ENTHUSIASTS' | 'ADVENTURE_LOVERS'>
  }
  objectives: {
    primary_goal: 'BRAND_AWARENESS' | 'VISITOR_INCREASE' | 'REVENUE_GROWTH' | 'MARKET_PENETRATION' | 'SEASONALITY_BALANCE'
    specific_targets: Array<{
      metric: string
      target_value: number
      measurement_unit: string
      deadline: string
    }>
  }
  timeline: {
    start_date: string
    end_date: string
    phases: Array<{
      name: string
      start_date: string
      end_date: string
      activities: Array<string>
      budget_allocation: number
    }>
  }
  channels: {
    digital: Array<{
      platform: 'WEBSITE' | 'SOCIAL_MEDIA' | 'EMAIL' | 'SEARCH_ENGINE' | 'DISPLAY_ADS' | 'VIDEO_PLATFORM'
      specific_channel: string
      budget_allocation: number
      expected_reach: number
    }>
    traditional: Array<{
      medium: 'TV' | 'RADIO' | 'PRINT' | 'OUTDOOR' | 'DIRECT_MAIL'
      specific_outlet: string
      budget_allocation: number
      expected_reach: number
    }>
  }
  content: {
    messaging: {
      main_message: string
      key_selling_points: Array<string>
      call_to_action: string
      tone_of_voice: 'PROFESSIONAL' | 'FRIENDLY' | 'EXCITING' | 'LUXURIOUS' | 'ADVENTUROUS'
    }
  }
  budget: {
    total_budget: number
    currency: 'BRL' | 'USD' | 'EUR'
    allocation: {
      content_creation: number
      media_buying: number
      production: number
      distribution: number
      events: number
      personnel: number
    }
  }
}

export interface TourismPromotionFilters {
  title?: string
  campaign_id?: string
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'SCHEDULED' | 'EXPIRED' | 'PAUSED'
  type?: 'ADVERTISING' | 'PUBLIC_RELATIONS' | 'DIGITAL_MARKETING' | 'EVENT_MARKETING' | 'TRADE_SHOWS' | 'PARTNERSHIPS'
  category?: 'DESTINATION_MARKETING' | 'ATTRACTION_PROMOTION' | 'EVENT_PROMOTION' | 'ACCOMMODATION_PROMOTION' | 'PACKAGE_PROMOTION'
  target_market?: 'LOCAL' | 'REGIONAL' | 'NATIONAL' | 'INTERNATIONAL'
  primary_goal?: 'BRAND_AWARENESS' | 'VISITOR_INCREASE' | 'REVENUE_GROWTH' | 'MARKET_PENETRATION' | 'SEASONALITY_BALANCE'
  min_budget?: number
  max_budget?: number
  currency?: 'BRL' | 'USD' | 'EUR'
  start_date_from?: string
  start_date_to?: string
  end_date_from?: string
  end_date_to?: string
  channel_type?: 'DIGITAL' | 'TRADITIONAL' | 'EVENTS'
  partner_type?: 'MEDIA_OUTLET' | 'INFLUENCER' | 'TRAVEL_AGENCY' | 'HOTEL' | 'AIRLINE' | 'GOVERNMENT' | 'NGO'
  min_roi?: number
  created_from?: string
  created_to?: string
}

export const useTourismPromotion = () => {
  const [promotions, setPromotions] = useState<TourismPromotion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPromotions = useCallback(async (filters?: TourismPromotionFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/tourism/promotions', { params: filters })
      setPromotions(response.data)
    } catch (err) {
      setError('Falha ao carregar promoções turísticas')
      console.error('Error fetching tourism promotions:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getPromotionById = useCallback(async (id: string): Promise<TourismPromotion | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/tourism/promotions/${id}`)
      return response.data
    } catch (err) {
      setError('Falha ao carregar promoção turística')
      console.error('Error fetching tourism promotion:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createPromotion = useCallback(async (data: CreateTourismPromotionData): Promise<TourismPromotion | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/tourism/promotions', data)
      const newPromotion = response.data
      setPromotions(prev => [...prev, newPromotion])
      return newPromotion
    } catch (err) {
      setError('Falha ao criar promoção turística')
      console.error('Error creating tourism promotion:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePromotion = useCallback(async (id: string, data: Partial<CreateTourismPromotionData>): Promise<TourismPromotion | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/tourism/promotions/${id}`, data)
      const updatedPromotion = response.data
      setPromotions(prev => prev.map(promo => promo.id === id ? updatedPromotion : promo))
      return updatedPromotion
    } catch (err) {
      setError('Falha ao atualizar promoção turística')
      console.error('Error updating tourism promotion:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deletePromotion = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.delete(`/tourism/promotions/${id}`)
      setPromotions(prev => prev.filter(promo => promo.id !== id))
      return true
    } catch (err) {
      setError('Falha ao excluir promoção turística')
      console.error('Error deleting tourism promotion:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'SCHEDULED' | 'EXPIRED' | 'PAUSED'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/tourism/promotions/${id}/status`, { status })
      const updatedPromotion = response.data
      setPromotions(prev => prev.map(promo => promo.id === id ? updatedPromotion : promo))
      return true
    } catch (err) {
      setError('Falha ao atualizar status da promoção')
      console.error('Error updating promotion status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addPartnership = useCallback(async (promotionId: string, partnership: {
    partner_name: string
    partner_type: 'MEDIA_OUTLET' | 'INFLUENCER' | 'TRAVEL_AGENCY' | 'HOTEL' | 'AIRLINE' | 'GOVERNMENT' | 'NGO'
    contribution_type: 'FINANCIAL' | 'IN_KIND' | 'PROMOTIONAL' | 'CONTENT' | 'DISTRIBUTION'
    value: number
    duration: string
    contact_person: string
    deliverables: Array<string>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/promotions/${promotionId}/partnerships`, partnership)
      const updatedPromotion = response.data
      setPromotions(prev => prev.map(promo => promo.id === promotionId ? updatedPromotion : promo))
      return true
    } catch (err) {
      setError('Falha ao adicionar parceria')
      console.error('Error adding partnership:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePerformance = useCallback(async (promotionId: string, performance: {
    reach?: {
      total_impressions: number
      unique_reach: number
      frequency: number
    }
    engagement?: {
      total_engagements: number
      engagement_rate: number
      shares: number
      comments: number
      likes: number
      click_through_rate: number
    }
    conversions?: {
      website_visits: number
      inquiries: number
      bookings: number
      conversion_rate: number
    }
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/tourism/promotions/${promotionId}/performance`, performance)
      const updatedPromotion = response.data
      setPromotions(prev => prev.map(promo => promo.id === promotionId ? updatedPromotion : promo))
      return true
    } catch (err) {
      setError('Falha ao atualizar performance')
      console.error('Error updating performance:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addCreativeAsset = useCallback(async (promotionId: string, asset: {
    type: 'LOGO' | 'BANNER' | 'POSTER' | 'BROCHURE' | 'VIDEO' | 'INFOGRAPHIC' | 'SOCIAL_MEDIA_POST'
    title: string
    file_path: string
    dimensions?: string
    usage_rights: 'INTERNAL' | 'EXTERNAL' | 'COMMERCIAL' | 'EDITORIAL'
    languages: Array<'PT' | 'EN' | 'ES' | 'FR' | 'DE' | 'IT'>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/promotions/${promotionId}/creative-assets`, asset)
      const updatedPromotion = response.data
      setPromotions(prev => prev.map(promo => promo.id === promotionId ? updatedPromotion : promo))
      return true
    } catch (err) {
      setError('Falha ao adicionar ativo criativo')
      console.error('Error adding creative asset:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const recordBudgetSpending = useCallback(async (promotionId: string, spending: {
    category: 'CONTENT_CREATION' | 'MEDIA_BUYING' | 'PRODUCTION' | 'DISTRIBUTION' | 'EVENTS' | 'PERSONNEL' | 'TECHNOLOGY'
    amount: number
    description: string
    date: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/promotions/${promotionId}/budget-spending`, spending)
      const updatedPromotion = response.data
      setPromotions(prev => prev.map(promo => promo.id === promotionId ? updatedPromotion : promo))
      return true
    } catch (err) {
      setError('Falha ao registrar gasto')
      console.error('Error recording budget spending:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addFeedback = useCallback(async (promotionId: string, feedback: {
    stakeholder: string
    rating: number
    comments: string
    suggestions: Array<string>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/promotions/${promotionId}/feedback`, feedback)
      const updatedPromotion = response.data
      setPromotions(prev => prev.map(promo => promo.id === promotionId ? updatedPromotion : promo))
      return true
    } catch (err) {
      setError('Falha ao adicionar feedback')
      console.error('Error adding feedback:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const generateROIReport = useCallback(async (promotionId: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/promotions/${promotionId}/roi-report`)
      const updatedPromotion = response.data
      setPromotions(prev => prev.map(promo => promo.id === promotionId ? updatedPromotion : promo))
      return true
    } catch (err) {
      setError('Falha ao gerar relatório de ROI')
      console.error('Error generating ROI report:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getActivePromotions = useCallback(() => {
    return promotions.filter(promo => promo.status === 'ACTIVE')
  }, [promotions])

  const getPromotionsByType = useCallback((type: 'ADVERTISING' | 'PUBLIC_RELATIONS' | 'DIGITAL_MARKETING' | 'EVENT_MARKETING' | 'TRADE_SHOWS' | 'PARTNERSHIPS') => {
    return promotions.filter(promo => promo.type === type)
  }, [promotions])

  const getPromotionsByCategory = useCallback((category: 'DESTINATION_MARKETING' | 'ATTRACTION_PROMOTION' | 'EVENT_PROMOTION' | 'ACCOMMODATION_PROMOTION' | 'PACKAGE_PROMOTION') => {
    return promotions.filter(promo => promo.category === category)
  }, [promotions])

  const getHighPerformingPromotions = useCallback((minROI: number = 200) => {
    return promotions.filter(promo => promo.roi_analysis.return_on_investment >= minROI)
      .sort((a, b) => b.roi_analysis.return_on_investment - a.roi_analysis.return_on_investment)
  }, [promotions])

  const getTotalBudgetSpent = useCallback(() => {
    return promotions.reduce((total, promo) => total + promo.budget.spent_to_date, 0)
  }, [promotions])

  const getTotalRevenueGenerated = useCallback(() => {
    return promotions.reduce((total, promo) => total + promo.roi_analysis.revenue_generated, 0)
  }, [promotions])

  const getPromotionsByTargetMarket = useCallback((market: 'LOCAL' | 'REGIONAL' | 'NATIONAL' | 'INTERNATIONAL') => {
    return promotions.filter(promo => promo.target_market.geographic.includes(market))
  }, [promotions])

  const getUpcomingPromotions = useCallback((days: number = 30) => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)

    return promotions.filter(promo => {
      const startDate = new Date(promo.timeline.start_date)
      return startDate >= new Date() && startDate <= futureDate
    })
  }, [promotions])

  useEffect(() => {
    fetchPromotions()
  }, [fetchPromotions])

  return {
    promotions,
    loading,
    error,
    fetchPromotions,
    getPromotionById,
    createPromotion,
    updatePromotion,
    deletePromotion,
    updateStatus,
    addPartnership,
    updatePerformance,
    addCreativeAsset,
    recordBudgetSpending,
    addFeedback,
    generateROIReport,
    getActivePromotions,
    getPromotionsByType,
    getPromotionsByCategory,
    getHighPerformingPromotions,
    getTotalBudgetSpent,
    getTotalRevenueGenerated,
    getPromotionsByTargetMarket,
    getUpcomingPromotions
  }
}