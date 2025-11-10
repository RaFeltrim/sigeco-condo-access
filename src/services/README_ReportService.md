# ReportService - Documentação

## Visão Geral

O `ReportService` é um serviço completo para geração de relatórios em PDF e Excel com validação de dados, timeout de 5 segundos e download automático.

## Funcionalidades Implementadas

✅ Instalação de dependências jsPDF e xlsx (SheetJS)
✅ Interface ReportService com métodos generatePDF e generateExcel
✅ Geração de PDF com formatação adequada (cabeçalho, tabela, rodapé)
✅ Geração de Excel com múltiplas sheets (dados, estatísticas, metadados)
✅ Método downloadReport que força download do arquivo
✅ Validação de dados antes da geração
✅ Timeout de 5 segundos para geração
✅ Hook React com loading states durante geração

## Estrutura de Arquivos

```
src/
├── services/
│   ├── ReportService.ts          # Serviço principal
│   ├── __example_usage__.ts      # Exemplos de uso
│   └── README_ReportService.md   # Esta documentação
└── hooks/
    └── useReportGeneration.ts    # Hook React para gerenciar estados
```

## Uso Básico

### 1. Preparar os Dados

```typescript
import { ReportService, ReportData } from '@/services/ReportService';

const reportData: ReportData = {
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
    totalAcessos: 284,
    tempoMedio: '1h 28min',
    picoPeriodo: '14:00-16:00',
    taxaOcupacao: '67%'
  },
  metadata: ReportService.createMetadata(
    { periodo: 'Esta semana' },
    1,
    'pdf',
    'Porteiro João'
  )
};
```

### 2. Usar o Hook React (Recomendado)

```typescript
import { useReportGeneration } from '@/hooks/useReportGeneration';

function MyComponent() {
  const { isGenerating, error, generatePDFReport, generateExcelReport } = useReportGeneration();

  const handlePDF = async () => {
    await generatePDFReport(reportData);
  };

  const handleExcel = async () => {
    await generateExcelReport(reportData);
  };

  return (
    <div>
      <Button onClick={handlePDF} disabled={isGenerating}>
        {isGenerating ? 'Gerando PDF...' : 'Gerar PDF'}
      </Button>
      <Button onClick={handleExcel} disabled={isGenerating}>
        {isGenerating ? 'Gerando Excel...' : 'Gerar Excel'}
      </Button>
      {error && <Alert>{error}</Alert>}
    </div>
  );
}
```

### 3. Uso Direto do Serviço

```typescript
import { ReportService } from '@/services/ReportService';

async function generateReport() {
  try {
    // Validar dados
    const validation = ReportService.validateReportData(reportData);
    if (!validation.isValid) {
      console.error('Erros:', validation.errors);
      return;
    }

    // Gerar PDF
    const pdfBlob = await ReportService.generatePDF(reportData);
    const filename = ReportService.generateFilename('pdf');
    ReportService.downloadReport(pdfBlob, filename);

    // Ou gerar Excel
    const excelBlob = await ReportService.generateExcel(reportData);
    const excelFilename = ReportService.generateFilename('excel');
    ReportService.downloadReport(excelBlob, excelFilename);
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

## Tipos e Interfaces

### ReportFilter
```typescript
interface ReportFilter {
  periodo?: string;
  tipo?: string;
  status?: string;
  destino?: string;
  dataInicio?: Date;
  dataFim?: Date;
}
```

### VisitaRegistro
```typescript
interface VisitaRegistro {
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
```

### ReportData
```typescript
interface ReportData {
  registros: VisitaRegistro[];
  estatisticas: Estatisticas;
  metadata: ReportMetadata;
}
```

## Validações

O serviço valida automaticamente:
- ✅ Dados não nulos
- ✅ Array de registros válido
- ✅ Presença de estatísticas
- ✅ Presença de metadados
- ✅ Registros não vazios

## Timeout

- Todas as operações têm timeout de **5 segundos**
- Se exceder, uma exceção é lançada
- O hook React trata automaticamente o erro

## Formato PDF

O PDF gerado inclui:
- **Cabeçalho**: Título e data de geração
- **Estatísticas**: Resumo dos dados
- **Filtros**: Filtros aplicados (se houver)
- **Tabela**: Registros detalhados com paginação automática
- **Rodapé**: Número de página e versão

## Formato Excel

O Excel gerado inclui 3 sheets:
1. **Dados**: Registros detalhados com colunas formatadas
2. **Estatísticas**: Métricas resumidas
3. **Metadados**: Informações sobre a geração e filtros

## Tratamento de Erros

O serviço lança exceções específicas:
- `"Validação falhou: ..."` - Dados inválidos
- `"Geração de PDF excedeu o tempo limite..."` - Timeout
- `"Falha ao fazer download do arquivo: ..."` - Erro no download

## Próximos Passos

Para integrar na página de relatórios (Task 6):
1. Importar `useReportGeneration` no `RelatoriosPage.tsx`
2. Substituir os handlers `handleExportarDados` pelos métodos do hook
3. Adicionar spinner de loading baseado em `isGenerating`
4. Preparar os dados do relatório a partir dos filtros e registros da página

## Requisitos Atendidos

- ✅ 3.1: Processamento em até 5 segundos (timeout implementado)
- ✅ 3.2: Download automático do arquivo
- ✅ 3.3: Conteúdo completo e formatado
- ✅ 3.4: Mensagens de erro específicas
- ✅ 3.5: Validação de dados e filtros
