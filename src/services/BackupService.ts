/**
 * Backup Service
 * Handles automatic and manual backups, restore operations, and data integrity
 */

import { LoggingService } from '@/lib/logging';

export interface BackupMetadata {
  id: string;
  timestamp: Date;
  size: number;
  version: string;
  type: 'automatic' | 'manual';
  checksum: string;
  description?: string;
}

export interface BackupData {
  metadata: BackupMetadata;
  data: {
    visitors: string;
    users: string;
    access: string;
    settings: string;
  };
}

export interface BackupStats {
  lastBackup: Date | null;
  nextBackup: Date | null;
  totalBackups: number;
  totalSize: number;
  automaticBackupEnabled: boolean;
}

const STORAGE_KEY_BACKUPS = 'sigeco_backups';
const STORAGE_KEY_BACKUP_CONFIG = 'sigeco_backup_config';
const STORAGE_KEY_BACKUP_LOGS = 'sigeco_backup_logs';
const MAX_BACKUPS = 10;
const BACKUP_VERSION = '1.0.0';

// Keys to backup from localStorage
const BACKUP_KEYS = [
  'sigeco_visitors',
  'sigeco_users',
  'sigeco_access_records',
  'sigeco_settings',
];

interface BackupConfig {
  automaticBackupEnabled: boolean;
  backupSchedule: string; // cron-like schedule (e.g., "daily-06:00")
  lastBackupTime: string | null;
}

interface BackupLog {
  id: string;
  timestamp: Date;
  type: 'backup' | 'restore' | 'verify' | 'delete';
  status: 'success' | 'failure';
  message: string;
  details?: string;
}

class BackupServiceClass {
  private config: BackupConfig;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.config = this.loadConfig();
    this.startAutomaticBackup();
  }

  /**
   * Create a manual backup
   */
  async createBackup(description?: string): Promise<BackupMetadata> {
    try {
      const backupData = this.collectBackupData();
      const metadata: BackupMetadata = {
        id: this.generateBackupId(),
        timestamp: new Date(),
        size: this.calculateSize(backupData),
        version: BACKUP_VERSION,
        type: 'manual',
        checksum: await this.calculateChecksum(backupData),
        description,
      };

      const backup: BackupData = {
        metadata,
        data: backupData,
      };

      this.saveBackup(backup);
      this.addLog({
        id: metadata.id,
        timestamp: new Date(),
        type: 'backup',
        status: 'success',
        message: 'Manual backup created successfully',
        details: `Size: ${this.formatSize(metadata.size)}`,
      });

      LoggingService.info('Manual backup created', { id: metadata.id });
      return metadata;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.addLog({
        id: 'failed',
        timestamp: new Date(),
        type: 'backup',
        status: 'failure',
        message: 'Failed to create backup',
        details: errorMsg,
      });
      LoggingService.error('Backup creation failed', error as Error);
      throw error;
    }
  }

  /**
   * Create an automatic backup
   */
  async createAutomaticBackup(): Promise<BackupMetadata> {
    try {
      const backupData = this.collectBackupData();
      const metadata: BackupMetadata = {
        id: this.generateBackupId(),
        timestamp: new Date(),
        size: this.calculateSize(backupData),
        version: BACKUP_VERSION,
        type: 'automatic',
        checksum: await this.calculateChecksum(backupData),
        description: 'Automatic scheduled backup',
      };

      const backup: BackupData = {
        metadata,
        data: backupData,
      };

      this.saveBackup(backup);
      this.config.lastBackupTime = new Date().toISOString();
      this.saveConfig();

      this.addLog({
        id: metadata.id,
        timestamp: new Date(),
        type: 'backup',
        status: 'success',
        message: 'Automatic backup completed',
        details: `Size: ${this.formatSize(metadata.size)}`,
      });

      LoggingService.info('Automatic backup created', { id: metadata.id });
      return metadata;
    } catch (error) {
      LoggingService.error('Automatic backup failed', error as Error);
      throw error;
    }
  }

  /**
   * Restore a backup by ID
   */
  async restoreBackup(backupId: string): Promise<boolean> {
    try {
      const backup = this.getBackupById(backupId);
      if (!backup) {
        throw new Error('Backup not found');
      }

      // Verify backup integrity
      const isValid = await this.verifyBackupIntegrity(backup);
      if (!isValid) {
        throw new Error('Backup integrity check failed');
      }

      // Restore data
      this.restoreBackupData(backup.data);

      this.addLog({
        id: backupId,
        timestamp: new Date(),
        type: 'restore',
        status: 'success',
        message: 'Backup restored successfully',
        details: `Backup from ${new Date(backup.metadata.timestamp).toLocaleString()}`,
      });

      LoggingService.info('Backup restored', { id: backupId });
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.addLog({
        id: backupId,
        timestamp: new Date(),
        type: 'restore',
        status: 'failure',
        message: 'Failed to restore backup',
        details: errorMsg,
      });
      LoggingService.error('Backup restore failed', error as Error);
      throw error;
    }
  }

  /**
   * Verify backup integrity
   */
  async verifyBackupIntegrity(backup: BackupData): Promise<boolean> {
    try {
      const currentChecksum = await this.calculateChecksum(backup.data);
      const isValid = currentChecksum === backup.metadata.checksum;

      this.addLog({
        id: backup.metadata.id,
        timestamp: new Date(),
        type: 'verify',
        status: isValid ? 'success' : 'failure',
        message: isValid ? 'Backup integrity verified' : 'Backup integrity check failed',
        details: `Checksum: ${currentChecksum.substring(0, 8)}...`,
      });

      return isValid;
    } catch (error) {
      LoggingService.error('Backup verification failed', error as Error);
      return false;
    }
  }

  /**
   * Get all backups
   */
  getAllBackups(): BackupMetadata[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BACKUPS);
      if (!stored) return [];

      const backups = JSON.parse(stored) as BackupData[];
      return backups
        .map((b) => ({ ...b.metadata, timestamp: new Date(b.metadata.timestamp) }))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      LoggingService.error('Failed to load backups', error as Error);
      return [];
    }
  }

  /**
   * Get backup by ID
   */
  getBackupById(id: string): BackupData | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BACKUPS);
      if (!stored) return null;

      const backups = JSON.parse(stored) as BackupData[];
      const backup = backups.find((b) => b.metadata.id === id);
      return backup || null;
    } catch (error) {
      LoggingService.error('Failed to load backup', error as Error);
      return null;
    }
  }

  /**
   * Delete a backup
   */
  deleteBackup(id: string): boolean {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BACKUPS);
      if (!stored) return false;

      const backups = JSON.parse(stored) as BackupData[];
      const filtered = backups.filter((b) => b.metadata.id !== id);

      if (filtered.length === backups.length) return false;

      localStorage.setItem(STORAGE_KEY_BACKUPS, JSON.stringify(filtered));

      this.addLog({
        id,
        timestamp: new Date(),
        type: 'delete',
        status: 'success',
        message: 'Backup deleted',
      });

      return true;
    } catch (error) {
      LoggingService.error('Failed to delete backup', error as Error);
      return false;
    }
  }

  /**
   * Get backup statistics
   */
  getStats(): BackupStats {
    const backups = this.getAllBackups();
    const lastBackup = backups.length > 0 ? backups[0].timestamp : null;
    const nextBackup = this.calculateNextBackup();
    const totalSize = backups.reduce((sum, b) => sum + b.size, 0);

    return {
      lastBackup,
      nextBackup,
      totalBackups: backups.length,
      totalSize,
      automaticBackupEnabled: this.config.automaticBackupEnabled,
    };
  }

  /**
   * Enable/disable automatic backup
   */
  setAutomaticBackup(enabled: boolean): void {
    this.config.automaticBackupEnabled = enabled;
    this.saveConfig();

    if (enabled) {
      this.startAutomaticBackup();
    } else {
      this.stopAutomaticBackup();
    }

    LoggingService.info('Automatic backup ' + (enabled ? 'enabled' : 'disabled'));
  }

  /**
   * Get backup logs
   */
  getLogs(): BackupLog[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BACKUP_LOGS);
      if (!stored) return [];

      const logs = JSON.parse(stored) as BackupLog[];
      return logs.map((log) => ({ ...log, timestamp: new Date(log.timestamp) }));
    } catch (error) {
      LoggingService.error('Failed to load backup logs', error as Error);
      return [];
    }
  }

  /**
   * Export backup as downloadable file
   */
  exportBackup(backupId: string): string {
    const backup = this.getBackupById(backupId);
    if (!backup) {
      throw new Error('Backup not found');
    }

    return JSON.stringify(backup, null, 2);
  }

  /**
   * Import backup from file
   */
  async importBackup(backupJson: string): Promise<BackupMetadata> {
    try {
      const backup = JSON.parse(backupJson) as BackupData;

      // Validate backup structure
      if (!backup.metadata || !backup.data) {
        throw new Error('Invalid backup format');
      }

      // Verify integrity
      const isValid = await this.verifyBackupIntegrity(backup);
      if (!isValid) {
        throw new Error('Backup integrity check failed');
      }

      // Save imported backup
      this.saveBackup(backup);

      this.addLog({
        id: backup.metadata.id,
        timestamp: new Date(),
        type: 'backup',
        status: 'success',
        message: 'Backup imported successfully',
      });

      return backup.metadata;
    } catch (error) {
      LoggingService.error('Backup import failed', error as Error);
      throw error;
    }
  }

  /**
   * Private: Collect data to backup
   */
  private collectBackupData(): BackupData['data'] {
    const data: BackupData['data'] = {
      visitors: '',
      users: '',
      access: '',
      settings: '',
    };

    const keyMapping: Record<string, keyof BackupData['data']> = {
      'sigeco_visitors': 'visitors',
      'sigeco_users': 'users',
      'sigeco_access_records': 'access',
      'sigeco_settings': 'settings',
    };

    for (const key of BACKUP_KEYS) {
      const value = localStorage.getItem(key) || '[]';
      const mappedKey = keyMapping[key];
      if (mappedKey) {
        data[mappedKey] = value;
      }
    }

    return data;
  }

  /**
   * Private: Restore backup data
   */
  private restoreBackupData(data: BackupData['data']): void {
    const keyMapping: Record<keyof BackupData['data'], string> = {
      visitors: 'sigeco_visitors',
      users: 'sigeco_users',
      access: 'sigeco_access_records',
      settings: 'sigeco_settings',
    };

    for (const [key, storageKey] of Object.entries(keyMapping)) {
      const value = data[key as keyof BackupData['data']];
      if (value) {
        localStorage.setItem(storageKey, value);
      }
    }
  }

  /**
   * Private: Save backup
   */
  private saveBackup(backup: BackupData): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BACKUPS);
      const backups = stored ? (JSON.parse(stored) as BackupData[]) : [];

      backups.unshift(backup);

      // Keep only last MAX_BACKUPS
      const trimmed = backups.slice(0, MAX_BACKUPS);

      localStorage.setItem(STORAGE_KEY_BACKUPS, JSON.stringify(trimmed));
    } catch (error) {
      LoggingService.error('Failed to save backup', error as Error);
      throw new Error('Failed to save backup');
    }
  }

  /**
   * Private: Calculate checksum
   */
  private async calculateChecksum(data: BackupData['data']): Promise<string> {
    try {
      // Check if Web Crypto API is available (requires HTTPS or localhost)
      if (!crypto || !crypto.subtle || !crypto.subtle.digest) {
        // Fallback to simple hash for non-HTTPS contexts
        return this.simpleHash(JSON.stringify(data));
      }

      const str = JSON.stringify(data);
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      // Fallback if crypto operation fails
      LoggingService.warn('Crypto API unavailable, using fallback hash', { error });
      return this.simpleHash(JSON.stringify(data));
    }
  }

  /**
   * Private: Simple hash fallback (for non-HTTPS contexts)
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    // Convert to hex string with padding
    return Math.abs(hash).toString(16).padStart(16, '0') + 
           str.length.toString(16).padStart(8, '0') +
           Date.now().toString(16).padStart(12, '0');
  }

  /**
   * Private: Calculate backup size
   */
  private calculateSize(data: BackupData['data']): number {
    return new Blob([JSON.stringify(data)]).size;
  }

  /**
   * Private: Format size
   */
  private formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  /**
   * Private: Generate backup ID
   */
  private generateBackupId(): string {
    return `backup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Private: Load config
   */
  private loadConfig(): BackupConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BACKUP_CONFIG);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      LoggingService.error('Failed to load backup config', error as Error);
    }

    return {
      automaticBackupEnabled: true,
      backupSchedule: 'daily-06:00',
      lastBackupTime: null,
    };
  }

  /**
   * Private: Save config
   */
  private saveConfig(): void {
    try {
      localStorage.setItem(STORAGE_KEY_BACKUP_CONFIG, JSON.stringify(this.config));
    } catch (error) {
      LoggingService.error('Failed to save backup config', error as Error);
    }
  }

  /**
   * Private: Add log entry
   */
  private addLog(log: BackupLog): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BACKUP_LOGS);
      const logs = stored ? (JSON.parse(stored) as BackupLog[]) : [];

      logs.unshift(log);

      // Keep only last 50 logs
      const trimmed = logs.slice(0, 50);

      localStorage.setItem(STORAGE_KEY_BACKUP_LOGS, JSON.stringify(trimmed));
    } catch (error) {
      LoggingService.error('Failed to save backup log', error as Error);
    }
  }

  /**
   * Private: Calculate next backup time
   */
  private calculateNextBackup(): Date | null {
    if (!this.config.automaticBackupEnabled) return null;

    const now = new Date();
    const nextBackup = new Date(now);
    nextBackup.setDate(nextBackup.getDate() + 1);
    nextBackup.setHours(6, 0, 0, 0);

    // If it's before 6 AM today, schedule for today
    if (now.getHours() < 6) {
      nextBackup.setDate(nextBackup.getDate() - 1);
    }

    return nextBackup;
  }

  /**
   * Private: Start automatic backup
   */
  private startAutomaticBackup(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    if (!this.config.automaticBackupEnabled) return;

    // Check every hour if backup is needed
    this.checkInterval = setInterval(() => {
      this.checkAndRunBackup();
    }, 60 * 60 * 1000); // 1 hour

    // Also check immediately
    setTimeout(() => {
      this.checkAndRunBackup();
    }, 5000); // 5 seconds after start
  }

  /**
   * Private: Stop automatic backup
   */
  private stopAutomaticBackup(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Private: Check and run backup if needed
   */
  private async checkAndRunBackup(): Promise<void> {
    if (!this.config.automaticBackupEnabled) return;

    const now = new Date();
    const lastBackup = this.config.lastBackupTime
      ? new Date(this.config.lastBackupTime)
      : null;

    // Check if 24 hours have passed since last backup
    if (!lastBackup || now.getTime() - lastBackup.getTime() > 24 * 60 * 60 * 1000) {
      // Also check if it's around the scheduled time (6 AM ± 1 hour)
      const hour = now.getHours();
      if (hour >= 5 && hour <= 7) {
        try {
          await this.createAutomaticBackup();
        } catch (error) {
          LoggingService.error('Automatic backup failed', error as Error);
        }
      }
    }
  }
}

export const BackupService = new BackupServiceClass();
