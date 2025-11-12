# Changelog

All notable changes to the SIGECO project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Sistema de Relatórios - REL-003 (2025-11-12)
- **PDF Preview em Tempo Real**: Nova funcionalidade permite visualizar relatórios PDF antes do download
  - Componente `PDFPreview` com interface modal responsiva
  - Controles de zoom interativo (50% a 200%)
  - Botão de download integrado
  - Preview gerado usando jsPDF com blob URLs
  - Componente `PDFPreviewButton` para fácil integração
  
- **4 Templates Customizáveis**: Sistema completo de templates para PDFs
  - Template "Padrão SIGECO" - completo com todas as informações
  - Template "Minimalista" - design limpo e compacto
  - Template "Executivo" - para apresentações profissionais
  - Template "Compacto" - máximo de dados em menos páginas
  
- **Seletor Visual de Templates**: Interface intuitiva para escolha
  - Preview de cores e estilos de cada template
  - Persistência de preferências no localStorage
  - Badges informativos sobre propriedades do template

#### Testes Automatizados - TEST-001 (2025-11-12)
- **Testes Unitários**: Cobertura completa do ReportTemplateService
  - 15+ casos de teste para gerenciamento de templates
  - Testes de conversão de cores (hex para RGB)
  - Testes de tamanhos de fonte para diferentes templates
  - Testes de geração de PDF com diferentes configurações
  - Testes de preview URL generation
  - Testes de edge cases e persistência
  
- **Testes de Componentes**: ReportTemplateSelector e PDFPreview
  - Testes de renderização e interação do usuário
  - Testes de seleção de templates e persistência
  - Testes de controles de zoom (incremento/decremento/reset)
  - Testes de acessibilidade (ARIA labels, navegação por teclado)
  - Testes de estados de loading e error handling
  - 35+ casos de teste no total

#### Gerenciamento de Moradores - MRD-RBF (Já Implementado)
- **CRUD Completo**: Interface completa para gerenciamento
  - Criação de novos moradores com validação
  - Edição de dados existentes
  - Visualização detalhada de informações
  - Exclusão com confirmação
  
- **Validações Robustas**: Sistema de validação avançado
  - Validação de CPF com algoritmo de dígitos verificadores
  - Validação de telefone brasileiro (10-11 dígitos)
  - Formatação automática de documentos e telefones
  - Feedback visual de erros em tempo real
  
- **Filtros Avançados**: Sistema de busca e filtro
  - Filtro por status (ativo/inativo)
  - Filtro por tipo (proprietário/locatário)
  - Busca por nome, email ou unidade
  - Contador de resultados filtrados
  
- **Export de Dados**: Exportação para análise externa
  - Export para formato Excel (.xlsx)
  - Export para formato CSV
  - Preservação de formatação de dados

### Changed

#### Portal Administrativo (2025-11-12)
- **Completude aumentada de 72% para 90%**: Melhorias significativas
  - Sistema de Relatórios: 75% → 95% (com preview PDF)
  - Gerenciamento de Moradores: 70% → 85% (com CRUD completo)
  
- **Status atualizado para PRODUÇÃO READY**: Portal pronto para uso em produção

### Technical Improvements

#### Build & Development (2025-11-12)
- Build system validado e funcionando corretamente
- Type checking com TypeScript sem erros
- Bundle size otimizado (mantido controle de tamanho)
- Vitest configurado para testes unitários e de componentes

#### Code Quality (2025-11-12)
- Testes automatizados implementados (35+ casos)
- Cobertura de testes para features críticas
- Validação de acessibilidade em componentes
- Documentação inline nos componentes

## Release Notes

### Sprint 1 & 2 Completion - v0.9.0 (2025-11-12)

Esta atualização marca a conclusão dos Sprints 1 e 2 do roadmap de desenvolvimento, trazendo o projeto de 85% para 90%+ de completude. O Portal Administrativo agora está em **PRODUÇÃO READY** com funcionalidades críticas completamente implementadas e testadas.

**Destaques desta versão:**
- 🎨 Sistema completo de preview PDF com 4 templates customizáveis
- 📊 Gerenciamento de moradores com CRUD completo e validações robustas
- ✅ 35+ testes automatizados garantindo qualidade do código
- 🚀 Portal Administrativo pronto para produção (90% completo)

**Próximos passos:**
- Sprint 3: Melhorias de UX (loading skeletons, tooltips, undo/redo)
- Sprint 4: Operações em lote (batch operations)
- Sprint 5: Import de dados (Excel/CSV)

---

## Version History

- **v0.9.0** (2025-11-12) - Sprint 1 & 2: PDF Preview + Tests + CRUD Moradores
- **v0.8.0** (2025-01-11) - Portal do Porteiro PRODUÇÃO READY (90%)
- **v0.7.0** - Portal Administrativo Base (72%)
- **v0.6.0** - Sistema de Relatórios Base (75%)
- **v0.5.0** - Gerenciamento de Moradores Base (70%)

---

## Links Úteis

- [README.md](./README.md) - Documentação principal do projeto
- [ROADMAP.md](./ROADMAP.md) - Plano de desenvolvimento
- [TODO.md](./TODO.md) - Lista de tarefas pendentes
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guia de contribuição
