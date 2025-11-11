/**
 * Authentication Service
 * Handles user authentication and session management
 */

import { User, AuthCredentials, AuthResponse, AuthState } from '@/types/user';
import UserService from './UserService';

const TOKEN_KEY = 'sigeco_auth_token';
const REFRESH_TOKEN_KEY = 'sigeco_refresh_token';
const USER_KEY = 'sigeco_current_user';
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Mock password storage (in production, this would be handled by backend)
const MOCK_PASSWORDS: Record<string, string> = {
  'admin@sigeco.com': 'admin123',
  'porteiro@sigeco.com': 'porteiro123',
};

class AuthService {
  /**
   * Login with email and password
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user by email
    const user = UserService.getUserByEmail(credentials.email);

    if (!user) {
      throw new Error('Email ou senha incorretos');
    }

    // Check user status
    if (user.status === 'suspended') {
      throw new Error('Usuário suspenso. Entre em contato com o administrador.');
    }

    if (user.status === 'inactive') {
      throw new Error('Usuário inativo. Entre em contato com o administrador.');
    }

    // Verify password (mock validation)
    const storedPassword = MOCK_PASSWORDS[credentials.email] || 'default123';
    if (credentials.password !== storedPassword) {
      throw new Error('Email ou senha incorretos');
    }

    // Generate tokens
    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Record login
    UserService.recordLogin(user.id);

    // Save auth data
    this.saveAuthData(user, token, refreshToken);

    return {
      user,
      token,
      refreshToken,
      expiresIn: TOKEN_EXPIRY,
    };
  }

  /**
   * Logout current user
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (!stored) return null;

      const user = JSON.parse(stored);
      
      // Convert date strings back to Date objects
      return {
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
      };
    } catch (error) {
      console.error('Error loading current user:', error);
      return null;
    }
  }

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired
    try {
      const payload = this.parseToken(token);
      return payload.exp > Date.now();
    } catch {
      return false;
    }
  }

  /**
   * Get current auth state
   */
  getAuthState(): AuthState {
    const user = this.getCurrentUser();
    const token = this.getToken();
    const isAuthenticated = this.isAuthenticated();

    return {
      isAuthenticated,
      user,
      token,
      loading: false,
      error: null,
    };
  }

  /**
   * Refresh auth token
   */
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const payload = this.parseToken(refreshToken);
      
      if (payload.exp < Date.now()) {
        throw new Error('Refresh token expired');
      }

      const user = UserService.getUserById(payload.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate new tokens
      const newToken = this.generateToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      // Save auth data
      this.saveAuthData(user, newToken, newRefreshToken);

      return {
        user,
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn: TOKEN_EXPIRY,
      };
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  /**
   * Update current user data
   */
  updateCurrentUser(updates: Partial<User>): void {
    const user = this.getCurrentUser();
    if (!user) return;

    const updatedUser = {
      ...user,
      ...updates,
    };

    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  }

  /**
   * Change password (mock implementation)
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify current password
    const storedPassword = MOCK_PASSWORDS[user.email] || 'default123';
    if (currentPassword !== storedPassword) {
      throw new Error('Senha atual incorreta');
    }

    // Update password (in production, this would be handled by backend)
    MOCK_PASSWORDS[user.email] = newPassword;
  }

  /**
   * Request password reset (mock implementation)
   */
  async requestPasswordReset(email: string): Promise<void> {
    const user = UserService.getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists for security
      return;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In production, this would send an email with reset link
    console.log(`Password reset requested for ${email}`);
  }

  /**
   * Generate auth token
   */
  private generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + TOKEN_EXPIRY,
    };

    return btoa(JSON.stringify(payload));
  }

  /**
   * Generate refresh token
   */
  private generateRefreshToken(user: User): string {
    const payload = {
      userId: user.id,
      exp: Date.now() + REFRESH_TOKEN_EXPIRY,
    };

    return btoa(JSON.stringify(payload));
  }

  /**
   * Parse token payload
   */
  private parseToken(token: string): { userId: number; exp: number; email?: string; role?: string } {
    try {
      return JSON.parse(atob(token));
    } catch {
      throw new Error('Invalid token');
    }
  }

  /**
   * Save auth data to storage
   */
  private saveAuthData(user: User, token: string, refreshToken: string): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  /**
   * Validate session
   */
  async validateSession(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      try {
        await this.refreshToken();
        return true;
      } catch {
        this.logout();
        return false;
      }
    }
    return true;
  }
}

export default new AuthService();
