import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Plus,
  CheckCircle,
  AlertCircle,
  X,
  MapPin,
  Phone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AgendamentoPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [novoAgendamento, setNovoAgendamento] = useState({
    visitante: "", documento: "", destino: "", motivo: "", 
    data: "", horario: "", telefone: "", observacoes: ""
  });
  
  const { toast } = useToast();

  const agendamentos = [
    {
      id: 1,
      visitante: "Dr. Carlos Mendes",
      documento: "123.456.789-00",
      destino: "Apto 205",
      motivo: "Consulta médica domiciliar",
      data: "2024-09-18",
      horario: "14:00",
      telefone: "(11) 99999-1234",
      status: "Confirmado",
      morador: "Maria Santos",
      observacoes: "Médico cardiologista"
    },
    {
      id: 2,
      visitante: "Ana Limpeza",
      documento: "987.654.321-00",
      destino: "Apto 101",
      motivo: "Serviço de limpeza",
      data: "2024-09-18",
      horario: "09:00",
      telefone: "(11) 98888-5678",
      status: "Pendente",
      morador: "João Silva",
      observacoes: "Limpeza quinzenal"
    },
    {
      id: 3,
      visitante: "Entrega Express",
      documento: "456.789.123-00",
      destino: "Apto 304",
      motivo: "Entrega de móveis",
      data: "2024-09-19",
      horario: "10:30",
      telefone: "(11) 97777-9012",
      status: "Confirmado",
      morador: "Carlos Lima",
      observacoes: "Sofá 3 lugares - necessário elevador de carga"
    },
    {
      id: 4,
      visitante: "Técnico TV",
      documento: "321.654.987-00",
      destino: "Apto 102",
      motivo: "Manutenção televisão",
      data: "2024-09-20",
      horario: "15:00",
      telefone: "(11) 96666-3456",
      status: "Cancelado",
      morador: "Ana Costa",
      observacoes: "Cancelado pelo morador"
    }
  ];

  const estatisticas = [
    { titulo: "Agendamentos Hoje", valor: "2", icon: CalendarIcon, cor: "text-primary" },
    { titulo: "Confirmados", valor: "5", icon: CheckCircle, cor: "text-success" },
    { titulo: "Pendentes", valor: "3", icon: AlertCircle, cor: "text-warning" },
    { titulo: "Esta Semana", valor: "12", icon: Clock, cor: "text-accent" },
  ];

  const handleNovoAgendamento = (e: React.FormEvent) => {
    e.preventDefault();
    if (novoAgendamento.visitante && novoAgendamento.destino && novoAgendamento.data && novoAgendamento.horario) {
      toast({
        title: "Agendamento criado com sucesso",
        description: `Visita de ${novoAgendamento.visitante} agendada para ${novoAgendamento.data} às ${novoAgendamento.horario}`,
      });
      setNovoAgendamento({
        visitante: "", documento: "", destino: "", motivo: "", 
        data: "", horario: "", telefone: "", observacoes: ""
      });
    }
  };

  const handleStatusChange = (id: number, novoStatus: string) => {
    const agendamento = agendamentos.find(a => a.id === id);
    toast({
      title: "Status atualizado",
      description: `Agendamento de ${agendamento?.visitante} marcado como ${novoStatus}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmado": return "bg-success";
      case "Pendente": return "bg-warning";
      case "Cancelado": return "bg-destructive";
      default: return "bg-secondary";
    }
  };

  const agendamentosHoje = agendamentos.filter(a => a.data === "2024-09-18");
  const proximosAgendamentos = agendamentos.filter(a => new Date(a.data) > new Date());

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Agendamento de Visitas</h1>
          <p className="text-muted-foreground">Gerencie visitas agendadas antecipadamente</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent-dark text-accent-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Agendar Nova Visita</DialogTitle>
              <DialogDescription>
                Preencha os dados para agendar uma nova visita
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNovoAgendamento} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Visitante *</Label>
                  <Input
                    placeholder="Nome completo"
                    value={novoAgendamento.visitante}
                    onChange={(e) => setNovoAgendamento({...novoAgendamento, visitante: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Documento</Label>
                  <Input
                    placeholder="CPF ou RG"
                    value={novoAgendamento.documento}
                    onChange={(e) => setNovoAgendamento({...novoAgendamento, documento: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Destino da Visita *</Label>
                  <Input
                    placeholder="Ex: Apto 101"
                    value={novoAgendamento.destino}
                    onChange={(e) => setNovoAgendamento({...novoAgendamento, destino: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    placeholder="(11) 99999-9999"
                    value={novoAgendamento.telefone}
                    onChange={(e) => setNovoAgendamento({...novoAgendamento, telefone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data *</Label>
                  <Input
                    type="date"
                    value={novoAgendamento.data}
                    onChange={(e) => setNovoAgendamento({...novoAgendamento, data: e.target.value})}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Horário *</Label>
                  <Input
                    type="time"
                    value={novoAgendamento.horario}
                    onChange={(e) => setNovoAgendamento({...novoAgendamento, horario: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Motivo da Visita</Label>
                <Select onValueChange={(value) => setNovoAgendamento({...novoAgendamento, motivo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visita-familiar">Visita Familiar</SelectItem>
                    <SelectItem value="prestador-servico">Prestador de Serviço</SelectItem>
                    <SelectItem value="entrega">Entrega</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                    <SelectItem value="saude">Serviços de Saúde</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  placeholder="Informações adicionais sobre a visita"
                  value={novoAgendamento.observacoes}
                  onChange={(e) => setNovoAgendamento({...novoAgendamento, observacoes: e.target.value})}
                  rows={2}
                />
              </div>

              <Button type="submit" className="w-full bg-success hover:bg-success/90">
                Agendar Visita
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {estatisticas.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-lg border-0 bg-card/95 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.titulo}</p>
                    <p className="text-3xl font-bold text-primary">{stat.valor}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <Icon className={`h-6 w-6 ${stat.cor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-primary">
              <CalendarIcon className="h-5 w-5" />
              Calendário
            </CardTitle>
            <CardDescription>Selecione uma data para ver os agendamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Agendamentos de Hoje */}
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-primary">
              <Clock className="h-5 w-5" />
              Agendamentos Hoje
            </CardTitle>
            <CardDescription>Visitas programadas para hoje</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {agendamentosHoje.length > 0 ? (
                agendamentosHoje.map((agendamento) => (
                  <div
                    key={agendamento.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-accent/10 p-2 rounded-lg">
                        <User className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{agendamento.visitante}</p>
                        <p className="text-xs text-muted-foreground">{agendamento.destino}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(agendamento.status)}>
                        {agendamento.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{agendamento.horario}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum agendamento para hoje</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Próximos Agendamentos */}
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-primary">
              <AlertCircle className="h-5 w-5" />
              Próximos Agendamentos
            </CardTitle>
            <CardDescription>Visitas programadas para os próximos dias</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {proximosAgendamentos.map((agendamento) => (
                <div
                  key={agendamento.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{agendamento.visitante}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {agendamento.destino}
                        <Phone className="h-3 w-3 ml-1" />
                        {agendamento.telefone}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-1 mb-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(agendamento.id, "Confirmado")}
                        className="h-6 px-2 border-success text-success hover:bg-success hover:text-success-foreground"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(agendamento.id, "Cancelado")}
                        className="h-6 px-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(agendamento.data).toLocaleDateString('pt-BR')} às {agendamento.horario}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista Completa de Agendamentos */}
      <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-primary">
            <CalendarIcon className="h-5 w-5" />
            Todos os Agendamentos
          </CardTitle>
          <CardDescription>Lista completa de visitas agendadas</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-3 p-6">
            {agendamentos.map((agendamento) => (
              <Card key={agendamento.id} className="border border-border/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{agendamento.visitante}</h4>
                        <p className="text-sm text-muted-foreground">{agendamento.documento}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(agendamento.status)}>
                      {agendamento.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">Destino</p>
                      <p>{agendamento.destino}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Data/Hora</p>
                      <p>{new Date(agendamento.data).toLocaleDateString('pt-BR')} às {agendamento.horario}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Contato</p>
                      <p>{agendamento.telefone}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Morador</p>
                      <p>{agendamento.morador}</p>
                    </div>
                  </div>
                  
                  {agendamento.observacoes && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm text-muted-foreground">{agendamento.observacoes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgendamentoPage;