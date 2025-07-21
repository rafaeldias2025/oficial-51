import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { InlineUserControls } from '../InlineUserControls';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// Mock dependencies
vi.mock('@/hooks/useAuth');
vi.mock('@/integrations/supabase/client');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  }
}));

const mockUseAuth = vi.mocked(useAuth);
const mockSupabase = vi.mocked(supabase);

const mockUserProfile = {
  id: 'profile-123',
  user_id: 'user-123',
  full_name: 'João Silva',
  email: 'joao@exemplo.com',
  avatar_url: 'https://exemplo.com/avatar.jpg',
  role: 'client' as const,
  is_active: true,
  total_points: 150
};

const mockAdminUser = {
  id: 'admin-user-123',
  email: 'admin@instituto.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2024-01-01T00:00:00Z'
} as const;

describe('InlineUserControls', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock do useAuth retornando admin
    mockUseAuth.mockReturnValue({
      user: mockAdminUser,
      session: null,
      isLoading: false,
      isInitialized: true,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn()
    });

    // Mock das queries do Supabase
    const mockFromProfiles = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ 
        data: { role: 'admin' }, 
        error: null 
      }),
      update: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis()
    };

    const mockFromUserPoints = {
      upsert: vi.fn().mockResolvedValue({ error: null })
    };

    mockSupabase.from = vi.fn().mockImplementation((table) => {
      if (table === 'profiles') return mockFromProfiles;
      if (table === 'user_points') return mockFromUserPoints;
      return mockFromProfiles;
    });
  });

  it('should render user controls for admin', async () => {
    render(
      <InlineUserControls
        userId="user-123"
        userProfile={mockUserProfile}
      />
    );

    expect(screen.getByText('Controles Administrativos')).toBeInTheDocument();
    expect(screen.getByText('CLIENT')).toBeInTheDocument();
    expect(screen.getByText('ATIVO')).toBeInTheDocument();
    expect(screen.getByText('Imagens')).toBeInTheDocument();
    expect(screen.getByText('Editar')).toBeInTheDocument();
  });

  it('should show role promotion button for non-admin users', () => {
    render(
      <InlineUserControls
        userId="user-123"
        userProfile={mockUserProfile}
      />
    );

    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('should not show role promotion button for admin users', () => {
    const adminProfile = { ...mockUserProfile, role: 'admin' as const };
    
    render(
      <InlineUserControls
        userId="user-123"
        userProfile={adminProfile}
      />
    );

    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('should open edit form when edit button is clicked', () => {
    render(
      <InlineUserControls
        userId="user-123"
        userProfile={mockUserProfile}
      />
    );

    fireEvent.click(screen.getByText('Editar'));
    
    expect(screen.getByDisplayValue('João Silva')).toBeInTheDocument();
    expect(screen.getByDisplayValue('150')).toBeInTheDocument();
    expect(screen.getByText('Salvar Alterações')).toBeInTheDocument();
  });

  it('should update profile when save button is clicked', async () => {
    const mockUpdate = vi.fn().mockResolvedValue({ error: null });
    const mockFromProfiles = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ 
        data: { role: 'admin' }, 
        error: null 
      }),
      update: mockUpdate.mockReturnThis()
    };

    mockSupabase.from = vi.fn().mockImplementation((table) => {
      if (table === 'profiles') return mockFromProfiles;
      if (table === 'user_points') return {
        upsert: vi.fn().mockResolvedValue({ error: null })
      };
      return mockFromProfiles;
    });

    const onProfileUpdate = vi.fn();

    render(
      <InlineUserControls
        userId="user-123"
        userProfile={mockUserProfile}
        onProfileUpdate={onProfileUpdate}
      />
    );

    // Abrir formulário de edição
    fireEvent.click(screen.getByText('Editar'));

    // Alterar nome
    const nameInput = screen.getByDisplayValue('João Silva');
    fireEvent.change(nameInput, { target: { value: 'João Santos' } });

    // Salvar
    fireEvent.click(screen.getByText('Salvar Alterações'));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        full_name: 'João Santos',
        role: 'client'
      });
    });
  });

  it('should open avatar upload dialog when avatar button is clicked', () => {
    render(
      <InlineUserControls
        userId="user-123"
        userProfile={mockUserProfile}
      />
    );

    fireEvent.click(screen.getByText('Imagens'));
    
    expect(screen.getByText('Gerenciar Imagens do Usuário')).toBeInTheDocument();
  });

  it('should show user information correctly', () => {
    render(
      <InlineUserControls
        userId="user-123"
        userProfile={mockUserProfile}
      />
    );

    expect(screen.getByText('profile-...')).toBeInTheDocument(); // ID truncado
    expect(screen.getByText('joao@exemplo.com')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument(); // Pontos
    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });

  it('should handle role change correctly', async () => {
    const mockUpdate = vi.fn().mockResolvedValue({ error: null });
    const mockFromProfiles = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ 
        data: { role: 'admin' }, 
        error: null 
      }),
      update: mockUpdate.mockReturnThis()
    };

    mockSupabase.from = vi.fn().mockReturnValue(mockFromProfiles);

    const onProfileUpdate = vi.fn();

    render(
      <InlineUserControls
        userId="user-123"
        userProfile={mockUserProfile}
        onProfileUpdate={onProfileUpdate}
      />
    );

    // Abrir formulário de edição
    fireEvent.click(screen.getByText('Editar'));

    // Alterar role usando o select nativo
    const roleSelect = screen.getByLabelText('Role');
    fireEvent.change(roleSelect, { target: { value: 'admin' } });

    // Salvar
    fireEvent.click(screen.getByText('Salvar Alterações'));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        full_name: 'João Silva',
        role: 'admin'
      });
    });
  });

  it('should handle errors gracefully', async () => {
    const mockFromProfiles = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ 
        data: { role: 'admin' }, 
        error: null 
      }),
      update: vi.fn().mockReturnThis().mockReturnThis().mockResolvedValue({
        error: new Error('Update failed')
      })
    };

    mockSupabase.from = vi.fn().mockReturnValue(mockFromProfiles);

    render(
      <InlineUserControls
        userId="user-123"
        userProfile={mockUserProfile}
      />
    );

    // Abrir formulário e tentar salvar
    fireEvent.click(screen.getByText('Editar'));
    fireEvent.click(screen.getByText('Salvar Alterações'));

    // Verificar que o erro foi tratado
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });

  it('should prevent non-admin users from editing', async () => {
    // Mock usuário não-admin
    mockUseAuth.mockReturnValue({
      user: { 
        id: 'regular-user', 
        email: 'user@exemplo.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: '2024-01-01T00:00:00Z'
      },
      session: null,
      isLoading: false,
      isInitialized: true,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn()
    });

    const mockFromProfiles = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ 
        data: { role: 'client' }, 
        error: null 
      })
    };

    mockSupabase.from = vi.fn().mockReturnValue(mockFromProfiles);

    render(
      <InlineUserControls
        userId="user-123"
        userProfile={mockUserProfile}
      />
    );

    fireEvent.click(screen.getByText('Editar'));
    fireEvent.click(screen.getByText('Salvar Alterações'));

    // Verificar que a mensagem de erro aparece
    await waitFor(() => {
      expect(screen.queryByText('Salvar Alterações')).toBeInTheDocument();
    });
  });
}); 