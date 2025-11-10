import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar,
  Users,
  Clock,
  BarChart3,
  PieChart,
  TrendingUp,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ReportService, type ReportFilter, type ReportData, type VisitaRegistro, type Estatisticas } from "@/services/ReportService";
import { AnalyticsService } from "@/services/AnalyticsService";
import { SavedFiltersManager } from "@/components/reports/SavedFiltersManager";

const RelatoriosPageContent = () => {
  const [filtros, setFiltros] = useState<ReportFilter>({
    periodo: "",
    tipo: "",
    status: "",
    destino: ""
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingFormat, setGeneratingFormat] = useState<'pdf' | 'excel' | null>(null);
  
  const { toast } = useToast();

  const dadosRelatorio = [
    { id: 1, data: "17/09/2024", hora: "14:30", visitante: "João Silva", documento: "123.456.789-00", destino: "Apto 101", motivo: "Visita familiar", status: "Concluída", duracao: "2h 15min" },
    { id: 2, data: "17/09/2024", hora: "13:15", visitante: "Maria Santos", documento: "987.654.321-00", destino: "Apto 205", motivo: "Entrega", status: "Concluída", duracao: "15min" },
    { id: 3, data: "17/09/2024", hora: "12:45", visitante: "Carlos Lima", documento: "456.789.123-00", destino: "Administração", motivo: "Manutenção", status: "Em andamento", duracao: "45min" },
    { id: 4, data: "16/09/2024", hora: "16:20", visitante: "Ana Costa", documento: "321.654.987-00", destino: "Apto 102", motivo: "Prestador de serviço", status: "Concluída", duracao: "3h 30min" },
    { id: 5, data: "16/09/2024", hora: "09:10", visitante: "Pedro Oliveira", documento: "159.753.486-00", destino: "Apto 304", motivo: "Visita social", status: "Concluída", duracao: "1h 45min" },
  ];

  const estatisticas = [
    { titulo: "Total de Acessos", valor: "284", periodo: "Últimos 7 dias", icon: Users, cor: "text-primary" },
    { titulo: "Tempo Médio", valor: "1h 28min", periodo: "Por visita", icon: Clock, cor: "text-accent" },
    { titulo: "Pico de Movimento", valor: "14:00-16:00", periodo: "Horário", icon: TrendingUp, cor: "text-success" },
    { titulo: "Taxa de Ocupação", valor: "67%", periodo: "Média diária", icon: BarChart3, cor: "text-warning" },
  ];

  // Filter data based on current filters
  const getFilteredData = (): VisitaRegistro[] => {
    let filtered = [...dadosRelatorio];

    if (filtros.tipo && filtros.tipo !== "todos") {
      filtered = filtered.filter(registro => {
        const tipoMap: Record<string, string> = {
          'familiar': 'Visita familiar',
          'servico': 'Prestador de serviço',
          'entrega': 'Entrega',
          'manutencao': 'Manutenção'
        };
        return registro.motivo === tipoMap[filtros.tipo];
      });
    }

    if (filtros.status && filtros.status !== "todos") {
      filtered = filtered.filter(registro => {
        const statusMap: Record<string, string> = {
          'ativo': 'Em andamento',
          'concluida': 'Concluída',
          'cancelada': 'Cancelada'
        };
        return registro.status === statusMap[filtros.status];
      });
    }

    if (filtros.destino && filtros.destino.trim() !== "") {
      const destinoLower = filtros.destino.toLowerCase();
      filtered = filtered.filter(registro => 
        registro.destino.toLowerCase().includes(destinoLower)
      );
    }

    return filtered;
  };

  // Prepare report data
  const prepareReportData = (format: 'pdf' | 'excel'): ReportData => {
    const filteredRegistros = getFilteredData();
    
    const estatisticasData: Estatisticas = {
      totalAcessos: filteredRegistros.length,
      tempoMedio: estatisticas[1].valor,
      picoPeriodo: estatisticas[2].valor,
      taxaOcupacao: estatisticas[3].valor
    };

    const metadata = ReportService.createMetadata(
      filtros,
      filteredRegistros.length,
      format,
      'Porteiro'
    );

    return {
      registros: filteredRegistros,
      estatisticas: estatisticasData,
      metadata
    };
  };

  const handleExportarDados = async (formato: 'pdf' | 'excel') => {
    setIsGenerating(true);
    setGeneratingFormat(formato);
    const startTime = Date.now();

    try {
      // Prepare data
      const reportData = prepareReportData(formato);

      // Validate data
      const validation = ReportService.validateReportData(reportData);
      if (!validation.isValid) {
        // Track validation error
        AnalyticsService.track('report_validation_failed', {
          format: formato,
          errors: validation.errors,
          filters: filtros
        });
        
        toast({
          title: "Erro na validação dos dados",
          description: validation.errors.join(', '),
          variant: "destructive"
        });
        return;
      }

      // Generate report
      let blob: Blob;
      if (formato === 'pdf') {
        blob = await ReportService.generatePDF(reportData);
      } else {
        blob = await ReportService.generateExcel(reportData);
      }

      // Download report
      const filename = ReportService.generateFilename(formato, 'relatorio_acessos');
      ReportService.downloadReport(blob, filename);

      // Calculate generation time
      const generationTime = (Date.now() - startTime) / 1000;

      // Track successful report generation
      AnalyticsService.track('report_generated', {
        format: formato,
        filters: filtros,
        recordCount: reportData.registros.length,
        generationTime,
        filename
      });

      toast({
        title: "Relatório gerado com sucesso",
        description: `O arquivo ${filename} foi baixado para sua pasta de downloads`,
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      
      let errorMessage = 'Erro desconhecido ao gerar relatório';
      let errorType = 'unknown';
      
      if (error instanceof Error) {
        if (error.message.includes('tempo limite')) {
          errorMessage = 'A geração do relatório demorou muito tempo. Tente reduzir o período ou filtros.';
          errorType = 'timeout';
        } else if (error.message.includes('Validação falhou')) {
          errorMessage = error.message;
          errorType = 'validation';
        } else if (error.message.includes('download')) {
          errorMessage = 'Falha ao fazer download do arquivo. Verifique as permissões do navegador.';
          errorType = 'download';
        } else {
          errorMessage = error.message;
          errorType = 'generation';
        }
      }

      // Track report generation failure
      AnalyticsService.track('report_generation_failed', {
        format: formato,
        filters: filtros,
        errorType,
        errorMessage,
        generationTime: (Date.now() - startTime) / 1000
      });

      toast({
        title: "Erro ao gerar relatório",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setGeneratingFormat(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Relatórios de Acesso</h1>
          <p className="text-muted-foreground">Análise completa do fluxo de visitantes</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => handleExportarDados("pdf")} 
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            disabled={isGenerating}
          >
            {isGenerating && generatingFormat === 'pdf' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            PDF
          </Button>
          <Button 
            onClick={() => handleExportarDados("excel")} 
            className="bg-success hover:bg-success/90"
            disabled={isGenerating}
          >
            {isGenerating && generatingFormat === 'excel' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Excel
          </Button>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {estatisticas.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-lg border-0 bg-card/95 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.titulo}</p>
                    <p className="text-2xl font-bold text-primary">{stat.valor}</p>
                    <p className={`text-xs ${stat.cor} mt-1`}>{stat.periodo}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <Icon className={`h-5 w-5 ${stat.cor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filtros */}
      <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-primary">
            <Filter className="h-5 w-5" />
            Filtros de Relatório
          </CardTitle>
          <CardDescription>Configure os parâmetros para gerar relatórios personalizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Período</Label>
              <Select onValueChange={(value) => setFiltros({...filtros, periodo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="ontem">Ontem</SelectItem>
                  <SelectItem value="semana">Esta semana</SelectItem>
                  <SelectItem value="mes">Este mês</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Visita</Label>
              <Select onValueChange={(value) => setFiltros({...filtros, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="familiar">Visita Familiar</SelectItem>
                  <SelectItem value="servico">Prestador de Serviço</SelectItem>
                  <SelectItem value="entrega">Entrega</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select onValueChange={(value) => setFiltros({...filtros, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Em andamento</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Destino</Label>
              <Input 
                placeholder="Ex: Apto 101, Administração..."
                value={filtros.destino}
                onChange={(e) => setFiltros({...filtros, destino: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => setFiltros({periodo: "", tipo: "", status: "", destino: ""})}
                disabled={isGenerating}
              >
                Limpar Filtros
              </Button>
              <div className="text-sm text-muted-foreground flex items-center">
                {getFilteredData().length} registro(s) encontrado(s)
              </div>
            </div>
            
            {/* REL-003: Saved Filters Manager */}
            <SavedFiltersManager
              currentFilters={filtros}
              onApplyFilter={(filters) => setFiltros(filters)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Dados */}
      <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-primary">
            <BarChart3 className="h-5 w-5" />
            Registros Detalhados
          </CardTitle>
          <CardDescription>Visualização completa dos acessos registrados</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Visitante</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredData().map((registro) => (
                  <TableRow key={registro.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{registro.data}</p>
                        <p className="text-sm text-muted-foreground">{registro.hora}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{registro.visitante}</TableCell>
                    <TableCell className="text-sm">{registro.documento}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/5 border-primary/20">
                        {registro.destino}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{registro.motivo}</TableCell>
                    <TableCell className="text-sm font-medium">{registro.duracao}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={registro.status === "Concluída" ? "default" : "secondary"}
                        className={registro.status === "Concluída" ? "bg-success" : registro.status === "Em andamento" ? "bg-warning" : ""}
                      >
                        {registro.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Análise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-primary">
              <PieChart className="h-5 w-5" />
              Distribuição por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { tipo: "Visita Familiar", porcentagem: 45, cor: "bg-primary" },
                { tipo: "Prestador de Serviço", porcentagem: 30, cor: "bg-accent" },
                { tipo: "Entrega", porcentagem: 15, cor: "bg-success" },
                { tipo: "Manutenção", porcentagem: 10, cor: "bg-warning" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded ${item.cor}`}></div>
                  <span className="flex-1 text-sm">{item.tipo}</span>
                  <span className="font-semibold text-primary">{item.porcentagem}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-primary">
              <Calendar className="h-5 w-5" />
              Horários de Pico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { horario: "08:00 - 10:00", visitas: 23, intensidade: 60 },
                { horario: "10:00 - 12:00", visitas: 18, intensidade: 45 },
                { horario: "14:00 - 16:00", visitas: 31, intensidade: 85 },
                { horario: "16:00 - 18:00", visitas: 28, intensidade: 75 }
              ].map((periodo, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{periodo.horario}</span>
                    <span className="font-semibold text-primary">{periodo.visitas} visitas</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-accent to-accent-dark h-2 rounded-full transition-all duration-500"
                      style={{ width: `${periodo.intensidade}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const RelatoriosPage = () => {
  return (
    <ErrorBoundary context="Relatórios Page">
      <RelatoriosPageContent />
    </ErrorBoundary>
  );
};

export default RelatoriosPage;