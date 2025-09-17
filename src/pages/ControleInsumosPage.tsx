import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Users, 
  Wrench, 
  Truck,
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  Building,
  Phone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ControleInsumosPage = () => {
  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: "", documento: "", funcao: "", contato: "", observacoes: ""
  });
  
  const [novoPrestador, setNovoPrestador] = useState({
    nome: "", empresa: "", servico: "", documento: "", contato: "", observacoes: ""
  });

  const { toast } = useToast();

  const funcionarios = [
    { 
      id: 1, 
      nome: "José Silva", 
      documento: "123.456.789-00", 
      funcao: "Limpeza", 
      contato: "(11) 99999-1234",
      entrada: "08:00",
      status: "Ativo",
      ultimoAcesso: "Hoje"
    },
    { 
      id: 2, 
      nome: "Maria Santos", 
      documento: "987.654.321-00", 
      funcao: "Jardinagem", 
      contato: "(11) 99999-5678",
      entrada: "07:30",
      status: "Ativo",
      ultimoAcesso: "Hoje"
    },
    { 
      id: 3, 
      nome: "Carlos Lima", 
      documento: "456.789.123-00", 
      funcao: "Manutenção", 
      contato: "(11) 99999-9012",
      entrada: "09:00",
      status: "Inativo",
      ultimoAcesso: "Ontem"
    }
  ];

  const prestadores = [
    { 
      id: 1, 
      nome: "Tech Solutions", 
      responsavel: "Pedro Costa",
      servico: "Manutenção Elevadores", 
      documento: "12.345.678/0001-90", 
      contato: "(11) 3333-4444",
      proximaVisita: "20/09/2024",
      status: "Agendado"
    },
    { 
      id: 2, 
      nome: "Clean Service", 
      responsavel: "Ana Oliveira",
      servico: "Limpeza Especializada", 
      documento: "98.765.432/0001-10", 
      contato: "(11) 2222-3333",
      proximaVisita: "18/09/2024",
      status: "Em andamento"
    }
  ];

  const estatisticas = [
    { titulo: "Funcionários Ativos", valor: "12", icon: Users, cor: "text-primary" },
    { titulo: "Prestadores Cadastrados", valor: "8", icon: Building, cor: "text-accent" },
    { titulo: "Serviços Agendados", valor: "5", icon: Calendar, cor: "text-success" },
    { titulo: "Acessos Hoje", valor: "23", icon: Clock, cor: "text-warning" },
  ];

  const handleCadastroFuncionario = (e: React.FormEvent) => {
    e.preventDefault();
    if (novoFuncionario.nome && novoFuncionario.documento && novoFuncionario.funcao) {
      toast({
        title: "Funcionário cadastrado",
        description: `${novoFuncionario.nome} foi adicionado ao sistema`,
      });
      setNovoFuncionario({ nome: "", documento: "", funcao: "", contato: "", observacoes: "" });
    }
  };

  const handleCadastroPrestador = (e: React.FormEvent) => {
    e.preventDefault();
    if (novoPrestador.nome && novoPrestador.empresa && novoPrestador.servico) {
      toast({
        title: "Prestador cadastrado",
        description: `${novoPrestador.empresa} foi adicionada ao sistema`,
      });
      setNovoPrestador({ nome: "", empresa: "", servico: "", documento: "", contato: "", observacoes: "" });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-primary">Controle de Insumos</h1>
        <p className="text-muted-foreground">Gestão de funcionários e prestadores de serviço</p>
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

      <Tabs defaultValue="funcionarios" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="funcionarios" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Funcionários
          </TabsTrigger>
          <TabsTrigger value="prestadores" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Prestadores
          </TabsTrigger>
        </TabsList>

        {/* Tab Funcionários */}
        <TabsContent value="funcionarios" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cadastro de Funcionário */}
            <Card className="lg:col-span-1 shadow-lg border-0 bg-card/95 backdrop-blur">
              <CardHeader className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground rounded-t-xl">
                <CardTitle className="flex items-center gap-3">
                  <Plus className="h-5 w-5" />
                  Cadastrar Funcionário
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleCadastroFuncionario} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome Completo *</Label>
                    <Input
                      placeholder="Digite o nome completo"
                      value={novoFuncionario.nome}
                      onChange={(e) => setNovoFuncionario({...novoFuncionario, nome: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Documento *</Label>
                    <Input
                      placeholder="CPF ou RG"
                      value={novoFuncionario.documento}
                      onChange={(e) => setNovoFuncionario({...novoFuncionario, documento: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Função *</Label>
                    <Select onValueChange={(value) => setNovoFuncionario({...novoFuncionario, funcao: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a função" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="limpeza">Limpeza</SelectItem>
                        <SelectItem value="manutencao">Manutenção</SelectItem>
                        <SelectItem value="jardinagem">Jardinagem</SelectItem>
                        <SelectItem value="portaria">Portaria</SelectItem>
                        <SelectItem value="administracao">Administração</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Contato</Label>
                    <Input
                      placeholder="Telefone ou celular"
                      value={novoFuncionario.contato}
                      onChange={(e) => setNovoFuncionario({...novoFuncionario, contato: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Textarea
                      placeholder="Informações adicionais"
                      value={novoFuncionario.observacoes}
                      onChange={(e) => setNovoFuncionario({...novoFuncionario, observacoes: e.target.value})}
                      rows={2}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-accent hover:bg-accent-dark text-accent-foreground"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Funcionário
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Lista de Funcionários */}
            <Card className="lg:col-span-2 shadow-lg border-0 bg-card/95 backdrop-blur">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-3 text-primary">
                    <Users className="h-5 w-5" />
                    Funcionários Cadastrados
                  </CardTitle>
                  <div className="flex gap-3">
                    <Input placeholder="Buscar funcionário..." className="w-64" />
                    <Button variant="outline">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Funcionário</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Entrada</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {funcionarios.map((funcionario) => (
                      <TableRow key={funcionario.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">{funcionario.nome}</p>
                              <p className="text-sm text-muted-foreground">{funcionario.documento}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-accent/5 border-accent/20">
                            {funcionario.funcao}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{funcionario.contato}</TableCell>
                        <TableCell className="text-sm font-medium">{funcionario.entrada}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={funcionario.status === "Ativo" ? "default" : "secondary"}
                            className={funcionario.status === "Ativo" ? "bg-success" : ""}
                          >
                            {funcionario.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Prestadores */}
        <TabsContent value="prestadores" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cadastro de Prestador */}
            <Card className="lg:col-span-1 shadow-lg border-0 bg-card/95 backdrop-blur">
              <CardHeader className="bg-gradient-to-r from-accent to-accent-light text-accent-foreground rounded-t-xl">
                <CardTitle className="flex items-center gap-3">
                  <Plus className="h-5 w-5" />
                  Cadastrar Prestador
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleCadastroPrestador} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Responsável *</Label>
                    <Input
                      placeholder="Nome do responsável"
                      value={novoPrestador.nome}
                      onChange={(e) => setNovoPrestador({...novoPrestador, nome: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Empresa *</Label>
                    <Input
                      placeholder="Nome da empresa"
                      value={novoPrestador.empresa}
                      onChange={(e) => setNovoPrestador({...novoPrestador, empresa: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Serviço *</Label>
                    <Select onValueChange={(value) => setNovoPrestador({...novoPrestador, servico: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elevador">Manutenção de Elevador</SelectItem>
                        <SelectItem value="eletrica">Elétrica</SelectItem>
                        <SelectItem value="hidraulica">Hidráulica</SelectItem>
                        <SelectItem value="limpeza">Limpeza Especializada</SelectItem>
                        <SelectItem value="jardinagem">Jardinagem</SelectItem>
                        <SelectItem value="seguranca">Segurança</SelectItem>
                        <SelectItem value="ar-condicionado">Ar Condicionado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>CNPJ/CPF</Label>
                    <Input
                      placeholder="Documento da empresa"
                      value={novoPrestador.documento}
                      onChange={(e) => setNovoPrestador({...novoPrestador, documento: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Contato</Label>
                    <Input
                      placeholder="Telefone comercial"
                      value={novoPrestador.contato}
                      onChange={(e) => setNovoPrestador({...novoPrestador, contato: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Textarea
                      placeholder="Detalhes do serviço"
                      value={novoPrestador.observacoes}
                      onChange={(e) => setNovoPrestador({...novoPrestador, observacoes: e.target.value})}
                      rows={2}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-success hover:bg-success/90 text-success-foreground"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Prestador
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Lista de Prestadores */}
            <Card className="lg:col-span-2 shadow-lg border-0 bg-card/95 backdrop-blur">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-3 text-primary">
                    <Building className="h-5 w-5" />
                    Prestadores Cadastrados
                  </CardTitle>
                  <div className="flex gap-3">
                    <Input placeholder="Buscar prestador..." className="w-64" />
                    <Button variant="outline">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Próxima Visita</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prestadores.map((prestador) => (
                      <TableRow key={prestador.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="bg-accent/10 p-2 rounded-lg">
                              <Building className="h-4 w-4 text-accent" />
                            </div>
                            <div>
                              <p className="font-semibold">{prestador.nome}</p>
                              <p className="text-sm text-muted-foreground">{prestador.responsavel}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-success/5 border-success/20">
                            {prestador.servico}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{prestador.contato}</TableCell>
                        <TableCell className="text-sm font-medium">{prestador.proximaVisita}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={prestador.status === "Agendado" ? "default" : "secondary"}
                            className={prestador.status === "Agendado" ? "bg-warning" : prestador.status === "Em andamento" ? "bg-accent" : ""}
                          >
                            {prestador.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ControleInsumosPage;