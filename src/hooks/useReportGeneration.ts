import { useState } from 'react';
import { ReportService, ReportData, ReportFilter } from '@/services/ReportService';
import { useToast } from '@/hooks/use-toast';

export interface UseReportGenerationReturn {
  isGenerating: boolean;
  error: string | null;
  generatePDFReport: (data: ReportData) => Promise<void>;
  generateExcelReport: (data: ReportData) => Promise<void>;
}

/**
 * Hook to manage report generation with loading states and error handling
 */
export const useReportGeneration = (): UseReportGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generatePDFReport = async (data: ReportData): Promise<void> => {
    setIsGenerating(true);
    setError(null);

    try {
      // Validate data first
      const validation = ReportService.validateReportData(data);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Generate PDF
      const blob = await ReportService.generatePDF(data);
      
      // Generate filename and download
      const filename = ReportService.generateFilename('pdf', 'relatorio_acessos');
      ReportService.downloadReport(blob, filename);

      toast({
        title: 'Relatório PDF gerado com sucesso',
        description: `O arquivo ${filename} foi baixado`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao gerar PDF';
      setError(errorMessage);
      
      toast({
        title: 'Erro ao gerar relatório PDF',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateExcelReport = async (data: ReportData): Promise<void> => {
    setIsGenerating(true);
    setError(null);

    try {
      // Validate data first
      const validation = ReportService.validateReportData(data);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Generate Excel
      const blob = await ReportService.generateExcel(data);
      
      // Generate filename and download
      const filename = ReportService.generateFilename('excel', 'relatorio_acessos');
      ReportService.downloadReport(blob, filename);

      toast({
        title: 'Relatório Excel gerado com sucesso',
        description: `O arquivo ${filename} foi baixado`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao gerar Excel';
      setError(errorMessage);
      
      toast({
        title: 'Erro ao gerar relatório Excel',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    error,
    generatePDFReport,
    generateExcelReport,
  };
};
