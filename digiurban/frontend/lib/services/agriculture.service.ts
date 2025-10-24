import { api, createCRUDService } from './api'

const BASE_PATH = '/api/specialized/agriculture'

export const agricultureService = {
  producers: createCRUDService(`${BASE_PATH}/producers`),
  properties: createCRUDService(`${BASE_PATH}/properties`),
  technicalAssistance: createCRUDService(`${BASE_PATH}/technical-assistance`),
  attendances: createCRUDService(`${BASE_PATH}/attendances`),
  stats: () => api.get(`${BASE_PATH}/stats`),
}
