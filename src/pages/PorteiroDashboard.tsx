import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { UserPlus, Search, Clock, User, FileText, LogOut, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const PorteiroDashboard = () => {
  const [visitante, setVisitante] = useState({ nome: "", documento: "", destino: "", motivo: "" });
  const [busca, setBusca] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const registrosRecentes = [
    { id: 1, nome: "João Silva", documento: "123.456.789-00", destino: "Apto 101", hora: "14:30", status: "Ativo" },
    { id: 2, nome: "Maria Santos", documento: "987.654.321-00", destino: "Apto 205", hora: "13:15", status: "Saiu" },
    { id: 3, nome: "Carlos Lima", documento: "456.789.123-00", destino: "Apto 304", hora: "12:45", status: "Ativo" },
    { id: 4, nome: "Ana Costa", documento: "321.654.987-00", destino: "Apto 102", hora: "11:20", status: "Saiu" },
  ];

  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    if (visitante.nome && visitante.documento && visitante.destino) {
      toast({
        title: "Entrada registrada com sucesso",
        description: `Visitante ${visitante.nome} autorizado para ${visitante.destino}`,
      });
      setVisitante({ nome: "", documento: "", destino: "", motivo: "" });
    }
  };

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
              <p className="font-semibold text-primary">Porteiro</p>
              <p className="text-sm text-muted-foreground">Portaria Principal</p>
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

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna Esquerda - Cadastro de Visitante */}
          <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
            <CardHeader className="bg-gradient-to-r from-accent to-accent-light text-accent-foreground rounded-t-xl">
              <CardTitle className="flex items-center gap-3">
                <UserPlus className="h-6 w-6" />
                Registrar Nova Entrada
              </CardTitle>
              <CardDescription className="text-accent-foreground/90">
                Cadastre a entrada de visitantes no condomínio
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleCadastro} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Visitante *</Label>
                  <Input
                    id="nome"
                    placeholder="Digite o nome completo"
                    value={visitante.nome}
                    onChange={(e) => setVisitante({ ...visitante, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documento">Documento *</Label>
                  <Input
                    id="documento"
                    placeholder="CPF, RG ou outro documento"
                    value={visitante.documento}
                    onChange={(e) => setVisitante({ ...visitante, documento: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destino">Destino da Visita *</Label>
                  <Input
                    id="destino"
                    placeholder="Ex: Apto 101, Administração, etc."
                    value={visitante.destino}
                    onChange={(e) => setVisitante({ ...visitante, destino: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo da Visita</Label>
                  <Textarea
                    id="motivo"
                    placeholder="Descreva o motivo da visita (opcional)"
                    value={visitante.motivo}
                    onChange={(e) => setVisitante({ ...visitante, motivo: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-accent hover:bg-accent-dark text-accent-foreground font-semibold"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Confirmar Entrada
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Coluna Direita - Consulta e Histórico */}
          <div className="space-y-6">
            {/* Busca */}
            <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                  <Search className="h-5 w-5" />
                  Consultar Visitante
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="Buscar por nome ou documento..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Registros Recentes */}
            <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                  <Clock className="h-5 w-5" />
                  Entradas Recentes
                </CardTitle>
                <CardDescription>Últimas entradas registradas hoje</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {registrosRecentes.map((registro) => (
                    <div
                      key={registro.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/50 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{registro.nome}</p>
                          <p className="text-xs text-muted-foreground">{registro.destino}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={registro.status === "Ativo" ? "default" : "secondary"}
                          className={registro.status === "Ativo" ? "bg-success" : ""}
                        >
                          {registro.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{registro.hora}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suporte */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-primary">Precisa de Ajuda?</p>
                    <p className="text-sm text-muted-foreground">Suporte técnico disponível</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    Contatar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PorteiroDashboard;