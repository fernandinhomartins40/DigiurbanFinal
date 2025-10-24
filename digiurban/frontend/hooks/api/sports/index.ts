// Sports Hooks - Export all sports-related hooks
export { useSportsEvents } from './useSportsEvents'
export { useCompetitions } from './useCompetitions'
export { useAthletes } from './useAthletes'
export { useSportsTeams } from './useSportsTeams'
export { useSportsInfrastructure } from './useSportsInfrastructure'
export { useSportsPrograms } from './useSportsPrograms'
export { useSportsInstructors } from './useSportsInstructors'
export { useSportsReports } from './useSportsReports'

// Re-export all types for convenience
export type {
  SportsEvent,
  CreateSportsEventData,
  UseSportsEventsReturn
} from './useSportsEvents'

export type {
  Competition,
  CreateCompetitionData,
  UseCompetitionsReturn
} from './useCompetitions'

export type {
  Athlete,
  CreateAthleteData,
  UseAthletesReturn
} from './useAthletes'

export type {
  SportsTeam,
  CreateSportsTeamData,
  UseSportsTeamsReturn
} from './useSportsTeams'

export type {
  SportsInfrastructure,
  CreateSportsInfrastructureData,
  UseSportsInfrastructureReturn
} from './useSportsInfrastructure'

export type {
  SportsProgram,
  CreateSportsProgramData,
  UseSportsProgramsReturn
} from './useSportsPrograms'

export type {
  SportsInstructor,
  CreateSportsInstructorData,
  UseSportsInstructorsReturn
} from './useSportsInstructors'

export type {
  SportsReport,
  CreateSportsReportData,
  ReportFilters,
  ReportStats,
  UseSportsReportsReturn
} from './useSportsReports'