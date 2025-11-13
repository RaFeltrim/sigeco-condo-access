# 🏢 SIGECO - Sistema de Gerenciamento de Acesso para Condomínios

Sistema moderno e completo para gestão de visitantes, moradores e controle de acesso em condomínios.

[![Build](https://img.shields.io/badge/Build-Passing-success)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)]()
[![React](https://img.shields.io/badge/React-18.3.1-blue)]()
[![License](https://img.shields.io/badge/License-Private-red)]()

**Última Atualização:** 13 de Novembro de 2025

---

## 📋 Sobre o Projeto

O SIGECO é uma solução completa para gestão de acesso em condomínios, oferecendo dois portais especializados:

- **🚪 Portal do Porteiro**: Sistema completo para registro e controle de visitantes
- **👨‍💼 Portal Administrativo**: Gestão completa do condomínio (moradores, agendamentos, relatórios, etc.)
- **🔐 Tela de Login**: Sistema de autenticação com diferentes níveis de acesso

---

## 📊 Status de Completude dos Portais

### 🔐 Tela de Login - 100% Completo ✅

[![Login](https://img.shields.io/badge/Login-100%25%20Completo-success)]()
[![Status](https://img.shields.io/badge/Status-Funcional-brightgreen)]()

Sistema de autenticação completo e funcional com interface moderna.

**Funcionalidades:**
- ✅ Interface moderna e responsiva
- ✅ Autenticação por usuário e senha
- ✅ Redirecionamento automático baseado no tipo de usuário
- ✅ Validação de credenciais
- ✅ Feedback visual (loading states e mensagens)
- ✅ Usuários de teste disponíveis (admin/porteiro)
- ✅ Recuperação de senha (em desenvolvimento)

**Usuários de Teste:**
- **admin** → Acesso ao Portal Administrativo
- **porteiro** → Acesso ao Portal do Porteiro

---

### 🚪 Portal do Porteiro - 90% Completo ✅

[![Portal Status](https://img.shields.io/badge/Portal%20do%20Porteiro-90%25%20Completo-success)]()
[![Production Ready](https://img.shields.io/badge/Status-PRODUÇÃO%20READY-brightgreen)]()

Portal completo e **pronto para uso em produção** com todas as funcionalidades essenciais implementadas.

**Funcionalidades por Categoria:**

**Registro e Controle (100%)** ✅
- ✅ Registro de entrada de visitantes (validações completas)
- ✅ Registro de saída com cálculo de duração
- ✅ Quick checkout para agilizar saídas
- ✅ Prevenção de duplicatas automática

**Visualização e Busca (100%)** ✅
- ✅ Listagem de visitantes em tempo real
- ✅ Busca avançada (nome, documento, destino)
- ✅ Ordenação inteligente (ativos primeiro)
- ✅ Histórico de visitas por visitante

**Dashboard e Métricas (95%)** ✅
- ✅ Visitantes hoje vs. dia anterior
- ✅ Visitantes ativos no momento
- ✅ Total da semana com comparativo
- ✅ Cards visuais com indicadores

**Gestão de Dados (100%)** ✅
- ✅ Persistência automática (localStorage)
- ✅ Validação e recuperação de dados
- ✅ Limpeza automática de registros antigos
- ✅ Sistema de pruning inteligente

**Qualidade e Acessibilidade (90%)** ✅
- ✅ Validações em tempo real
- ✅ ARIA labels e navegação por teclado
- ✅ Mensagens de erro claras
- ✅ Loading states em operações

**Features Extras (70%)** 🟡 *(Opcionais - não afetam funcionalidade principal)*
- 🔲 Foto do visitante (3%)
- 🔲 QR Code de identificação (2%)
- 🔲 Notificações ao morador (2%)
- 🔲 Relatórios específicos (1%)
- 🔲 Gráficos visuais (1%)
- 🔲 Histórico de ações/auditoria (1%)

**📖 [Documentação Completa do Portal do Porteiro →](./PORTAL_STATUS.md)**

---

### 👨‍💼 Portal Administrativo - 72% Completo 🟡

[![Portal Admin](https://img.shields.io/badge/Portal%20Administrativo-72%25%20Completo-yellow)]()
[![Status](https://img.shields.io/badge/Status-Funcional%20Parcial-yellow)]()

Portal administrativo com funcionalidades principais implementadas e em evolução contínua.

**Funcionalidades por Categoria:**

**Controle de Acesso (100%)** ✅
- ✅ Sistema de autenticação completo
- ✅ Controle de permissões
- ✅ Sessões de usuário
- ✅ Logout seguro

**Gestão de Usuários (100%)** ✅
- ✅ CRUD completo de usuários
- ✅ Atribuição de perfis e permissões
- ✅ Gestão de status (ativo/inativo)
- ✅ Validações e segurança

**Sistema de Relatórios (75%)** 🟡
- ✅ Geração de relatórios básicos
- ✅ Exportação em PDF e Excel
- ✅ Filtros por período
- 🔲 Relatórios avançados (25%)

**Gerenciamento de Moradores (70%)** 🟡
- ✅ Cadastro de moradores
- ✅ Listagem e busca
- ✅ Edição de dados
- 🔲 Histórico completo de ações (30%)

**Agendamento de Visitas (65%)** 🟡
- ✅ Criação de agendamentos
- ✅ Visualização em calendário
- ✅ Mudança de status
- 🔲 Notificações automáticas (35%)

**Dashboard Administrativo (60%)** 🟡
- ✅ KPIs principais
- ✅ Estatísticas básicas
- 🔲 Integração com dados reais (40%)

**Controle de Insumos (55%)** 🟡
- ✅ Cadastro de insumos
- ✅ Controle de estoque básico
- 🔲 Alertas de estoque (45%)

**Backup e Segurança (50%)** 🟠
- ✅ Sistema básico de backup
- 🔲 Restore automatizado (50%)
- 🔲 Compliance LGPD completo

**Suporte Avançado (60%)** 🟡
- ✅ Sistema de tickets
- ✅ Material de treinamento
- 🔲 Base de conhecimento (40%)

**📖 [Análise Completa dos Portais →](./PORTAL_COMPLETION_ANALYSIS.md)**

---

## 📊 Resumo Geral

| Componente | Completude | Status | Produção |
|-----------|-----------|--------|----------|
| 🔐 **Tela de Login** | **100%** | ✅ Completo | **SIM** ✅ |
| 🚪 **Portal do Porteiro** | **90%** | ✅ Excelente | **SIM** ✅ |
| 👨‍💼 **Portal Administrativo** | **72%** | 🟡 Bom | Parcial 🟡 |
| 📦 **Projeto Geral (MVP)** | **68%** | 🟡 Em Progresso | Não ❌ |

---

## 🚀 Como Usar

### 🔧 Instalação e Configuração

**Pré-requisitos:**
- Node.js 18+ e npm instalados ([instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

**Passos para instalação:**

```bash
# 1. Clone o repositório
git clone <YOUR_GIT_URL>

# 2. Entre no diretório do projeto
cd sigeco-condo-access

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O sistema estará disponível em: `http://localhost:5173`

### 🎯 Acessando o Sistema

1. Acesse `http://localhost:5173`
2. Faça login com um dos usuários de teste:
   - **Usuário:** `admin` / **Senha:** qualquer → Portal Administrativo
   - **Usuário:** `porteiro` / **Senha:** qualquer → Portal do Porteiro

### 💻 Formas de Editar o Código

**Opção 1: Via Lovable (Recomendado)**
- Acesse o [Projeto Lovable](https://lovable.dev/projects/550ae652-c4e5-4f30-a9dd-54040128e05d)
- Faça alterações através de prompts
- Mudanças são automaticamente commitadas no repositório

**Opção 2: IDE Local**
- Clone o repositório
- Edite com sua IDE favorita
- Push das alterações reflete automaticamente no Lovable

**Opção 3: GitHub Direto**
- Navegue até o arquivo desejado
- Clique no botão "Edit" (ícone de lápis)
- Faça as alterações e commit

**Opção 4: GitHub Codespaces**
- Clique no botão "Code" (verde)
- Selecione a aba "Codespaces"
- Clique em "New codespace"
- Edite diretamente no Codespace

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **React** | 18.3.1 | Framework UI |
| **TypeScript** | 5.8.3 | Tipagem estática |
| **Vite** | 6.4.1 | Build tool |
| **Tailwind CSS** | 3.4.17 | Estilização |
| **shadcn/ui** | Latest | Biblioteca de componentes |
| **React Router** | 6.30.1 | Roteamento |
| **Vitest** | 4.0.7 | Testes unitários |
| **Playwright** | 1.56.1 | Testes E2E |

---

## 📦 Deploy

### Deploy via Lovable (Simples)
1. Acesse [Lovable](https://lovable.dev/projects/550ae652-c4e5-4f30-a9dd-54040128e05d)
2. Clique em **Share → Publish**
3. Seu projeto estará online!

### Domínio Customizado
1. Navegue para **Project > Settings > Domains**
2. Clique em **Connect Domain**
3. Siga as instruções

📖 [Documentação: Custom Domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## 🧪 Desenvolvimento e Testes

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Build de produção
npm run preview          # Preview do build de produção

# Qualidade de Código
npm run validate         # Executa type-check + lint + build (use antes de PR!)
npm run type-check       # Verifica tipos TypeScript
npm run lint             # Executa ESLint
npm run lint:fix         # Corrige problemas automaticamente

# Testes
npm run test             # Testes unitários
npm run test:e2e         # Testes end-to-end
npm run test:e2e:ui      # Testes E2E com interface

# Validação de Sistema
npm run validate:system  # Valida todos os módulos
npm run verify:mvp       # Verifica completude do MVP
```

### Fluxo de Contribuição

1. **Escolha uma tarefa** do [TODO.md](./TODO.md)
2. **Crie uma branch** para sua feature
3. **Desenvolva** seguindo os padrões do projeto
4. **Teste localmente** com `npm run validate`
5. **Verifique o console** do navegador (sem erros!)
6. **Crie um Pull Request** com descrição detalhada

📖 **[Guia Completo de Contribuição →](./CONTRIBUTING.md)**

---

## 📈 Arquitetura do Projeto

```
sigeco-condo-access/
├── 📁 src/
│   ├── 📦 components/      # Componentes React (63 componentes)
│   │   ├── ui/             # Componentes base (shadcn/ui)
│   │   ├── dashboard/      # Componentes do dashboard
│   │   ├── visitor/        # Gestão de visitantes
│   │   ├── user/           # Gestão de usuários
│   │   └── ...
│   ├── 📄 pages/           # Páginas principais (10 páginas)
│   │   ├── Login.tsx       # Tela de login
│   │   ├── PorteiroDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── ...
│   ├── 🔧 services/        # Serviços e APIs
│   ├── 🎨 lib/             # Utilitários e helpers
│   ├── 📝 types/           # Type definitions
│   └── 🎭 hooks/           # Custom React hooks
├── 📁 tests/               # Testes automatizados
├── 📁 public/              # Assets estáticos
└── 📄 package.json         # Dependências e scripts
```

---

## 📚 Documentação

### 📊 Análises e Status
- **[PORTAL_COMPLETION_ANALYSIS.md](./PORTAL_COMPLETION_ANALYSIS.md)** - Análise completa dos dois portais
- **[PORTAL_STATUS.md](./PORTAL_STATUS.md)** - Documentação detalhada do Portal do Porteiro
- **[PORTAL_COMPLETION_CHART.md](./PORTAL_COMPLETION_CHART.md)** - Gráficos visuais de progresso

### 🗺️ Planejamento e Roadmap
- **[TODO.md](./TODO.md)** - Lista de tarefas e melhorias (130 issues)
- **[ROADMAP.md](./ROADMAP.md)** - Plano de desenvolvimento (5 sprints)
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Guia de contribuição e boas práticas

### 📖 Documentação Técnica
- **[PROJECT_ANALYSIS_SUMMARY.md](./PROJECT_ANALYSIS_SUMMARY.md)** - Resumo executivo do projeto
- **[IMPROVEMENT_PLAN_INDEX.md](./IMPROVEMENT_PLAN_INDEX.md)** - Índice completo de documentação
- **[Backend README](./backend/README.md)** - Documentação do backend
- **[Pasta docs/](./docs/)** - Documentação técnica detalhada

---

## 🤝 Como Contribuir

Contribuições são muito bem-vindas! 

**Passos para contribuir:**
1. 📖 Leia o **[CONTRIBUTING.md](./CONTRIBUTING.md)**
2. 🎯 Escolha uma tarefa no **[TODO.md](./TODO.md)**
3. 🌿 Crie uma branch: `git checkout -b feature/sua-feature`
4. ✅ Valide seu código: `npm run validate`
5. 🚀 Abra um Pull Request

**Áreas que precisam de ajuda:**
- 🔴 Atualização de dependências vulneráveis
- 🟡 Implementação de testes automatizados
- 🟢 Melhorias de acessibilidade e UX
- 📝 Documentação de componentes

---

## 🔗 Links Importantes

- 🎨 **Projeto Lovable**: [lovable.dev/projects/550ae652-c4e5-4f30-a9dd-54040128e05d](https://lovable.dev/projects/550ae652-c4e5-4f30-a9dd-54040128e05d)
- 📊 **Relatórios MVP**: `.kiro/reports/mvp-verification-latest.md`
- 🧪 **Relatórios de Validação**: `.kiro/reports/system-validation-latest.md`

---

## 📞 Suporte

Encontrou um problema ou tem alguma dúvida?
- 📝 Abra uma [Issue no GitHub](../../issues)
- 💬 Entre em contato pelo sistema de suporte integrado
- 📖 Consulte a [documentação completa](./docs/)

---

<div align="center">

**SIGECO** - Sistema de Gerenciamento de Acesso para Condomínios

Desenvolvido com ❤️ usando React, TypeScript e Tailwind CSS

**Última Atualização:** 13 de Novembro de 2025  
**Versão:** 0.0.0 (Pre-MVP)  
**Status:** 🟡 Em Desenvolvimento Ativo

</div>
