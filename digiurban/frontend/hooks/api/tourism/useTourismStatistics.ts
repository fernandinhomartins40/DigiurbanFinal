import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface TourismStatistics {
  id: string
  period: {
    type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
    start_date: string
    end_date: string
    year: number
    month?: number
    quarter?: number
    week?: number
    day?: string
  }
  visitor_data: {
    total_visitors: number
    domestic_visitors: number
    international_visitors: number
    visitor_growth_rate: number
    visitor_demographics: {
      age_groups: Array<{
        age_range: string
        count: number
        percentage: number
      }>
      gender_distribution: {
        male: number
        female: number
        other: number
      }
      education_level: Array<{
        level: string
        count: number
        percentage: number
      }>
      income_brackets: Array<{
        bracket: string
        count: number
        percentage: number
      }>
    }
    visitor_origin: Array<{
      country: string
      state?: string
      city?: string
      count: number
      percentage: number
      growth_rate: number
    }>
  }
  accommodation_data: {
    total_establishments: number
    total_rooms: number
    total_beds: number
    occupancy_rate: number
    average_daily_rate: number
    revenue_per_available_room: number
    average_length_of_stay: number
    by_category: Array<{
      category: 'LUXURY' | 'PREMIUM' | 'STANDARD' | 'ECONOMY' | 'BUDGET'
      establishments: number
      occupancy_rate: number
      average_rate: number
    }>
    by_type: Array<{
      type: 'HOTEL' | 'POUSADA' | 'RESORT' | 'HOSTEL' | 'APARTMENT' | 'CAMPING'
      count: number
      occupancy_rate: number
    }>
  }
  economic_impact: {
    total_tourism_revenue: number
    direct_spending: number
    indirect_spending: number
    induced_spending: number
    tax_revenue: number
    employment: {
      direct_jobs: number
      indirect_jobs: number
      total_jobs: number
      unemployment_rate: number
    }
    gdp_contribution: {
      absolute_value: number
      percentage_of_total_gdp: number
    }
    foreign_exchange_earnings: number
  }
  attractions_data: {
    total_attractions: number
    most_visited: Array<{
      attraction_id: string
      attraction_name: string
      category: string
      visitors: number
      revenue: number
      growth_rate: number
    }>
    by_category: Array<{
      category: 'HISTORICAL' | 'CULTURAL' | 'NATURAL' | 'RELIGIOUS' | 'ARCHITECTURAL' | 'ADVENTURE' | 'GASTRONOMIC'
      count: number
      total_visitors: number
      average_visitors_per_attraction: number
    }>
    visitor_satisfaction: {
      average_rating: number
      total_reviews: number
      repeat_visit_rate: number
    }
  }
  events_data: {
    total_events: number
    total_attendees: number
    by_category: Array<{
      category: 'FESTIVAL' | 'CULTURAL' | 'SPORTS' | 'GASTRONOMIC' | 'RELIGIOUS' | 'MUSICAL'
      count: number
      attendees: number
      revenue: number
    }>
    major_events: Array<{
      event_id: string
      event_name: string
      attendees: number
      economic_impact: number
      media_value: number
    }>
    seasonal_distribution: Array<{
      season: 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER'
      events: number
      attendees: number
    }>
  }
  transportation_data: {
    arrival_methods: Array<{
      method: 'FLIGHT' | 'BUS' | 'CAR' | 'TRAIN' | 'CRUISE' | 'OTHER'
      visitors: number
      percentage: number
      growth_rate: number
    }>
    airport_statistics: {
      total_passengers: number
      international_passengers: number
      domestic_passengers: number
      flights: number
      load_factor: number
    }
    road_traffic: {
      vehicle_count: number
      tourism_related_percentage: number
    }
  }
  seasonality: {
    peak_months: Array<{
      month: number
      visitors: number
      occupancy_rate: number
      revenue: number
    }>
    low_months: Array<{
      month: number
      visitors: number
      occupancy_rate: number
      revenue: number
    }>
    seasonal_index: Array<{
      month: number
      index: number
    }>
  }
  spending_patterns: {
    average_per_visitor_per_day: number
    average_total_per_visitor: number
    spending_categories: Array<{
      category: 'ACCOMMODATION' | 'FOOD_BEVERAGE' | 'TRANSPORTATION' | 'ACTIVITIES' | 'SHOPPING' | 'OTHER'
      amount: number
      percentage: number
    }>
    by_visitor_type: Array<{
      type: 'DOMESTIC' | 'INTERNATIONAL' | 'BUSINESS' | 'LEISURE'
      daily_spending: number
      total_spending: number
    }>
  }
  digital_presence: {
    website_visitors: number
    social_media_engagement: Array<{
      platform: 'FACEBOOK' | 'INSTAGRAM' | 'TWITTER' | 'YOUTUBE' | 'TIKTOK'
      followers: number
      engagement_rate: number
      reach: number
    }>
    online_bookings: {
      total_bookings: number
      percentage_of_total: number
      conversion_rate: number
    }
    review_platforms: Array<{
      platform: string
      total_reviews: number
      average_rating: number
      sentiment_score: number
    }>
  }
  sustainability_metrics: {
    carbon_footprint: {
      total_emissions: number
      per_visitor_emissions: number
      reduction_percentage: number
    }
    waste_management: {
      total_waste: number
      recycling_rate: number
      waste_per_visitor: number
    }
    water_consumption: {
      total_consumption: number
      per_visitor_consumption: number
      conservation_percentage: number
    }
    certified_sustainable_businesses: {
      count: number
      percentage: number
    }
  }
  infrastructure_capacity: {
    hotel_bed_availability: number
    restaurant_seats: number
    parking_spaces: number
    public_transport_capacity: number
    utilities_capacity: {
      water_supply: number
      electricity: number
      waste_treatment: number
    }
  }
  competitive_analysis: {
    market_share: {
      regional_position: number
      national_position: number
      international_position: number
    }
    benchmarking: Array<{
      competitor_destination: string
      visitors: number
      revenue: number
      occupancy_rate: number
      average_daily_rate: number
    }>
  }
  forecasting: {
    visitor_projections: Array<{
      year: number
      projected_visitors: number
      confidence_interval: {
        lower: number
        upper: number
      }
    }>
    revenue_projections: Array<{
      year: number
      projected_revenue: number
      growth_rate: number
    }>
    capacity_needs: Array<{
      year: number
      additional_rooms_needed: number
      infrastructure_investments: number
    }>
  }
  quality_indicators: {
    visitor_satisfaction_index: number
    service_quality_score: number
    safety_perception_index: number
    value_for_money_index: number
    recommendation_likelihood: number
  }
  challenges_opportunities: {
    challenges: Array<{
      challenge: string
      impact_level: 'LOW' | 'MEDIUM' | 'HIGH'
      affected_areas: Array<string>
    }>
    opportunities: Array<{
      opportunity: string
      potential_impact: 'LOW' | 'MEDIUM' | 'HIGH'
      investment_required: number
      timeline: string
    }>
  }
  data_sources: Array<{
    source: string
    type: 'PRIMARY' | 'SECONDARY'
    reliability: 'HIGH' | 'MEDIUM' | 'LOW'
    last_updated: string
  }>
  created_at: string
  updated_at: string
}

export interface CreateTourismStatisticsData {
  period: {
    type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
    start_date: string
    end_date: string
    year: number
    month?: number
    quarter?: number
    week?: number
  }
  visitor_data: {
    total_visitors: number
    domestic_visitors: number
    international_visitors: number
    visitor_growth_rate: number
  }
  accommodation_data: {
    total_establishments: number
    total_rooms: number
    occupancy_rate: number
    average_daily_rate: number
    average_length_of_stay: number
  }
  economic_impact: {
    total_tourism_revenue: number
    direct_spending: number
    tax_revenue: number
    employment: {
      direct_jobs: number
      indirect_jobs: number
    }
  }
  attractions_data: {
    total_attractions: number
    most_visited: Array<{
      attraction_id: string
      attraction_name: string
      category: string
      visitors: number
      revenue: number
    }>
  }
  events_data: {
    total_events: number
    total_attendees: number
    by_category: Array<{
      category: 'FESTIVAL' | 'CULTURAL' | 'SPORTS' | 'GASTRONOMIC' | 'RELIGIOUS' | 'MUSICAL'
      count: number
      attendees: number
      revenue: number
    }>
  }
  spending_patterns: {
    average_per_visitor_per_day: number
    average_total_per_visitor: number
    spending_categories: Array<{
      category: 'ACCOMMODATION' | 'FOOD_BEVERAGE' | 'TRANSPORTATION' | 'ACTIVITIES' | 'SHOPPING' | 'OTHER'
      amount: number
      percentage: number
    }>
  }
}

export interface TourismStatisticsFilters {
  period_type?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  year?: number
  month?: number
  quarter?: number
  start_date?: string
  end_date?: string
  min_visitors?: number
  max_visitors?: number
  min_revenue?: number
  max_revenue?: number
  min_occupancy_rate?: number
  max_occupancy_rate?: number
  visitor_type?: 'DOMESTIC' | 'INTERNATIONAL'
  accommodation_category?: 'LUXURY' | 'PREMIUM' | 'STANDARD' | 'ECONOMY' | 'BUDGET'
  attraction_category?: 'HISTORICAL' | 'CULTURAL' | 'NATURAL' | 'RELIGIOUS' | 'ARCHITECTURAL' | 'ADVENTURE' | 'GASTRONOMIC'
  event_category?: 'FESTIVAL' | 'CULTURAL' | 'SPORTS' | 'GASTRONOMIC' | 'RELIGIOUS' | 'MUSICAL'
  created_from?: string
  created_to?: string
}

export const useTourismStatistics = () => {
  const [statistics, setStatistics] = useState<TourismStatistics[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatistics = useCallback(async (filters?: TourismStatisticsFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/tourism/statistics', { params: filters })
      setStatistics(response.data)
    } catch (err) {
      setError('Falha ao carregar estatísticas de turismo')
      console.error('Error fetching tourism statistics:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getStatisticsById = useCallback(async (id: string): Promise<TourismStatistics | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/tourism/statistics/${id}`)
      return response.data
    } catch (err) {
      setError('Falha ao carregar estatística de turismo')
      console.error('Error fetching tourism statistics:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createStatistics = useCallback(async (data: CreateTourismStatisticsData): Promise<TourismStatistics | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/tourism/statistics', data)
      const newStatistics = response.data
      setStatistics(prev => [...prev, newStatistics])
      return newStatistics
    } catch (err) {
      setError('Falha ao criar estatística de turismo')
      console.error('Error creating tourism statistics:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatistics = useCallback(async (id: string, data: Partial<CreateTourismStatisticsData>): Promise<TourismStatistics | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/tourism/statistics/${id}`, data)
      const updatedStatistics = response.data
      setStatistics(prev => prev.map(stat => stat.id === id ? updatedStatistics : stat))
      return updatedStatistics
    } catch (err) {
      setError('Falha ao atualizar estatística de turismo')
      console.error('Error updating tourism statistics:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteStatistics = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.delete(`/tourism/statistics/${id}`)
      setStatistics(prev => prev.filter(stat => stat.id !== id))
      return true
    } catch (err) {
      setError('Falha ao excluir estatística de turismo')
      console.error('Error deleting tourism statistics:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const generateReport = useCallback(async (filters: {
    period_type: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
    year: number
    month?: number
    quarter?: number
    report_type: 'COMPREHENSIVE' | 'SUMMARY' | 'TRENDS' | 'COMPARATIVE'
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.post('/tourism/statistics/generate-report', filters)
      return true
    } catch (err) {
      setError('Falha ao gerar relatório')
      console.error('Error generating report:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateVisitorData = useCallback(async (statisticsId: string, visitorData: {
    total_visitors?: number
    domestic_visitors?: number
    international_visitors?: number
    visitor_demographics?: {
      age_groups: Array<{
        age_range: string
        count: number
        percentage: number
      }>
      gender_distribution: {
        male: number
        female: number
        other: number
      }
    }
    visitor_origin?: Array<{
      country: string
      state?: string
      city?: string
      count: number
      percentage: number
    }>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/tourism/statistics/${statisticsId}/visitor-data`, visitorData)
      const updatedStatistics = response.data
      setStatistics(prev => prev.map(stat => stat.id === statisticsId ? updatedStatistics : stat))
      return true
    } catch (err) {
      setError('Falha ao atualizar dados de visitantes')
      console.error('Error updating visitor data:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateEconomicImpact = useCallback(async (statisticsId: string, economicData: {
    total_tourism_revenue?: number
    direct_spending?: number
    indirect_spending?: number
    tax_revenue?: number
    employment?: {
      direct_jobs: number
      indirect_jobs: number
    }
    gdp_contribution?: {
      absolute_value: number
      percentage_of_total_gdp: number
    }
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/tourism/statistics/${statisticsId}/economic-impact`, economicData)
      const updatedStatistics = response.data
      setStatistics(prev => prev.map(stat => stat.id === statisticsId ? updatedStatistics : stat))
      return true
    } catch (err) {
      setError('Falha ao atualizar impacto econômico')
      console.error('Error updating economic impact:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addForecast = useCallback(async (statisticsId: string, forecast: {
    visitor_projections?: Array<{
      year: number
      projected_visitors: number
      confidence_interval: {
        lower: number
        upper: number
      }
    }>
    revenue_projections?: Array<{
      year: number
      projected_revenue: number
      growth_rate: number
    }>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/statistics/${statisticsId}/forecast`, forecast)
      const updatedStatistics = response.data
      setStatistics(prev => prev.map(stat => stat.id === statisticsId ? updatedStatistics : stat))
      return true
    } catch (err) {
      setError('Falha ao adicionar previsão')
      console.error('Error adding forecast:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateQualityIndicators = useCallback(async (statisticsId: string, quality: {
    visitor_satisfaction_index?: number
    service_quality_score?: number
    safety_perception_index?: number
    value_for_money_index?: number
    recommendation_likelihood?: number
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/tourism/statistics/${statisticsId}/quality-indicators`, quality)
      const updatedStatistics = response.data
      setStatistics(prev => prev.map(stat => stat.id === statisticsId ? updatedStatistics : stat))
      return true
    } catch (err) {
      setError('Falha ao atualizar indicadores de qualidade')
      console.error('Error updating quality indicators:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getStatisticsByPeriod = useCallback((periodType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY') => {
    return statistics.filter(stat => stat.period.type === periodType)
  }, [statistics])

  const getYearlyStatistics = useCallback((year: number) => {
    return statistics.filter(stat => stat.period.year === year)
  }, [statistics])

  const getMonthlyStatistics = useCallback((year: number, month: number) => {
    return statistics.filter(stat => stat.period.year === year && stat.period.month === month)
  }, [statistics])

  const calculateTotalVisitors = useCallback((filters?: { year?: number, period_type?: string }) => {
    let filteredStats = statistics

    if (filters?.year) {
      filteredStats = filteredStats.filter(stat => stat.period.year === filters.year)
    }

    if (filters?.period_type) {
      filteredStats = filteredStats.filter(stat => stat.period.type === filters.period_type)
    }

    return filteredStats.reduce((total, stat) => total + stat.visitor_data.total_visitors, 0)
  }, [statistics])

  const calculateTotalRevenue = useCallback((filters?: { year?: number, period_type?: string }) => {
    let filteredStats = statistics

    if (filters?.year) {
      filteredStats = filteredStats.filter(stat => stat.period.year === filters.year)
    }

    if (filters?.period_type) {
      filteredStats = filteredStats.filter(stat => stat.period.type === filters.period_type)
    }

    return filteredStats.reduce((total, stat) => total + stat.economic_impact.total_tourism_revenue, 0)
  }, [statistics])

  const calculateAverageOccupancy = useCallback((filters?: { year?: number }) => {
    let filteredStats = statistics

    if (filters?.year) {
      filteredStats = filteredStats.filter(stat => stat.period.year === filters.year)
    }

    if (filteredStats.length === 0) return 0

    const totalOccupancy = filteredStats.reduce((total, stat) => total + stat.accommodation_data.occupancy_rate, 0)
    return totalOccupancy / filteredStats.length
  }, [statistics])

  const getTrendAnalysis = useCallback((metric: 'visitors' | 'revenue' | 'occupancy', periods: number = 12) => {
    const recentStats = statistics
      .sort((a, b) => new Date(b.period.start_date).getTime() - new Date(a.period.start_date).getTime())
      .slice(0, periods)

    return recentStats.map(stat => {
      let value: number
      switch (metric) {
        case 'visitors':
          value = stat.visitor_data.total_visitors
          break
        case 'revenue':
          value = stat.economic_impact.total_tourism_revenue
          break
        case 'occupancy':
          value = stat.accommodation_data.occupancy_rate
          break
        default:
          value = 0
      }

      return {
        period: stat.period.start_date,
        value,
        growth_rate: stat.visitor_data.visitor_growth_rate
      }
    }).reverse()
  }, [statistics])

  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  return {
    statistics,
    loading,
    error,
    fetchStatistics,
    getStatisticsById,
    createStatistics,
    updateStatistics,
    deleteStatistics,
    generateReport,
    updateVisitorData,
    updateEconomicImpact,
    addForecast,
    updateQualityIndicators,
    getStatisticsByPeriod,
    getYearlyStatistics,
    getMonthlyStatistics,
    calculateTotalVisitors,
    calculateTotalRevenue,
    calculateAverageOccupancy,
    getTrendAnalysis
  }
}