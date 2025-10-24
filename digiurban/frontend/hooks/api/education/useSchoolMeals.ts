'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/auth'

// Types
interface SchoolMeal {
  id: string
  schoolId: string
  mealType: 'BREAKFAST' | 'LUNCH' | 'SNACK' | 'DINNER'
  date: string
  menuDescription: string
  ingredients: string[]
  nutritionalInfo?: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  allergens?: string[]
  specialDiets?: ('VEGETARIAN' | 'VEGAN' | 'GLUTEN_FREE' | 'LACTOSE_FREE' | 'DIABETIC')[]
  cost: number
  studentsServed: number
  observations?: string
  isActive: boolean
  school?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

interface CreateSchoolMealData {
  schoolId: string
  mealType: 'BREAKFAST' | 'LUNCH' | 'SNACK' | 'DINNER'
  date: string
  menuDescription: string
  ingredients: string[]
  nutritionalInfo?: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  allergens?: string[]
  specialDiets?: ('VEGETARIAN' | 'VEGAN' | 'GLUTEN_FREE' | 'LACTOSE_FREE' | 'DIABETIC')[]
  cost: number
  studentsServed: number
  observations?: string
}

interface UpdateSchoolMealData extends Partial<CreateSchoolMealData> {
  isActive?: boolean
}

interface MealPlan {
  id: string
  schoolId: string
  weekStart: string
  weekEnd: string
  meals: {
    day: string
    breakfast?: SchoolMeal
    lunch?: SchoolMeal
    snack?: SchoolMeal
    dinner?: SchoolMeal
  }[]
  totalCost: number
  totalStudents: number
  isApproved: boolean
  approvedBy?: string
  approvedAt?: string
}

interface CreateMealPlanData {
  schoolId: string
  weekStart: string
  weekEnd: string
  meals: {
    day: string
    mealType: 'BREAKFAST' | 'LUNCH' | 'SNACK' | 'DINNER'
    menuDescription: string
    ingredients: string[]
    cost: number
    studentsServed: number
  }[]
}

interface MealFilters {
  schoolId?: string
  mealType?: 'BREAKFAST' | 'LUNCH' | 'SNACK' | 'DINNER'
  dateFrom?: string
  dateTo?: string
  isActive?: boolean
}

interface UseSchoolMealsReturn {
  meals: SchoolMeal[]
  mealPlans: MealPlan[]
  loading: boolean
  error: string | null
  createMeal: (data: CreateSchoolMealData) => Promise<SchoolMeal>
  updateMeal: (id: string, data: UpdateSchoolMealData) => Promise<SchoolMeal>
  deleteMeal: (id: string) => Promise<void>
  getMealById: (id: string) => SchoolMeal | undefined
  getMealsBySchool: (schoolId: string, date?: string) => SchoolMeal[]
  createMealPlan: (data: CreateMealPlanData) => Promise<MealPlan>
  approveMealPlan: (id: string) => Promise<MealPlan>
  getMealPlansBySchool: (schoolId: string) => MealPlan[]
  refreshMeals: (filters?: MealFilters) => Promise<void>
}

export function useSchoolMeals(initialFilters?: MealFilters): UseSchoolMealsReturn {
  const [meals, setMeals] = useState<SchoolMeal[]>([])
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMeals = useCallback(async (filters?: MealFilters) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (filters?.schoolId) queryParams.append('schoolId', filters.schoolId)
      if (filters?.mealType) queryParams.append('mealType', filters.mealType)
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom)
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo)
      if (filters?.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString())

      const query = queryParams.toString()
      const endpoint = `/api/specialized/education/school-meals${query ? `?${query}` : ''}`

      const data = await apiClient.get(endpoint)
      setMeals(data.meals || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar merenda escolar')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMealPlans = useCallback(async () => {
    try {
      const data = await apiClient.get('/api/specialized/education/school-meals/plans')
      setMealPlans(data.mealPlans || [])
    } catch (err) {
      console.error('Erro ao carregar planos de merenda:', err)
    }
  }, [])

  const createMeal = useCallback(async (data: CreateSchoolMealData): Promise<SchoolMeal> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/education/school-meals', data)
      const newMeal = response.meal
      setMeals(prev => [newMeal, ...prev])
      return newMeal
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar merenda'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateMeal = useCallback(async (id: string, data: UpdateSchoolMealData): Promise<SchoolMeal> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/education/school-meals/${id}`, data)
      const updatedMeal = response.meal
      setMeals(prev => prev.map(meal =>
        meal.id === id ? updatedMeal : meal
      ))
      return updatedMeal
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar merenda'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteMeal = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/education/school-meals/${id}`)
      setMeals(prev => prev.filter(meal => meal.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir merenda'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const createMealPlan = useCallback(async (data: CreateMealPlanData): Promise<MealPlan> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/education/school-meals/plans', data)
      const newMealPlan = response.mealPlan
      setMealPlans(prev => [newMealPlan, ...prev])
      return newMealPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar plano de merenda'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const approveMealPlan = useCallback(async (id: string): Promise<MealPlan> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/education/school-meals/plans/${id}/approve`, {})
      const approvedMealPlan = response.mealPlan
      setMealPlans(prev => prev.map(plan =>
        plan.id === id ? approvedMealPlan : plan
      ))
      return approvedMealPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao aprovar plano de merenda'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getMealById = useCallback((id: string): SchoolMeal | undefined => {
    return meals.find(meal => meal.id === id)
  }, [meals])

  const getMealsBySchool = useCallback((schoolId: string, date?: string): SchoolMeal[] => {
    return meals.filter(meal =>
      meal.schoolId === schoolId && (!date || meal.date === date)
    )
  }, [meals])

  const getMealPlansBySchool = useCallback((schoolId: string): MealPlan[] => {
    return mealPlans.filter(plan => plan.schoolId === schoolId)
  }, [mealPlans])

  const refreshMeals = useCallback(async (filters?: MealFilters) => {
    await Promise.all([fetchMeals(filters), fetchMealPlans()])
  }, [fetchMeals, fetchMealPlans])

  useEffect(() => {
    fetchMeals(initialFilters)
    fetchMealPlans()
  }, [fetchMeals, fetchMealPlans, initialFilters])

  return {
    meals,
    mealPlans,
    loading,
    error,
    createMeal,
    updateMeal,
    deleteMeal,
    getMealById,
    getMealsBySchool,
    createMealPlan,
    approveMealPlan,
    getMealPlansBySchool,
    refreshMeals
  }
}