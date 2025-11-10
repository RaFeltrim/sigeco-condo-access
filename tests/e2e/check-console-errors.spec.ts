import { test, expect } from '@playwright/test';

test('Verificar erros no console da página inicial', async ({ page }) => {
  const consoleMessages: string[] = [];
  const errors: string[] = [];
  
  // Capturar mensagens do console
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push(`[${msg.type()}] ${text}`);
    if (msg.type() === 'error') {
      errors.push(text);
    }
  });

  // Capturar erros de página
  page.on('pageerror', error => {
    errors.push(`PAGE ERROR: ${error.message}`);
  });

  // Navegar para a página
  await page.goto('http://localhost:9323');
  
  // Aguardar carregamento
  await page.waitForTimeout(3000);

  // Imprimir todas as mensagens
  console.log('\n=== MENSAGENS DO CONSOLE ===');
  consoleMessages.forEach(msg => console.log(msg));
  
  console.log('\n=== ERROS ENCONTRADOS ===');
  if (errors.length > 0) {
    errors.forEach(err => console.log(err));
  } else {
    console.log('Nenhum erro encontrado!');
  }

  // Verificar elementos da página
  const title = await page.title();
  console.log(`\nTítulo da página: ${title}`);
  
  const url = page.url();
  console.log(`URL atual: ${url}`);
});
