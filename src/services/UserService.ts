/**
 * User Management Service
 * Handles CRUD operations for users
 */

import { User, UserFormData, UserFilter, isUserArray } from '@/types/user';

const STORAGE_KEY = 'sigeco_users';
const MAX_USERS = 500;

class UserService {
  /**
   * Get all users from storage
   */
  getUsers(): User[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return this.getDefaultUsers();

      const parsed = JSON.parse(stored);
      
      // Convert date strings back to Date objects
      const users = parsed.map((user: User) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
      }));

      // Validate data
      if (!isUserArray(users)) {
        console.warn('Invalid users data, returning defaults');
        return this.getDefaultUsers();
      }

      return users;
    } catch (error) {
      console.error('Error loading users:', error);
      return this.getDefaultUsers();
    }
  }

  /**
   * Get default users for initial setup
   */
  private getDefaultUsers(): User[] {
    return [
      {
        id: 1,
        nome: 'Administrador',
        email: 'admin@sigeco.com',
        documento: '000.000.000-00',
        role: 'admin',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        nome: 'Porteiro Principal',
        email: 'porteiro@sigeco.com',
        documento: '111.111.111-11',
        role: 'porteiro',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  /**
   * Get user by ID
   */
  getUserById(id: number): User | null {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  /**
   * Get user by email
   */
  getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  /**
   * Get filtered users
   */
  getFilteredUsers(filter: UserFilter): User[] {
    const users = this.getUsers();

    return users.filter(user => {
      if (filter.role && user.role !== filter.role) return false;
      if (filter.status && user.status !== filter.status) return false;
      if (filter.apartamento && user.apartamento !== filter.apartamento) return false;
      if (filter.bloco && user.bloco !== filter.bloco) return false;
      
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        const matchesSearch =
          user.nome.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.documento.toLowerCase().includes(searchLower) ||
          user.apartamento?.toLowerCase().includes(searchLower) ||
          user.telefone?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      return true;
    });
  }

  /**
   * Create a new user
   */
  createUser(userData: UserFormData): User {
    const users = this.getUsers();

    // Check if email already exists
    if (this.getUserByEmail(userData.email)) {
      throw new Error('Email já cadastrado');
    }

    const newUser: User = {
      id: this.generateId(),
      nome: userData.nome,
      email: userData.email,
      documento: userData.documento,
      telefone: userData.telefone,
      role: userData.role,
      status: userData.status,
      apartamento: userData.apartamento,
      bloco: userData.bloco,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);
    
    // Keep only the most recent users
    const trimmedUsers = users.slice(-MAX_USERS);
    this.saveUsers(trimmedUsers);

    return newUser;
  }

  /**
   * Update an existing user
   */
  updateUser(id: number, updates: Partial<UserFormData>): User | null {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) return null;

    // Check if email is being changed and if it's already in use
    if (updates.email && updates.email !== users[index].email) {
      const existingUser = this.getUserByEmail(updates.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Email já cadastrado');
      }
    }

    const updatedUser: User = {
      ...users[index],
      ...updates,
      id: users[index].id, // Preserve original ID
      createdAt: users[index].createdAt, // Preserve creation date
      updatedAt: new Date(),
    };

    users[index] = updatedUser;
    this.saveUsers(users);

    return updatedUser;
  }

  /**
   * Delete a user
   */
  deleteUser(id: number): boolean {
    const users = this.getUsers();
    
    // Prevent deleting the last admin
    const admins = users.filter(u => u.role === 'admin');
    const userToDelete = users.find(u => u.id === id);
    
    if (userToDelete?.role === 'admin' && admins.length === 1) {
      throw new Error('Não é possível excluir o último administrador');
    }

    const filtered = users.filter(u => u.id !== id);

    if (filtered.length === users.length) return false;

    this.saveUsers(filtered);
    return true;
  }

  /**
   * Update user status
   */
  updateUserStatus(id: number, status: User['status']): User | null {
    return this.updateUser(id, { status });
  }

  /**
   * Record user login
   */
  recordLogin(id: number): User | null {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) return null;

    users[index] = {
      ...users[index],
      lastLogin: new Date(),
      updatedAt: new Date(),
    };

    this.saveUsers(users);
    return users[index];
  }

  /**
   * Get user statistics
   */
  getUserStats() {
    const users = this.getUsers();

    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      suspended: users.filter(u => u.status === 'suspended').length,
      byRole: {
        admin: users.filter(u => u.role === 'admin').length,
        sindico: users.filter(u => u.role === 'sindico').length,
        porteiro: users.filter(u => u.role === 'porteiro').length,
        morador: users.filter(u => u.role === 'morador').length,
      },
    };
  }

  /**
   * Validate user data
   */
  validateUserData(data: Partial<UserFormData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.nome && data.nome.length < 3) {
      errors.push('Nome deve ter no mínimo 3 caracteres');
    }

    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('Email inválido');
    }

    if (data.documento && !this.isValidDocumento(data.documento)) {
      errors.push('Documento inválido');
    }

    if (data.telefone && data.telefone.length > 0 && !this.isValidTelefone(data.telefone)) {
      errors.push('Telefone inválido');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Email validation
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Document validation (CPF)
   */
  private isValidDocumento(documento: string): boolean {
    // Remove non-numeric characters
    const cleaned = documento.replace(/\D/g, '');
    return cleaned.length === 11;
  }

  /**
   * Phone validation
   */
  private isValidTelefone(telefone: string): boolean {
    const cleaned = telefone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 11;
  }

  /**
   * Generate unique ID
   */
  private generateId(): number {
    const users = this.getUsers();
    const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
    return maxId + 1;
  }

  /**
   * Save users to storage
   */
  private saveUsers(users: User[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
      throw new Error('Falha ao salvar usuários');
    }
  }

  /**
   * Export users to CSV
   */
  exportToCSV(filter?: UserFilter): string {
    const users = filter ? this.getFilteredUsers(filter) : this.getUsers();

    const headers = [
      'ID',
      'Nome',
      'Email',
      'Documento',
      'Telefone',
      'Função',
      'Status',
      'Apartamento',
      'Bloco',
      'Data Cadastro',
      'Último Login'
    ];

    const rows = users.map(u => [
      u.id,
      u.nome,
      u.email,
      u.documento,
      u.telefone || '',
      u.role,
      u.status,
      u.apartamento || '',
      u.bloco || '',
      u.createdAt.toLocaleDateString('pt-BR'),
      u.lastLogin ? u.lastLogin.toLocaleDateString('pt-BR') : 'Nunca'
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
  }
}

export default new UserService();
