// Analytics Hooks - Fase 6
export { useAnalytics } from './useAnalytics'
export { useReports } from './useReports'
export { useAlerts } from './useAlerts'
export { useDashboards } from './useDashboards'
export { useBenchmarks } from './useBenchmarks'
export { useKPIs } from './useKPIs'

// Types exports
export type {
  AnalyticsFilters,
  KPI,
  RealtimeMetrics,
  TrendData,
  DashboardData
} from './useAnalytics'

export type {
  Report,
  ReportExecution,
  CreateReportData,
  ExecuteReportParams
} from './useReports'

export type {
  Alert,
  AlertTrigger,
  CreateAlertData,
  AlertDashboard
} from './useAlerts'

export type {
  DashboardWidget,
  Dashboard,
  CreateDashboardData,
  CitizenDashboard,
  EmployeeDashboard,
  CoordinatorDashboard,
  ManagerDashboard,
  ExecutiveDashboard,
  SuperAdminDashboard
} from './useDashboards'

export type {
  Benchmark,
  BenchmarkComparison,
  BenchmarkData
} from './useBenchmarks'

export type {
  KPIDefinition,
  KPIValue,
  CreateKPIData
} from './useKPIs'