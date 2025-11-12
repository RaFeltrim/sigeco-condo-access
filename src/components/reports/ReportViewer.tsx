import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Download,
  Printer,
  Share2,
  Calendar,
  Clock,
  User,
  TrendingUp,
  Eye,
  CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { ReportData } from "@/services/ReportService";
import { useToast } from "@/hooks/use-toast";

interface ReportViewerProps {
  data: ReportData;
  onDownload?: () => void;
  onPrint?: () => void;
  onShare?: () => void;
  className?: string;
}

export const ReportViewer = ({ 
  data, 
  onDownload,
  onPrint,
  onShare,
  className = "" 
}: ReportViewerProps) => {
  const { toast } = useToast();

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
      toast({
        title: "Impressão iniciada",
        description: "Configurar impressão na janela que será aberta",
      });
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      toast({
        title: "Compartilhar relatório",
        description: "Funcionalidade de compartilhamento em desenvolvimento",
      });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Visualização do Relatório
            </CardTitle>
            <CardDescription>
              Gerado em {format(data.metadata.generatedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metadata Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              Gerado por
            </div>
            <p className="text-sm font-medium">{data.metadata.generatedBy}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Data
            </div>
            <p className="text-sm font-medium">
              {format(data.metadata.generatedAt, "dd/MM/yyyy", { locale: ptBR })}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Hora
            </div>
            <p className="text-sm font-medium">
              {format(data.metadata.generatedAt, "HH:mm", { locale: ptBR })}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              Registros
            </div>
            <p className="text-sm font-medium">{data.metadata.totalRecords}</p>
          </div>
        </div>

        <Separator />

        {/* Statistics Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Estatísticas Gerais
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{data.estatisticas.totalAcessos}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total de Acessos</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{data.estatisticas.tempoMedio}</p>
                  <p className="text-sm text-muted-foreground mt-1">Tempo Médio</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{data.estatisticas.picoPeriodo}</p>
                  <p className="text-sm text-muted-foreground mt-1">Pico de Movimento</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{data.estatisticas.taxaOcupacao}</p>
                  <p className="text-sm text-muted-foreground mt-1">Taxa de Ocupação</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Filters Applied */}
        {data.metadata.filters && Object.keys(data.metadata.filters).length > 0 && (
          <>
            <div>
              <h3 className="text-lg font-semibold mb-3">Filtros Aplicados</h3>
              <div className="flex flex-wrap gap-2">
                {data.metadata.filters.periodo && (
                  <Badge variant="secondary">
                    <Calendar className="h-3 w-3 mr-1" />
                    {data.metadata.filters.periodo}
                  </Badge>
                )}
                {data.metadata.filters.tipo && (
                  <Badge variant="secondary">
                    Tipo: {data.metadata.filters.tipo}
                  </Badge>
                )}
                {data.metadata.filters.status && (
                  <Badge variant="secondary">
                    Status: {data.metadata.filters.status}
                  </Badge>
                )}
                {data.metadata.filters.destino && (
                  <Badge variant="secondary">
                    Destino: {data.metadata.filters.destino}
                  </Badge>
                )}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Data Table */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Registros Detalhados
          </h3>
          <ScrollArea className="h-[400px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Visitante</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duração</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.registros.map((registro, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{registro.data}</span>
                        <span className="text-xs text-muted-foreground">{registro.hora}</span>
                      </div>
                    </TableCell>
                    <TableCell>{registro.visitante}</TableCell>
                    <TableCell className="font-mono text-xs">{registro.documento}</TableCell>
                    <TableCell>{registro.destino}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{registro.motivo}</TableCell>
                    <TableCell>
                      <Badge variant={registro.status === 'Ativo' ? 'default' : 'secondary'}>
                        {registro.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{registro.duracao}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {/* Footer Info */}
        <div className="text-xs text-muted-foreground text-center">
          <p>SIGECO - Sistema de Gerenciamento de Acesso v{data.metadata.version}</p>
          <p className="mt-1">
            Relatório gerado automaticamente • Formato: {data.metadata.format.toUpperCase()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportViewer;
