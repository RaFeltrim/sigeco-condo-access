/**
 * AccessLog Component
 * Displays access records with filtering and export capabilities
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Filter, RefreshCw, Search, Calendar } from 'lucide-react';
import AccessService from '@/services/AccessService';
import { AccessRecord, AccessFilter, AccessStatus, AccessType } from '@/types/access';
import { toast } from 'sonner';

interface AccessLogProps {
  maxRecords?: number;
  showFilters?: boolean;
}

export const AccessLog = ({ maxRecords = 50, showFilters = true }: AccessLogProps) => {
  const [records, setRecords] = useState<AccessRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AccessRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<AccessFilter>({});
  const [isLoading, setIsLoading] = useState(false);

  const loadRecords = () => {
    setIsLoading(true);
    try {
      const allRecords = AccessService.getAccessRecords();
      setRecords(allRecords);
      applyFilters(allRecords, filter, searchTerm);
    } catch (error) {
      toast.error('Erro ao carregar registros');
      console.error('Error loading access records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (
    recordsToFilter: AccessRecord[],
    currentFilter: AccessFilter,
    search: string
  ) => {
    let filtered = AccessService.getFilteredRecords(currentFilter);

    // Apply search term
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        r =>
          r.userName.toLowerCase().includes(searchLower) ||
          r.location.toLowerCase().includes(searchLower) ||
          r.destino?.toLowerCase().includes(searchLower) ||
          r.documento?.toLowerCase().includes(searchLower)
      );
    }

    // Limit number of records
    setFilteredRecords(filtered.slice(0, maxRecords));
  };

  useEffect(() => {
    loadRecords();
    // loadRecords is defined above and doesn't change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters(records, filter, searchTerm);
    // applyFilters is defined above and doesn't change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, searchTerm, records]);

  const handleExport = () => {
    try {
      const csv = AccessService.exportToCSV(filter);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `access-log-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar relatório');
      console.error('Export error:', error);
    }
  };

  const getStatusBadgeVariant = (status: AccessStatus) => {
    const variants: Record<AccessStatus, 'default' | 'secondary' | 'destructive'> = {
      'Autorizado': 'default',
      'Negado': 'destructive',
      'Pendente': 'secondary',
      'Expirado': 'secondary',
    };
    return variants[status];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Registro de Acessos
            </CardTitle>
            <CardDescription>
              Visualize e gerencie os registros de controle de acesso
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadRecords} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {showFilters && (
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, local ou documento..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                value={filter.status}
                onValueChange={(value: AccessStatus) =>
                  setFilter(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Autorizado">Autorizado</SelectItem>
                  <SelectItem value="Negado">Negado</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Expirado">Expirado</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filter.accessType}
                onValueChange={(value: AccessType) =>
                  setFilter(prev => ({ ...prev, accessType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Acesso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Entrada">Entrada</SelectItem>
                  <SelectItem value="Saida">Saída</SelectItem>
                  <SelectItem value="Permanencia">Permanência</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setFilter({});
                  setSearchTerm('');
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum registro encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map(record => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono text-sm">
                      {record.timestamp.toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{record.userName}</div>
                        <div className="text-xs text-muted-foreground">{record.userRole}</div>
                      </div>
                    </TableCell>
                    <TableCell>{record.accessType}</TableCell>
                    <TableCell>{record.location}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {record.destino || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(record.status)}>
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredRecords.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Mostrando {filteredRecords.length} de {records.length} registros
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccessLog;
