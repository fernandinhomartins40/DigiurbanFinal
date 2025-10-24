// Security Hooks - Export all security-related hooks
export { useSecurityOccurrences } from './useSecurityOccurrences'
export { useSecurityAlerts } from './useSecurityAlerts'
export { useSecurityPatrols } from './useSecurityPatrols'
export { useCriticalPoints } from './useCriticalPoints'
export { useSecurityStatistics } from './useSecurityStatistics'
export { useIntegratedSurveillance } from './useIntegratedSurveillance'
export { useSecurityAttendances } from './useSecurityAttendances'
export { useGuardSupport } from './useGuardSupport'

// Re-export all types for convenience
export type {
  SecurityOccurrence,
  CreateSecurityOccurrenceData,
  UpdateSecurityOccurrenceData,
  OccurrenceFilters,
  UseSecurityOccurrencesReturn
} from './useSecurityOccurrences'

export type {
  SecurityAlert,
  CreateSecurityAlertData,
  UseSecurityAlertsReturn
} from './useSecurityAlerts'

export type {
  SecurityPatrol,
  CreateSecurityPatrolData,
  UseSecurityPatrolsReturn
} from './useSecurityPatrols'

export type {
  CriticalPoint,
  CreateCriticalPointData,
  UseCriticalPointsReturn
} from './useCriticalPoints'

export type {
  SecurityStatistics,
  UseSecurityStatisticsReturn
} from './useSecurityStatistics'

export type {
  SurveillanceCamera,
  UseIntegratedSurveillanceReturn
} from './useIntegratedSurveillance'

export type {
  SecurityAttendance,
  CreateSecurityAttendanceData,
  UseSecurityAttendancesReturn
} from './useSecurityAttendances'

export type {
  GuardSupportRequest,
  CreateGuardSupportRequestData,
  UseGuardSupportReturn
} from './useGuardSupport'