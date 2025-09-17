import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  Download, 
  Upload, 
  BookOpen,
  Monitor,
  Wifi,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Video,
  MessageSquare,
  Headphones
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SuporteAvancadoPage = () => {
  const { toast } = useToast();

  const statusSistema = {
    versaoAtual: "2.1.3",
    ultimaAtualizacao: "15/09/2024",
    proximaAtualizacao: "Disponível",
    sistemaOnline: true,
    backupStatus: "Ativo"
  };

  const treinamentos = [
    { 
      id: 1, 
      titulo: "Operação Básica do Sistema", 
      duracao: "25 min", 
      tipo: "Vídeo", 
      status: "Completo",
      progresso: 100
    },
    { 
      id: 2, 
      titulo: "Cadastro de Visitantes", 
      duracao: "15 min", 
      tipo: "Guia", 
      status: "Completo",
      progresso: 100
    },
    { 
      id: 3, 
      titulo: "Geração de Relatórios", 
      duracao: "20 min", 
      tipo: "Vídeo", 
      status: "Em progresso",
      progresso: 65
    },
    { 
      id: 4, 
      titulo: "Configurações de Segurança", 
      duracao: "30 min", 
      tipo: "Guia", 
      status: "Não iniciado",
      progresso: 0
    }
  ];

  const suporteContatos = [
    {
      tipo: "Técnico",
      descricao: "Problemas técnicos e emergências",
      contato: "(11) 3333-4444",
      horario: "24/7",
      status: "Disponível"
    },
    {
      tipo: "Treinamento",
      descricao: "Capacitação e dúvidas de uso",
      contato: "(11) 3333-5555", 
      horario: "8h às 18h",
      status: "Disponível"
    },
    {
      tipo: "Comercial",
      descricao: "Upgrades e novas funcionalidades",
      contato: "(11) 3333-6666",
      horario: "8h às 17h",
      status: "Disponível"
    }
  ];

  const atualizacoes = [
    {
      versao: "2.2.0",
      data: "Setembro 2024",
      status: "Disponível",
      tamanho: "45 MB",
      descricao: "Melhorias na interface e novos relatórios"
    },
    {
      versao: "2.1.3",
      data: "15/09/2024",
      status: "Instalado",
      tamanho: "12 MB",
      descricao: "Correções de bugs e otimizações"
    },
    {
      versao: "2.1.2",
      data: "01/09/2024", 
      status: "Instalado",
      tamanho: "8 MB",
      descricao: "Atualizações de segurança"
    }
  ];

  const handleIniciarTreinamento = (id: number, titulo: string) => {
    toast({
      title: "Treinamento iniciado",
      description: `Começando: ${titulo}`,
    });
  };

  const handleInstalarAtualizacao = () => {
    toast({
      title: "Instalação iniciada",
      description: "A atualização será instalada durante a manutenção noturna",
    });
  };

  const handleContatarSuporte = (tipo: string) => {
    toast({
      title: `Conectando com suporte ${tipo.toLowerCase()}`,
      description: "Você será redirecionado para o canal apropriado",
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-primary">Suporte e Manutenção</h1>
        <p className="text-muted-foreground">Central de suporte, treinamento e atualizações</p>
      </div>

      {/* Status do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Versão Atual</p>
                <p className="text-2xl font-bold text-primary">{statusSistema.versaoAtual}</p>
                <p className="text-xs text-success mt-1">Atualizado</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-xl">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sistema</p>
                <p className="text-2xl font-bold text-success">Online</p>
                <p className="text-xs text-success mt-1">99.9% uptime</p>
              </div>
              <div className="bg-success/10 p-3 rounded-xl">
                <Wifi className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Atualizações</p>
                <p className="text-2xl font-bold text-accent">1</p>
                <p className="text-xs text-accent mt-1">Disponível</p>
              </div>
              <div className="bg-accent/10 p-3 rounded-xl">
                <Download className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Suporte</p>
                <p className="text-2xl font-bold text-success">24/7</p>
                <p className="text-xs text-success mt-1">Disponível</p>
              </div>
              <div className="bg-success/10 p-3 rounded-xl">
                <Headphones className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="treinamento" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="treinamento" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Treinamento
          </TabsTrigger>
          <TabsTrigger value="atualizacoes" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Atualizações
          </TabsTrigger>
          <TabsTrigger value="suporte" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Suporte
          </TabsTrigger>
          <TabsTrigger value="documentacao" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentação
          </TabsTrigger>
        </TabsList>

        {/* Tab Treinamento */}
        <TabsContent value="treinamento" className="space-y-6">
          <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-primary">
                <BookOpen className="h-5 w-5" />
                Material de Treinamento
              </CardTitle>
              <CardDescription>Aprenda a usar todas as funcionalidades do SIGECO</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {treinamentos.map((treinamento) => (
                  <Card key={treinamento.id} className="border border-border/50">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="outline" 
                            className={`${treinamento.tipo === 'Vídeo' ? 'bg-accent/5 border-accent/20' : 'bg-primary/5 border-primary/20'}`}
                          >
                            {treinamento.tipo === 'Vídeo' ? 
                              <Video className="h-3 w-3 mr-1" /> : 
                              <FileText className="h-3 w-3 mr-1" />
                            }
                            {treinamento.tipo}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{treinamento.duracao}</span>
                        </div>

                        <div>
                          <h4 className="font-semibold text-primary mb-2">{treinamento.titulo}</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progresso</span>
                              <span>{treinamento.progresso}%</span>
                            </div>
                            <Progress value={treinamento.progresso} className="h-2" />
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <Badge 
                            variant={treinamento.status === 'Completo' ? 'default' : treinamento.status === 'Em progresso' ? 'secondary' : 'outline'}
                            className={treinamento.status === 'Completo' ? 'bg-success' : treinamento.status === 'Em progresso' ? 'bg-warning' : ''}
                          >
                            {treinamento.status}
                          </Badge>
                          
                          <Button 
                            size="sm"
                            onClick={() => handleIniciarTreinamento(treinamento.id, treinamento.titulo)}
                            className="bg-accent hover:bg-accent-dark text-accent-foreground"
                          >
                            {treinamento.status === 'Completo' ? 'Revisar' : treinamento.status === 'Em progresso' ? 'Continuar' : 'Iniciar'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Atualizações */}
        <TabsContent value="atualizacoes" className="space-y-6">
          <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-3 text-primary">
                    <Download className="h-5 w-5" />
                    Atualizações do Sistema
                  </CardTitle>
                  <CardDescription>Mantenha o SIGECO sempre atualizado</CardDescription>
                </div>
                <Button 
                  onClick={handleInstalarAtualizacao}
                  className="bg-accent hover:bg-accent-dark text-accent-foreground"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Instalar Atualização
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {atualizacoes.map((atualizacao, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        atualizacao.status === 'Disponível' 
                          ? 'bg-accent/10' 
                          : 'bg-success/10'
                      }`}>
                        {atualizacao.status === 'Disponível' ? 
                          <AlertCircle className="h-5 w-5 text-accent" /> :
                          <CheckCircle className="h-5 w-5 text-success" />
                        }
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary">Versão {atualizacao.versao}</h4>
                        <p className="text-sm text-muted-foreground">{atualizacao.descricao}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {atualizacao.data} • {atualizacao.tamanho}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={atualizacao.status === 'Disponível' ? 'default' : 'secondary'}
                      className={atualizacao.status === 'Disponível' ? 'bg-accent' : 'bg-success'}
                    >
                      {atualizacao.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Suporte */}
        <TabsContent value="suporte" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suporteContatos.map((contato, index) => (
              <Card key={index} className="shadow-lg border-0 bg-card/95 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-primary">
                    <Phone className="h-5 w-5" />
                    Suporte {contato.tipo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{contato.descricao}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Telefone:</span>
                      <span className="font-medium">{contato.contato}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Horário:</span>
                      <span className="font-medium">{contato.horario}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <Badge className="bg-success">{contato.status}</Badge>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleContatarSuporte(contato.tipo)}
                    className="w-full bg-accent hover:bg-accent-dark text-accent-foreground"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contatar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab Documentação */}
        <TabsContent value="documentacao" className="space-y-6">
          <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-primary">
                <FileText className="h-5 w-5" />
                Documentação Técnica
              </CardTitle>
              <CardDescription>Manuais e guias de referência</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { titulo: "Manual do Usuário", descricao: "Guia completo de operação", tipo: "PDF", paginas: "45 páginas" },
                  { titulo: "Guia de Instalação", descricao: "Procedimentos de configuração", tipo: "PDF", paginas: "20 páginas" },
                  { titulo: "Manual Técnico", descricao: "Especificações do sistema", tipo: "PDF", paginas: "67 páginas" },
                  { titulo: "FAQ - Perguntas Frequentes", descricao: "Dúvidas mais comuns", tipo: "Web", paginas: "Online" },
                  { titulo: "Glossário", descricao: "Termos e definições", tipo: "PDF", paginas: "12 páginas" },
                  { titulo: "Changelog", descricao: "Histórico de atualizações", tipo: "Web", paginas: "Online" }
                ].map((doc, index) => (
                  <Card key={index} className="border border-border/50 hover:bg-muted/50 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <FileText className="h-6 w-6 text-primary" />
                          <Badge variant="outline">{doc.tipo}</Badge>
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary">{doc.titulo}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{doc.descricao}</p>
                          <p className="text-xs text-muted-foreground mt-2">{doc.paginas}</p>
                        </div>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="h-3 w-3 mr-2" />
                          Baixar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuporteAvancadoPage;