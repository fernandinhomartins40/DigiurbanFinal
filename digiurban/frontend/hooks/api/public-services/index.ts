// Public Services Hooks - Export all public services-related hooks
export { useServiceRequests } from './useServiceRequests'
export { useCleaningSchedule } from './useCleaningSchedule'
export { useStreetLighting } from './useStreetLighting'
export { useSpecialCollection } from './useSpecialCollection'
export { useProblemReports } from './useProblemReports'
export { useTeamSchedule } from './useTeamSchedule'
export { usePublicServicesAttendances } from './usePublicServicesAttendances'

// Re-export all types for convenience
export type {
  ServiceRequest,
  CreateServiceRequestData,
  UpdateServiceRequestData,
  ServiceRequestFilters,
  UseServiceRequestsReturn
} from './useServiceRequests'

export type {
  CleaningSchedule,
  CreateCleaningScheduleData,
  UseCleaningScheduleReturn
} from './useCleaningSchedule'

export type {
  StreetLight,
  CreateStreetLightData,
  ReportIssueData,
  MaintenanceData,
  UseStreetLightingReturn
} from './useStreetLighting'

export type {
  SpecialCollection,
  CreateSpecialCollectionData,
  UseSpecialCollectionReturn
} from './useSpecialCollection'

export type {
  ProblemReport,
  CreateProblemReportData,
  UseProblemReportsReturn
} from './useProblemReports'

export type {
  TeamSchedule,
  CreateTeamScheduleData,
  TeamMember,
  UseTeamScheduleReturn
} from './useTeamSchedule'

export type {
  PublicServiceAttendance,
  CreatePublicServiceAttendanceData,
  AttendanceFilters,
  AttendanceStats,
  UsePublicServicesAttendancesReturn
} from './usePublicServicesAttendances'