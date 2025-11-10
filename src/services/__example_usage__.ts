/**
 * Example usage of ReportService
 * This file demonstrates how to use the ReportService in your components
 */

import { ReportService, ReportData, ReportFilter, VisitaRegistro, Estatisticas } from './ReportService';

// Example: Prepare report data
const exampleFilters: ReportFilter = {
  periodo: 'Esta semana',
  tipo: 'Visita Familiar',
  status: 'Concluída',
  destino: 'Apto 101'
};

const exampleRegistros: VisitaRegistro[] = [
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
  },
  {
    id: 2,
    data: '17/09/2024',
    hora: '13:15',
    visitante: 'Maria Santos',
    documento: '987.654.321-00',
    destino: 'Apto 205',
    motivo: 'Entrega',
    status: 'Concluída',
    duracao: '15min'
  }
];

const exampleEstatisticas: Estatisticas = {
  totalAcessos: 284,
  tempoMedio: '1h 28min',
  picoPeriodo: '14:00-16:00',
  taxaOcupacao: '67%'
};

const exampleReportData: ReportData = {
  registros: exampleRegistros,
  estatisticas: exampleEstatisticas,
  metadata: ReportService.createMetadata(
    exampleFilters,
    exampleRegistros.length,
    'pdf',
    'Porteiro João'
  )
};

// Example: Generate and download PDF report
export async function generatePDFExample() {
  try {
    // Validate data
    const validation = ReportService.validateReportData(exampleReportData);
    if (!validation.isValid) {
      console.error('Validation errors:', validation.errors);
      return;
    }

    // Generate PDF
    const pdfBlob = await ReportService.generatePDF(exampleReportData);
    
    // Download
    const filename = ReportService.generateFilename('pdf', 'relatorio_acessos');
    ReportService.downloadReport(pdfBlob, filename);
    
    console.log('PDF generated successfully!');
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

// Example: Generate and download Excel report
export async function generateExcelExample() {
  try {
    // Update metadata for Excel format
    const excelData: ReportData = {
      ...exampleReportData,
      metadata: ReportService.createMetadata(
        exampleFilters,
        exampleRegistros.length,
        'excel',
        'Porteiro João'
      )
    };

    // Validate data
    const validation = ReportService.validateReportData(excelData);
    if (!validation.isValid) {
      console.error('Validation errors:', validation.errors);
      return;
    }

    // Generate Excel
    const excelBlob = await ReportService.generateExcel(excelData);
    
    // Download
    const filename = ReportService.generateFilename('excel', 'relatorio_acessos');
    ReportService.downloadReport(excelBlob, filename);
    
    console.log('Excel generated successfully!');
  } catch (error) {
    console.error('Error generating Excel:', error);
  }
}

// Example: Using with React Hook
/*
import { useReportGeneration } from '@/hooks/useReportGeneration';

function MyComponent() {
  const { isGenerating, error, generatePDFReport, generateExcelReport } = useReportGeneration();

  const handleGeneratePDF = async () => {
    await generatePDFReport(exampleReportData);
  };

  const handleGenerateExcel = async () => {
    await generateExcelReport(exampleReportData);
  };

  return (
    <div>
      <button onClick={handleGeneratePDF} disabled={isGenerating}>
        {isGenerating ? 'Gerando...' : 'Gerar PDF'}
      </button>
      <button onClick={handleGenerateExcel} disabled={isGenerating}>
        {isGenerating ? 'Gerando...' : 'Gerar Excel'}
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
}
*/
