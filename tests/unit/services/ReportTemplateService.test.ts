/**
 * Unit Tests: ReportTemplateService
 * 
 * Testing Pyramid Layer: Unit Tests
 * Purpose: Test ReportTemplateService functionality in isolation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReportTemplateService } from '@/services/ReportTemplateService';
import type { ReportData } from '@/services/ReportService';

describe('ReportTemplateService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Template Management', () => {
    it('should return all available templates', () => {
      const templates = ReportTemplateService.getTemplates();
      expect(templates).toHaveLength(4);
      expect(templates[0].id).toBe('default');
      expect(templates[1].id).toBe('minimal');
      expect(templates[2].id).toBe('executive');
      expect(templates[3].id).toBe('compact');
    });

    it('should get template by ID', () => {
      const template = ReportTemplateService.getTemplate('default');
      expect(template).toBeDefined();
      expect(template?.name).toBe('Padrão SIGECO');
      expect(template?.id).toBe('default');
    });

    it('should return undefined for non-existent template', () => {
      const template = ReportTemplateService.getTemplate('non-existent');
      expect(template).toBeUndefined();
    });

    it('should get current template', () => {
      const template = ReportTemplateService.getCurrentTemplate();
      expect(template).toBeDefined();
      expect(template.id).toBe('default'); // Default template
    });

    it('should set current template', () => {
      ReportTemplateService.setCurrentTemplate('minimal');
      const template = ReportTemplateService.getCurrentTemplate();
      expect(template.id).toBe('minimal');
      expect(template.name).toBe('Minimalista');
    });

    it('should persist template selection to localStorage', () => {
      ReportTemplateService.setCurrentTemplate('executive');
      const savedId = localStorage.getItem('sigeco_report_template');
      expect(savedId).toBe('executive');
    });

    it('should load template from localStorage on next call', () => {
      localStorage.setItem('sigeco_report_template', 'compact');
      const template = ReportTemplateService.getCurrentTemplate();
      expect(template.id).toBe('compact');
    });
  });

  describe('Template Properties', () => {
    it('should have correct properties for default template', () => {
      const template = ReportTemplateService.getTemplate('default');
      expect(template).toMatchObject({
        id: 'default',
        name: 'Padrão SIGECO',
        headerColor: '#2563eb',
        accentColor: '#10b981',
        showLogo: true,
        showPageNumbers: true,
        showStatistics: true,
        showFilters: true,
        tableStyle: 'striped',
        fontSize: 'medium'
      });
    });

    it('should have correct properties for minimal template', () => {
      const template = ReportTemplateService.getTemplate('minimal');
      expect(template).toMatchObject({
        id: 'minimal',
        name: 'Minimalista',
        showLogo: false,
        showFilters: false,
        tableStyle: 'minimal',
        fontSize: 'small'
      });
    });

    it('should have correct properties for executive template', () => {
      const template = ReportTemplateService.getTemplate('executive');
      expect(template).toMatchObject({
        id: 'executive',
        name: 'Executivo',
        tableStyle: 'bordered',
        fontSize: 'large'
      });
    });

    it('should have correct properties for compact template', () => {
      const template = ReportTemplateService.getTemplate('compact');
      expect(template).toMatchObject({
        id: 'compact',
        name: 'Compacto',
        showLogo: false,
        showPageNumbers: false,
        showStatistics: false,
        showFilters: false,
        fontSize: 'small'
      });
    });
  });

  describe('Color Conversion', () => {
    it('should convert template colors to RGB', () => {
      const template = ReportTemplateService.getTemplate('default')!;
      const colors = ReportTemplateService.getTemplateColors(template);
      
      expect(colors.primary).toEqual([37, 99, 235]); // #2563eb
      expect(colors.secondary).toEqual([16, 185, 129]); // #10b981
      expect(colors.text).toEqual([33, 37, 41]);
      expect(colors.textLight).toEqual([108, 117, 125]);
      expect(colors.background).toEqual([240, 240, 240]);
    });

    it('should handle different header colors', () => {
      const template = ReportTemplateService.getTemplate('minimal')!;
      const colors = ReportTemplateService.getTemplateColors(template);
      
      expect(colors.primary).toEqual([100, 116, 139]); // #64748b
    });
  });

  describe('Font Sizes', () => {
    it('should return correct font sizes for small template', () => {
      const template = ReportTemplateService.getTemplate('minimal')!;
      const sizes = ReportTemplateService.getFontSizes(template);
      
      expect(sizes).toEqual({
        title: 16,
        subtitle: 9,
        header: 12,
        body: 7,
        footer: 7
      });
    });

    it('should return correct font sizes for medium template', () => {
      const template = ReportTemplateService.getTemplate('default')!;
      const sizes = ReportTemplateService.getFontSizes(template);
      
      expect(sizes).toEqual({
        title: 20,
        subtitle: 10,
        header: 14,
        body: 8,
        footer: 8
      });
    });

    it('should return correct font sizes for large template', () => {
      const template = ReportTemplateService.getTemplate('executive')!;
      const sizes = ReportTemplateService.getFontSizes(template);
      
      expect(sizes).toEqual({
        title: 24,
        subtitle: 12,
        header: 16,
        body: 10,
        footer: 9
      });
    });
  });

  describe('PDF Generation', () => {
    const mockReportData: ReportData = {
      registros: [
        {
          id: 1,
          data: '17/09/2024',
          hora: '14:30',
          visitante: 'João Silva',
          documento: '123.456.789-00',
          destino: 'Apto 101',
          motivo: 'Visita familiar',
          status: 'Concluída',
          duracao: '2h 15min'
        }
      ],
      estatisticas: {
        totalAcessos: 1,
        tempoMedio: '2h 15min',
        picoPeriodo: '14:00-16:00',
        taxaOcupacao: '67%'
      },
      metadata: {
        generatedAt: new Date(),
        generatedBy: 'Test User',
        filters: {
          periodo: 'hoje',
          tipo: 'todos',
          status: 'todos',
          destino: ''
        },
        recordCount: 1,
        format: 'pdf'
      }
    };

    it('should generate PDF with default template', async () => {
      const blob = await ReportTemplateService.generatePDFWithTemplate(mockReportData);
      
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/pdf');
      expect(blob.size).toBeGreaterThan(0);
    });

    it('should generate PDF with custom template', async () => {
      const template = ReportTemplateService.getTemplate('minimal');
      const blob = await ReportTemplateService.generatePDFWithTemplate(mockReportData, template);
      
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/pdf');
    });

    it('should generate PDF with statistics when enabled', async () => {
      const template = ReportTemplateService.getTemplate('default');
      expect(template?.showStatistics).toBe(true);
      
      const blob = await ReportTemplateService.generatePDFWithTemplate(mockReportData, template);
      expect(blob.size).toBeGreaterThan(0);
    });

    it('should generate PDF without statistics when disabled', async () => {
      const template = ReportTemplateService.getTemplate('compact');
      expect(template?.showStatistics).toBe(false);
      
      const blob = await ReportTemplateService.generatePDFWithTemplate(mockReportData, template);
      expect(blob.size).toBeGreaterThan(0);
    });

    it('should handle multiple records', async () => {
      const largeDataset: ReportData = {
        ...mockReportData,
        registros: Array(50).fill(null).map((_, i) => ({
          ...mockReportData.registros[0],
          id: i + 1,
          visitante: `Visitante ${i + 1}`
        }))
      };

      const blob = await ReportTemplateService.generatePDFWithTemplate(largeDataset);
      expect(blob.size).toBeGreaterThan(0);
    });
  });

  describe('Preview Generation', () => {
    const mockReportData: ReportData = {
      registros: [
        {
          id: 1,
          data: '17/09/2024',
          hora: '14:30',
          visitante: 'João Silva',
          documento: '123.456.789-00',
          destino: 'Apto 101',
          motivo: 'Visita familiar',
          status: 'Concluída',
          duracao: '2h 15min'
        }
      ],
      estatisticas: {
        totalAcessos: 1,
        tempoMedio: '2h 15min',
        picoPeriodo: '14:00-16:00',
        taxaOcupacao: '67%'
      },
      metadata: {
        generatedAt: new Date(),
        generatedBy: 'Test User',
        filters: {
          periodo: 'hoje',
          tipo: 'todos',
          status: 'todos',
          destino: ''
        },
        recordCount: 1,
        format: 'pdf'
      }
    };

    it('should generate preview URL', async () => {
      const template = ReportTemplateService.getTemplate('default')!;
      const url = await ReportTemplateService.generatePreview(mockReportData, template);
      
      expect(url).toMatch(/^blob:/);
      
      // Clean up
      URL.revokeObjectURL(url);
    });

    it('should generate preview for different templates', async () => {
      const templates = ['default', 'minimal', 'executive', 'compact'];
      
      for (const templateId of templates) {
        const template = ReportTemplateService.getTemplate(templateId)!;
        const url = await ReportTemplateService.generatePreview(mockReportData, template);
        
        expect(url).toMatch(/^blob:/);
        URL.revokeObjectURL(url);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty registros array', async () => {
      const emptyData: ReportData = {
        registros: [],
        estatisticas: {
          totalAcessos: 0,
          tempoMedio: '0min',
          picoPeriodo: 'N/A',
          taxaOcupacao: '0%'
        },
        metadata: {
          generatedAt: new Date(),
          generatedBy: 'Test User',
          filters: {
            periodo: 'hoje',
            tipo: 'todos',
            status: 'todos',
            destino: ''
          },
          recordCount: 0,
          format: 'pdf'
        }
      };

      const blob = await ReportTemplateService.generatePDFWithTemplate(emptyData);
      expect(blob).toBeInstanceOf(Blob);
    });

    it('should not set invalid template', () => {
      ReportTemplateService.setCurrentTemplate('default');
      ReportTemplateService.setCurrentTemplate('invalid-template');
      
      const template = ReportTemplateService.getCurrentTemplate();
      expect(template.id).toBe('default'); // Should remain default
    });
  });
});
