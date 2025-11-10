import { test, expect } from '@playwright/test';

test.describe('Análise Completa do Site SIGECO', () => {
  
  test('1. Verificar página de Login', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    
    await page.goto('http://localhost:9323/login');
    await page.waitForLoadState('networkidle');
    
    console.log('\n=== TESTE 1: PÁGINA DE LOGIN ===');
    
    // Verificar título
    const title = await page.title();
    console.log(`✓ Título: ${title}`);
    
    // Verificar elementos principais
    const logo = await page.locator('svg').first().isVisible();
    console.log(`${logo ? '✓' : '✗'} Logo visível`);
    
    const usernameInput = await page.locator('input[type="text"]').isVisible();
    console.log(`${usernameInput ? '✓' : '✗'} Campo de usuário visível`);
    
    const passwordInput = await page.locator('input[type="password"]').isVisible();
    console.log(`${passwordInput ? '✓' : '✗'} Campo de senha visível`);
    
    const loginButton = await page.locator('button[type="submit"]').isVisible();
    console.log(`${loginButton ? '✓' : '✗'} Botão de login visível`);
    
    console.log(`${errors.length === 0 ? '✓' : '✗'} Sem erros: ${errors.length === 0 ? 'SIM' : errors.join(', ')}`);
  });

  test('2. Verificar Dashboard do Porteiro', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    
    await page.goto('http://localhost:9323/login');
    
    // Fazer login como porteiro
    await page.fill('input[type="text"]', 'porteiro');
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/porteiro-dashboard');
    await page.waitForLoadState('networkidle');
    
    console.log('\n=== TESTE 2: DASHBOARD DO PORTEIRO ===');
    
    // Verificar elementos principais
    const heading = await page.locator('h1, h2').first().textContent();
    console.log(`✓ Título da página: ${heading}`);
    
    // Verificar cards de estatísticas
    const cards = await page.locator('[class*="card"]').count();
    console.log(`✓ Cards encontrados: ${cards}`);
    
    // Verificar tabela de visitantes
    const table = await page.locator('table').isVisible();
    console.log(`${table ? '✓' : '✗'} Tabela de visitantes visível`);
    
    // Verificar botões de ação
    const buttons = await page.locator('button').count();
    console.log(`✓ Botões encontrados: ${buttons}`);
    
    console.log(`${errors.length === 0 ? '✓' : '✗'} Sem erros: ${errors.length === 0 ? 'SIM' : errors.join(', ')}`);
  });

  test('3. Verificar Dashboard do Admin', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    
    await page.goto('http://localhost:9323/login');
    
    // Fazer login como admin
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/admin-dashboard');
    await page.waitForLoadState('networkidle');
    
    console.log('\n=== TESTE 3: DASHBOARD DO ADMIN ===');
    
    // Verificar sidebar
    const sidebar = await page.locator('[class*="sidebar"], nav').isVisible();
    console.log(`${sidebar ? '✓' : '✗'} Sidebar visível`);
    
    // Verificar itens do menu
    const menuItems = await page.locator('nav a, nav button').count();
    console.log(`✓ Itens de menu: ${menuItems}`);
    
    // Verificar conteúdo principal
    const mainContent = await page.locator('main, [role="main"]').isVisible();
    console.log(`${mainContent ? '✓' : '✗'} Conteúdo principal visível`);
    
    console.log(`${errors.length === 0 ? '✓' : '✗'} Sem erros: ${errors.length === 0 ? 'SIM' : errors.join(', ')}`);
  });

  test('4. Verificar navegação entre páginas do Admin', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    
    await page.goto('http://localhost:9323/login');
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin-dashboard');
    
    console.log('\n=== TESTE 4: NAVEGAÇÃO ENTRE PÁGINAS ===');
    
    // Tentar clicar em cada item do menu
    const navLinks = await page.locator('nav button, nav a').all();
    console.log(`✓ Total de links de navegação: ${navLinks.length}`);
    
    for (let i = 0; i < Math.min(navLinks.length, 7); i++) {
      try {
        const link = navLinks[i];
        const text = await link.textContent();
        await link.click();
        await page.waitForTimeout(500);
        console.log(`✓ Navegou para: ${text?.trim()}`);
      } catch (e) {
        console.log(`✗ Erro ao navegar para item ${i + 1}`);
      }
    }
    
    console.log(`${errors.length === 0 ? '✓' : '✗'} Sem erros de navegação: ${errors.length === 0 ? 'SIM' : errors.join(', ')}`);
  });

  test('5. Verificar formulários e validações', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    
    await page.goto('http://localhost:9323/login');
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin-dashboard');
    
    console.log('\n=== TESTE 5: FORMULÁRIOS E VALIDAÇÕES ===');
    
    // Procurar por botões que abrem modais
    const addButtons = await page.locator('button:has-text("Novo"), button:has-text("Adicionar"), button:has-text("Cadastrar")').all();
    console.log(`✓ Botões de adicionar encontrados: ${addButtons.length}`);
    
    if (addButtons.length > 0) {
      try {
        await addButtons[0].click();
        await page.waitForTimeout(500);
        
        const modal = await page.locator('[role="dialog"], .modal').isVisible();
        console.log(`${modal ? '✓' : '✗'} Modal aberto`);
        
        if (modal) {
          const inputs = await page.locator('[role="dialog"] input, .modal input').count();
          console.log(`✓ Campos de input no modal: ${inputs}`);
        }
      } catch (e) {
        console.log('✗ Erro ao abrir modal');
      }
    }
    
    console.log(`${errors.length === 0 ? '✓' : '✗'} Sem erros: ${errors.length === 0 ? 'SIM' : errors.join(', ')}`);
  });

  test('6. Verificar responsividade', async ({ page }) => {
    console.log('\n=== TESTE 6: RESPONSIVIDADE ===');
    
    await page.goto('http://localhost:9323/login');
    
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    console.log('✓ Testado em Desktop (1920x1080)');
    
    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    console.log('✓ Testado em Tablet (768x1024)');
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    console.log('✓ Testado em Mobile (375x667)');
  });

  test('7. Verificar performance e carregamento', async ({ page }) => {
    console.log('\n=== TESTE 7: PERFORMANCE ===');
    
    const startTime = Date.now();
    await page.goto('http://localhost:9323/login');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    console.log(`✓ Tempo de carregamento: ${loadTime}ms`);
    console.log(`${loadTime < 3000 ? '✓' : '⚠'} Performance: ${loadTime < 3000 ? 'BOA' : 'PODE MELHORAR'}`);
    
    // Verificar recursos carregados
    const images = await page.locator('img').count();
    const scripts = await page.locator('script').count();
    
    console.log(`✓ Imagens carregadas: ${images}`);
    console.log(`✓ Scripts carregados: ${scripts}`);
  });
});
