// Education Hooks - Export all education-related hooks
export { useSchools } from './useSchools'
export { useStudents } from './useStudents'
export { useEnrollments } from './useEnrollments'
export { useAttendance } from './useAttendance'
export { useSchoolTransport } from './useSchoolTransport'
export { useSchoolMeals } from './useSchoolMeals'
export { useSchoolIncidents } from './useSchoolIncidents'
export { useSchoolEvents } from './useSchoolEvents'

// Re-export all types for convenience
export type {
  School,
  CreateSchoolData,
  UpdateSchoolData,
  UseSchoolsReturn
} from './useSchools'

export type {
  Student,
  CreateStudentData,
  UpdateStudentData,
  StudentFilters,
  UseStudentsReturn
} from './useStudents'

export type {
  Enrollment,
  CreateEnrollmentData,
  UpdateEnrollmentData,
  EnrollmentFilters,
  UseEnrollmentsReturn
} from './useEnrollments'

export type {
  Attendance,
  MarkAttendanceData,
  BulkAttendanceData,
  AttendanceFilters,
  AttendanceStats,
  UseAttendanceReturn
} from './useAttendance'

export type {
  SchoolTransport,
  CreateSchoolTransportData,
  UpdateSchoolTransportData,
  TransportStudent,
  AddStudentToTransportData,
  UseSchoolTransportReturn
} from './useSchoolTransport'

export type {
  SchoolMeal,
  CreateSchoolMealData,
  UpdateSchoolMealData,
  MealPlan,
  CreateMealPlanData,
  MealFilters,
  UseSchoolMealsReturn
} from './useSchoolMeals'

export type {
  SchoolIncident,
  CreateSchoolIncidentData,
  UpdateSchoolIncidentData,
  IncidentFilters,
  IncidentStats,
  UseSchoolIncidentsReturn
} from './useSchoolIncidents'

export type {
  SchoolEvent,
  CreateSchoolEventData,
  UpdateSchoolEventData,
  EventFilters,
  EventRegistration,
  UseSchoolEventsReturn
} from './useSchoolEvents'