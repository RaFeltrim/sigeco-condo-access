/**
 * UserActivityLogger - Sistema de registro de atividades do usuário
 * 
 * Registra clicks, inputs e comportamento do sistema durante testes de usuário.
 * Ativo apenas em modo desenvolvimento.
 * Gera relatórios em formato markdown para análise.
 */

export interface ActivityLog {
  id: string;
  timestamp: Date;
  type: 'click' | 'input' | 'navigation' | 'error' | 'system';
  description: string;
  elementInfo?: {
    tagName?: string;
    id?: string;
    className?: string;
    text?: string;
    xpath?: string;
  };
  inputInfo?: {
    fieldName?: string;
    fieldType?: string;
    value?: string;
    previousValue?: string;
  };
  navigationInfo?: {
    from?: string;
    to?: string;
  };
  errorInfo?: {
    message?: string;
    stack?: string;
  };
  systemInfo?: {
    action?: string;
    details?: Record<string, unknown>;
  };
}

interface SessionInfo {
  startTime: Date;
  endTime?: Date;
  userAgent: string;
  screenResolution: string;
  totalActivities: number;
}

class UserActivityLoggerClass {
  private logs: ActivityLog[] = [];
  private sessionInfo: SessionInfo;
  private isActive: boolean = false;

  constructor() {
    this.sessionInfo = {
      startTime: new Date(),
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      totalActivities: 0,
    };
  }

  /**
   * Inicia o registro de atividades
   */
  start(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    this.sessionInfo.startTime = new Date();
    this.logs = [];
    
    this.logSystem('Logging iniciado', { mode: 'development' });
    console.log('[UserActivityLogger] Registro de atividades iniciado');
  }

  /**
   * Para o registro de atividades
   */
  stop(): void {
    if (!this.isActive) return;
    
    this.sessionInfo.endTime = new Date();
    this.isActive = false;
    
    this.logSystem('Logging finalizado', {
      totalActivities: this.logs.length,
      duration: this.getSessionDuration(),
    });
    
    console.log('[UserActivityLogger] Registro de atividades finalizado');
  }

  /**
   * Verifica se o logger está ativo
   */
  isLogging(): boolean {
    return this.isActive;
  }

  /**
   * Registra um clique
   */
  logClick(event: MouseEvent): void {
    if (!this.isActive) return;

    const target = event.target as HTMLElement;
    const log: ActivityLog = {
      id: this.generateId(),
      timestamp: new Date(),
      type: 'click',
      description: `Clique em ${this.getElementDescription(target)}`,
      elementInfo: {
        tagName: target.tagName,
        id: target.id || undefined,
        className: target.className || undefined,
        text: this.getElementText(target),
        xpath: this.getXPath(target),
      },
    };

    this.addLog(log);
  }

  /**
   * Registra uma entrada de input
   */
  logInput(
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    previousValue?: string
  ): void {
    if (!this.isActive) return;

    const fieldName = this.getFieldName(element);
    const fieldType = element instanceof HTMLSelectElement 
      ? 'select' 
      : (element as HTMLInputElement).type || 'text';
    
    // Sanitizar valores sensíveis
    const value = this.sanitizeValue(fieldName, element.value);
    const prevValue = previousValue ? this.sanitizeValue(fieldName, previousValue) : undefined;

    const log: ActivityLog = {
      id: this.generateId(),
      timestamp: new Date(),
      type: 'input',
      description: `Input em campo "${fieldName}"`,
      elementInfo: {
        tagName: element.tagName,
        id: element.id || undefined,
        className: element.className || undefined,
        xpath: this.getXPath(element),
      },
      inputInfo: {
        fieldName,
        fieldType,
        value,
        previousValue: prevValue,
      },
    };

    this.addLog(log);
  }

  /**
   * Registra navegação
   */
  logNavigation(from: string, to: string): void {
    if (!this.isActive) return;

    const log: ActivityLog = {
      id: this.generateId(),
      timestamp: new Date(),
      type: 'navigation',
      description: `Navegação de "${from}" para "${to}"`,
      navigationInfo: {
        from,
        to,
      },
    };

    this.addLog(log);
  }

  /**
   * Registra um erro
   */
  logError(error: Error | string, context?: string): void {
    if (!this.isActive) return;

    const errorObj = typeof error === 'string' ? new Error(error) : error;

    const log: ActivityLog = {
      id: this.generateId(),
      timestamp: new Date(),
      type: 'error',
      description: context 
        ? `Erro em ${context}: ${errorObj.message}`
        : `Erro: ${errorObj.message}`,
      errorInfo: {
        message: errorObj.message,
        stack: errorObj.stack,
      },
    };

    this.addLog(log);
  }

  /**
   * Registra evento de sistema
   */
  logSystem(action: string, details?: Record<string, unknown>): void {
    if (!this.isActive) return;

    const log: ActivityLog = {
      id: this.generateId(),
      timestamp: new Date(),
      type: 'system',
      description: `Sistema: ${action}`,
      systemInfo: {
        action,
        details,
      },
    };

    this.addLog(log);
  }

  /**
   * Obtém todos os logs
   */
  getLogs(): ActivityLog[] {
    return [...this.logs];
  }

  /**
   * Limpa todos os logs
   */
  clearLogs(): void {
    this.logs = [];
    this.sessionInfo.totalActivities = 0;
  }

  /**
   * Gera relatório em markdown
   */
  generateMarkdownReport(): string {
    const duration = this.getSessionDuration();
    const stats = this.generateStats();

    let markdown = `# Relatório de Atividades do Usuário\n\n`;
    markdown += `## Informações da Sessão\n\n`;
    markdown += `- **Início**: ${this.formatDate(this.sessionInfo.startTime)}\n`;
    if (this.sessionInfo.endTime) {
      markdown += `- **Fim**: ${this.formatDate(this.sessionInfo.endTime)}\n`;
    }
    markdown += `- **Duração**: ${duration}\n`;
    markdown += `- **User Agent**: ${this.sessionInfo.userAgent}\n`;
    markdown += `- **Resolução**: ${this.sessionInfo.screenResolution}\n`;
    markdown += `- **Total de Atividades**: ${this.logs.length}\n\n`;

    markdown += `## Estatísticas\n\n`;
    markdown += `- **Clicks**: ${stats.clicks}\n`;
    markdown += `- **Inputs**: ${stats.inputs}\n`;
    markdown += `- **Navegações**: ${stats.navigations}\n`;
    markdown += `- **Erros**: ${stats.errors}\n`;
    markdown += `- **Eventos de Sistema**: ${stats.system}\n\n`;

    markdown += `## Linha do Tempo de Atividades\n\n`;
    
    this.logs.forEach((log, index) => {
      markdown += `### ${index + 1}. ${log.description}\n\n`;
      markdown += `- **Tipo**: ${log.type}\n`;
      markdown += `- **Horário**: ${this.formatTime(log.timestamp)}\n`;

      if (log.elementInfo) {
        markdown += `- **Elemento**:\n`;
        if (log.elementInfo.tagName) {
          markdown += `  - Tag: \`${log.elementInfo.tagName}\`\n`;
        }
        if (log.elementInfo.id) {
          markdown += `  - ID: \`${log.elementInfo.id}\`\n`;
        }
        if (log.elementInfo.className) {
          markdown += `  - Classes: \`${log.elementInfo.className}\`\n`;
        }
        if (log.elementInfo.text) {
          markdown += `  - Texto: "${log.elementInfo.text}"\n`;
        }
        if (log.elementInfo.xpath) {
          markdown += `  - XPath: \`${log.elementInfo.xpath}\`\n`;
        }
      }

      if (log.inputInfo) {
        markdown += `- **Campo**:\n`;
        markdown += `  - Nome: \`${log.inputInfo.fieldName}\`\n`;
        markdown += `  - Tipo: \`${log.inputInfo.fieldType}\`\n`;
        if (log.inputInfo.value) {
          markdown += `  - Valor: \`${log.inputInfo.value}\`\n`;
        }
        if (log.inputInfo.previousValue) {
          markdown += `  - Valor Anterior: \`${log.inputInfo.previousValue}\`\n`;
        }
      }

      if (log.navigationInfo) {
        markdown += `- **Navegação**:\n`;
        markdown += `  - De: \`${log.navigationInfo.from}\`\n`;
        markdown += `  - Para: \`${log.navigationInfo.to}\`\n`;
      }

      if (log.errorInfo) {
        markdown += `- **Erro**:\n`;
        markdown += `  - Mensagem: \`${log.errorInfo.message}\`\n`;
        if (log.errorInfo.stack) {
          markdown += `  - Stack:\n\`\`\`\n${log.errorInfo.stack}\n\`\`\`\n`;
        }
      }

      if (log.systemInfo) {
        markdown += `- **Ação de Sistema**: ${log.systemInfo.action}\n`;
        if (log.systemInfo.details) {
          markdown += `- **Detalhes**: ${JSON.stringify(log.systemInfo.details, null, 2)}\n`;
        }
      }

      markdown += `\n`;
    });

    markdown += `## Resumo\n\n`;
    markdown += `Este relatório foi gerado automaticamente pelo UserActivityLogger.\n`;
    markdown += `Ele contém ${this.logs.length} atividades registradas durante a sessão de teste.\n\n`;
    markdown += `### Como usar este relatório:\n\n`;
    markdown += `1. Analise a linha do tempo para entender o fluxo de interação do usuário\n`;
    markdown += `2. Identifique padrões de uso e possíveis problemas de UX\n`;
    markdown += `3. Verifique se há erros ou comportamentos inesperados\n`;
    markdown += `4. Use as informações de XPath e classes para localizar elementos no código\n`;

    return markdown;
  }

  /**
   * Baixa o relatório como arquivo markdown
   */
  downloadReport(): void {
    const markdown = this.generateMarkdownReport();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `user-activity-report-${timestamp}.md`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  // Métodos privados auxiliares

  private addLog(log: ActivityLog): void {
    this.logs.push(log);
    this.sessionInfo.totalActivities++;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getElementDescription(element: HTMLElement): string {
    if (element.id) {
      return `#${element.id}`;
    }
    
    const text = this.getElementText(element);
    if (text) {
      return `${element.tagName.toLowerCase()} "${text}"`;
    }
    
    return element.tagName.toLowerCase();
  }

  private getElementText(element: HTMLElement): string {
    const text = element.textContent?.trim() || '';
    return text.length > 50 ? text.substring(0, 47) + '...' : text;
  }

  private getXPath(element: Element): string {
    if (element.id) {
      return `//*[@id="${element.id}"]`;
    }

    const parts: string[] = [];
    let current: Element | null = element;

    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let index = 0;
      let sibling = current.previousSibling;

      while (sibling) {
        if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === current.nodeName) {
          index++;
        }
        sibling = sibling.previousSibling;
      }

      const tagName = current.nodeName.toLowerCase();
      const pathIndex = index > 0 ? `[${index + 1}]` : '';
      parts.unshift(`${tagName}${pathIndex}`);

      current = current.parentElement;
    }

    return '/' + parts.join('/');
  }

  private getFieldName(element: HTMLElement): string {
    // Tentar obter o nome do campo de várias formas
    const input = element as HTMLInputElement;
    
    if (input.name) return input.name;
    if (input.id) return input.id;
    
    // Tentar encontrar label associado
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) return label.textContent?.trim() || 'campo sem nome';
    }
    
    // Procurar label pai
    const parentLabel = element.closest('label');
    if (parentLabel) {
      return parentLabel.textContent?.trim() || 'campo sem nome';
    }
    
    // Usar placeholder como fallback
    if (input.placeholder) return input.placeholder;
    
    return 'campo sem nome';
  }

  private sanitizeValue(fieldName: string, value: string): string {
    const sensitiveFields = [
      'password',
      'senha',
      'token',
      'cpf',
      'rg',
      'documento',
    ];

    const fieldLower = fieldName.toLowerCase();
    const isSensitive = sensitiveFields.some(sf => fieldLower.includes(sf));

    if (isSensitive) {
      return value ? '[VALOR OCULTO]' : '';
    }

    // Limitar tamanho do valor
    return value.length > 100 ? value.substring(0, 97) + '...' : value;
  }

  private getSessionDuration(): string {
    const start = this.sessionInfo.startTime.getTime();
    const end = this.sessionInfo.endTime?.getTime() || Date.now();
    const durationMs = end - start;

    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  private generateStats() {
    return {
      clicks: this.logs.filter(l => l.type === 'click').length,
      inputs: this.logs.filter(l => l.type === 'input').length,
      navigations: this.logs.filter(l => l.type === 'navigation').length,
      errors: this.logs.filter(l => l.type === 'error').length,
      system: this.logs.filter(l => l.type === 'system').length,
    };
  }

  private formatDate(date: Date): string {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  }
}

// Export singleton instance
export const UserActivityLogger = new UserActivityLoggerClass();
