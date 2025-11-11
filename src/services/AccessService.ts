/**
 * Access Control Service
 * Manages access records, permissions, and logging
 */

import { AccessRecord, AccessFilter, AccessStats, AccessLogEntry, isAccessRecordArray } from '@/types/access';

const STORAGE_KEY = 'sigeco_access_records';
const LOG_STORAGE_KEY = 'sigeco_access_logs';
const MAX_RECORDS = 1000;
const MAX_LOGS = 500;

class AccessService {
  /**
   * Get all access records from storage
   */
  getAccessRecords(): AccessRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      
      // Convert date strings back to Date objects
      const records = parsed.map((record: AccessRecord) => ({
        ...record,
        timestamp: new Date(record.timestamp),
      }));

      // Validate data
      if (!isAccessRecordArray(records)) {
        console.warn('Invalid access records data, returning empty array');
        return [];
      }

      return records;
    } catch (error) {
      console.error('Error loading access records:', error);
      return [];
    }
  }

  /**
   * Get filtered access records
   */
  getFilteredRecords(filter: AccessFilter): AccessRecord[] {
    const records = this.getAccessRecords();

    return records.filter(record => {
      if (filter.startDate && record.timestamp < filter.startDate) return false;
      if (filter.endDate && record.timestamp > filter.endDate) return false;
      if (filter.userId && record.userId !== filter.userId) return false;
      if (filter.status && record.status !== filter.status) return false;
      if (filter.accessType && record.accessType !== filter.accessType) return false;
      if (filter.location && record.location !== filter.location) return false;
      if (filter.userRole && record.userRole !== filter.userRole) return false;
      return true;
    });
  }

  /**
   * Get access statistics
   */
  getAccessStats(filter?: AccessFilter): AccessStats {
    const records = filter ? this.getFilteredRecords(filter) : this.getAccessRecords();

    const stats: AccessStats = {
      total: records.length,
      autorizados: records.filter(r => r.status === 'Autorizado').length,
      negados: records.filter(r => r.status === 'Negado').length,
      pendentes: records.filter(r => r.status === 'Pendente').length,
      porTipo: {
        'Entrada': records.filter(r => r.accessType === 'Entrada').length,
        'Saida': records.filter(r => r.accessType === 'Saida').length,
        'Permanencia': records.filter(r => r.accessType === 'Permanencia').length,
      },
      porStatus: {
        'Autorizado': records.filter(r => r.status === 'Autorizado').length,
        'Negado': records.filter(r => r.status === 'Negado').length,
        'Pendente': records.filter(r => r.status === 'Pendente').length,
        'Expirado': records.filter(r => r.status === 'Expirado').length,
      },
    };

    return stats;
  }

  /**
   * Add a new access record
   */
  addAccessRecord(record: Omit<AccessRecord, 'id' | 'timestamp'>): AccessRecord {
    const records = this.getAccessRecords();

    const newRecord: AccessRecord = {
      ...record,
      id: Date.now(),
      timestamp: new Date(),
    };

    records.unshift(newRecord);

    // Keep only the most recent records
    const trimmedRecords = records.slice(0, MAX_RECORDS);
    this.saveAccessRecords(trimmedRecords);

    // Log the action
    this.addLog({
      action: `Acesso ${record.accessType}`,
      details: `${record.userName} - ${record.status}`,
      userId: record.userId,
      userName: record.userName,
    });

    return newRecord;
  }

  /**
   * Update an access record
   */
  updateAccessRecord(id: number, updates: Partial<AccessRecord>): AccessRecord | null {
    const records = this.getAccessRecords();
    const index = records.findIndex(r => r.id === id);

    if (index === -1) return null;

    const updatedRecord = {
      ...records[index],
      ...updates,
      id: records[index].id, // Preserve original ID
      timestamp: records[index].timestamp, // Preserve original timestamp
    };

    records[index] = updatedRecord;
    this.saveAccessRecords(records);

    // Log the action
    this.addLog({
      action: 'Registro atualizado',
      details: `ID ${id} - ${JSON.stringify(updates)}`,
    });

    return updatedRecord;
  }

  /**
   * Delete an access record
   */
  deleteAccessRecord(id: number): boolean {
    const records = this.getAccessRecords();
    const filtered = records.filter(r => r.id !== id);

    if (filtered.length === records.length) return false;

    this.saveAccessRecords(filtered);

    // Log the action
    this.addLog({
      action: 'Registro excluído',
      details: `ID ${id}`,
    });

    return true;
  }

  /**
   * Check if user has permission for access type
   */
  hasPermission(userRole: string, accessType: string): boolean {
    const permissions: Record<string, string[]> = {
      admin: ['Entrada', 'Saida', 'Permanencia'],
      sindico: ['Entrada', 'Saida', 'Permanencia'],
      porteiro: ['Entrada', 'Saida'],
      morador: ['Entrada', 'Saida'],
    };

    return permissions[userRole]?.includes(accessType) ?? false;
  }

  /**
   * Get access logs
   */
  getAccessLogs(): AccessLogEntry[] {
    try {
      const stored = localStorage.getItem(LOG_STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      
      // Convert date strings back to Date objects
      return parsed.map((log: AccessLogEntry) => ({
        ...log,
        timestamp: new Date(log.timestamp),
      }));
    } catch (error) {
      console.error('Error loading access logs:', error);
      return [];
    }
  }

  /**
   * Add a log entry
   */
  private addLog(entry: Omit<AccessLogEntry, 'id' | 'timestamp'>): void {
    const logs = this.getAccessLogs();

    const newLog: AccessLogEntry = {
      ...entry,
      id: Date.now(),
      timestamp: new Date(),
    };

    logs.unshift(newLog);

    // Keep only the most recent logs
    const trimmedLogs = logs.slice(0, MAX_LOGS);
    
    try {
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(trimmedLogs));
    } catch (error) {
      console.error('Error saving access logs:', error);
    }
  }

  /**
   * Save access records to storage
   */
  private saveAccessRecords(records: AccessRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error('Error saving access records:', error);
      throw new Error('Falha ao salvar registros de acesso');
    }
  }

  /**
   * Clear old records (older than specified days)
   */
  clearOldRecords(daysOld: number = 90): number {
    const records = this.getAccessRecords();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const filtered = records.filter(r => r.timestamp >= cutoffDate);
    const removedCount = records.length - filtered.length;

    if (removedCount > 0) {
      this.saveAccessRecords(filtered);
      this.addLog({
        action: 'Limpeza de registros antigos',
        details: `${removedCount} registros removidos (>${daysOld} dias)`,
      });
    }

    return removedCount;
  }

  /**
   * Export records to CSV format
   */
  exportToCSV(filter?: AccessFilter): string {
    const records = filter ? this.getFilteredRecords(filter) : this.getAccessRecords();

    const headers = [
      'ID',
      'Data/Hora',
      'Usuário',
      'Função',
      'Tipo',
      'Status',
      'Local',
      'Destino',
      'Autorizado Por',
      'Motivo',
      'Observações'
    ];

    const rows = records.map(r => [
      r.id,
      r.timestamp.toLocaleString('pt-BR'),
      r.userName,
      r.userRole,
      r.accessType,
      r.status,
      r.location,
      r.destino || '',
      r.autorizadoPor || '',
      r.motivo || '',
      r.observacoes || ''
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
  }
}

export default new AccessService();
