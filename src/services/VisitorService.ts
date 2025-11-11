/**
 * Visitor Management Service
 * Complete service for visitor CRUD operations
 */

import { Visitor, VisitorFormData, isVisitorArray } from '@/types/visitor';

const STORAGE_KEY = 'sigeco_visitors';
const MAX_RECORDS = 1000;
const PRUNE_DAYS = 30;

class VisitorService {
  /**
   * Get all visitors from storage
   */
  getVisitors(): Visitor[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      
      // Convert date strings back to Date objects
      const visitors = parsed.map((visitor: Visitor) => ({
        ...visitor,
        entrada: new Date(visitor.entrada),
        saida: visitor.saida ? new Date(visitor.saida) : undefined,
      }));

      // Validate data
      if (!isVisitorArray(visitors)) {
        console.warn('Invalid visitors data, returning empty array');
        return [];
      }

      return visitors;
    } catch (error) {
      console.error('Error loading visitors:', error);
      return [];
    }
  }

  /**
   * Get active visitors only
   */
  getActiveVisitors(): Visitor[] {
    return this.getVisitors().filter(v => v.status === 'Ativo');
  }

  /**
   * Get visitor by ID
   */
  getVisitorById(id: number): Visitor | null {
    const visitors = this.getVisitors();
    return visitors.find(v => v.id === id) || null;
  }

  /**
   * Get visitors by document
   */
  getVisitorsByDocument(documento: string): Visitor[] {
    const visitors = this.getVisitors();
    return visitors.filter(v => v.documento === documento);
  }

  /**
   * Add a new visitor entry
   */
  addVisitor(visitorData: VisitorFormData): Visitor {
    const visitors = this.getVisitors();

    // Check for duplicate active entry
    const existingActive = visitors.find(
      v => v.documento === visitorData.documento && v.status === 'Ativo'
    );

    if (existingActive) {
      throw new Error('Visitante já possui entrada ativa');
    }

    const now = new Date();
    const newVisitor: Visitor = {
      id: this.generateId(),
      nome: visitorData.nome,
      documento: visitorData.documento,
      destino: visitorData.destino,
      motivo: visitorData.motivo,
      entrada: now,
      status: 'Ativo',
      hora: now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    visitors.unshift(newVisitor);

    // Keep only recent records
    const trimmed = visitors.slice(0, MAX_RECORDS);
    this.saveVisitors(trimmed);

    return newVisitor;
  }

  /**
   * Register visitor checkout
   */
  checkoutVisitor(id: number): Visitor | null {
    const visitors = this.getVisitors();
    const index = visitors.findIndex(v => v.id === id);

    if (index === -1) return null;

    const visitor = visitors[index];

    if (visitor.status === 'Saiu') {
      throw new Error('Visitante já realizou checkout');
    }

    const now = new Date();
    const entrada = new Date(visitor.entrada);
    const diffMs = now.getTime() - entrada.getTime();
    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const updatedVisitor: Visitor = {
      ...visitor,
      status: 'Saiu',
      saida: now,
      duracao: {
        hours,
        minutes,
        totalMinutes,
      },
    };

    visitors[index] = updatedVisitor;
    this.saveVisitors(visitors);

    return updatedVisitor;
  }

  /**
   * Update visitor information
   */
  updateVisitor(id: number, updates: Partial<VisitorFormData>): Visitor | null {
    const visitors = this.getVisitors();
    const index = visitors.findIndex(v => v.id === id);

    if (index === -1) return null;

    const updatedVisitor: Visitor = {
      ...visitors[index],
      ...updates,
      id: visitors[index].id,
      entrada: visitors[index].entrada,
      status: visitors[index].status,
    };

    visitors[index] = updatedVisitor;
    this.saveVisitors(visitors);

    return updatedVisitor;
  }

  /**
   * Delete a visitor record
   */
  deleteVisitor(id: number): boolean {
    const visitors = this.getVisitors();
    const filtered = visitors.filter(v => v.id !== id);

    if (filtered.length === visitors.length) return false;

    this.saveVisitors(filtered);
    return true;
  }

  /**
   * Search visitors
   */
  searchVisitors(searchTerm: string): Visitor[] {
    if (!searchTerm) return [];

    const visitors = this.getVisitors();
    const searchLower = searchTerm.toLowerCase();

    return visitors.filter(
      v =>
        v.nome.toLowerCase().includes(searchLower) ||
        v.documento.toLowerCase().includes(searchLower) ||
        v.destino.toLowerCase().includes(searchLower)
    );
  }

  /**
   * Get visitor statistics for today
   */
  getTodayStats() {
    const visitors = this.getVisitors();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayVisitors = visitors.filter(v => {
      const entradaDate = new Date(v.entrada);
      entradaDate.setHours(0, 0, 0, 0);
      return entradaDate.getTime() === today.getTime();
    });

    return {
      total: todayVisitors.length,
      active: todayVisitors.filter(v => v.status === 'Ativo').length,
      completed: todayVisitors.filter(v => v.status === 'Saiu').length,
    };
  }

  /**
   * Get visitor statistics for the week
   */
  getWeekStats() {
    const visitors = this.getVisitors();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weekVisitors = visitors.filter(v => new Date(v.entrada) >= weekAgo);

    return {
      total: weekVisitors.length,
      active: weekVisitors.filter(v => v.status === 'Ativo').length,
      completed: weekVisitors.filter(v => v.status === 'Saiu').length,
    };
  }

  /**
   * Get visitors by date range
   */
  getVisitorsByDateRange(startDate: Date, endDate: Date): Visitor[] {
    const visitors = this.getVisitors();

    return visitors.filter(v => {
      const entrada = new Date(v.entrada);
      return entrada >= startDate && entrada <= endDate;
    });
  }

  /**
   * Validate visitor data
   */
  validateVisitorData(data: Partial<VisitorFormData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.nome && data.nome.length < 3) {
      errors.push('Nome deve ter no mínimo 3 caracteres');
    }

    if (data.nome && !/^[A-Za-zÀ-ÿ\s]+$/.test(data.nome)) {
      errors.push('Nome deve conter apenas letras');
    }

    if (data.documento) {
      const cleaned = data.documento.replace(/\D/g, '');
      if (cleaned.length !== 9 && cleaned.length !== 11) {
        errors.push('Documento inválido (CPF: 11 dígitos, RG: 9 dígitos)');
      }
    }

    if (data.destino && data.destino.length < 3) {
      errors.push('Destino deve ter no mínimo 3 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Clear old visitors (older than PRUNE_DAYS)
   */
  pruneOldVisitors(): number {
    const visitors = this.getVisitors();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - PRUNE_DAYS);

    const filtered = visitors.filter(v => new Date(v.entrada) >= cutoffDate);
    const removedCount = visitors.length - filtered.length;

    if (removedCount > 0) {
      this.saveVisitors(filtered);
    }

    return removedCount;
  }

  /**
   * Export visitors to CSV
   */
  exportToCSV(startDate?: Date, endDate?: Date): string {
    let visitors = this.getVisitors();

    if (startDate && endDate) {
      visitors = this.getVisitorsByDateRange(startDate, endDate);
    }

    const headers = [
      'ID',
      'Nome',
      'Documento',
      'Destino',
      'Motivo',
      'Entrada',
      'Saída',
      'Status',
      'Duração (min)'
    ];

    const rows = visitors.map(v => [
      v.id,
      v.nome,
      v.documento,
      v.destino,
      v.motivo || '',
      v.entrada.toLocaleString('pt-BR'),
      v.saida ? v.saida.toLocaleString('pt-BR') : '',
      v.status,
      v.duracao?.totalMinutes || ''
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
  }

  /**
   * Generate unique ID
   */
  private generateId(): number {
    const visitors = this.getVisitors();
    const maxId = visitors.reduce((max, visitor) => Math.max(max, visitor.id), 0);
    return maxId + 1;
  }

  /**
   * Save visitors to storage
   */
  private saveVisitors(visitors: Visitor[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visitors));
    } catch (error) {
      console.error('Error saving visitors:', error);
      throw new Error('Falha ao salvar visitantes');
    }
  }

  /**
   * Get recent visitors (last N entries)
   */
  getRecentVisitors(limit: number = 10): Visitor[] {
    const visitors = this.getVisitors();
    
    // Sort by entrada date descending and take limit
    return visitors
      .sort((a, b) => new Date(b.entrada).getTime() - new Date(a.entrada).getTime())
      .slice(0, limit);
  }

  /**
   * Get visitor history by document
   */
  getVisitorHistory(documento: string): Visitor[] {
    return this.getVisitorsByDocument(documento)
      .sort((a, b) => new Date(b.entrada).getTime() - new Date(a.entrada).getTime());
  }
}

export default new VisitorService();
