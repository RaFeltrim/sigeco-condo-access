/**
 * RealtimeLogger
 *
 * Provides real-time logging capabilities for validation agents.
 * Displays logs as they happen during agent execution.
 */

export type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  agentName?: string;
  message: string;
  data?: any;
}

export class RealtimeLogger {
  private logs: LogEntry[] = [];
  private verbose: boolean = false;
  private enableColors: boolean = true;

  constructor(options?: { verbose?: boolean; enableColors?: boolean }) {
    this.verbose = options?.verbose ?? false;
    this.enableColors = options?.enableColors ?? true;
  }

  /**
   * Log an info message
   */
  info(message: string, agentName?: string, data?: any): void {
    this.log('info', message, agentName, data);
  }

  /**
   * Log a success message
   */
  success(message: string, agentName?: string, data?: any): void {
    this.log('success', message, agentName, data);
  }

  /**
   * Log a warning message
   */
  warning(message: string, agentName?: string, data?: any): void {
    this.log('warning', message, agentName, data);
  }

  /**
   * Log an error message
   */
  error(message: string, agentName?: string, data?: any): void {
    this.log('error', message, agentName, data);
  }

  /**
   * Log a debug message (only shown in verbose mode)
   */
  debug(message: string, agentName?: string, data?: any): void {
    if (this.verbose) {
      this.log('debug', message, agentName, data);
    }
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, agentName?: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      agentName,
      message,
      data,
    };

    this.logs.push(entry);
    this.displayLog(entry);
  }

  /**
   * Display a log entry to console
   */
  private displayLog(entry: LogEntry): void {
    const timestamp = entry.timestamp.toLocaleTimeString();
    const icon = this.getIcon(entry.level);
    const color = this.getColor(entry.level);
    const reset = '\x1b[0m';

    let logMessage = '';

    if (this.enableColors) {
      logMessage = `${color}${icon}${reset} [${timestamp}]`;
    } else {
      logMessage = `${icon} [${timestamp}]`;
    }

    if (entry.agentName) {
      logMessage += ` [${entry.agentName}]`;
    }

    logMessage += ` ${entry.message}`;

    console.log(logMessage);

    // Display data if in verbose mode and data exists
    if (this.verbose && entry.data) {
      console.log('  Data:', JSON.stringify(entry.data, null, 2));
    }
  }

  /**
   * Get icon for log level
   */
  private getIcon(level: LogLevel): string {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      debug: '🔍',
    };
    return icons[level];
  }

  /**
   * Get color code for log level
   */
  private getColor(level: LogLevel): string {
    const colors = {
      info: '\x1b[36m', // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m', // Red
      debug: '\x1b[90m', // Gray
    };
    return colors[level];
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs for a specific agent
   */
  getAgentLogs(agentName: string): LogEntry[] {
    return this.logs.filter((log) => log.agentName === agentName);
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Export logs to JSON
   */
  exportJSON(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Display a progress bar
   */
  displayProgress(current: number, total: number, label?: string): void {
    const percentage = Math.round((current / total) * 100);
    const barLength = 40;
    const filledLength = Math.round((barLength * current) / total);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

    const progressMessage = label
      ? `${label}: [${bar}] ${percentage}% (${current}/${total})`
      : `[${bar}] ${percentage}% (${current}/${total})`;

    // Use carriage return to update the same line
    process.stdout.write(`\r${progressMessage}`);

    // Add newline when complete
    if (current === total) {
      process.stdout.write('\n');
    }
  }

  /**
   * Display a spinner (for long-running operations)
   */
  displaySpinner(message: string): () => void {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;

    const interval = setInterval(() => {
      process.stdout.write(`\r${frames[i]} ${message}`);
      i = (i + 1) % frames.length;
    }, 80);

    // Return a function to stop the spinner
    return () => {
      clearInterval(interval);
      process.stdout.write('\r');
    };
  }

  /**
   * Display a section header
   */
  displaySection(title: string): void {
    const line = '='.repeat(80);
    console.log('\n' + line);
    console.log(title);
    console.log(line + '\n');
  }

  /**
   * Display a subsection header
   */
  displaySubsection(title: string): void {
    const line = '-'.repeat(80);
    console.log('\n' + line);
    console.log(title);
    console.log(line + '\n');
  }

  /**
   * Display a table
   */
  displayTable(headers: string[], rows: string[][]): void {
    // Calculate column widths
    const columnWidths = headers.map((header, i) => {
      const maxRowWidth = Math.max(...rows.map((row) => (row[i] || '').length));
      return Math.max(header.length, maxRowWidth);
    });

    // Display header
    const headerRow = headers
      .map((header, i) => header.padEnd(columnWidths[i]))
      .join(' | ');
    console.log(headerRow);
    console.log(columnWidths.map((width) => '-'.repeat(width)).join('-+-'));

    // Display rows
    rows.forEach((row) => {
      const rowStr = row
        .map((cell, i) => (cell || '').padEnd(columnWidths[i]))
        .join(' | ');
      console.log(rowStr);
    });
    console.log('');
  }

  /**
   * Display test results summary
   */
  displayTestSummary(
    agentName: string,
    passed: number,
    failed: number,
    executionTime: number,
  ): void {
    const total = passed + failed;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    const status = failed === 0 ? '✅ PASSED' : '❌ FAILED';

    console.log(`\n${agentName}:`);
    console.log(`  Status: ${status}`);
    console.log(`  Tests: ${passed}/${total} passed (${passRate}%)`);
    console.log(`  Time: ${(executionTime / 1000).toFixed(2)}s`);
  }
}
