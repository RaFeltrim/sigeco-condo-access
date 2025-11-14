import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  FileText, 
  Calendar as CalendarIcon,
  Download,
  Eye,
  Loader2,
  Filter,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ReportService, type ReportData, type ReportFilter } from "@/services/ReportService";
import { useToast } from "@/hooks/use-toast";

interface ReportMetadata {
  periodo?: string;
  dataInicio?: Date;
  dataFim?: Date;
  totalRegistros: number;
  formato: 'pdf' | 'excel';
  geradoPor: string;
  dataGeracao: string;
}

interface ReportGeneratorProps {
  onGenerate?: (report: Blob, metadata: ReportMetadata) => void;
  onPreview?: (data: ReportData) => void;
  className?: string;
}

export const ReportGenerator = ({ onGenerate, onPreview, className = "" }: ReportGeneratorProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState<'visitors' | 'access' | 'occupancy'>('visitors');
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [filters, setFilters] = useState<ReportFilter>({});
  const [customTitle, setCustomTitle] = useState("");

  const reportTypes = [
    { value: 'visitors', label: 'Relatório de Visitantes', description: 'Lista completa de visitantes e acessos' },
    { value: 'access', label: 'Controle de Acesso', description: 'Autorizações e bloqueios de entrada' },
    { value: 'occupancy', label: 'Taxa de Ocupação', description: 'Estatísticas de presença no condomínio' },
  ];

  const periods = [
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Última Semana' },
    { value: 'month', label: 'Último Mês' },
    { value: 'custom', label: 'Período Personalizado' },
  ];

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);

      // Validate date range for custom period
      if (period === 'custom' && (!dateRange.from || !dateRange.to)) {
        toast({
          title: "Período inválido",
          description: "Selecione as datas de início e fim para o período personalizado",
          variant: "destructive",
        });
        return;
      }

      // Mock data for demonstration
      const mockData: ReportData = {
        registros: [
          {
            id: 1,
            data: format(new Date(), 'dd/MM/yyyy', { locale: ptBR }),
            hora: format(new Date(), 'HH:mm', { locale: ptBR }),
            visitante: 'João Silva',
            documento: '123.456.789-00',
            destino: 'Apto 101',
            motivo: 'Visita social',
            status: 'Saiu',
            duracao: '2h 30min'
          },
          // Add more mock records as needed
        ],
        estatisticas: {
          totalAcessos: 45,
          tempoMedio: '1h 28min',
          picoPeriodo: '14:00-16:00',
          taxaOcupacao: '67%'
        },
        metadata: ReportService.createMetadata(
          {
            periodo: periods.find(p => p.value === period)?.label,
            dataInicio: dateRange.from,
            dataFim: dateRange.to,
            ...filters
          },
          45,
          format,
          'Administrador'
        )
      };

      // Generate report
      let blob: Blob;
      if (format === 'pdf') {
        blob = await ReportService.generatePDF(mockData);
      } else {
        blob = await ReportService.generateExcel(mockData);
      }

      // Download report
      const filename = ReportService.generateFilename(
        format,
        customTitle || reportTypes.find(t => t.value === reportType)?.label.toLowerCase().replace(/\s+/g, '-')
      );
      
      ReportService.downloadReport(blob, filename);

      // Callback
      if (onGenerate) {
        onGenerate(blob, mockData.metadata);
      }

      toast({
        title: "Relatório gerado com sucesso!",
        description: `${filename} foi baixado para seu computador.`,
      });

    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Erro ao gerar relatório",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = () => {
    // Mock data for preview
    const mockData: ReportData = {
      registros: [
        {
          id: 1,
          data: format(new Date(), 'dd/MM/yyyy', { locale: ptBR }),
          hora: format(new Date(), 'HH:mm', { locale: ptBR }),
          visitante: 'João Silva',
          documento: '123.456.789-00',
          destino: 'Apto 101',
          motivo: 'Visita social',
          status: 'Saiu',
          duracao: '2h 30min'
        },
      ],
      estatisticas: {
        totalAcessos: 45,
        tempoMedio: '1h 28min',
        picoPeriodo: '14:00-16:00',
        taxaOcupacao: '67%'
      },
      metadata: ReportService.createMetadata(
        {
          periodo: periods.find(p => p.value === period)?.label,
          ...filters
        },
        45,
        format,
        'Administrador'
      )
    };

    if (onPreview) {
      onPreview(mockData);
    }

    toast({
      title: "Prévia do relatório",
      description: "Visualização dos dados que serão incluídos no relatório",
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Gerador de Relatórios
            </CardTitle>
            <CardDescription>
              Configure e gere relatórios personalizados
            </CardDescription>
          </div>
          <Badge variant="secondary">
            <Settings className="h-3 w-3 mr-1" />
            Configuração
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Type */}
        <div className="space-y-2">
          <Label htmlFor="report-type">Tipo de Relatório</Label>
          <Select value={reportType} onValueChange={(value: 'visitors' | 'access' | 'occupancy') => setReportType(value)}>
            <SelectTrigger id="report-type">
              <SelectValue placeholder="Selecione o tipo de relatório" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{type.label}</span>
                    <span className="text-xs text-muted-foreground">{type.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Format Selection */}
        <div className="space-y-2">
          <Label htmlFor="format">Formato de Saída</Label>
          <Select value={format} onValueChange={(value: 'pdf' | 'excel') => setFormat(value)}>
            <SelectTrigger id="format">
              <SelectValue placeholder="Selecione o formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF - Documento Portátil</SelectItem>
              <SelectItem value="excel">Excel - Planilha (.xlsx)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Period Selection */}
        <div className="space-y-2">
          <Label htmlFor="period">Período</Label>
          <Select value={period} onValueChange={(value: 'today' | 'week' | 'month' | 'custom') => setPeriod(value)}>
            <SelectTrigger id="period">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Date Range */}
        {period === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Data Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                    initialFocus
                    disabled={(date) => dateRange.from ? date < dateRange.from : false}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {/* Custom Title */}
        <div className="space-y-2">
          <Label htmlFor="custom-title">Título Personalizado (Opcional)</Label>
          <Input
            id="custom-title"
            placeholder="Ex: Relatório Mensal de Visitas"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Gerar e Baixar
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handlePreview}
            disabled={isGenerating}
          >
            <Eye className="mr-2 h-4 w-4" />
            Visualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
