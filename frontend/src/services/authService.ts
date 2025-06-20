
import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', data);
      const { access_token, user } = response.data;

      localStorage.setItem('authToken', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      return { token: access_token, user };
    } catch (error: any) {
      // console para debug
      console.error('Erro no authService.login:', error);

      throw new Error(error?.response?.data?.message || 'Falha no login');
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    const { token, user } = response.data;

    // Armazenar token no localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { token, user };
  },

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};