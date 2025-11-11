import { useState, useEffect, useRef } from "react";
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
  Monitor,
  FileDown,
  FileUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BackupService } from "@/services/BackupService";

const SegurancaPage = () => {
  const [configuracoes, setConfiguracoes] = useState({
    backupAutomatico: true,
    backupNuvem: true,
    criptografia: true,
    logAuditoria: true,
    alertasSeguranca: true
  });
  const [backupStats, setBackupStats] = useState({
    lastBackup: null as Date | null,
    nextBackup: null as Date | null,
    totalBackups: 0,
    totalSize: 0,
    automaticBackupEnabled: true
  });
  const [backups, setBackups] = useState<Array<{ id: string; timestamp: Date; size: number; type: string; description?: string }>>([]);
  const [logs, setLogs] = useState<Array<{ id: string; timestamp: Date; type: string; status: string; message: string }>>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  useEffect(() => {
    loadBackupData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadBackupData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadBackupData = () => {
    const stats = BackupService.getStats();
    const allBackups = BackupService.getAllBackups();
    const allLogs = BackupService.getLogs();
    
    setBackupStats(stats);
    setBackups(allBackups);
    setLogs(allLogs.slice(0, 10)); // Last 10 logs
    setConfiguracoes(prev => ({
      ...prev,
      backupAutomatico: stats.automaticBackupEnabled
    }));
  };

  const handleBackupManual = async () => {
    setIsBackingUp(true);
    try {
      const metadata = await BackupService.createBackup("Backup manual solicitado pelo usuário");
      toast({
        title: "Backup concluído",
        description: `Backup criado com sucesso (${formatSize(metadata.size)})`,
      });
      loadBackupData();
    } catch (error) {
      toast({
        title: "Erro no backup",
        description: error instanceof Error ? error.message : "Falha ao criar backup",
        variant: "destructive",
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestaurarBackup = (backupId: string) => {
    if (!window.confirm("Tem certeza que deseja restaurar este backup? Todos os dados atuais serão substituídos.")) {
      return;
    }

    try {
      BackupService.restoreBackup(backupId);
      toast({
        title: "Backup restaurado",
        description: "Os dados foram restaurados com sucesso. Recarregue a página para ver as mudanças.",
      });
      
      // Reload page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro na restauração",
        description: error instanceof Error ? error.message : "Falha ao restaurar backup",
        variant: "destructive",
      });
    }
  };

  const handleExportBackup = (backupId: string) => {
    try {
      const backupJson = BackupService.exportBackup(backupId);
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sigeco-backup-${backupId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Backup exportado",
        description: "O arquivo de backup foi baixado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: error instanceof Error ? error.message : "Falha ao exportar backup",
        variant: "destructive",
      });
    }
  };

  const handleImportBackup = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const metadata = await BackupService.importBackup(text);
      toast({
        title: "Backup importado",
        description: `Backup de ${new Date(metadata.timestamp).toLocaleString()} importado com sucesso`,
      });
      loadBackupData();
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: error instanceof Error ? error.message : "Falha ao importar backup",
        variant: "destructive",
      });
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteBackup = (backupId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este backup?")) {
      return;
    }

    const success = BackupService.deleteBackup(backupId);
    if (success) {
      toast({
        title: "Backup excluído",
        description: "O backup foi removido com sucesso",
      });
      loadBackupData();
    }
  };

  const toggleConfiguracao = (config: string) => {
    const newValue = !configuracoes[config as keyof typeof configuracoes];
    
    setConfiguracoes(prev => ({
      ...prev,
      [config]: newValue
    }));
    
    // Handle automatic backup toggle
    if (config === 'backupAutomatico') {
      BackupService.setAutomaticBackup(newValue);
    }
    
    toast({
      title: "Configuração atualizada",
      description: `${config} foi ${newValue ? 'habilitado' : 'desabilitado'}`,
    });
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "Nunca";
    return new Date(date).toLocaleString('pt-BR');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-primary">Segurança e Backup</h1>
        <p className="text-muted-foreground">Configurações de segurança e backup dos dados</p>
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />

      {/* Status Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status do Sistema</p>
                <p className="text-2xl font-bold text-success">Seguro</p>
                <p className="text-xs text-success mt-1">{backupStats.totalBackups} backups disponíveis</p>
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
                <p className="text-2xl font-bold text-primary">
                  {backupStats.lastBackup 
                    ? new Date(backupStats.lastBackup).toLocaleDateString('pt-BR')
                    : 'Nunca'}
                </p>
                <p className="text-xs text-accent mt-1">
                  {backupStats.lastBackup 
                    ? new Date(backupStats.lastBackup).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                    : 'Nenhum backup criado'}
                </p>
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
                <p className="text-2xl font-bold text-primary">{formatSize(backupStats.totalSize)}</p>
                <p className="text-xs text-muted-foreground mt-1">em {backupStats.totalBackups} backup(s)</p>
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
              <Label className="text-base">Status do Backup</Label>
              <Badge className={isBackingUp ? "bg-warning" : "bg-success"}>
                {isBackingUp ? "Em andamento..." : "Pronto"}
              </Badge>
            </div>
            <Progress value={isBackingUp ? 50 : 100} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Último backup: {formatDate(backupStats.lastBackup)}</span>
              <span>Próximo: {backupStats.nextBackup ? formatDate(backupStats.nextBackup) : 'Não agendado'}</span>
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
                disabled={isBackingUp}
                className="w-full bg-accent hover:bg-accent-dark text-accent-foreground"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isBackingUp ? 'Criando Backup...' : 'Iniciar Backup Manual'}
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={handleImportBackup}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <FileUp className="h-4 w-4 mr-2" />
                  Importar
                </Button>
                
                <Button 
                  onClick={() => backups.length > 0 && handleExportBackup(backups[0].id)}
                  disabled={backups.length === 0}
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Informações do Backup</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total de Backups:</span>
                    <span className="font-medium">{backupStats.totalBackups}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tamanho Total:</span>
                    <span className="font-medium">{formatSize(backupStats.totalSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className={backupStats.automaticBackupEnabled ? "bg-success" : "bg-warning"}>
                      {backupStats.automaticBackupEnabled ? "Ativo" : "Inativo"}
                    </Badge>
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
              {logs.length > 0 ? (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        log.status === 'success' 
                          ? 'bg-success/10' 
                          : 'bg-destructive/10'
                      }`}>
                        {log.status === 'success' ? 
                          <CheckCircle className="h-4 w-4 text-success" /> :
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        }
                      </div>
                      <div>
                        <p className="font-semibold text-sm capitalize">{log.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {log.message}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={log.status === 'success' ? "default" : "destructive"}
                        className={log.status === 'success' ? "bg-success" : ""}
                      >
                        {log.status === 'success' ? 'Sucesso' : 'Falha'}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(log.timestamp).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Monitor className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum log de segurança registrado</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Backups */}
      <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-primary">
            <Database className="h-5 w-5" />
            Backups Disponíveis
          </CardTitle>
          <CardDescription>Gerencie e restaure backups do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {backups.length > 0 ? (
            <div className="space-y-3">
              {backups.map((backup) => (
                <Card key={backup.id} className="border border-border/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Database className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">
                            Backup {new Date(backup.timestamp).toLocaleDateString('pt-BR')}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(backup.timestamp).toLocaleTimeString('pt-BR')} • 
                            {formatSize(backup.size)} • 
                            {backup.type === 'automatic' ? 'Automático' : 'Manual'}
                          </p>
                          {backup.description && (
                            <p className="text-xs text-muted-foreground mt-1">{backup.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestaurarBackup(backup.id)}
                          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Restaurar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExportBackup(backup.id)}
                          className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                        >
                          <FileDown className="h-3 w-3 mr-1" />
                          Exportar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteBackup(backup.id)}
                          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <AlertTriangle className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Nenhum backup disponível</p>
              <p className="text-sm mt-1">Crie um backup manual ou aguarde o backup automático</p>
              <Button
                onClick={handleBackupManual}
                disabled={isBackingUp}
                className="mt-4 bg-accent hover:bg-accent-dark text-accent-foreground"
              >
                <Upload className="h-4 w-4 mr-2" />
                Criar Primeiro Backup
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SegurancaPage;