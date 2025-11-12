import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import NotificationSystem from "@/components/NotificationSystem";
import { DashboardStats, DashboardLayout, DashboardChart, type StatItem, type DashboardWidget } from "@/components/dashboard";
import { 
  BarChart3, 
  Users, 
  Clock, 
  Shield, 
  FileText, 
  Settings, 
  Phone, 
  LogOut,
  Eye,
  UserCheck,
  TrendingUp,
  Activity,
  Package,
  Lock,
  Calendar as CalendarIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import RelatoriosPage from "./RelatoriosPage";
import SegurancaPage from "./SegurancaPage";
import ControleInsumosPage from "./ControleInsumosPage";
import SuporteAvancadoPage from "./SuporteAvancadoPage";
import GerenciamentoMoradoresPage from "./GerenciamentoMoradoresPage";
import AgendamentoPage from "./AgendamentoPage";
import VisitorService from "@/services/VisitorService";
import { Visitor } from "@/types/visitor";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [recentVisitors, setRecentVisitors] = useState<Visitor[]>([]);
  const [todayStats, setTodayStats] = useState({ total: 0, active: 0, completed: 0 });
  const [weekStats, setWeekStats] = useState({ total: 0 });
  const [weeklyData, setWeeklyData] = useState<number[]>([]);

  useEffect(() => {
    // Load real data from VisitorService
    const loadData = () => {
      const today = VisitorService.getTodayStats();
      const week = VisitorService.getWeekStats();
      const recent = VisitorService.getRecentVisitors(10);
      
      setTodayStats(today);
      setWeekStats(week);
      setRecentVisitors(recent);
      
      // Calculate weekly data for the chart
      const weekData = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        
        const dayVisitors = VisitorService.getVisitorsByDateRange(date, nextDay);
        weekData.push(dayVisitors.length);
      }
      setWeeklyData(weekData);
    };

    loadData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: "overview", label: "Visão Geral", icon: BarChart3 },
    { id: "residents", label: "Gerenciamento de Moradores", icon: Users },
    { id: "agendamento", label: "Agendamento de Visitas", icon: CalendarIcon },
    { id: "reports", label: "Relatórios", icon: FileText },
    { id: "insumos", label: "Controle de Insumos", icon: Package },
    { id: "security", label: "Backup e Segurança", icon: Lock },
    { id: "support", label: "Suporte Avançado", icon: Phone },
  ];

  // Calculate changes for stats
  const yesterdayTotal = Math.max(0, weekStats.total - todayStats.total);
  const todayChange = yesterdayTotal > 0 
    ? `${todayStats.total > yesterdayTotal ? '+' : ''}${Math.round(((todayStats.total - yesterdayTotal) / yesterdayTotal) * 100)}%`
    : '+0%';
  
  const avgWeekly = Math.round(weekStats.total / 7);
  const weekChange = avgWeekly > 0
    ? `${todayStats.total > avgWeekly ? '+' : ''}${Math.round(((todayStats.total - avgWeekly) / avgWeekly) * 100)}%`
    : '+0%';

  const stats: StatItem[] = [
    { 
      title: "Acessos Hoje", 
      value: todayStats.total, 
      change: todayChange, 
      changeType: todayStats.total > yesterdayTotal ? 'positive' : 'negative',
      icon: Eye, 
      color: "text-accent",
      description: "Visitantes registrados hoje"
    },
    { 
      title: "Visitantes Ativos", 
      value: todayStats.active, 
      change: `${todayStats.active} no prédio`,
      changeType: 'neutral',
      icon: UserCheck, 
      color: "text-success",
      description: "Atualmente no condomínio"
    },
    { 
      title: "Total Semanal", 
      value: weekStats.total, 
      change: weekChange,
      changeType: todayStats.total > avgWeekly ? 'positive' : 'negative',
      icon: TrendingUp, 
      color: "text-primary",
      description: "Acessos nos últimos 7 dias"
    },
    { 
      title: "Sistema Online", 
      value: "99.9%", 
      change: "Estável",
      changeType: 'positive',
      icon: Activity, 
      color: "text-success",
      description: "Uptime do sistema"
    },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-muted">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur border-b border-border shadow-sm">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <Logo />
          <div className="flex items-center gap-4">
            <NotificationSystem />
            <div className="text-right">
              <p className="font-semibold text-primary">Administrador</p>
              <p className="text-sm text-muted-foreground">Painel de Controle</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-64 bg-card/95 backdrop-blur border-r border-border min-h-screen">
          <div className="p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeSection === item.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6" role="main">
          {activeSection === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-primary mb-2">Dashboard Administrativo</h1>
                  <p className="text-muted-foreground">Visão geral do sistema de controle de acesso</p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setActiveSection("residents")}
                    className="bg-accent hover:bg-accent-dark"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Novo Morador
                  </Button>
                  <Button 
                    onClick={() => setActiveSection("agendamento")}
                    variant="outline"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Agendar Visita
                  </Button>
                </div>
              </div>

              {/* Stats Cards - Using New DashboardStats Component */}
              <DashboardStats stats={stats} />

              {/* Chart and Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Fluxo de Visitas - Using New DashboardChart Component */}
                <DashboardChart
                  title="Fluxo de Visitas - Última Semana"
                  description="Número de visitantes por dia da semana"
                  data={[
                    { name: "Dom", value: weeklyData[0] || 0 },
                    { name: "Seg", value: weeklyData[1] || 0 },
                    { name: "Ter", value: weeklyData[2] || 0 },
                    { name: "Qua", value: weeklyData[3] || 0 },
                    { name: "Qui", value: weeklyData[4] || 0 },
                    { name: "Sex", value: weeklyData[5] || 0 },
                    { name: "Sáb", value: weeklyData[6] || 0 },
                  ]}
                  type="bar"
                  height={300}
                  className="shadow-lg border-0 bg-card/95 backdrop-blur"
                />

                {/* Visitantes Recentes */}
                <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-primary">
                      <Clock className="h-5 w-5" />
                      Atividade Recente
                    </CardTitle>
                    <CardDescription>Últimas entradas registradas</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      {recentVisitors.length > 0 ? (
                        recentVisitors.slice(0, 5).map((visitor) => (
                          <div
                            key={visitor.id}
                            className="flex items-center justify-between p-4 hover:bg-muted/50 border-b border-border last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-lg">
                                <Shield className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{visitor.nome}</p>
                                <p className="text-xs text-muted-foreground">{visitor.destino}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={visitor.status === "Ativo" ? "default" : "secondary"}
                                className={visitor.status === "Ativo" ? "bg-success" : ""}
                              >
                                {visitor.status}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">{visitor.hora}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-muted-foreground">
                          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Nenhuma visita registrada ainda</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeSection === "residents" && <GerenciamentoMoradoresPage />}
          
          {activeSection === "agendamento" && <AgendamentoPage />}

          {activeSection === "reports" && <RelatoriosPage />}

          {activeSection === "insumos" && <ControleInsumosPage />}

          {activeSection === "security" && <SegurancaPage />}

          {activeSection === "support" && <SuporteAvancadoPage />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;