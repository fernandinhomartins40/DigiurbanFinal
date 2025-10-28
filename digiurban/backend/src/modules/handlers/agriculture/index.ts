// ============================================================
// AGRICULTURE HANDLERS - Index
// ============================================================

import { moduleHandlerRegistry } from '../../../core/module-handler';
import { TechnicalAssistanceHandler } from './technical-assistance-handler';
import { SeedDistributionHandler } from './seed-distribution-handler';
import { SoilAnalysisHandler } from './soil-analysis-handler';
import { FarmerMarketRegistrationHandler } from './farmer-market-handler';

export function registerAgricultureHandlers() {
  // Assistência Técnica
  moduleHandlerRegistry.register(
    'agriculture:TechnicalAssistance',
    new TechnicalAssistanceHandler()
  );

  // Distribuição de Sementes/Mudas
  moduleHandlerRegistry.register(
    'agriculture:SeedDistribution',
    new SeedDistributionHandler()
  );

  // Análise de Solo
  moduleHandlerRegistry.register(
    'agriculture:SoilAnalysis',
    new SoilAnalysisHandler()
  );

  // Feira do Produtor
  moduleHandlerRegistry.register(
    'agriculture:FarmerMarketRegistration',
    new FarmerMarketRegistrationHandler()
  );

  console.log('✅ Agriculture handlers registered');
}

export {
  TechnicalAssistanceHandler,
  SeedDistributionHandler,
  SoilAnalysisHandler,
  FarmerMarketRegistrationHandler
};
