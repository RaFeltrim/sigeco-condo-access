/**
 * UserList Component
 * Displays list of users with actions
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, UserFilter, ROLE_LABELS, STATUS_LABELS } from '@/types/user';
import UserService from '@/services/UserService';
import { toast } from 'sonner';
import { Users, Search, Edit, Trash2, Plus, Download } from 'lucide-react';

interface UserListProps {
  onEditUser?: (user: User) => void;
  onCreateUser?: () => void;
}

export const UserList = ({ onEditUser, onCreateUser }: UserListProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<UserFilter>({});
  const [searchTerm, setSearchTerm] = useState('');

  const loadUsers = () => {
    try {
      const allUsers = UserService.getUsers();
      setUsers(allUsers);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
      console.error('Error loading users:', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = UserService.getFilteredUsers({
    ...filter,
    searchTerm,
  });

  const handleDelete = (user: User) => {
    if (window.confirm(`Deseja realmente excluir o usuário ${user.nome}?`)) {
      try {
        UserService.deleteUser(user.id);
        toast.success('Usuário excluído com sucesso!');
        loadUsers();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Erro ao excluir usuário');
      }
    }
  };

  const handleExport = () => {
    try {
      const csv = UserService.exportToCSV(filter);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `users-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Lista exportada com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar lista');
    }
  };

  const getStatusColor = (status: User['status']) => {
    const colors = {
      active: 'default',
      inactive: 'secondary',
      suspended: 'destructive',
    } as const;
    return colors[status];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gerenciamento de Usuários
            </CardTitle>
            <CardDescription>
              Visualize e gerencie os usuários do sistema
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {onCreateUser && (
              <Button onClick={onCreateUser}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            )}
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou documento..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={filter.role}
              onValueChange={value => setFilter(prev => ({ ...prev, role: value as User['role'] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as Funções" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filter.status}
              onValueChange={value => setFilter(prev => ({ ...prev, status: value as User['status'] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Apartamento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.nome}</div>
                        <div className="text-xs text-muted-foreground">{user.documento}</div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{ROLE_LABELS[user.role]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(user.status)}>
                        {STATUS_LABELS[user.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.apartamento ? `${user.apartamento}${user.bloco ? ` - ${user.bloco}` : ''}` : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {onEditUser && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Mostrando {filteredUsers.length} de {users.length} usuários
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserList;
