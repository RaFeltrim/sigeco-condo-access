import jsPDF from 'jspdf';
import ExcelJS from 'exceljs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Types and Interfaces
export interface ReportFilter {
  periodo?: string;
  tipo?: string;
  status?: string;
  destino?: string;
  dataInicio?: Date;
  dataFim?: Date;
}

export interface VisitaRegistro {
  id: number;
  data: string;
  hora: string;
  visitante: string;
  documento: string;
  destino: string;
  motivo: string;
  status: string;
  duracao: string;
}

export interface Estatisticas {
  totalAcessos: number;
  tempoMedio: string;
  picoPeriodo: string;
  taxaOcupacao: string;
}

export interface ReportMetadata {
  generatedAt: Date;
  generatedBy: string;
  filters: ReportFilter;
  totalRecords: number;
  format: 'pdf' | 'excel';
  version: string;
}

export interface ReportData {
  registros: VisitaRegistro[];
  estatisticas: Estatisticas;
  metadata: ReportMetadata;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Report Service Class
class ReportServiceClass {
  private readonly TIMEOUT_MS = 5000;
  private readonly VERSION = '1.0.0';

  /**
   * Validates report data before generation
   */
  validateReportData(data: ReportData): ValidationResult {
    const errors: string[] = [];

    if (!data) {
      errors.push('Dados do relatório não fornecidos');
      return { isValid: false, errors };
    }

    if (!data.registros || !Array.isArray(data.registros)) {
      errors.push('Registros inválidos ou ausentes');
    }

    if (data.registros && data.registros.length === 0) {
      errors.push('Nenhum registro encontrado para gerar o relatório');
    }

    if (!data.estatisticas) {
      errors.push('Estatísticas não fornecidas');
    }

    if (!data.metadata) {
      errors.push('Metadados do relatório não fornecidos');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generates PDF report with proper formatting
   */
  async generatePDF(data: ReportData): Promise<Blob> {
    return this.withTimeout(async () => {
      // Validate data
      const validation = this.validateReportData(data);
      if (!validation.isValid) {
        throw new Error(`Validação falhou: ${validation.errors.join(', ')}`);
      }

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      // Header
      doc.setFontSize(20);
      doc.setTextColor(33, 37, 41);
      doc.text('SIGECO - Relatório de Acessos', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 10;
      doc.setFontSize(10);
      doc.setTextColor(108, 117, 125);
      doc.text(
        `Gerado em: ${format(data.metadata.generatedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
        pageWidth / 2,
        yPosition,
        { align: 'center' }
      );

      yPosition += 15;

      // Statistics Section
      doc.setFontSize(14);
      doc.setTextColor(33, 37, 41);
      doc.text('Estatísticas Gerais', 14, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setTextColor(73, 80, 87);
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

      // Filters Applied
      if (data.metadata.filters && Object.keys(data.metadata.filters).length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(33, 37, 41);
        doc.text('Filtros Aplicados', 14, yPosition);
        yPosition += 6;

        doc.setFontSize(9);
        doc.setTextColor(73, 80, 87);
        
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
      doc.setFontSize(12);
      doc.setTextColor(33, 37, 41);
      doc.text('Registros Detalhados', 14, yPosition);
      yPosition += 8;

      // Table
      doc.setFontSize(8);
      doc.setFillColor(240, 240, 240);
      doc.rect(14, yPosition - 5, pageWidth - 28, 7, 'F');
      
      doc.setTextColor(33, 37, 41);
      doc.text('Data/Hora', 16, yPosition);
      doc.text('Visitante', 45, yPosition);
      doc.text('Documento', 85, yPosition);
      doc.text('Destino', 120, yPosition);
      doc.text('Status', 155, yPosition);
      doc.text('Duração', 180, yPosition);
      
      yPosition += 8;

      // Table Rows
      doc.setFontSize(7);
      data.registros.forEach((registro, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
          
          // Repeat table header on new page
          doc.setFontSize(8);
          doc.setFillColor(240, 240, 240);
          doc.rect(14, yPosition - 5, pageWidth - 28, 7, 'F');
          doc.setTextColor(33, 37, 41);
          doc.text('Data/Hora', 16, yPosition);
          doc.text('Visitante', 45, yPosition);
          doc.text('Documento', 85, yPosition);
          doc.text('Destino', 120, yPosition);
          doc.text('Status', 155, yPosition);
          doc.text('Duração', 180, yPosition);
          yPosition += 8;
          doc.setFontSize(7);
        }

        // Alternate row colors
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(14, yPosition - 4, pageWidth - 28, 6, 'F');
        }

        doc.setTextColor(73, 80, 87);
        doc.text(`${registro.data} ${registro.hora}`, 16, yPosition);
        doc.text(registro.visitante.substring(0, 20), 45, yPosition);
        doc.text(registro.documento, 85, yPosition);
        doc.text(registro.destino.substring(0, 15), 120, yPosition);
        doc.text(registro.status, 155, yPosition);
        doc.text(registro.duracao, 180, yPosition);
        
        yPosition += 6;
      });

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(108, 117, 125);
        doc.text(
          `Página ${i} de ${totalPages} | SIGECO v${this.VERSION}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      return doc.output('blob');
    }, 'Geração de PDF');
  }

  /**
   * Generates Excel report with multiple sheets using ExcelJS
   */
  async generateExcel(data: ReportData): Promise<Blob> {
    return this.withTimeout(async () => {
      // Validate data
      const validation = this.validateReportData(data);
      if (!validation.isValid) {
        throw new Error(`Validação falhou: ${validation.errors.join(', ')}`);
      }

      const workbook = new ExcelJS.Workbook();
      workbook.creator = data.metadata.generatedBy;
      workbook.created = data.metadata.generatedAt;

      // Sheet 1: Dados Detalhados
      const wsRegistros = workbook.addWorksheet('Dados', {
        views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
      });

      // Define columns
      wsRegistros.columns = [
        { header: 'Data', key: 'data', width: 12 },
        { header: 'Hora', key: 'hora', width: 8 },
        { header: 'Visitante', key: 'visitante', width: 25 },
        { header: 'Documento', key: 'documento', width: 18 },
        { header: 'Destino', key: 'destino', width: 20 },
        { header: 'Motivo', key: 'motivo', width: 25 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Duração', key: 'duracao', width: 12 }
      ];

      // Style header row
      wsRegistros.getRow(1).font = { bold: true };
      wsRegistros.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      // Add data rows
      data.registros.forEach(registro => {
        wsRegistros.addRow({
          data: registro.data,
          hora: registro.hora,
          visitante: registro.visitante,
          documento: registro.documento,
          destino: registro.destino,
          motivo: registro.motivo,
          status: registro.status,
          duracao: registro.duracao
        });
      });

      // Sheet 2: Estatísticas
      const wsEstatisticas = workbook.addWorksheet('Estatísticas');
      
      wsEstatisticas.columns = [
        { header: 'Métrica', key: 'metrica', width: 25 },
        { header: 'Valor', key: 'valor', width: 20 }
      ];

      wsEstatisticas.getRow(1).font = { bold: true };
      wsEstatisticas.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      wsEstatisticas.addRow({ metrica: 'Total de Acessos', valor: data.estatisticas.totalAcessos });
      wsEstatisticas.addRow({ metrica: 'Tempo Médio', valor: data.estatisticas.tempoMedio });
      wsEstatisticas.addRow({ metrica: 'Pico de Movimento', valor: data.estatisticas.picoPeriodo });
      wsEstatisticas.addRow({ metrica: 'Taxa de Ocupação', valor: data.estatisticas.taxaOcupacao });

      // Sheet 3: Metadados
      const wsMetadados = workbook.addWorksheet('Metadados');
      
      wsMetadados.columns = [
        { header: 'Campo', key: 'campo', width: 25 },
        { header: 'Valor', key: 'valor', width: 40 }
      ];

      wsMetadados.getRow(1).font = { bold: true };
      wsMetadados.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      wsMetadados.addRow({ 
        campo: 'Data de Geração', 
        valor: format(data.metadata.generatedAt, "dd/MM/yyyy HH:mm:ss", { locale: ptBR }) 
      });
      wsMetadados.addRow({ campo: 'Gerado Por', valor: data.metadata.generatedBy });
      wsMetadados.addRow({ campo: 'Total de Registros', valor: data.metadata.totalRecords });
      wsMetadados.addRow({ campo: 'Versão', valor: data.metadata.version });
      wsMetadados.addRow({ campo: 'Formato', valor: data.metadata.format });

      // Add filters to metadata
      if (data.metadata.filters) {
        if (data.metadata.filters.periodo) {
          wsMetadados.addRow({ campo: 'Filtro - Período', valor: data.metadata.filters.periodo });
        }
        if (data.metadata.filters.tipo) {
          wsMetadados.addRow({ campo: 'Filtro - Tipo', valor: data.metadata.filters.tipo });
        }
        if (data.metadata.filters.status) {
          wsMetadados.addRow({ campo: 'Filtro - Status', valor: data.metadata.filters.status });
        }
        if (data.metadata.filters.destino) {
          wsMetadados.addRow({ campo: 'Filtro - Destino', valor: data.metadata.filters.destino });
        }
      }

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }, 'Geração de Excel');
  }

  /**
   * Forces download of the report file
   * REL-RBF-003: Enhanced download with better browser compatibility
   */
  downloadReport(blob: Blob, filename: string): void {
    try {
      // Check if blob is valid
      if (!blob || blob.size === 0) {
        throw new Error('Arquivo vazio ou inválido');
      }

      // Create object URL
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      // Add to document, trigger click, and remove
      document.body.appendChild(link);
      
      // Use setTimeout to ensure the link is in the DOM before clicking
      setTimeout(() => {
        link.click();
        
        // Clean up after a short delay
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
      }, 0);
      
    } catch (error) {
      console.error('Download error:', error);
      
      // Fallback: try to open in new window if download fails
      try {
        const url = window.URL.createObjectURL(blob);
        const newWindow = window.open(url, '_blank');
        
        if (!newWindow) {
          throw new Error('Popup bloqueado. Por favor, permita popups para este site.');
        }
        
        // Clean up URL after window opens
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
      } catch (fallbackError) {
        throw new Error(`Falha ao fazer download do arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Verifique se popups estão permitidos.`);
      }
    }
  }

  /**
   * Wraps async operations with timeout
   */
  private async withTimeout<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<T>((_, reject) =>
        setTimeout(
          () => reject(new Error(`${operationName} excedeu o tempo limite de ${this.TIMEOUT_MS}ms`)),
          this.TIMEOUT_MS
        )
      )
    ]);
  }

  /**
   * Helper to create report metadata
   */
  createMetadata(
    filters: ReportFilter,
    totalRecords: number,
    format: 'pdf' | 'excel',
    generatedBy: string = 'Sistema'
  ): ReportMetadata {
    return {
      generatedAt: new Date(),
      generatedBy,
      filters,
      totalRecords,
      format,
      version: this.VERSION
    };
  }

  /**
   * Helper to generate filename with timestamp
   */
  generateFilename(fileFormat: 'pdf' | 'excel', prefix: string = 'relatorio'): string {
    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    const extension = fileFormat === 'pdf' ? 'pdf' : 'xlsx';
    return `${prefix}_${timestamp}.${extension}`;
  }
}

// Export singleton instance
export const ReportService = new ReportServiceClass();
