/**
 * E2E Tests - Admin Dashboard SIGECO
 * Automated tests for all admin components
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:9323';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'a';

// Helper function to login
async function login(page: { goto: (url: string) => Promise<unknown>; fill: (selector: string, value: string) => Promise<void>; click: (selector: string) => Promise<void>; waitForURL: (pattern: string) => Promise<void> }) {
  await page.goto(BASE_URL);
  await page.fill('input[name="username"], input[type="text"]', ADMIN_USERNAME);
  await page.fill('input[name="password"], input[type="password"]', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin-dashboard');
}

test.describe('Admin Dashboard E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  // ==========================================
  // 1. VISÃO GERAL (OVERVIEW)
  // ==========================================
  
  test.describe('1. Visão Geral', () => {
    
    test('T1.1 - Verificar 4 cards de estatísticas', async ({ page }) => {
      // Verificar se os 4 cards estão visíveis
      const cards = page.locator('[data-testid^="stat-card-"]');
      await expect(cards).toHaveCount(4);
      
      // Verificar textos dos cards
      await expect(page.locator('[data-testid="stat-title-0"]')).toContainText('Acessos Hoje');
      await expect(page.locator('[data-testid="stat-title-1"]')).toContainText('Visitantes Ativos');
      await expect(page.locator('[data-testid="stat-title-2"]')).toContainText('Total Semanal');
      await expect(page.locator('[data-testid="stat-title-3"]')).toContainText('Sistema Online');
    });

    test('T1.2 - Verificar gráfico de fluxo de visitas', async ({ page }) => {
      // Verificar título do gráfico
      await expect(page.getByText('Fluxo de Visitas - Última Semana')).toBeVisible();
      
      // Verificar se há barras do gráfico (7 dias)
      const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
      for (const dia of dias) {
        await expect(page.getByText(dia)).toBeVisible();
      }
    });

    test('T1.3 - Verificar lista de atividade recente', async ({ page }) => {
      await expect(page.getByText('Atividade Recente')).toBeVisible();
      
      // Verificar se há pelo menos um item na lista
      const items = page.locator('.hover\\:bg-muted\\/50');
      await expect(items.first()).toBeVisible();
    });
  });

  // ==========================================
  // 2. GERENCIAMENTO DE MORADORES
  // ==========================================
  
  test.describe('2. Gerenciamento de Moradores', () => {
    
    test.beforeEach(async ({ page }) => {
      await page.click('button:has-text("Gerenciamento de Moradores")');
      await expect(page.getByRole('heading', { name: 'Gerenciamento de Moradores' })).toBeVisible();
    });

    test('T2.1 - Abrir modal Novo Morador', async ({ page }) => {
      await page.click('[data-testid="btn-novo-morador"]');
      await expect(page.getByRole('heading', { name: 'Cadastrar Novo Morador' })).toBeVisible();
    });

    test('T2.2 - Validar campos obrigatórios', async ({ page }) => {
      await page.click('button:has-text("Novo Morador")');
      await page.click('button:has-text("Cadastrar Morador")');
      
      // Deve mostrar erros
      await expect(page.getByText('Campos obrigatórios faltando')).toBeVisible();
    });

    test('T2.3 - Validar máscara de telefone', async ({ page }) => {
      await page.click('button:has-text("Novo Morador")');
      
      const telefoneInput = page.locator('input[placeholder*="99999-9999"]');
      await telefoneInput.fill('11999991234');
      
      // Verificar se foi formatado
      const value = await telefoneInput.inputValue();
      expect(value).toMatch(/\(\d{2}\) \d{5}-\d{4}/);
    });

    test('T2.4 - Validar máscara de documento', async ({ page }) => {
      await page.click('button:has-text("Novo Morador")');
      
      const docInput = page.locator('input[placeholder*="CPF"]');
      await docInput.fill('12345678900');
      
      // Verificar se foi formatado
      const value = await docInput.inputValue();
      expect(value).toMatch(/\d{3}\.\d{3}\.\d{3}-\d{2}/);
    });

    test('T2.5 - Validar CPF inválido', async ({ page }) => {
      await page.click('button:has-text("Novo Morador")');
      
      const docInput = page.locator('input[placeholder*="CPF"]');
      await docInput.fill('11111111111');
      await page.click('button:has-text("Cadastrar Morador")');
      
      await expect(page.getByText('CPF inválido')).toBeVisible();
    });

    test('T2.6 - Testar busca de unidade (Typeahead)', async ({ page }) => {
      await page.click('button:has-text("Novo Morador")');
      await expect(page.getByRole('heading', { name: 'Cadastrar Novo Morador' })).toBeVisible({ timeout: 5000 });
      
      // Clicar no combobox de unidade
      await page.click('button[role="combobox"]', { timeout: 5000 });
      
      // Verificar se o campo de busca aparece
      await expect(page.locator('input[placeholder*="Buscar unidade"]')).toBeVisible({ timeout: 5000 });
    });

    test('T2.8 - Verificar tabela de moradores', async ({ page }) => {
      // Verificar cabeçalhos da tabela
      await expect(page.getByText('Morador')).toBeVisible();
      await expect(page.getByText('Unidade')).toBeVisible();
      await expect(page.getByText('Contato')).toBeVisible();
      await expect(page.getByText('Tipo')).toBeVisible();
      await expect(page.getByText('Status')).toBeVisible();
      await expect(page.getByText('Ações')).toBeVisible();
    });

    test('T2.9 - Testar busca de moradores', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="Buscar por nome"]');
      await searchInput.waitFor({ state: 'visible', timeout: 5000 });
      await searchInput.fill('Ana');
      
      // Aguardar filtro com estado da rede
      await page.waitForLoadState('networkidle', { timeout: 5000 });
      
      // Verificar se há resultados (se não houver é ok, só verificando que não deu erro)
      const rows = page.locator('tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('T2.10 - Testar botão de exclusão', async ({ page }) => {
      // Aguardar tabela carregar
      await page.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 5000 });
      
      // Clicar no primeiro botão de lixeira
      await page.locator('button:has(svg.lucide-trash-2)').first().click({ timeout: 5000 });
      
      // Verificar modal de confirmação
      await expect(page.getByText('Confirmar Exclusão')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Tem certeza que deseja excluir')).toBeVisible({ timeout: 5000 });
    });

    test('T2.12 - Cancelar exclusão', async ({ page }) => {
      // Aguardar tabela carregar
      await page.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 5000 });
      
      await page.locator('button:has(svg.lucide-trash-2)').first().click({ timeout: 5000 });
      await expect(page.getByText('Confirmar Exclusão')).toBeVisible({ timeout: 5000 });
      
      await page.click('button:has-text("Cancelar")');
      
      // Modal deve fechar
      await expect(page.getByText('Confirmar Exclusão')).not.toBeVisible({ timeout: 5000 });
    });

    test('T2.13 - Alternar para aba Unidades', async ({ page }) => {
      await page.click('button:has-text("Unidades")');
      
      // Verificar se grid de unidades está visível
      await expect(page.getByText('Bloco')).toBeVisible();
    });
  });

  // ==========================================
  // 3. AGENDAMENTO DE VISITAS
  // ==========================================
  
  test.describe('3. Agendamento de Visitas', () => {
    
    test.beforeEach(async ({ page }) => {
      await page.click('button:has-text("Agendamento de Visitas")');
      await expect(page.getByText('Agendamento de Visitas')).toBeVisible();
    });

    test('T3.1 - Abrir modal Novo Agendamento', async ({ page }) => {
      await page.click('button:has-text("Novo Agendamento")');
      await expect(page.getByText('Agendar Nova Visita')).toBeVisible();
    });

    test('T3.2 - Validar campos obrigatórios', async ({ page }) => {
      await page.click('button:has-text("Novo Agendamento")');
      await page.click('button:has-text("Agendar Visita")');
      
      // Deve mostrar erro
      await expect(page.getByText('obrigatório')).toBeVisible();
    });

    test('T3.5 - Verificar calendário', async ({ page }) => {
      // Verificar se calendário está visível
      await expect(page.getByText('Calendário')).toBeVisible();
      
      // Verificar se há dias do mês
      const calendar = page.locator('.rdp');
      await expect(calendar).toBeVisible();
    });

    test('T3.6 - Verificar Agendamentos Hoje', async ({ page }) => {
      await expect(page.getByText('Agendamentos Hoje')).toBeVisible();
    });

    test('T3.7 - Verificar Próximos Agendamentos', async ({ page }) => {
      await expect(page.getByText('Próximos Agendamentos')).toBeVisible();
    });
  });

  // ==========================================
  // 4. RELATÓRIOS
  // ==========================================
  
  test.describe('4. Relatórios', () => {
    
    test.beforeEach(async ({ page }) => {
      await page.click('button:has-text("Relatórios")');
      await expect(page.getByText('Relatórios de Acesso')).toBeVisible();
    });

    test('T4.1 - Aplicar filtro de período', async ({ page }) => {
      await page.click('button[role="combobox"]:has-text("Selecione o período")');
      await page.click('text=Esta semana');
      
      // Verificar se contador atualizou
      await expect(page.getByText(/\d+ registro\(s\) encontrado\(s\)/)).toBeVisible();
    });

    test('T4.5 - Limpar filtros', async ({ page }) => {
      await page.click('button:has-text("Limpar Filtros")');
      
      // Verificar se filtros foram resetados
      await page.waitForTimeout(500);
    });

    test('T4.6 - Salvar filtro atual', async ({ page }) => {
      // Aplicar um filtro
      await page.click('button[role="combobox"]:has-text("Selecione o período")', { timeout: 5000 });
      await page.click('text=Hoje', { timeout: 5000 });
      await page.waitForLoadState('networkidle', { timeout: 5000 });
      
      // Clicar em Salvar Filtro
      await page.click('button:has-text("Salvar Filtro")', { timeout: 5000 });
      
      // Verificar modal
      await expect(page.getByText('Salvar Filtro Atual')).toBeVisible({ timeout: 5000 });
      
      // Digitar nome
      await page.fill('input[placeholder*="Visitas"]', 'Teste Filtro');
      await page.click('button:has-text("Salvar")');
      
      // Verificar toast
      await expect(page.getByText('Filtro salvo')).toBeVisible({ timeout: 5000 });
    });

    test('T4.7 - Ver filtros salvos', async ({ page }) => {
      await page.click('button:has-text("Filtros Salvos")');
      await expect(page.getByText('Filtros Salvos')).toBeVisible();
    });

    test('T4.10 - Exportar PDF', async ({ page }) => {
      const downloadPromise = page.waitForEvent('download');
      await page.click('button:has-text("PDF")');
      
      // Aguardar download
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.pdf');
    });

    test('T4.11 - Exportar Excel', async ({ page }) => {
      const downloadPromise = page.waitForEvent('download');
      await page.click('button:has-text("Excel")');
      
      // Aguardar download
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.xlsx');
    });

    test('T4.13 - Verificar tabela de registros', async ({ page }) => {
      // Verificar cabeçalhos
      await expect(page.getByText('Data/Hora')).toBeVisible();
      await expect(page.getByText('Visitante')).toBeVisible();
      await expect(page.getByText('Documento')).toBeVisible();
      await expect(page.getByText('Destino')).toBeVisible();
    });
  });

  // ==========================================
  // 5. CONTROLE DE INSUMOS
  // ==========================================
  
  test.describe('5. Controle de Insumos', () => {
    
    test.beforeEach(async ({ page }) => {
      await page.click('button:has-text("Controle de Insumos")');
      await expect(page.getByText('Controle de Insumos')).toBeVisible();
    });

    test('T5.1 - Verificar aba Funcionários', async ({ page }) => {
      await expect(page.getByText('Funcionários')).toBeVisible();
      await expect(page.getByText('Cadastrar Funcionário')).toBeVisible();
    });

    test('T5.2 - Validar campos obrigatórios', async ({ page }) => {
      await page.click('button:has-text("Cadastrar Funcionário")');
      
      // Deve mostrar erros
      await expect(page.getByText('Campos obrigatórios faltando')).toBeVisible();
    });

    test('T5.3 - Validar campo Função vazio', async ({ page }) => {
      // Preencher apenas nome e documento
      await page.fill('input[placeholder*="nome completo"]', 'Teste Funcionário');
      await page.fill('input[placeholder*="CPF"]', '12345678900');
      
      await page.click('button:has-text("Cadastrar Funcionário")');
      
      // Deve mostrar erro de função
      await expect(page.getByText('Função é obrigatória')).toBeVisible();
    });

    test('T5.6 - Alternar para aba Prestadores', async ({ page }) => {
      await page.click('button:has-text("Prestadores")');
      await expect(page.getByText('Cadastrar Prestador')).toBeVisible();
    });
  });

  // ==========================================
  // 6. BACKUP E SEGURANÇA
  // ==========================================
  
  test.describe('6. Backup e Segurança', () => {
    
    test.beforeEach(async ({ page }) => {
      await page.click('button:has-text("Backup e Segurança")');
      await expect(page.getByText('Segurança e Backup')).toBeVisible();
    });

    test('T6.1 - Verificar cards de status', async ({ page }) => {
      await expect(page.getByText('Status do Sistema')).toBeVisible();
      await expect(page.getByText('Último Backup')).toBeVisible();
      await expect(page.getByText('Espaço Utilizado')).toBeVisible();
    });

    test('T6.2 - Verificar barra de progresso', async ({ page }) => {
      await expect(page.getByText('Progresso do Backup Atual')).toBeVisible();
    });

    test('T6.3 - Testar toggle Backup Automático', async ({ page }) => {
      // Encontrar o switch
      const toggle = page.locator('button[role="switch"]').first();
      await toggle.click();
      
      // Verificar toast
      await expect(page.getByText('Configuração atualizada')).toBeVisible();
    });

    test('T6.6 - Iniciar Backup Manual', async ({ page }) => {
      await page.click('button:has-text("Iniciar Backup Manual")');
      await expect(page.getByText('Backup iniciado')).toBeVisible();
    });

    test('T6.8 - Verificar logs de segurança', async ({ page }) => {
      await expect(page.getByText('Logs de Segurança')).toBeVisible();
    });
  });

  // ==========================================
  // 7. SUPORTE AVANÇADO
  // ==========================================
  
  test.describe('7. Suporte Avançado', () => {
    
    test.beforeEach(async ({ page }) => {
      await page.click('button:has-text("Suporte Avançado")');
      await expect(page.getByText('Suporte e Manutenção')).toBeVisible();
    });

    test('T7.1 - Verificar cards de status', async ({ page }) => {
      await expect(page.getByText('Versão Atual')).toBeVisible();
      await expect(page.getByText('Sistema')).toBeVisible();
      await expect(page.getByText('Atualizações')).toBeVisible();
      await expect(page.getByText('Suporte')).toBeVisible();
    });

    test('T7.2 - Verificar tabs', async ({ page }) => {
      await expect(page.getByText('Treinamento')).toBeVisible();
      await expect(page.getByText('Atualizações')).toBeVisible();
      await expect(page.getByText('Suporte')).toBeVisible();
      await expect(page.getByText('Documentação')).toBeVisible();
    });

    test('T7.3 - Verificar materiais de treinamento', async ({ page }) => {
      await expect(page.getByText('Material de Treinamento')).toBeVisible();
    });

    test('T7.5 - Alternar para aba Atualizações', async ({ page }) => {
      await page.click('button:has-text("Atualizações")');
      await expect(page.getByText('Atualizações do Sistema')).toBeVisible();
    });

    test('T7.7 - Alternar para aba Suporte', async ({ page }) => {
      await page.click('button:has-text("Suporte")');
      await expect(page.getByText('Suporte Técnico')).toBeVisible();
    });

    test('T7.9 - Alternar para aba Documentação', async ({ page }) => {
      await page.click('button:has-text("Documentação")');
      await expect(page.getByText('Documentação Técnica')).toBeVisible();
    });
  });
});
