import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface HealthStatistics {
  id: string
  period: {
    type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
    start_date: string
    end_date: string
    year: number
    month?: number
    quarter?: number
    week?: number
  }
  population_data: {
    total_population: number
    population_by_age_group: Array<{
      age_range: string
      count: number
      percentage: number
    }>
    population_by_gender: {
      male: number
      female: number
      other: number
    }
    coverage_area: {
      neighborhoods: Array<string>
      geographic_coverage: number
    }
  }
  health_services: {
    consultations: {
      total_consultations: number
      by_specialty: Array<{
        specialty: string
        count: number
        percentage: number
      }>
      by_health_center: Array<{
        health_center_name: string
        count: number
      }>
      emergency_consultations: number
      preventive_consultations: number
    }
    hospitalizations: {
      total_admissions: number
      average_length_of_stay: number
      by_diagnosis: Array<{
        icd10_code: string
        diagnosis: string
        count: number
      }>
      mortality_rate: number
      readmission_rate: number
    }
    procedures: {
      total_procedures: number
      surgical_procedures: number
      diagnostic_procedures: number
      therapeutic_procedures: number
      by_type: Array<{
        procedure_code: string
        procedure_name: string
        count: number
      }>
    }
  }
  vaccination_data: {
    total_doses_administered: number
    by_vaccine: Array<{
      vaccine_name: string
      doses_administered: number
      target_population: number
      coverage_percentage: number
    }>
    by_age_group: Array<{
      age_range: string
      doses_administered: number
      coverage_percentage: number
    }>
    adverse_events: number
    campaign_effectiveness: number
  }
  epidemiological_data: {
    notifiable_diseases: Array<{
      disease_name: string
      icd10_code: string
      confirmed_cases: number
      suspected_cases: number
      incidence_rate: number
      mortality_rate: number
    }>
    outbreaks: {
      total_outbreaks: number
      controlled_outbreaks: number
      ongoing_outbreaks: number
    }
    environmental_health: {
      water_quality_violations: number
      food_safety_inspections: number
      vector_control_activities: number
    }
  }
  maternal_child_health: {
    prenatal_care: {
      pregnant_women_enrolled: number
      prenatal_visits_average: number
      high_risk_pregnancies: number
    }
    births: {
      total_births: number
      live_births: number
      stillbirths: number
      cesarean_rate: number
      low_birth_weight_rate: number
    }
    child_health: {
      children_under_5: number
      growth_monitoring_coverage: number
      malnutrition_cases: number
      infant_mortality_rate: number
    }
  }
  chronic_diseases: {
    diabetes: {
      diagnosed_cases: number
      under_treatment: number
      controlled_cases: number
      complications: number
    }
    hypertension: {
      diagnosed_cases: number
      under_treatment: number
      controlled_cases: number
      complications: number
    }
    mental_health: {
      patients_in_treatment: number
      new_cases: number
      by_condition: Array<{
        condition: string
        count: number
      }>
    }
  }
  pharmacy_data: {
    medications_dispensed: number
    average_cost_per_prescription: number
    generic_substitution_rate: number
    stock_shortages: number
    expired_medications: number
  }
  quality_indicators: {
    patient_satisfaction: {
      average_score: number
      response_rate: number
      by_service: Array<{
        service: string
        satisfaction_score: number
      }>
    }
    access_indicators: {
      average_waiting_time: number
      appointment_availability: number
      geographic_accessibility: number
    }
    safety_indicators: {
      adverse_events: number
      medication_errors: number
      healthcare_associated_infections: number
    }
  }
  financial_data: {
    total_budget: number
    budget_execution: number
    cost_per_capita: number
    cost_by_service: Array<{
      service: string
      cost: number
      percentage: number
    }>
    revenue_sources: Array<{
      source: 'SUS' | 'MUNICIPAL' | 'STATE' | 'FEDERAL' | 'OTHER'
      amount: number
      percentage: number
    }>
  }
  human_resources: {
    total_professionals: number
    by_category: Array<{
      category: string
      count: number
      ratio_per_1000_inhabitants: number
    }>
    turnover_rate: number
    absenteeism_rate: number
    training_hours: number
  }
  infrastructure: {
    health_centers: {
      total_units: number
      by_type: Array<{
        type: string
        count: number
      }>
      bed_occupancy_rate: number
      equipment_availability: number
    }
  }
  created_at: string
  updated_at: string
}

export interface CreateHealthStatisticsData {
  period: {
    type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
    start_date: string
    end_date: string
    year: number
    month?: number
    quarter?: number
    week?: number
  }
  population_data: {
    total_population: number
    population_by_age_group: Array<{
      age_range: string
      count: number
      percentage: number
    }>
    population_by_gender: {
      male: number
      female: number
      other: number
    }
  }
  health_services: {
    consultations: {
      total_consultations: number
      emergency_consultations: number
      preventive_consultations: number
    }
    hospitalizations: {
      total_admissions: number
      average_length_of_stay: number
      mortality_rate: number
    }
    procedures: {
      total_procedures: number
      surgical_procedures: number
      diagnostic_procedures: number
    }
  }
}

export interface HealthStatisticsFilters {
  period_type?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  year?: number
  month?: number
  quarter?: number
  start_date?: string
  end_date?: string
  health_center_id?: string
  created_from?: string
  created_to?: string
}

export const useHealthStatistics = () => {
  const [statistics, setStatistics] = useState<HealthStatistics[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatistics = useCallback(async (filters?: HealthStatisticsFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/health/statistics', { params: filters })
      setStatistics(response.data)
    } catch (err) {
      setError('Falha ao carregar estatísticas de saúde')
      console.error('Error fetching health statistics:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getStatisticsById = useCallback(async (id: string): Promise<HealthStatistics | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/health/statistics/${id}`)
      return response.data
    } catch (err) {
      setError('Falha ao carregar estatística')
      console.error('Error fetching statistic:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createStatistics = useCallback(async (data: CreateHealthStatisticsData): Promise<HealthStatistics | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/health/statistics', data)
      const newStatistics = response.data
      setStatistics(prev => [...prev, newStatistics])
      return newStatistics
    } catch (err) {
      setError('Falha ao criar estatísticas')
      console.error('Error creating statistics:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const generateReport = useCallback(async (filters: {
    period_type: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
    year: number
    month?: number
    quarter?: number
    report_type: 'COMPREHENSIVE' | 'SUMMARY' | 'EXECUTIVE' | 'EPIDEMIOLOGICAL'
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.post('/health/statistics/generate-report', filters)
      return true
    } catch (err) {
      setError('Falha ao gerar relatório')
      console.error('Error generating report:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getStatisticsByPeriod = useCallback((periodType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY') => {
    return statistics.filter(stat => stat.period.type === periodType)
  }, [statistics])

  const getMonthlyStatistics = useCallback((year: number, month: number) => {
    return statistics.filter(stat =>
      stat.period.type === 'MONTHLY' &&
      stat.period.year === year &&
      stat.period.month === month
    )
  }, [statistics])

  const getYearlyStatistics = useCallback((year: number) => {
    return statistics.filter(stat =>
      stat.period.type === 'YEARLY' &&
      stat.period.year === year
    )
  }, [statistics])

  const calculateTotalConsultations = useCallback((filters?: { year?: number, period_type?: string }) => {
    let filteredStats = statistics

    if (filters?.year) {
      filteredStats = filteredStats.filter(stat => stat.period.year === filters.year)
    }

    if (filters?.period_type) {
      filteredStats = filteredStats.filter(stat => stat.period.type === filters.period_type)
    }

    return filteredStats.reduce((total, stat) => total + stat.health_services.consultations.total_consultations, 0)
  }, [statistics])

  const calculateAveragePatientSatisfaction = useCallback((filters?: { year?: number }) => {
    let filteredStats = statistics

    if (filters?.year) {
      filteredStats = filteredStats.filter(stat => stat.period.year === filters.year)
    }

    if (filteredStats.length === 0) return 0

    const totalSatisfaction = filteredStats.reduce((total, stat) =>
      total + stat.quality_indicators.patient_satisfaction.average_score, 0
    )
    return totalSatisfaction / filteredStats.length
  }, [statistics])

  const getVaccinationCoverage = useCallback((vaccineName?: string) => {
    const latestStats = statistics
      .sort((a, b) => new Date(b.period.start_date).getTime() - new Date(a.period.start_date).getTime())
      .slice(0, 1)

    if (latestStats.length === 0) return []

    const vaccinationData = latestStats[0].vaccination_data.by_vaccine

    if (vaccineName) {
      return vaccinationData.filter(vaccine =>
        vaccine.vaccine_name.toLowerCase().includes(vaccineName.toLowerCase())
      )
    }

    return vaccinationData
  }, [statistics])

  const getEpidemiologicalTrends = useCallback((diseaseName: string) => {
    return statistics
      .filter(stat =>
        stat.epidemiological_data.notifiable_diseases.some(disease =>
          disease.disease_name.toLowerCase().includes(diseaseName.toLowerCase())
        )
      )
      .map(stat => {
        const disease = stat.epidemiological_data.notifiable_diseases.find(d =>
          d.disease_name.toLowerCase().includes(diseaseName.toLowerCase())
        )
        return {
          period: stat.period.start_date,
          confirmed_cases: disease?.confirmed_cases || 0,
          incidence_rate: disease?.incidence_rate || 0
        }
      })
      .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime())
  }, [statistics])

  const getCostAnalysis = useCallback((serviceType?: string) => {
    const latestStats = statistics
      .sort((a, b) => new Date(b.period.start_date).getTime() - new Date(a.period.start_date).getTime())
      .slice(0, 1)

    if (latestStats.length === 0) return []

    const costData = latestStats[0].financial_data.cost_by_service

    if (serviceType) {
      return costData.filter(service =>
        service.service.toLowerCase().includes(serviceType.toLowerCase())
      )
    }

    return costData
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
    generateReport,
    getStatisticsByPeriod,
    getMonthlyStatistics,
    getYearlyStatistics,
    calculateTotalConsultations,
    calculateAveragePatientSatisfaction,
    getVaccinationCoverage,
    getEpidemiologicalTrends,
    getCostAnalysis
  }
}