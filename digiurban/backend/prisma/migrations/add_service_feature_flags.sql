-- =====================================================
-- MIGRATION: Adicionar Feature Flags ao Service
-- Data: 2025-10-25
-- Descrição: Adiciona flags opcionais sem quebrar compatibilidade
-- =====================================================

-- Adicionar flags de recursos (todas false por padrão = compatível!)
ALTER TABLE services ADD COLUMN hasCustomForm BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE services ADD COLUMN hasLocation BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE services ADD COLUMN hasScheduling BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE services ADD COLUMN hasSurvey BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE services ADD COLUMN hasCustomWorkflow BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE services ADD COLUMN hasCustomFields BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE services ADD COLUMN hasAdvancedDocs BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE services ADD COLUMN hasNotifications BOOLEAN NOT NULL DEFAULT false;

-- ✅ COMPATIBILIDADE TOTAL
-- Todos os serviços existentes terão flags = false
-- Funcionam EXATAMENTE como antes!

-- Índices para performance nas queries condicionais
CREATE INDEX idx_services_hasCustomForm ON services(hasCustomForm) WHERE hasCustomForm = true;
CREATE INDEX idx_services_hasLocation ON services(hasLocation) WHERE hasLocation = true;
CREATE INDEX idx_services_hasScheduling ON services(hasScheduling) WHERE hasScheduling = true;
CREATE INDEX idx_services_hasSurvey ON services(hasSurvey) WHERE hasSurvey = true;
CREATE INDEX idx_services_hasCustomWorkflow ON services(hasCustomWorkflow) WHERE hasCustomWorkflow = true;

-- Comentário sobre compatibilidade
COMMENT ON COLUMN services.hasCustomForm IS 'Flag opcional: ativa formulário customizado (padrão: false)';
COMMENT ON COLUMN services.hasLocation IS 'Flag opcional: ativa captura GPS (padrão: false)';
COMMENT ON COLUMN services.hasScheduling IS 'Flag opcional: ativa agendamento (padrão: false)';
COMMENT ON COLUMN services.hasSurvey IS 'Flag opcional: ativa pesquisas (padrão: false)';
COMMENT ON COLUMN services.hasCustomWorkflow IS 'Flag opcional: ativa workflow customizado (padrão: false)';
COMMENT ON COLUMN services.hasCustomFields IS 'Flag opcional: ativa campos customizados (padrão: false)';
COMMENT ON COLUMN services.hasAdvancedDocs IS 'Flag opcional: ativa docs avançados com IA (padrão: false)';
COMMENT ON COLUMN services.hasNotifications IS 'Flag opcional: ativa notificações customizadas (padrão: false)';
