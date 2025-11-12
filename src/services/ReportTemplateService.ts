import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ReportData } from './ReportService';

// Template configuration types
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  headerColor: string;
  accentColor: string;
  showLogo: boolean;
  showPageNumbers: boolean;
  showStatistics: boolean;
  showFilters: boolean;
  tableStyle: 'striped' | 'bordered' | 'minimal';
  fontSize: 'small' | 'medium' | 'large';
}

export interface TemplateColors {
  primary: [number, number, number];
  secondary: [number, number, number];
  text: [number, number, number];
  textLight: [number, number, number];
  background: [number, number, number];
}

// Pre-defined templates
const DEFAULT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'default',
    name: 'Padrão SIGECO',
    description: 'Template padrão com todas as informações',
    headerColor: '#2563eb',
    accentColor: '#10b981',
    showLogo: true,
    showPageNumbers: true,
    showStatistics: true,
    showFilters: true,
    tableStyle: 'striped',
    fontSize: 'medium'
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Template limpo e compacto',
    headerColor: '#64748b',
    accentColor: '#94a3b8',
    showLogo: false,
    showPageNumbers: true,
    showStatistics: true,
    showFilters: false,
    tableStyle: 'minimal',
    fontSize: 'small'
  },
  {
    id: 'executive',
    name: 'Executivo',
    description: 'Template para apresentações executivas',
    headerColor: '#1e293b',
    accentColor: '#3b82f6',
    showLogo: true,
    showPageNumbers: true,
    showStatistics: true,
    showFilters: true,
    tableStyle: 'bordered',
    fontSize: 'large'
  },
  {
    id: 'compact',
    name: 'Compacto',
    description: 'Máximo de dados em menos páginas',
    headerColor: '#0f172a',
    accentColor: '#22c55e',
    showLogo: false,
    showPageNumbers: false,
    showStatistics: false,
    showFilters: false,
    tableStyle: 'minimal',
    fontSize: 'small'
  }
];

class ReportTemplateServiceClass {
  private templates: ReportTemplate[] = DEFAULT_TEMPLATES;
  private currentTemplate: ReportTemplate = DEFAULT_TEMPLATES[0];

  /**
   * Get all available templates
   */
  getTemplates(): ReportTemplate[] {
    return [...this.templates];
  }

  /**
   * Get template by ID
   */
  getTemplate(id: string): ReportTemplate | undefined {
    return this.templates.find(t => t.id === id);
  }

  /**
   * Set current template
   */
  setCurrentTemplate(templateId: string): void {
    const template = this.getTemplate(templateId);
    if (template) {
      this.currentTemplate = template;
      // Save to localStorage
      localStorage.setItem('sigeco_report_template', templateId);
    }
  }

  /**
   * Get current template
   */
  getCurrentTemplate(): ReportTemplate {
    // Try to load from localStorage
    const savedTemplateId = localStorage.getItem('sigeco_report_template');
    if (savedTemplateId) {
      const template = this.getTemplate(savedTemplateId);
      if (template) {
        this.currentTemplate = template;
      }
    }
    return this.currentTemplate;
  }

  /**
   * Parse hex color to RGB array
   */
  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        ]
      : [0, 0, 0];
  }

  /**
   * Get colors for template
   */
  getTemplateColors(template: ReportTemplate): TemplateColors {
    return {
      primary: this.hexToRgb(template.headerColor),
      secondary: this.hexToRgb(template.accentColor),
      text: [33, 37, 41],
      textLight: [108, 117, 125],
      background: [240, 240, 240]
    };
  }

  /**
   * Get font sizes for template
   */
  getFontSizes(template: ReportTemplate) {
    const sizes = {
      small: { title: 16, subtitle: 9, header: 12, body: 7, footer: 7 },
      medium: { title: 20, subtitle: 10, header: 14, body: 8, footer: 8 },
      large: { title: 24, subtitle: 12, header: 16, body: 10, footer: 9 }
    };
    return sizes[template.fontSize];
  }

  /**
   * Generate PDF with template
   */
  async generatePDFWithTemplate(
    data: ReportData,
    template?: ReportTemplate
  ): Promise<Blob> {
    const activeTemplate = template || this.currentTemplate;
    const colors = this.getTemplateColors(activeTemplate);
    const sizes = this.getFontSizes(activeTemplate);
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header with template styling
    doc.setFontSize(sizes.title);
    doc.setTextColor(...colors.primary);
    doc.text('SIGECO - Relatório de Acessos', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(sizes.subtitle);
    doc.setTextColor(...colors.textLight);
    doc.text(
      `Gerado em: ${format(data.metadata.generatedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
      pageWidth / 2,
      yPosition,
      { align: 'center' }
    );

    yPosition += 15;

    // Statistics Section (if enabled in template)
    if (activeTemplate.showStatistics) {
      doc.setFontSize(sizes.header);
      doc.setTextColor(...colors.primary);
      doc.text('Estatísticas Gerais', 14, yPosition);
      yPosition += 8;

      doc.setFontSize(sizes.body);
      doc.setTextColor(...colors.text);
      const stats = [
        `Total de Acessos: ${data.estatisticas.totalAcessos}`,
        `Tempo Médio: ${data.estatisticas.tempoMedio}`,
        `Pico de Movimento: ${data.estatisticas.picoPeriodo}`,
        `Taxa de Ocupação: ${data.estatisticas.taxaOcupacao}`
      ];

      stats.forEach(stat => {
        doc.text(stat, 14, yPosition);
        yPosition += 6;
      });

      yPosition += 10;
    }

    // Filters Applied (if enabled in template)
    if (activeTemplate.showFilters && data.metadata.filters && Object.keys(data.metadata.filters).length > 0) {
      doc.setFontSize(sizes.header - 2);
      doc.setTextColor(...colors.primary);
      doc.text('Filtros Aplicados', 14, yPosition);
      yPosition += 6;

      doc.setFontSize(sizes.body - 1);
      doc.setTextColor(...colors.text);
      
      if (data.metadata.filters.periodo) {
        doc.text(`Período: ${data.metadata.filters.periodo}`, 14, yPosition);
        yPosition += 5;
      }
      if (data.metadata.filters.tipo) {
        doc.text(`Tipo: ${data.metadata.filters.tipo}`, 14, yPosition);
        yPosition += 5;
      }
      if (data.metadata.filters.status) {
        doc.text(`Status: ${data.metadata.filters.status}`, 14, yPosition);
        yPosition += 5;
      }
      if (data.metadata.filters.destino) {
        doc.text(`Destino: ${data.metadata.filters.destino}`, 14, yPosition);
        yPosition += 5;
      }

      yPosition += 5;
    }

    // Table Header
    doc.setFontSize(sizes.header);
    doc.setTextColor(...colors.primary);
    doc.text('Registros Detalhados', 14, yPosition);
    yPosition += 8;

    // Table with template styling
    this.renderTable(doc, data, activeTemplate, colors, sizes, yPosition, pageWidth, pageHeight);

    // Footer with page numbers (if enabled in template)
    if (activeTemplate.showPageNumbers) {
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(sizes.footer);
        doc.setTextColor(...colors.textLight);
        doc.text(
          `Página ${i} de ${totalPages} | Template: ${activeTemplate.name}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
    }

    return doc.output('blob');
  }

  /**
   * Render table with template styling
   */
  private renderTable(
    doc: jsPDF,
    data: ReportData,
    template: ReportTemplate,
    colors: TemplateColors,
    sizes: ReturnType<typeof this.getFontSizes>,
    startY: number,
    pageWidth: number,
    pageHeight: number
  ): void {
    let yPosition = startY;

    // Table header styling based on template
    doc.setFontSize(sizes.body);
    
    if (template.tableStyle === 'bordered' || template.tableStyle === 'striped') {
      doc.setFillColor(...colors.background);
      doc.rect(14, yPosition - 5, pageWidth - 28, 7, 'F');
      
      if (template.tableStyle === 'bordered') {
        doc.setDrawColor(...colors.textLight);
        doc.rect(14, yPosition - 5, pageWidth - 28, 7);
      }
    }
    
    doc.setTextColor(...colors.text);
    doc.text('Data/Hora', 16, yPosition);
    doc.text('Visitante', 45, yPosition);
    doc.text('Documento', 85, yPosition);
    doc.text('Destino', 120, yPosition);
    doc.text('Status', 155, yPosition);
    doc.text('Duração', 180, yPosition);
    
    yPosition += 8;

    // Table Rows
    doc.setFontSize(sizes.body - 1);
    data.registros.forEach((registro, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
        
        // Repeat table header on new page
        doc.setFontSize(sizes.body);
        if (template.tableStyle === 'bordered' || template.tableStyle === 'striped') {
          doc.setFillColor(...colors.background);
          doc.rect(14, yPosition - 5, pageWidth - 28, 7, 'F');
        }
        doc.setTextColor(...colors.text);
        doc.text('Data/Hora', 16, yPosition);
        doc.text('Visitante', 45, yPosition);
        doc.text('Documento', 85, yPosition);
        doc.text('Destino', 120, yPosition);
        doc.text('Status', 155, yPosition);
        doc.text('Duração', 180, yPosition);
        yPosition += 8;
        doc.setFontSize(sizes.body - 1);
      }

      // Row styling based on template
      if (template.tableStyle === 'striped' && index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(14, yPosition - 4, pageWidth - 28, 6, 'F');
      } else if (template.tableStyle === 'bordered') {
        doc.setDrawColor(...colors.textLight);
        doc.rect(14, yPosition - 4, pageWidth - 28, 6);
      }

      doc.setTextColor(...colors.text);
      doc.text(`${registro.data} ${registro.hora}`, 16, yPosition);
      doc.text(registro.visitante.substring(0, 20), 45, yPosition);
      doc.text(registro.documento, 85, yPosition);
      doc.text(registro.destino.substring(0, 15), 120, yPosition);
      doc.text(registro.status, 155, yPosition);
      doc.text(registro.duracao, 180, yPosition);
      
      yPosition += 6;
    });
  }

  /**
   * Generate preview data URL for template
   */
  async generatePreview(
    data: ReportData,
    template: ReportTemplate
  ): Promise<string> {
    const blob = await this.generatePDFWithTemplate(data, template);
    return URL.createObjectURL(blob);
  }
}

// Export singleton instance
export const ReportTemplateService = new ReportTemplateServiceClass();
