/**
 * SavedFiltersManager Component
 * REL-003: Manages saved report filters
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Save, Star, Trash2, Clock } from "lucide-react";
import { SavedFiltersService, type SavedFilter } from "@/services/SavedFiltersService";
import type { ReportFilter } from "@/services/ReportService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface SavedFiltersManagerProps {
  currentFilters: ReportFilter;
  onApplyFilter: (filters: ReportFilter) => void;
}

export function SavedFiltersManager({ currentFilters, onApplyFilter }: SavedFiltersManagerProps) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showListDialog, setShowListDialog] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterToDelete, setFilterToDelete] = useState<SavedFilter | null>(null);
  const { toast } = useToast();

  // Load saved filters on mount
  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = () => {
    const filters = SavedFiltersService.loadFilters();
    setSavedFilters(filters);
  };

  const handleSaveFilter = () => {
    if (!filterName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, digite um nome para o filtro",
        variant: "destructive",
      });
      return;
    }

    try {
      SavedFiltersService.saveFilter(filterName, currentFilters);
      loadFilters();
      setShowSaveDialog(false);
      setFilterName("");

      toast({
        title: "Filtro salvo",
        description: `O filtro "${filterName}" foi salvo com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar filtro",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleApplyFilter = (filter: SavedFilter) => {
    SavedFiltersService.markAsUsed(filter.id);
    onApplyFilter(filter.filters);
    setShowListDialog(false);

    toast({
      title: "Filtro aplicado",
      description: `Filtro "${filter.name}" foi aplicado`,
    });
  };

  const handleDeleteFilter = (filter: SavedFilter) => {
    setFilterToDelete(filter);
  };

  const confirmDeleteFilter = () => {
    if (!filterToDelete) return;

    try {
      SavedFiltersService.deleteFilter(filterToDelete.id);
      loadFilters();
      setFilterToDelete(null);

      toast({
        title: "Filtro excluído",
        description: `O filtro "${filterToDelete.name}" foi removido`,
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir filtro",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const hasActiveFilters = () => {
    return Object.values(currentFilters).some(value => value && value !== "");
  };

  return (
    <div className="flex gap-2">
      {/* Save Current Filter */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasActiveFilters()}
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Filtro
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salvar Filtro Atual</DialogTitle>
            <DialogDescription>
              Dê um nome para este conjunto de filtros para reutilizá-lo depois
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="filter-name">Nome do Filtro</Label>
              <Input
                id="filter-name"
                placeholder="Ex: Visitas Familiares Ativas"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveFilter();
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Filtros Atuais:</Label>
              <div className="flex flex-wrap gap-2">
                {currentFilters.periodo && (
                  <Badge variant="outline">Período: {currentFilters.periodo}</Badge>
                )}
                {currentFilters.tipo && (
                  <Badge variant="outline">Tipo: {currentFilters.tipo}</Badge>
                )}
                {currentFilters.status && (
                  <Badge variant="outline">Status: {currentFilters.status}</Badge>
                )}
                {currentFilters.destino && (
                  <Badge variant="outline">Destino: {currentFilters.destino}</Badge>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveFilter} className="bg-accent hover:bg-accent-dark">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Saved Filters */}
      <Dialog open={showListDialog} onOpenChange={setShowListDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Star className="h-4 w-4 mr-2" />
            Filtros Salvos ({savedFilters.length})
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Filtros Salvos</DialogTitle>
            <DialogDescription>
              Selecione um filtro salvo para aplicá-lo rapidamente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {savedFilters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum filtro salvo ainda</p>
                <p className="text-sm mt-1">Salve seus filtros favoritos para acesso rápido</p>
              </div>
            ) : (
              savedFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold">{filter.name}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {filter.filters.periodo && (
                        <Badge variant="outline" className="text-xs">
                          Período: {filter.filters.periodo}
                        </Badge>
                      )}
                      {filter.filters.tipo && (
                        <Badge variant="outline" className="text-xs">
                          Tipo: {filter.filters.tipo}
                        </Badge>
                      )}
                      {filter.filters.status && (
                        <Badge variant="outline" className="text-xs">
                          Status: {filter.filters.status}
                        </Badge>
                      )}
                      {filter.filters.destino && (
                        <Badge variant="outline" className="text-xs">
                          Destino: {filter.filters.destino}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>
                        Criado: {format(filter.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                      {filter.lastUsed && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Usado: {format(filter.lastUsed, "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => handleApplyFilter(filter)}
                      className="bg-accent hover:bg-accent-dark"
                    >
                      Aplicar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteFilter(filter)}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!filterToDelete} onOpenChange={() => setFilterToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o filtro <strong>"{filterToDelete?.name}"</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFilterToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteFilter}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
