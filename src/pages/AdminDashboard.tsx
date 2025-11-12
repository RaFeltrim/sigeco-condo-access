import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import NotificationSystem from "@/components/NotificationSystem";
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

  const stats = [
    { title: "Acessos Hoje", value: todayStats.total.toString(), change: todayChange, icon: Eye, color: "text-accent" },
    { title: "Visitantes Ativos", value: todayStats.active.toString(), change: `${todayStats.active} ativos`, icon: UserCheck, color: "text-success" },
    { title: "Total Semanal", value: weekStats.total.toString(), change: weekChange, icon: TrendingUp, color: "text-primary" },
    { title: "Sistema Online", value: "99.9%", change: "Estável", icon: Activity, color: "text-success" },
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

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="stats-cards-container">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className="shadow-lg border-0 bg-card/95 backdrop-blur" data-testid={`stat-card-${index}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1" data-testid={`stat-title-${index}`}>{stat.title}</p>
                            <p className="text-3xl font-bold text-primary" data-testid={`stat-value-${index}`}>{stat.value}</p>
                            <p className={`text-sm ${stat.color} mt-1`}>{stat.change}</p>
                          </div>
                          <div className="bg-primary/10 p-3 rounded-xl">
                            <Icon className={`h-6 w-6 ${stat.color}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Chart and Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Fluxo de Visitas */}
                <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-primary">
                      <BarChart3 className="h-5 w-5" />
                      Fluxo de Visitas - Última Semana
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"].map((dia, index) => {
                        const valor = weeklyData[index] || 0;
                        const maxValue = Math.max(...weeklyData, 1);
                        const width = (valor / maxValue) * 100;
                        
                        return (
                          <div key={dia} className="flex items-center gap-4">
                            <span className="text-sm font-medium w-16">{dia}</span>
                            <div className="flex-1 bg-secondary rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-accent to-accent-dark h-3 rounded-full transition-all duration-500"
                                style={{ width: `${width}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-primary w-8">{valor}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

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