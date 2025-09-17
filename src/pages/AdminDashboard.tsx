import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
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
  Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import RelatoriosPage from "./RelatoriosPage";
import SegurancaPage from "./SegurancaPage";
import ControleInsumosPage from "./ControleInsumosPage";
import SuporteAvancadoPage from "./SuporteAvancadoPage";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");

  const menuItems = [
    { id: "overview", label: "Visão Geral", icon: BarChart3 },
    { id: "residents", label: "Gerenciamento de Moradores", icon: Users },
    { id: "reports", label: "Relatórios", icon: FileText },
    { id: "insumos", label: "Controle de Insumos", icon: Package },
    { id: "security", label: "Backup e Segurança", icon: Lock },
    { id: "support", label: "Suporte Avançado", icon: Phone },
  ];

  const stats = [
    { title: "Acessos Hoje", value: "47", change: "+12%", icon: Eye, color: "text-accent" },
    { title: "Visitantes Ativos", value: "8", change: "-2", icon: UserCheck, color: "text-success" },
    { title: "Total Semanal", value: "284", change: "+8%", icon: TrendingUp, color: "text-primary" },
    { title: "Sistema Online", value: "99.9%", change: "Estável", icon: Activity, color: "text-success" },
  ];

  const visitasRecentes = [
    { nome: "João Silva", documento: "123.456.789-00", destino: "Apto 101", hora: "14:30", status: "Ativo" },
    { nome: "Maria Santos", documento: "987.654.321-00", destino: "Apto 205", hora: "13:15", status: "Saiu" },
    { nome: "Carlos Lima", documento: "456.789.123-00", destino: "Apto 304", hora: "12:45", status: "Ativo" },
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
        <div className="flex-1 p-6">
          {activeSection === "overview" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">Dashboard Administrativo</h1>
                <p className="text-muted-foreground">Visão geral do sistema de controle de acesso</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className="shadow-lg border-0 bg-card/95 backdrop-blur">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                            <p className="text-3xl font-bold text-primary">{stat.value}</p>
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
                      {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((dia, index) => {
                        const valores = [45, 52, 38, 61, 47, 23, 15];
                        const valor = valores[index];
                        const width = (valor / 61) * 100;
                        
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
                      {visitasRecentes.map((visita, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 hover:bg-muted/50 border-b border-border last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <Shield className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{visita.nome}</p>
                              <p className="text-xs text-muted-foreground">{visita.destino}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={visita.status === "Ativo" ? "default" : "secondary"}
                              className={visita.status === "Ativo" ? "bg-success" : ""}
                            >
                              {visita.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">{visita.hora}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeSection === "residents" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-primary">Gerenciamento de Moradores</h1>
              <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
                <CardContent className="p-8 text-center">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    Funcionalidade em desenvolvimento
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "reports" && <RelatoriosPage />}

          {activeSection === "insumos" && <ControleInsumosPage />}

          {activeSection === "security" && <SegurancaPage />}

          {activeSection === "support" && <SuporteAvancadoPage />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;