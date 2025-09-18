import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Home, 
  Users, 
  UserPlus, 
  Search, 
  Settings, 
  Mail,
  Phone,
  MapPin,
  User,
  Edit,
  Trash2,
  Eye,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GerenciamentoMoradoresPage = () => {
  const [filtroUnidade, setFiltroUnidade] = useState("");
  const [busca, setBusca] = useState("");
  const [novoMorador, setNovoMorador] = useState({
    nome: "", email: "", telefone: "", unidade: "", documento: "", tipo: ""
  });
  
  const { toast } = useToast();

  const moradores = [
    {
      id: 1,
      nome: "Ana Silva Costa",
      email: "ana.silva@email.com",
      telefone: "(11) 99999-1234",
      unidade: "Apto 101",
      documento: "123.456.789-00",
      tipo: "Proprietário",
      status: "Ativo",
      dataCadastro: "15/01/2024"
    },
    {
      id: 2,
      nome: "João Santos Lima",
      email: "joao.santos@email.com",
      telefone: "(11) 99999-5678",
      unidade: "Apto 102",
      documento: "987.654.321-00",
      tipo: "Locatário",
      status: "Ativo",
      dataCadastro: "22/01/2024"
    },
    {
      id: 3,
      nome: "Maria Oliveira",
      email: "maria.oliveira@email.com",
      telefone: "(11) 99999-9012",
      unidade: "Apto 205",
      documento: "456.789.123-00",
      tipo: "Proprietário",
      status: "Ativo",
      dataCadastro: "08/02/2024"
    },
    {
      id: 4,
      nome: "Carlos Pereira",
      email: "carlos.pereira@email.com",
      telefone: "(11) 99999-3456",
      unidade: "Apto 304",
      documento: "321.654.987-00",
      tipo: "Proprietário",
      status: "Inativo",
      dataCadastro: "12/12/2023"
    }
  ];

  const unidades = [
    { numero: "101", bloco: "A", tipo: "2 Quartos", proprietario: "Ana Silva Costa", status: "Ocupado" },
    { numero: "102", bloco: "A", tipo: "3 Quartos", proprietario: "João Santos Lima", status: "Ocupado" },
    { numero: "103", bloco: "A", tipo: "2 Quartos", proprietario: "-", status: "Vago" },
    { numero: "201", bloco: "A", tipo: "3 Quartos", proprietario: "Pedro Costa", status: "Ocupado" },
    { numero: "202", bloco: "A", tipo: "2 Quartos", proprietario: "-", status: "Vago" },
    { numero: "205", bloco: "A", tipo: "3 Quartos", proprietario: "Maria Oliveira", status: "Ocupado" },
    { numero: "304", bloco: "A", tipo: "Cobertura", proprietario: "Carlos Pereira", status: "Ocupado" },
  ];

  const estatisticas = [
    { titulo: "Total de Moradores", valor: "48", icon: Users, cor: "text-primary" },
    { titulo: "Unidades Ocupadas", valor: "15", icon: Home, cor: "text-accent" },
    { titulo: "Unidades Vagas", valor: "5", icon: MapPin, cor: "text-warning" },
    { titulo: "Cadastros Este Mês", valor: "3", icon: UserPlus, cor: "text-success" },
  ];

  const handleCadastroMorador = (e: React.FormEvent) => {
    e.preventDefault();
    if (novoMorador.nome && novoMorador.email && novoMorador.unidade) {
      toast({
        title: "Morador cadastrado com sucesso",
        description: `${novoMorador.nome} foi adicionado à unidade ${novoMorador.unidade}`,
      });
      setNovoMorador({ nome: "", email: "", telefone: "", unidade: "", documento: "", tipo: "" });
    }
  };

  const moradoresFiltrados = moradores.filter(morador => 
    morador.nome.toLowerCase().includes(busca.toLowerCase()) ||
    morador.unidade.toLowerCase().includes(busca.toLowerCase()) ||
    morador.documento.includes(busca)
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-primary">Gerenciamento de Moradores</h1>
        <p className="text-muted-foreground">Administração completa de moradores e unidades</p>
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

      <Tabs defaultValue="moradores" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="moradores" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Moradores
          </TabsTrigger>
          <TabsTrigger value="unidades" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Unidades
          </TabsTrigger>
        </TabsList>

        {/* Tab Moradores */}
        <TabsContent value="moradores" className="space-y-6">
          <div className="flex justify-between items-center gap-4">
            <div className="flex gap-3 flex-1">
              <Input
                placeholder="Buscar por nome, unidade ou documento..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="max-w-md"
              />
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent-dark text-accent-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Morador
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Morador</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do novo morador
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCadastroMorador} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome Completo *</Label>
                    <Input
                      placeholder="Digite o nome completo"
                      value={novoMorador.nome}
                      onChange={(e) => setNovoMorador({...novoMorador, nome: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      placeholder="email@exemplo.com"
                      value={novoMorador.email}
                      onChange={(e) => setNovoMorador({...novoMorador, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input
                      placeholder="(11) 99999-9999"
                      value={novoMorador.telefone}
                      onChange={(e) => setNovoMorador({...novoMorador, telefone: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Unidade *</Label>
                    <Select onValueChange={(value) => setNovoMorador({...novoMorador, unidade: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {unidades.filter(u => u.status === "Vago").map((unidade) => (
                          <SelectItem key={unidade.numero} value={`Apto ${unidade.numero}`}>
                            Apto {unidade.numero} - {unidade.tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Documento</Label>
                    <Input
                      placeholder="CPF ou RG"
                      value={novoMorador.documento}
                      onChange={(e) => setNovoMorador({...novoMorador, documento: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo *</Label>
                    <Select onValueChange={(value) => setNovoMorador({...novoMorador, tipo: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="proprietario">Proprietário</SelectItem>
                        <SelectItem value="locatario">Locatário</SelectItem>
                        <SelectItem value="familiar">Familiar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full bg-success hover:bg-success/90">
                    Cadastrar Morador
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Morador</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {moradoresFiltrados.map((morador) => (
                    <TableRow key={morador.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{morador.nome}</p>
                            <p className="text-sm text-muted-foreground">{morador.documento}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-accent/5 border-accent/20">
                          {morador.unidade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{morador.telefone}</p>
                          <p className="text-xs text-muted-foreground">{morador.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={morador.tipo === "Proprietário" ? "default" : "secondary"}>
                          {morador.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={morador.status === "Ativo" ? "default" : "secondary"}
                          className={morador.status === "Ativo" ? "bg-success" : ""}
                        >
                          {morador.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-destructive text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Unidades */}
        <TabsContent value="unidades" className="space-y-6">
          <div className="flex gap-3">
            <Select onValueChange={setFiltroUnidade}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="ocupado">Ocupadas</SelectItem>
                <SelectItem value="vago">Vagas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unidades
              .filter(unidade => !filtroUnidade || filtroUnidade === "todos" || unidade.status.toLowerCase() === filtroUnidade)
              .map((unidade, index) => (
                <Card key={index} className="shadow-lg border-0 bg-card/95 backdrop-blur">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Apto {unidade.numero}</CardTitle>
                        <CardDescription>Bloco {unidade.bloco} • {unidade.tipo}</CardDescription>
                      </div>
                      <Badge 
                        variant={unidade.status === "Ocupado" ? "default" : "secondary"}
                        className={unidade.status === "Ocupado" ? "bg-success" : "bg-warning"}
                      >
                        {unidade.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{unidade.tipo}</span>
                      </div>
                      {unidade.proprietario !== "-" && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{unidade.proprietario}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Config
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GerenciamentoMoradoresPage;