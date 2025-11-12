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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { MaskedInput } from "@/components/ui/masked-input";
import { UnitCombobox } from "@/components/ui/unit-combobox";
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
  Plus,
  Download,
  FileSpreadsheet,
  CheckSquare,
  Square
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validatePhone, validateDocument } from "@/lib/utils/validation";
import * as XLSX from 'xlsx';

const GerenciamentoMoradoresPage = () => {
  const [filtroUnidade, setFiltroUnidade] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [novoMorador, setNovoMorador] = useState({
    nome: "", email: "", telefone: "", unidade: "", documento: "", tipo: ""
  });
  const [editingMorador, setEditingMorador] = useState<typeof moradores[0] | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    telefone?: string;
    documento?: string;
  }>({});
  const [moradorToDelete, setMoradorToDelete] = useState<typeof moradores[0] | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Sprint 4: Batch operations state
  const [selectedMoradores, setSelectedMoradores] = useState<number[]>([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showBulkEditDialog, setShowBulkEditDialog] = useState(false);
  const [bulkEditData, setBulkEditData] = useState({
    status: "",
    tipo: ""
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
    
    // MRD-RBF-003: Validate phone and document
    const errors: { telefone?: string; documento?: string } = {};
    
    // Validate phone if provided
    if (novoMorador.telefone && !validatePhone(novoMorador.telefone)) {
      errors.telefone = "Telefone inválido. Use o formato (11) 99999-9999";
    }
    
    // Validate document (required)
    if (!novoMorador.documento) {
      errors.documento = "Documento é obrigatório";
    } else {
      const docValidation = validateDocument(novoMorador.documento);
      if (!docValidation.isValid) {
        errors.documento = docValidation.message || "Documento inválido";
      }
    }
    
    // If there are errors, show them and don't submit
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({
        title: "Erro na validação",
        description: "Por favor, corrija os erros no formulário",
        variant: "destructive",
      });
      return;
    }
    
    // Clear errors and proceed with submission
    setFormErrors({});
    
    if (novoMorador.nome && novoMorador.email && novoMorador.unidade && novoMorador.tipo) {
      toast({
        title: "Morador cadastrado com sucesso",
        description: `${novoMorador.nome} foi adicionado à unidade ${novoMorador.unidade}`,
      });
      setNovoMorador({ nome: "", email: "", telefone: "", unidade: "", documento: "", tipo: "" });
    } else {
      toast({
        title: "Campos obrigatórios faltando",
        description: "Preencha todos os campos obrigatórios (*)",
        variant: "destructive",
      });
    }
  };

  // MRD-RBF-004: Handle delete with confirmation
  const handleDeleteClick = (morador: typeof moradores[0]) => {
    setMoradorToDelete(morador);
    setShowDeleteDialog(true);
  };
  
  const handleConfirmDelete = () => {
    if (moradorToDelete) {
      // Here you would call the API to delete the morador
      toast({
        title: "Morador excluído",
        description: `${moradorToDelete.nome} foi removido do sistema`,
      });
      setShowDeleteDialog(false);
      setMoradorToDelete(null);
    }
  };
  
  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setMoradorToDelete(null);
  };

  // MRD-RBF-002: Handle edit functionality
  const handleEditClick = (morador: typeof moradores[0]) => {
    setEditingMorador(morador);
    setShowEditDialog(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingMorador) return;
    
    // Validate phone and document
    const errors: { telefone?: string; documento?: string } = {};
    
    if (editingMorador.telefone && !validatePhone(editingMorador.telefone)) {
      errors.telefone = "Telefone inválido. Use o formato (11) 99999-9999";
    }
    
    if (!editingMorador.documento) {
      errors.documento = "Documento é obrigatório";
    } else {
      const docValidation = validateDocument(editingMorador.documento);
      if (!docValidation.isValid) {
        errors.documento = docValidation.message || "Documento inválido";
      }
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({
        title: "Erro na validação",
        description: "Por favor, corrija os erros no formulário",
        variant: "destructive",
      });
      return;
    }
    
    setFormErrors({});
    
    // Here you would call the API to update the morador
    toast({
      title: "Morador atualizado",
      description: `${editingMorador.nome} foi atualizado com sucesso`,
    });
    
    setShowEditDialog(false);
    setEditingMorador(null);
  };

  // Sprint 4: Batch operations handlers
  const toggleSelectAll = () => {
    if (selectedMoradores.length === moradoresFiltrados.length) {
      setSelectedMoradores([]);
    } else {
      setSelectedMoradores(moradoresFiltrados.map(m => m.id));
    }
  };

  const toggleSelectMorador = (id: number) => {
    setSelectedMoradores(prev => 
      prev.includes(id) ? prev.filter(morId => morId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    // Here you would call the API to delete multiple moradores
    toast({
      title: "Moradores excluídos",
      description: `${selectedMoradores.length} morador(es) foram excluídos com sucesso`,
    });
    setSelectedMoradores([]);
    setShowBulkDeleteDialog(false);
  };

  const handleBulkEdit = () => {
    if (!bulkEditData.status && !bulkEditData.tipo) {
      toast({
        title: "Nenhuma alteração",
        description: "Selecione pelo menos um campo para editar",
        variant: "destructive",
      });
      return;
    }

    // Here you would call the API to update multiple moradores
    toast({
      title: "Moradores atualizados",
      description: `${selectedMoradores.length} morador(es) foram atualizados com sucesso`,
    });
    setSelectedMoradores([]);
    setShowBulkEditDialog(false);
    setBulkEditData({ status: "", tipo: "" });
  };

  const handleBulkExport = () => {
    const selectedData = moradores.filter(m => selectedMoradores.includes(m.id));
    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Moradores Selecionados");
    XLSX.writeFile(workbook, `moradores_selecionados_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: "Export realizado",
      description: `${selectedMoradores.length} morador(es) foram exportados com sucesso`,
    });
  };

  const handleCancelEdit = () => {
    setShowEditDialog(false);
    setEditingMorador(null);
    setFormErrors({});
  };

  // MRD-RBF-005: Enhanced filtering with multiple criteria
  const moradoresFiltrados = moradores.filter(morador => {
    // Text search filter
    const matchesSearch = 
      morador.nome.toLowerCase().includes(busca.toLowerCase()) ||
      morador.unidade.toLowerCase().includes(busca.toLowerCase()) ||
      morador.documento.includes(busca);
    
    // Status filter
    const matchesStatus = !filtroStatus || filtroStatus === "todos" || 
      morador.status.toLowerCase() === filtroStatus.toLowerCase();
    
    // Type filter
    const matchesTipo = !filtroTipo || filtroTipo === "todos" || 
      morador.tipo.toLowerCase() === filtroTipo.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesTipo;
  });

  // MRD-RBF-006: Export to Excel/CSV functionality
  const handleExportExcel = () => {
    try {
      const dataToExport = moradoresFiltrados.map(morador => ({
        'Nome': morador.nome,
        'Email': morador.email,
        'Telefone': morador.telefone,
        'Unidade': morador.unidade,
        'Documento': morador.documento,
        'Tipo': morador.tipo,
        'Status': morador.status,
        'Data Cadastro': morador.dataCadastro
      }));

      const ws = XLSX.utils.json_to_sheet(dataToExport);
      
      // Set column widths
      ws['!cols'] = [
        { wch: 25 }, // Nome
        { wch: 30 }, // Email
        { wch: 18 }, // Telefone
        { wch: 12 }, // Unidade
        { wch: 18 }, // Documento
        { wch: 15 }, // Tipo
        { wch: 10 }, // Status
        { wch: 15 }  // Data Cadastro
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Moradores');

      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const filename = `moradores_${timestamp}.xlsx`;
      
      XLSX.writeFile(wb, filename);

      toast({
        title: "Exportação concluída",
        description: `${moradoresFiltrados.length} registro(s) exportado(s) para ${filename}`,
      });
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = () => {
    try {
      const dataToExport = moradoresFiltrados.map(morador => ({
        'Nome': morador.nome,
        'Email': morador.email,
        'Telefone': morador.telefone,
        'Unidade': morador.unidade,
        'Documento': morador.documento,
        'Tipo': morador.tipo,
        'Status': morador.status,
        'Data Cadastro': morador.dataCadastro
      }));

      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const csv = XLSX.utils.sheet_to_csv(ws);
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      link.href = url;
      link.download = `moradores_${timestamp}.csv`;
      link.click();
      
      window.URL.revokeObjectURL(url);

      toast({
        title: "Exportação concluída",
        description: `${moradoresFiltrados.length} registro(s) exportado(s) para CSV`,
      });
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados",
        variant: "destructive",
      });
    }
  };

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
          {/* MRD-RBF-005: Enhanced filters section */}
          <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-primary">
                <Search className="h-5 w-5" />
                Filtros Avançados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Buscar</Label>
                  <Input
                    placeholder="Nome, unidade ou documento..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="proprietário">Proprietário</SelectItem>
                      <SelectItem value="locatário">Locatário</SelectItem>
                      <SelectItem value="familiar">Familiar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setBusca("");
                    setFiltroStatus("");
                    setFiltroTipo("");
                  }}
                >
                  Limpar Filtros
                </Button>
                <div className="text-sm text-muted-foreground">
                  {moradoresFiltrados.length} registro(s) encontrado(s)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sprint 4: Bulk operations toolbar */}
          {selectedMoradores.length > 0 && (
            <Card className="mb-4 bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-primary" />
                    <span className="font-medium">{selectedMoradores.length} morador(es) selecionado(s)</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleBulkExport}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Seleção
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBulkEditDialog(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar em Lote
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBulkDeleteDialog(true)}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir Seleção
                    </Button>
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMoradores([])}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between items-center gap-4">
            <div className="flex gap-3">
              {/* MRD-RBF-006: Export buttons */}
              <Button 
                variant="outline"
                onClick={handleExportExcel}
                className="border-success text-success hover:bg-success hover:text-success-foreground"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button 
                variant="outline"
                onClick={handleExportCSV}
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent-dark text-accent-foreground" data-testid="btn-novo-morador">
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
                <form onSubmit={handleCadastroMorador} className="space-y-4" data-testid="form-cadastro-morador">
                  <div className="space-y-2">
                    <Label>Nome Completo *</Label>
                    <Input
                      data-testid="input-nome-morador"
                      placeholder="Digite o nome completo"
                      value={novoMorador.nome}
                      onChange={(e) => setNovoMorador({...novoMorador, nome: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      data-testid="input-email-morador"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={novoMorador.email}
                      onChange={(e) => setNovoMorador({...novoMorador, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <MaskedInput
                      data-testid="input-telefone-morador"
                      mask="phone"
                      placeholder="(11) 99999-9999"
                      value={novoMorador.telefone}
                      onChange={(value) => {
                        setNovoMorador({...novoMorador, telefone: value});
                        if (formErrors.telefone) {
                          setFormErrors({...formErrors, telefone: undefined});
                        }
                      }}
                      error={formErrors.telefone}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Unidade *</Label>
                    <UnitCombobox
                      units={unidades.filter(u => u.status === "Vago")}
                      value={novoMorador.unidade}
                      onChange={(value) => setNovoMorador({...novoMorador, unidade: value})}
                      placeholder="Buscar e selecionar unidade..."
                      emptyMessage="Nenhuma unidade vaga encontrada"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Documento *</Label>
                    <MaskedInput
                      mask="document"
                      placeholder="CPF ou RG"
                      value={novoMorador.documento}
                      onChange={(value) => {
                        setNovoMorador({...novoMorador, documento: value});
                        if (formErrors.documento) {
                          setFormErrors({...formErrors, documento: undefined});
                        }
                      }}
                      error={formErrors.documento}
                      required
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
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedMoradores.length === moradoresFiltrados.length && moradoresFiltrados.length > 0}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Selecionar todos"
                      />
                    </TableHead>
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
                        <Checkbox
                          checked={selectedMoradores.includes(morador.id)}
                          onCheckedChange={() => toggleSelectMorador(morador.id)}
                          aria-label={`Selecionar ${morador.nome}`}
                        />
                      </TableCell>
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
                          <Button size="sm" variant="outline" aria-label={`Ver detalhes de ${morador.nome}`}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          {/* MRD-RBF-002: Edit button with functionality */}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEditClick(morador)}
                            aria-label={`Editar ${morador.nome}`}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDeleteClick(morador)}
                            aria-label={`Excluir ${morador.nome}`}
                          >
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
      
      {/* MRD-RBF-002: Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Morador</DialogTitle>
            <DialogDescription>
              Atualize os dados do morador
            </DialogDescription>
          </DialogHeader>
          {editingMorador && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome Completo *</Label>
                <Input
                  placeholder="Digite o nome completo"
                  value={editingMorador.nome}
                  onChange={(e) => setEditingMorador({...editingMorador, nome: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={editingMorador.email}
                  onChange={(e) => setEditingMorador({...editingMorador, email: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Telefone</Label>
                <MaskedInput
                  mask="phone"
                  placeholder="(11) 99999-9999"
                  value={editingMorador.telefone}
                  onChange={(value) => {
                    setEditingMorador({...editingMorador, telefone: value});
                    if (formErrors.telefone) {
                      setFormErrors({...formErrors, telefone: undefined});
                    }
                  }}
                  error={formErrors.telefone}
                />
              </div>

              <div className="space-y-2">
                <Label>Unidade *</Label>
                <Input
                  placeholder="Ex: Apto 101"
                  value={editingMorador.unidade}
                  onChange={(e) => setEditingMorador({...editingMorador, unidade: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Documento *</Label>
                <MaskedInput
                  mask="document"
                  placeholder="CPF ou RG"
                  value={editingMorador.documento}
                  onChange={(value) => {
                    setEditingMorador({...editingMorador, documento: value});
                    if (formErrors.documento) {
                      setFormErrors({...formErrors, documento: undefined});
                    }
                  }}
                  error={formErrors.documento}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo *</Label>
                <Select 
                  value={editingMorador.tipo.toLowerCase()} 
                  onValueChange={(value) => {
                    const tipoMap: Record<string, string> = {
                      'proprietario': 'Proprietário',
                      'locatario': 'Locatário',
                      'familiar': 'Familiar'
                    };
                    setEditingMorador({...editingMorador, tipo: tipoMap[value] || value});
                  }}
                >
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

              <div className="space-y-2">
                <Label>Status *</Label>
                <Select 
                  value={editingMorador.status.toLowerCase()} 
                  onValueChange={(value) => {
                    const statusMap: Record<string, string> = {
                      'ativo': 'Ativo',
                      'inativo': 'Inativo'
                    };
                    setEditingMorador({...editingMorador, status: statusMap[value] || value});
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-success hover:bg-success/90">
                  Salvar Alterações
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* MRD-RBF-004: Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{moradorToDelete?.nome}</strong>?
              <br />
              <br />
              Esta ação não pode ser desfeita. Todos os dados do morador serão permanentemente removidos do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sprint 4: Bulk delete dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir moradores selecionados?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a excluir {selectedMoradores.length} morador(es). Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBulkDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Excluir Todos
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sprint 4: Bulk edit dialog */}
      <Dialog open={showBulkEditDialog} onOpenChange={setShowBulkEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar {selectedMoradores.length} morador(es) em lote</DialogTitle>
            <DialogDescription>
              As alterações serão aplicadas a todos os moradores selecionados
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={bulkEditData.status}
                onValueChange={(value) => setBulkEditData({...bulkEditData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Manter atual" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select 
                value={bulkEditData.tipo}
                onValueChange={(value) => setBulkEditData({...bulkEditData, tipo: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Manter atual" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Proprietário">Proprietário</SelectItem>
                  <SelectItem value="Locatário">Locatário</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowBulkEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleBulkEdit} className="bg-success hover:bg-success/90">
              Aplicar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciamentoMoradoresPage;