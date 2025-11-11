/**
 * UserForm Component
 * Form for creating and editing users
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, UserFormData, UserFormErrors, ROLE_LABELS, STATUS_LABELS } from '@/types/user';
import UserService from '@/services/UserService';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';

interface UserFormProps {
  user?: User;
  onSuccess?: (user: User) => void;
  onCancel?: () => void;
}

export const UserForm = ({ user, onSuccess, onCancel }: UserFormProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    nome: user?.nome || '',
    email: user?.email || '',
    documento: user?.documento || '',
    telefone: user?.telefone || '',
    role: user?.role || 'morador',
    status: user?.status || 'active',
    apartamento: user?.apartamento || '',
    bloco: user?.bloco || '',
  });

  const [errors, setErrors] = useState<UserFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field as keyof UserFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: UserFormErrors = {};

    if (!formData.nome || formData.nome.length < 3) {
      newErrors.nome = 'Nome deve ter no mínimo 3 caracteres';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.documento || formData.documento.replace(/\D/g, '').length !== 11) {
      newErrors.documento = 'Documento deve ter 11 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      let savedUser: User;

      if (user) {
        // Update existing user
        savedUser = UserService.updateUser(user.id, formData)!;
        toast.success('Usuário atualizado com sucesso!');
      } else {
        // Create new user
        savedUser = UserService.createUser(formData);
        toast.success('Usuário criado com sucesso!');
      }

      onSuccess?.(savedUser);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user ? 'Editar Usuário' : 'Novo Usuário'}</CardTitle>
        <CardDescription>
          {user ? 'Atualize as informações do usuário' : 'Preencha os dados do novo usuário'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={e => handleChange('nome', e.target.value)}
                placeholder="Nome completo"
              />
              {errors.nome && <p className="text-sm text-destructive">{errors.nome}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                placeholder="email@exemplo.com"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="documento">CPF *</Label>
              <Input
                id="documento"
                value={formData.documento}
                onChange={e => handleChange('documento', e.target.value)}
                placeholder="000.000.000-00"
              />
              {errors.documento && <p className="text-sm text-destructive">{errors.documento}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={e => handleChange('telefone', e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Função *</Label>
              <Select
                value={formData.role}
                onValueChange={value => handleChange('role', value)}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={value => handleChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(formData.role === 'morador' || formData.role === 'sindico') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="apartamento">Apartamento</Label>
                  <Input
                    id="apartamento"
                    value={formData.apartamento || ''}
                    onChange={e => handleChange('apartamento', e.target.value)}
                    placeholder="Ex: 101"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloco">Bloco</Label>
                  <Input
                    id="bloco"
                    value={formData.bloco || ''}
                    onChange={e => handleChange('bloco', e.target.value)}
                    placeholder="Ex: A"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
