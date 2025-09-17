import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  CloudUpload, 
  HardDrive, 
  Lock, 
  Key,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Settings,
  Monitor
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SegurancaPage = () => {
  const [configuracoes, setConfiguracoes] = useState({
    backupAutomatico: true,
    backupNuvem: true,
    criptografia: true,
    logAuditoria: true,
    alertasSeguranca: true
  });

  const { toast } = useToast();

  const statusBackup = {
    ultimoBackup: "Hoje às 06:00",
    proximoBackup: "Amanhã às 06:00",
    tamanhoTotal: "2.4 GB",
    espacoLivre: "45 GB",
    status: "Ativo"
  };

  const logsSeguranca = [
    { id: 1, tipo: "Login", usuario: "admin", hora: "14:30", status: "Sucesso", ip: "192.168.1.100" },
    { id: 2, tipo: "Backup", sistema: "Automático", hora: "06:00", status: "Concluído", detalhes: "2.4 GB" },
    { id: 3, tipo: "Acesso", usuario: "porteiro", hora: "08:15", status: "Sucesso", ip: "192.168.1.101" },
    { id: 4, tipo: "Falha Login", usuario: "desconhecido", hora: "02:33", status: "Bloqueado", ip: "192.168.1.200" },
  ];

  const handleBackupManual = () => {
    toast({
      title: "Backup iniciado",
      description: "O backup manual foi iniciado e será concluído em alguns minutos",
    });
  };

  const handleRestaurarBackup = () => {
    toast({
      title: "Restauração de backup",
      description: "Selecione o arquivo de backup para restaurar",
    });
  };

  const toggleConfiguracao = (config: string) => {
    setConfiguracoes(prev => ({
      ...prev,
      [config]: !prev[config as keyof typeof prev]
    }));
    
    toast({
      title: "Configuração atualizada",
      description: `${config} foi ${configuracoes[config as keyof typeof configuracoes] ? 'desabilitado' : 'habilitado'}`,
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-primary">Segurança e Backup</h1>
        <p className="text-muted-foreground">Configurações de segurança e backup dos dados</p>
      </div>

      {/* Status Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status do Sistema</p>
                <p className="text-2xl font-bold text-success">Seguro</p>
                <p className="text-xs text-success mt-1">Todas as proteções ativas</p>
              </div>
              <div className="bg-success/10 p-3 rounded-xl">
                <Shield className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Último Backup</p>
                <p className="text-2xl font-bold text-primary">Hoje</p>
                <p className="text-xs text-accent mt-1">06:00 - Automático</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-xl">
                <Database className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Espaço Utilizado</p>
                <p className="text-2xl font-bold text-primary">2.4 GB</p>
                <p className="text-xs text-muted-foreground mt-1">de 50 GB disponíveis</p>
              </div>
              <div className="bg-accent/10 p-3 rounded-xl">
                <HardDrive className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configurações de Backup */}
      <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-primary">
            <CloudUpload className="h-5 w-5" />
            Configurações de Backup
          </CardTitle>
          <CardDescription>Configure as opções de backup automático e manual</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress do backup atual */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-base">Progresso do Backup Atual</Label>
              <Badge className="bg-success">Concluído</Badge>
            </div>
            <Progress value={100} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Último backup: {statusBackup.ultimoBackup}</span>
              <span>Próximo: {statusBackup.proximoBackup}</span>
            </div>
          </div>

          {/* Configurações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Backup Automático</Label>
                  <p className="text-sm text-muted-foreground">Backup diário às 06:00</p>
                </div>
                <Switch 
                  checked={configuracoes.backupAutomatico}
                  onCheckedChange={() => toggleConfiguracao('backupAutomatico')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Backup na Nuvem</Label>
                  <p className="text-sm text-muted-foreground">Armazenamento redundante</p>
                </div>
                <Switch 
                  checked={configuracoes.backupNuvem}
                  onCheckedChange={() => toggleConfiguracao('backupNuvem')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Criptografia Avançada</Label>
                  <p className="text-sm text-muted-foreground">Proteção AES-256</p>
                </div>
                <Switch 
                  checked={configuracoes.criptografia}
                  onCheckedChange={() => toggleConfiguracao('criptografia')}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={handleBackupManual}
                className="w-full bg-accent hover:bg-accent-dark text-accent-foreground"
              >
                <Upload className="h-4 w-4 mr-2" />
                Iniciar Backup Manual
              </Button>

              <Button 
                onClick={handleRestaurarBackup}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Download className="h-4 w-4 mr-2" />
                Restaurar Backup
              </Button>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Informações do Backup</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tamanho Total:</span>
                    <span className="font-medium">{statusBackup.tamanhoTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Espaço Livre:</span>
                    <span className="font-medium">{statusBackup.espacoLivre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className="bg-success">{statusBackup.status}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Segurança e Auditoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-primary">
              <Lock className="h-5 w-5" />
              Configurações de Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Log de Auditoria</Label>
                <p className="text-sm text-muted-foreground">Registra todas as ações</p>
              </div>
              <Switch 
                checked={configuracoes.logAuditoria}
                onCheckedChange={() => toggleConfiguracao('logAuditoria')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Alertas de Segurança</Label>
                <p className="text-sm text-muted-foreground">Notificações automáticas</p>
              </div>
              <Switch 
                checked={configuracoes.alertasSeguranca}
                onCheckedChange={() => toggleConfiguracao('alertasSeguranca')}
              />
            </div>

            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="w-full">
                <Key className="h-4 w-4 mr-2" />
                Alterar Senha de Administrador
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-primary">
              <Monitor className="h-5 w-5" />
              Logs de Segurança
            </CardTitle>
            <CardDescription>Últimas atividades registradas</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {logsSeguranca.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      log.status === 'Sucesso' || log.status === 'Concluído' 
                        ? 'bg-success/10' 
                        : 'bg-destructive/10'
                    }`}>
                      {log.status === 'Sucesso' || log.status === 'Concluído' ? 
                        <CheckCircle className="h-4 w-4 text-success" /> :
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      }
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{log.tipo}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.usuario || log.sistema} • {log.ip || log.detalhes}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={log.status === 'Sucesso' || log.status === 'Concluído' ? "default" : "destructive"}
                      className={log.status === 'Sucesso' || log.status === 'Concluído' ? "bg-success" : ""}
                    >
                      {log.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{log.hora}</p>
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

export default SegurancaPage;