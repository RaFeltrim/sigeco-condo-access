/**
 * DOMHelpers - Utilitários para manipulação segura do DOM
 * 
 * Fornece funções robustas para localizar e validar elementos DOM,
 * com timeouts configuráveis e logging de falhas.
 */

import { LoggingService } from './logging';

export interface WaitOptions {
  timeout?: number;
  interval?: number;
  errorMessage?: string;
}

const DEFAULT_TIMEOUT = 10000; // 10 segundos
const DEFAULT_INTERVAL = 100; // 100ms
const PAGE_LOAD_DELAY = 1000; // 1 segundo

/**
 * Aguarda até que um elemento apareça no DOM
 * 
 * @param selector - Seletor CSS do elemento
 * @param options - Opções de configuração (timeout, interval, errorMessage)
 * @returns Promise que resolve com o elemento encontrado
 * @throws Error se o elemento não for encontrado dentro do timeout
 */
export async function waitForElement(
  selector: string,
  options: WaitOptions = {}
): Promise<Element> {
  const {
    timeout = DEFAULT_TIMEOUT,
    interval = DEFAULT_INTERVAL,
    errorMessage = `Element not found: ${selector}`,
  } = options;

  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const checkElement = () => {
      const element = document.querySelector(selector);

      if (element) {
        LoggingService.info('Element found', {
          selector,
          elapsedTime: Date.now() - startTime,
        });
        resolve(element);
        return;
      }

      const elapsedTime = Date.now() - startTime;

      if (elapsedTime >= timeout) {
        const error = new Error(errorMessage);
        LoggingService.error('Element not found after timeout', error, {
          selector,
          timeout,
          elapsedTime,
        });
        reject(error);
        return;
      }

      setTimeout(checkElement, interval);
    };

    checkElement();
  });
}

/**
 * Verifica se um elemento existe no DOM
 * 
 * @param selector - Seletor CSS do elemento
 * @returns true se o elemento existe, false caso contrário
 */
export function elementExists(selector: string): boolean {
  const exists = document.querySelector(selector) !== null;

  if (!exists) {
    LoggingService.info('Element does not exist', { selector });
  }

  return exists;
}

/**
 * Busca um elemento no DOM de forma segura
 * Retorna null em vez de lançar exceção se o elemento não existir
 * 
 * @param selector - Seletor CSS do elemento
 * @returns O elemento encontrado ou null
 */
export function safeQuerySelector<T extends Element = Element>(
  selector: string
): T | null {
  try {
    const element = document.querySelector<T>(selector);

    if (!element) {
      LoggingService.info('Safe query returned null', { selector });
    }

    return element;
  } catch (error) {
    LoggingService.error('Error in safeQuerySelector', error as Error, {
      selector,
    });
    return null;
  }
}

/**
 * Aguarda o carregamento completo da página
 * Adiciona um delay adicional configurável após o evento load
 * 
 * @param additionalDelay - Delay adicional em ms (padrão: 1000ms)
 * @returns Promise que resolve quando a página está completamente carregada
 */
export async function waitForPageLoad(
  additionalDelay: number = PAGE_LOAD_DELAY
): Promise<void> {
  // Se a página já está carregada
  if (document.readyState === 'complete') {
    LoggingService.info('Page already loaded, applying additional delay', {
      additionalDelay,
    });
    await new Promise(resolve => setTimeout(resolve, additionalDelay));
    return;
  }

  // Aguarda o evento load
  return new Promise(resolve => {
    const handleLoad = async () => {
      LoggingService.info('Page load event fired, applying additional delay', {
        additionalDelay,
      });
      await new Promise(r => setTimeout(r, additionalDelay));
      resolve();
    };

    window.addEventListener('load', handleLoad, { once: true });
  });
}

/**
 * Busca múltiplos elementos no DOM de forma segura
 * 
 * @param selector - Seletor CSS dos elementos
 * @returns Array de elementos encontrados (vazio se nenhum for encontrado)
 */
export function safeQuerySelectorAll<T extends Element = Element>(
  selector: string
): T[] {
  try {
    const elements = Array.from(document.querySelectorAll<T>(selector));

    if (elements.length === 0) {
      LoggingService.info('Safe query all returned empty array', { selector });
    }

    return elements;
  } catch (error) {
    LoggingService.error('Error in safeQuerySelectorAll', error as Error, {
      selector,
    });
    return [];
  }
}

/**
 * Aguarda até que um elemento desapareça do DOM
 * Útil para aguardar o fechamento de modals, loaders, etc.
 * 
 * @param selector - Seletor CSS do elemento
 * @param options - Opções de configuração (timeout, interval)
 * @returns Promise que resolve quando o elemento não existe mais
 */
export async function waitForElementToDisappear(
  selector: string,
  options: WaitOptions = {}
): Promise<void> {
  const {
    timeout = DEFAULT_TIMEOUT,
    interval = DEFAULT_INTERVAL,
    errorMessage = `Element still present after timeout: ${selector}`,
  } = options;

  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const checkElement = () => {
      const element = document.querySelector(selector);

      if (!element) {
        LoggingService.info('Element disappeared', {
          selector,
          elapsedTime: Date.now() - startTime,
        });
        resolve();
        return;
      }

      const elapsedTime = Date.now() - startTime;

      if (elapsedTime >= timeout) {
        const error = new Error(errorMessage);
        LoggingService.error('Element still present after timeout', error, {
          selector,
          timeout,
          elapsedTime,
        });
        reject(error);
        return;
      }

      setTimeout(checkElement, interval);
    };

    checkElement();
  });
}

/**
 * Valida se um elemento está visível no viewport
 * 
 * @param element - Elemento a ser verificado
 * @returns true se o elemento está visível, false caso contrário
 */
export function isElementVisible(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  const isVisible =
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth);

  return isVisible;
}

/**
 * Aguarda até que um elemento esteja visível no viewport
 * 
 * @param selector - Seletor CSS do elemento
 * @param options - Opções de configuração (timeout, interval)
 * @returns Promise que resolve com o elemento quando ele estiver visível
 */
export async function waitForElementVisible(
  selector: string,
  options: WaitOptions = {}
): Promise<Element> {
  const element = await waitForElement(selector, options);

  const {
    timeout = DEFAULT_TIMEOUT,
    interval = DEFAULT_INTERVAL,
  } = options;

  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const checkVisibility = () => {
      if (isElementVisible(element)) {
        LoggingService.info('Element is visible', {
          selector,
          elapsedTime: Date.now() - startTime,
        });
        resolve(element);
        return;
      }

      const elapsedTime = Date.now() - startTime;

      if (elapsedTime >= timeout) {
        const error = new Error(`Element not visible after timeout: ${selector}`);
        LoggingService.error('Element not visible after timeout', error, {
          selector,
          timeout,
          elapsedTime,
        });
        reject(error);
        return;
      }

      setTimeout(checkVisibility, interval);
    };

    checkVisibility();
  });
}
