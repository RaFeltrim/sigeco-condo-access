# Implementation Plan - System Validation Agents

- [x] 1. Set up project structure and core interfaces





  - Create directory `src/lib/validation-agents/` for all agent code
  - Create directory `tests/fixtures/validation-data/` for test data
  - Define core TypeScript interfaces in `src/types/validation-agents.ts` for TestResult, AgentResult, ValidationReport
  - Create base ValidationAgent interface that all agents will implement
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1, 12.1, 13.1, 14.1_

- [x] 2. Implement Validation Orchestrator




  - [x] 2.1 Create ValidationOrchestrator class in `src/lib/validation-agents/ValidationOrchestrator.ts`


    - Implement agent registration system with `registerAgent()` method
    - Implement `runAll()` method that executes all registered agents
    - Implement `runModule()` method to execute specific module agents
    - Implement error handling to continue if individual agents fail
    - Implement `getHealthScore()` to calculate overall system health
    - _Requirements: 15.1, 15.2, 15.3, 16.1_

- [x] 3. Implement Dashboard Validation Agent






  - [x] 3.1 Create DashboardAgent class in `src/lib/validation-agents/DashboardAgent.ts`

    - Implement `validateKPIs()` method to extract and verify KPI values
    - Implement `extractKPIValues()` to parse Acessos Hoje, Visitantes Ativos, Total Semanal, Sistema Online
    - Implement `crossReferenceWithLogs()` to verify KPI coherence with Entradas Recentes
    - Verify percentage variations (+12%, -2%) are calculated correctly
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  

  - [x] 3.2 Add Ad Blocker test functionality

    - Implement `testWithAdBlocker()` method to simulate ad blocker environment
    - Implement `enableAdBlocker()` to block tracking libraries
    - Implement `checkConsoleErrors()` to detect ERR_BLOCKED_BY_ADBLOCKER
    - Verify system stability remains above 99.9% with blocked resources
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  

  - [x] 3.3 Add stress test functionality

    - Implement `executeStressTest()` method to simulate high load
    - Implement `simulateEntries()` to create 20 consecutive entry registrations
    - Implement `simulateExits()` to create 15 consecutive exit registrations
    - Implement `checkForReactError418()` to detect React Error #418
    - Verify Atividade Recente and Fluxo de Visitas update correctly
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4. Implement Moradores Validation Agent






  - [x] 4.1 Create MoradoresAgent class in `src/lib/validation-agents/MoradoresAgent.ts`


    - Implement `testCRUDOperations()` method to test all CRUD operations
    - Implement `createMorador()` to create new Morador with Nome, Unidade, Documento
    - Implement `readMorador()` to search for Morador Carlos Pereira
    - Implement `updateMorador()` to modify Morador data
    - Implement `deleteMorador()` to delete Morador with confirmation check
    - Implement `verifyCountersUpdate()` to validate Total de Moradores, Unidades Ocupadas, Cadastros Este Mês
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [x] 4.2 Add field validation functionality


    - Implement `testFieldValidation()` method to validate form fields
    - Implement `testRequiredFields()` to verify Nome, Unidade, Documento are required
    - Implement `testDocumentMask()` to verify formatting mask is applied
    - Test that validation prevents submission without required fields
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 5. Implement Agendamentos Validation Agent






  - [x] 5.1 Create AgendamentosAgent class in `src/lib/validation-agents/AgendamentosAgent.ts`


    - Implement `testCompleteWorkflow()` method to test full agendamento flow
    - Implement `createAgendamento()` to create new agendamento for Apto 101 (João Silva)
    - Implement `changeStatus()` to change status from Pendente to Confirmado
    - Implement `verifyDisplayInCalendar()` to check agendamento appears in Agendamentos Hoje or Próximos Agendamentos
    - Verify counters for Confirmados and Pendentes update correctly
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  

  - [x] 5.2 Add status behavior validation

    - Implement `testStatusBehavior()` method to validate status transitions
    - Implement `verifyCanceledExcludedFromCounters()` to check Cancelado status exclusion
    - Implement `verifyOnlyValidStatusInCalendar()` to verify only Pendente/Confirmado in calendar
    - Test status transitions: Pendente -> Confirmado -> Cancelado
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 6. Implement Relatórios Validation Agent





  - [x] 6.1 Create RelatoriosAgent class in `src/lib/validation-agents/RelatoriosAgent.ts`


    - Implement `testReportGeneration()` method to validate PDF and Excel generation (CRITICAL)
    - Implement `generatePDFReport()` to trigger PDF download for 7-day period
    - Implement `generateExcelReport()` to trigger Excel download
    - Implement `verifyFileIntegrity()` to check file is not corrupted
    - Implement `verifyFileNotEmpty()` to check file contains data
    - Report critical failure if any report generation fails
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  

  - [x] 6.2 Add data coherence validation
    - Implement `testDataCoherence()` method to validate summary vs. detailed data
    - Implement `extractSummaryIndicators()` to parse Tempo Médio, Taxa de Ocupação, Horários de Pico
    - Implement `extractDetailedRecords()` to get underlying data
    - Implement `verifyTempoMedio()` to match average with detailed records
    - Implement `verifyTaxaOcupacao()` to validate occupancy calculation
    - Implement `verifyHorariosPico()` to match peak hours with activity data
    - Implement `verifyDistribuicaoSums100()` to validate Distribuição por Tipo sums to 100%
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 7. Implement Funcionários Validation Agent



  - [x] 7.1 Create FuncionariosAgent class in `src/lib/validation-agents/FuncionariosAgent.ts`

    - Implement `testFunctionalFlow()` method to test funcionário lifecycle
    - Implement `createFuncionario()` to create new Funcionário with Nome, Documento, Função
    - Implement `verifyInList()` to check funcionário appears in list
    - Implement `verifyCounterUpdate()` to validate Funcionários Ativos counter increments
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  

  - [x] 7.2 Add entry/exit management validation
    - Implement `testEntryExitManagement()` method to validate inactive funcionário handling
    - Implement `verifyInactiveRequiresReactivation()` to check Carlos Lima (Status Inativo) requires reactivation
    - Test complete lifecycle: Create -> Activate -> Deactivate -> Reactivate
    - _Requirements: 10.5_

- [x] 8. Implement Backup Validation Agent



  - [x] 8.1 Create BackupAgent class in `src/lib/validation-agents/BackupAgent.ts`

    - Implement `testBackupRestore()` method to validate backup/restore process
    - Implement `executeBackup()` to trigger Backup Manual
    - Implement `executeRestore()` to trigger Restaurar Backup
    - Implement `verifyDatabaseIntegrity()` to check database is not corrupted after restore
    - Implement `verifyAuditLog()` to check Log de Auditoria records Backup and Restauração actions
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  

  - [x] 8.2 Add security compliance validation
    - Implement `testSecurityCompliance()` method to validate LGPD compliance
    - Implement `verifyBackupConfig()` to check Backup Automático (Diário), Backup na Nuvem, Criptografia AES-256
    - Implement `testSecurityAlerts()` to validate alerts are functional
    - Implement `simulateFailedLogin()` to test Falha Login alert
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 9. Implement Suporte Validation Agent




  - [x] 9.1 Create SuporteAgent class in `src/lib/validation-agents/SuporteAgent.ts`

    - Implement `testTrainingMaterialStatus()` method to validate training material completion
    - Implement `checkMaterialStatus()` to verify Geração de Relatórios and Configurações de Segurança status
    - Implement `verifyCompletionCriteria()` to flag incomplete materials as project blocker
    - Report if Geração de Relatórios is below 100% completion
    - Report if Configurações de Segurança is below 100% completion
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [x] 9.2 Add support quality validation

    - Implement `testSupportQuality()` method to validate support availability
    - Implement `verifySupport24x7Accessible()` to check support contact mechanism
    - Implement `verifyCurrentVersion()` to validate Versão Atual (2.1.3) is displayed
    - Implement `checkAvailableUpdates()` to check for available updates
    - Implement `verifyUpdateWithoutDowntime()` to validate updates can be installed without critical downtime
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 10. Implement Report Aggregator



  - [x] 10.1 Create ReportAggregator class in `src/lib/validation-agents/ReportAggregator.ts`

    - Implement `aggregateResults()` method to combine all agent results
    - Implement `calculateHealthScore()` to compute overall system health (0-100)
    - Implement `identifyCriticalFailures()` to extract critical test failures
    - Implement `generateRecommendations()` to create actionable recommendations
    - _Requirements: 15.1, 15.2, 15.3, 15.4_
  

  - [x] 10.2 Add report generation functionality
    - Implement `generateJSON()` method to create structured JSON report
    - Implement `generateMarkdown()` method to create human-readable report
    - Include detailed logs for each failed validation
    - Include screenshots and videos for failed tests
    - Add timestamp and environment info to report header
    - _Requirements: 15.5_

- [x] 11. Implement CLI Interface



  - [x] 11.1 Create CLI script in `scripts/validate-system.ts`

    - Parse command line arguments: --module, --verbose, --headless, --output-dir, --fail-fast
    - Instantiate ValidationOrchestrator and register all agents
    - Display progress indicators for each agent (running/passed/failed)
    - Handle errors gracefully and display user-friendly error messages
    - _Requirements: 16.1, 16.2, 16.4_
  

  - [x] 11.2 Add report output and exit code logic
    - Write JSON report to `.kiro/reports/system-validation-{timestamp}.json`
    - Write Markdown report to `.kiro/reports/system-validation-{timestamp}.md`
    - Create symlinks for latest reports (system-validation-latest.json and .md)
    - Display summary with overall health score and module status
    - Exit with code 0 if all validations pass, otherwise exit with code 1
    - _Requirements: 16.3, 16.5_

- [x] 12. Configure Playwright for validation agents


  - Create `playwright.config.validation.ts` with appropriate settings
  - Configure timeout (60s), retries (2), screenshot/video on failure
  - Set baseURL to local development server
  - Configure browser contexts for different agents
  - Add Ad Blocker configuration for Dashboard Agent
  - _Requirements: 2.1, 2.2, 2.3_


- [x] 13. Create test data fixtures


  - Create `tests/fixtures/validation-data/moradores-test-data.json` with sample Morador data
  - Create `tests/fixtures/validation-data/agendamentos-test-data.json` with sample Agendamento data
  - Create `tests/fixtures/validation-data/funcionarios-test-data.json` with sample Funcionário data
  - Include test data for Carlos Pereira (Morador Inativo) and Carlos Lima (Funcionário Inativo)
  - _Requirements: 4.1, 6.1, 10.1_

- [x] 14. Add npm scripts and documentation


  - Add "validate:system" script to package.json that runs `tsx scripts/validate-system.ts`
  - Add "validate:dashboard", "validate:moradores", "validate:agendamentos" module-specific scripts
  - Add "validate:ci" script for CI/CD integration with --headless --fail-fast flags
  - Create `.kiro/reports/` directory if it doesn't exist
  - Update README.md with usage instructions for System Validation Agents
  - _Requirements: 16.1, 16.2_

- [x] 15. Integration and end-to-end validation



  - Run the complete System Validation suite on the current SIGECO project
  - Verify that all agents execute without errors
  - Verify that JSON and Markdown reports are generated correctly
  - Verify that screenshots and videos are captured for failures
  - Verify that exit code is correct based on validation results
  - Test module-specific execution (--module flag)
  - Test fail-fast behavior (--fail-fast flag)
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1, 12.1, 13.1, 14.1, 15.1, 16.1_

- [x] 16. Implement Realtime logs
  - Create RealtimeLogger class with real-time logging capabilities
  - Integrate RealtimeLogger into CLI for live progress updates
  - Add progress bars, spinners, and formatted output
  - Display test summaries and agent status in real-time
  - Export detailed logs to JSON in verbose mode
  - _Requirements: 16.1, 16.2, 16.4_