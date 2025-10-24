// Social Assistance Hooks - Export all social assistance-related hooks
export { useVulnerableFamilies } from './useVulnerableFamilies'
export { useFamilyVisits } from './useFamilyVisits'
export { useSocialPrograms } from './useSocialPrograms'
export { useFamilyBenefits } from './useFamilyBenefits'
export { useEmergencyDeliveries } from './useEmergencyDeliveries'
export { useServiceUnits } from './useServiceUnits'
export { useSocialAttendances } from './useSocialAttendances'
export { useProgramEnrollments } from './useProgramEnrollments'
export { useCrasCreasManagement } from './useCrasCreasManagement'

// Re-export all types for convenience
export type {
  VulnerableFamily,
  CreateVulnerableFamilyData,
  UpdateVulnerableFamilyData,
  FamilyFilters,
  FamilyStats,
  UseVulnerableFamiliesReturn
} from './useVulnerableFamilies'

export type {
  FamilyVisit,
  CreateFamilyVisitData,
  UpdateFamilyVisitData,
  VisitFilters,
  VisitStats,
  UseFamilyVisitsReturn
} from './useFamilyVisits'

export type {
  SocialProgram,
  CreateSocialProgramData,
  UpdateSocialProgramData,
  ProgramFilters,
  ProgramStats,
  UseSocialProgramsReturn
} from './useSocialPrograms'

export type {
  FamilyBenefit,
  CreateFamilyBenefitData,
  UpdateFamilyBenefitData,
  BenefitFilters,
  UseFamilyBenefitsReturn
} from './useFamilyBenefits'

export type {
  EmergencyDelivery,
  CreateEmergencyDeliveryData,
  UpdateEmergencyDeliveryData,
  DeliveryFilters,
  UseEmergencyDeliveriesReturn
} from './useEmergencyDeliveries'

export type {
  ServiceUnit,
  CreateServiceUnitData,
  UpdateServiceUnitData,
  UseServiceUnitsReturn
} from './useServiceUnits'

export type {
  SocialAttendance,
  CreateSocialAttendanceData,
  UpdateSocialAttendanceData,
  AttendanceFilters,
  UseSocialAttendancesReturn
} from './useSocialAttendances'

export type {
  ProgramEnrollment,
  CreateProgramEnrollmentData,
  UpdateProgramEnrollmentData,
  EnrollmentFilters,
  UseProgramEnrollmentsReturn
} from './useProgramEnrollments'

export type {
  CrasCreasManagement,
  CreateCrasCreasManagementData,
  UpdateCrasCreasManagementData,
  ManagementFilters,
  UseCrasCreasManagementReturn
} from './useCrasCreasManagement'