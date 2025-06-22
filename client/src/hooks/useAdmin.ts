import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Admin {
  id: number;
  username: string;
  email: string;
}

interface LoginResponse {
  message: string;
  sessionToken: string;
  admin: Admin;
}

export function useAdminAuth() {
  const queryClient = useQueryClient();

  const { data: admin, isLoading } = useQuery<Admin>({
    queryKey: ['/api/admin/me'],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No token');
      
      const response = await fetch('/api/admin/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        localStorage.removeItem('adminToken');
        throw new Error('Invalid session');
      }
      
      const data = await response.json();
      return data.admin;
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      return response.json() as Promise<LoginResponse>;
    },
    onSuccess: (data) => {
      localStorage.setItem('adminToken', data.sessionToken);
      queryClient.setQueryData(['/api/admin/me'], data.admin);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    },
    onSuccess: () => {
      localStorage.removeItem('adminToken');
      queryClient.setQueryData(['/api/admin/me'], null);
      queryClient.clear();
    },
  });

  return {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    loginError: loginMutation.error?.message,
    loginLoading: loginMutation.isPending,
  };
}

// Custom hook for admin API requests
export function useAdminRequest() {
  return async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No admin token');
    }

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  };
}