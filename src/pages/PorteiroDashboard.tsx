import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import NotificationSystem from "@/components/NotificationSystem";
import { LogOut, Phone, TrendingUp, Users, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AnalyticsService } from "@/services/AnalyticsService";
import { VisitorSearch } from "@/components/visitor/VisitorSearch";
import { VisitorForm, type VisitorFormData } from "@/components/visitor/VisitorForm";
import { VisitorList } from "@/components/visitor/VisitorList";
import { QuickCheckout } from "@/components/visitor/QuickCheckout";
import { calculateDuration, formatDuration } from "@/lib/utils/duration";
import { useVisitorStorage } from "@/hooks/useVisitorStorage";

// WhatsApp support configuration
const SUPPORT_PHONE = '5519997775596';
const SUPPORT_MESSAGE = 'Olá, preciso de suporte técnico com o SIGECO';

/**
 * Opens WhatsApp Web or native app with pre-filled support message
 */
const openWhatsAppSupport = () => {
  const encodedMessage = encodeURIComponent(SUPPORT_MESSAGE);
  const whatsappUrl = `https://wa.me/${SUPPORT_PHONE}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};

const PorteiroDashboardContent = () => {
  // Use persistent storage hook
  const { visitors: registros, addVisitor, updateVisitor, clearOldVisitors, isLoading } = useVisitorStorage();
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Calculate dynamic statistics from actual data
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const visitantesHoje = registros.filter(r => {
    const entradaDate = new Date(r.entrada);
    entradaDate.setHours(0, 0, 0, 0);
    return entradaDate.getTime() === hoje.getTime();
  }).length;
  
  // Calculate yesterday's visitors
  const ontem = new Date(hoje);
  ontem.setDate(ontem.getDate() - 1);
  const visitantesOntem = registros.filter(r => {
    const entradaDate = new Date(r.entrada);
    entradaDate.setHours(0, 0, 0, 0);
    return entradaDate.getTime() === ontem.getTime();
  }).length;
  
  // Calculate percentage change vs yesterday
  const percentualOntem = visitantesOntem > 0 
    ? Math.round(((visitantesHoje - visitantesOntem) / visitantesOntem) * 100)
    : visitantesHoje > 0 ? 100 : 0;
  
  const inicioSemana = new Date();
  inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
  inicioSemana.setHours(0, 0, 0, 0);
  
  const visitantesSemana = registros.filter(r => {
    const entradaDate = new Date(r.entrada);
    return entradaDate >= inicioSemana;
  }).length;
  
  // Calculate previous week's visitors
  const inicioSemanaAnterior = new Date(inicioSemana);
  inicioSemanaAnterior.setDate(inicioSemanaAnterior.getDate() - 7);
  const fimSemanaAnterior = new Date(inicioSemana);
  fimSemanaAnterior.setTime(fimSemanaAnterior.getTime() - 1);
  
  const visitantesSemanaAnterior = registros.filter(r => {
    const entradaDate = new Date(r.entrada);
    return entradaDate >= inicioSemanaAnterior && entradaDate <= fimSemanaAnterior;
  }).length;
  
  // Calculate percentage change vs previous week
  const percentualSemana = visitantesSemanaAnterior > 0
    ? Math.round(((visitantesSemana - visitantesSemanaAnterior) / visitantesSemanaAnterior) * 100)
    : visitantesSemana > 0 ? 100 : 0;

  const handleFormSubmit = async (data: VisitorFormData) => {
    try {
      const entradaTime = new Date();
      
      // DSB-RBF-001: Check if visitor already exists and is active
      const existingVisitor = registros.find(
        r => r.documento === data.documento && r.status === "Ativo"
      );
      
      if (existingVisitor) {
        // Visitor is already inside - show warning instead of creating duplicate
        toast({
          title: "Visitante já está no prédio",
          description: `${data.nome} já possui entrada ativa desde ${existingVisitor.hora}`,
          variant: "destructive",
        });
        return;
      }
      
      // Check if visitor has a recent exit (within last 24 hours) to reactivate
      const recentExit = registros.find(
        r => r.documento === data.documento && 
        r.status === "Saiu" &&
        r.saida &&
        (entradaTime.getTime() - r.saida.getTime()) < 24 * 60 * 60 * 1000
      );
      
      if (recentExit) {
        // Reactivate existing visitor instead of creating new entry
        try {
          updateVisitor(recentExit.id, {
            status: "Ativo",
            entrada: entradaTime,
            hora: entradaTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            destino: data.destino,
            motivo: data.motivo,
            saida: undefined,
            duracao: undefined
          });
          
          // Track visitor re-entry
          AnalyticsService.track('visitor_reentry', {
            destination: data.destino,
            hasMotivo: !!data.motivo,
            timestamp: entradaTime.toISOString()
          });
          
          toast({
            title: "Entrada registrada com sucesso",
            description: `Visitante ${data.nome} autorizado para ${data.destino}`,
          });
          return;
        } catch (reactivationError) {
          // If reactivation fails (e.g., visitor was pruned from storage),
          // fall through to create a new entry instead
          console.warn('Failed to reactivate visitor, creating new entry:', reactivationError);
        }
      }
      
      // Create new visitor entry
      const novoRegistro = {
        nome: data.nome,
        documento: data.documento,
        destino: data.destino,
        hora: entradaTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: "Ativo" as const,
        entrada: entradaTime,
        motivo: data.motivo
      };
      
      // Add visitor with automatic localStorage persistence
      addVisitor(novoRegistro);
      
      // Track visitor registration
      AnalyticsService.track('visitor_registered', {
        destination: data.destino,
        hasMotivo: !!data.motivo,
        timestamp: entradaTime.toISOString()
      });
      
      // Show success toast
      toast({
        title: "Entrada registrada com sucesso",
        description: `Visitante ${data.nome} autorizado para ${data.destino}`,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      // Error toast is already shown by useVisitorStorage hook
      throw error; // Re-throw to let form handle it
    }
  };

  const handleCheckout = (id: number) => {
    try {
      const visitanteRecord = registros.find(r => r.id === id);
      
      if (!visitanteRecord) {
        toast({
          title: "Erro ao registrar saída",
          description: "Visitante não encontrado",
          variant: "destructive",
        });
        return;
      }
      
      // DSB-RBF-002: Prevent duplicate checkout for visitors who already left
      if (visitanteRecord.status === "Saiu") {
        toast({
          title: "Saída já registrada",
          description: `${visitanteRecord.nome} já saiu do prédio às ${visitanteRecord.saida?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
          variant: "destructive",
        });
        return;
      }
      
      const saida = new Date();
      
      // Calculate duration
      let duration;
      if (visitanteRecord?.entrada) {
        duration = calculateDuration(visitanteRecord.entrada, saida);
      }
      
      // Update visitor with automatic localStorage persistence
      updateVisitor(id, {
        status: "Saiu",
        saida,
        duracao: duration
      });
      
      // Track visitor exit
      if (visitanteRecord?.entrada && duration) {
        AnalyticsService.track('visitor_exit', {
          destination: visitanteRecord.destino,
          durationMinutes: duration.totalMinutes,
          timestamp: saida.toISOString()
        });
      }
      
      // Show toast with duration
      toast({
        title: `Saída de ${visitanteRecord?.nome} registrada com sucesso`,
        description: duration ? formatDuration(duration) : undefined,
        duration: 5000,
      });
    } catch (error) {
      console.error('Error during checkout:', error);
      // Error toast is already shown by useVisitorStorage hook
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  // Show loading state while data is being loaded from localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-muted flex items-center justify-center">
        <div className="text-center" role="status" aria-live="polite">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" aria-hidden="true"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-muted">
      {/* Skip to main content link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10000] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md"
      >
        Pular para o conteúdo principal
      </a>
      
      {/* Header */}
      <header className="bg-card/95 backdrop-blur border-b border-border shadow-sm" role="banner">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <Logo />
          <nav className="flex items-center gap-4" aria-label="Navegação principal">
            <NotificationSystem />
            <div className="text-right" role="status" aria-label="Informações do usuário">
              <p className="font-semibold text-primary">Porteiro</p>
              <p className="text-sm text-muted-foreground">Portaria Principal</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              aria-label="Sair do sistema"
            >
              <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
              Sair
            </Button>
          </nav>
        </div>
      </header>

      <main id="main-content" className="p-6 max-w-7xl mx-auto" role="main">
        {/* Título da Página */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">Dashboard do Porteiro</h1>
          <p className="text-muted-foreground">Controle de entrada e saída de visitantes</p>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6" role="region" aria-label="Estatísticas de visitantes">
          <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1" id="stat-today-label">Visitantes Hoje</p>
                  <p className="text-3xl font-bold text-primary" aria-labelledby="stat-today-label">{visitantesHoje}</p>
                  {visitantesOntem > 0 ? (
                    <p className={`text-xs mt-1 ${percentualOntem >= 0 ? 'text-success' : 'text-destructive'}`} aria-label={`${percentualOntem >= 0 ? '' : '-'}${Math.abs(percentualOntem)}% ${percentualOntem >= 0 ? 'a mais' : 'a menos'} que ontem`}>
                      {percentualOntem >= 0 ? '+' : ''}{percentualOntem}% vs. ontem
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">Primeiro dia de registros</p>
                  )}
                </div>
                <div className="bg-primary/10 p-3 rounded-xl" aria-hidden="true">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1" id="stat-active-label">Ativos Agora</p>
                  <p className="text-3xl font-bold text-accent" aria-labelledby="stat-active-label">{registros.filter(r => r.status === "Ativo").length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Visitantes no prédio</p>
                </div>
                <div className="bg-accent/10 p-3 rounded-xl" aria-hidden="true">
                  <Users className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1" id="stat-week-label">Total Semana</p>
                  <p className="text-3xl font-bold text-success" aria-labelledby="stat-week-label">{visitantesSemana}</p>
                  {visitantesSemanaAnterior > 0 ? (
                    <p className={`text-xs mt-1 ${percentualSemana >= 0 ? 'text-success' : 'text-destructive'}`} aria-label={`${percentualSemana >= 0 ? '' : '-'}${Math.abs(percentualSemana)}% ${percentualSemana >= 0 ? 'a mais' : 'a menos'} que a semana anterior`}>
                      {percentualSemana >= 0 ? '+' : ''}{percentualSemana}% vs. anterior
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">Primeira semana de registros</p>
                  )}
                </div>
                <div className="bg-success/10 p-3 rounded-xl" aria-hidden="true">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna Esquerda - Cadastro de Visitante */}
          <VisitorForm onSubmit={handleFormSubmit} />

          {/* Coluna Direita - Consulta e Histórico */}
          <div className="space-y-6">
            {/* DSB-004: Quick Checkout - Pronto para a Saída */}
            <QuickCheckout 
              visitors={registros}
              onCheckout={handleCheckout}
            />

            {/* Busca */}
            <VisitorSearch 
              visitors={registros}
              onSelectVisitor={(visitor) => {
                console.log('Selected visitor:', visitor);
              }}
            />

            {/* Registros Recentes */}
            <VisitorList 
              visitors={registros}
              onCheckout={handleCheckout}
            />

            {/* Manutenção de Dados */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-warning/5 to-destructive/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between" role="complementary" aria-label="Manutenção de dados">
                  <div>
                    <p className="font-semibold text-primary">Manutenção de Dados</p>
                    <p className="text-sm text-muted-foreground">Limpar registros antigos (30+ dias)</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => clearOldVisitors(30)}
                    className="border-warning text-warning hover:bg-warning hover:text-warning-foreground"
                    aria-label="Limpar registros com mais de 30 dias"
                  >
                    <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                    Limpar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Suporte */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between" role="complementary" aria-label="Suporte técnico">
                  <div>
                    <p className="font-semibold text-primary">Precisa de Ajuda?</p>
                    <p className="text-sm text-muted-foreground">Suporte técnico disponível</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={openWhatsAppSupport}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    aria-label="Contatar suporte técnico via WhatsApp"
                  >
                    <Phone className="h-4 w-4 mr-2" aria-hidden="true" />
                    Contatar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

const PorteiroDashboard = () => {
  return (
    <ErrorBoundary context="Porteiro Dashboard">
      <PorteiroDashboardContent />
    </ErrorBoundary>
  );
};

export default PorteiroDashboard;
