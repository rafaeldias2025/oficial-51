import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAdminActions, AdminUser } from '@/hooks/useAdminActions';
import { Users, UserPlus, Edit, Trash2, Search, RotateCw, UserCheck, UserX, Crown, Check, X, AlertCircle, Eye } from 'lucide-react';
import { ButtonLoading } from '@/components/ui/loading';
import { supabase } from '@/integrations/supabase/client';
import { UserDetailModal } from './UserDetailModal';

export const UserManagement: React.FC = () => {
  const { toast } = useToast();
  const { 
    loading, 
    error, 
    fetchAllUsers, 
    createUser, 
    updateUser, 
    deleteUser, 
    changeUserRole,
    clearError
  } = useAdminActions();
  
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [userDetailData, setUserDetailData] = useState<AdminUser | null>(null);
  
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'client' as 'admin' | 'client' | 'visitor'
  });
  
  const [editForm, setEditForm] = useState({
    email: '',
    full_name: '',
    role: 'client' as 'admin' | 'client' | 'visitor'
  });

  // Buscar usuários
  const handleFetchUsers = useCallback(async () => {
    const fetchedUsers = await fetchAllUsers();
    setUsers(fetchedUsers);
  }, [fetchAllUsers]);

  // Criar usuário
  const handleCreateUser = useCallback(async () => {
    if (!createForm.email || !createForm.password || !createForm.full_name) {
      toast({
        title: "❌ Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createForm.email)) {
      toast({
        title: "❌ Email inválido",
        description: "Digite um email válido",
        variant: "destructive"
      });
      return;
    }

    // Validação de senha
    if (createForm.password.length < 6) {
      toast({
        title: "❌ Senha muito fraca",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCreating(true);
      
      toast({
        title: "👤 Criando usuário...",
        description: "Aguarde enquanto criamos o usuário"
      });

      // Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: createForm.email,
        password: createForm.password,
        options: {
          data: {
            full_name: createForm.full_name
          }
        }
      });

      if (authError) throw authError;

      // Atualizar perfil com role
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: createForm.full_name,
            role: createForm.role
          })
          .eq('user_id', authData.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "✅ Usuário criado com sucesso!",
        description: `${createForm.full_name} foi adicionado ao sistema`
      });

      // Resetar formulário
      setCreateForm({
        email: '',
        password: '',
        full_name: '',
        role: 'client'
      });

      setIsCreateDialogOpen(false);
      await handleFetchUsers();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    } finally {
      setIsCreating(false);
    }
  }, [createForm, handleFetchUsers, toast]);

  // Editar usuário
  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setEditForm({
      email: user.email || '',
      full_name: user.full_name || '',
      role: user.role as 'admin' | 'client' | 'visitor'
    });
    setIsEditDialogOpen(true);
  };

  // Atualizar usuário
  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    setIsUpdating(true);
    const success = await updateUser(selectedUser.id, editForm);
    
    if (success) {
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      await handleFetchUsers();
    }
    
    setIsUpdating(false);
  };

  // Deletar usuário
  const handleDeleteUser = async (userId: string) => {
    setIsDeleting(userId);
    const success = await deleteUser(userId);
    
    if (success) {
      await handleFetchUsers();
    }
    
    setIsDeleting(null);
  };

  useEffect(() => {
    handleFetchUsers();
  }, [handleFetchUsers]);

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Exibir erro se houver */}
      {error && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Erro no sistema</p>
                <p className="text-sm">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearError}
                  className="mt-2"
                >
                  Tentar novamente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5" />
            Gerenciamento de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-netflix-text-muted" />
              <Input
                placeholder="Buscar usuários..."
                className="pl-10 bg-netflix-hover border-netflix-border text-netflix-text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Criar Usuário
              </Button>
              
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-netflix-text">Criar Novo Usuário</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="create-email">Email</Label>
                    <Input
                      id="create-email"
                      type="email"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                      className="bg-netflix-hover border-netflix-border text-netflix-text"
                      placeholder="user@exemplo.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="create-password">Senha</Label>
                    <Input
                      id="create-password"
                      type="password"
                      value={createForm.password}
                      onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                      className="bg-netflix-hover border-netflix-border text-netflix-text"
                      placeholder="Senha forte (min. 6 caracteres)"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="create-name">Nome Completo</Label>
                    <Input
                      id="create-name"
                      value={createForm.full_name}
                      onChange={(e) => setCreateForm({...createForm, full_name: e.target.value})}
                      className="bg-netflix-hover border-netflix-border text-netflix-text"
                      placeholder="Nome completo do usuário"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="create-role">Papel</Label>
                    <Select value={createForm.role} onValueChange={(value: 'admin' | 'client' | 'visitor') => setCreateForm({...createForm, role: value})}>
                      <SelectTrigger className="bg-netflix-hover border-netflix-border text-netflix-text">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Cliente</SelectItem>
                        <SelectItem value="visitor">Visitante</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCreateUser} 
                      disabled={isCreating}
                      className="instituto-button flex-1"
                    >
                      {isCreating ? (
                        <>
                          <ButtonLoading className="mr-2" />
                          Criando...
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Criar Usuário
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsCreateDialogOpen(false);
                        setCreateForm({
                          email: '',
                          password: '',
                          full_name: '',
                          role: 'client'
                        });
                      }}
                      disabled={isCreating}
                      className="border-netflix-border text-netflix-text hover:bg-netflix-hover"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              onClick={handleFetchUsers} 
              disabled={loading}
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
            >
              {loading ? (
                <>
                  <ButtonLoading className="mr-2" />
                  Carregando...
                </>
              ) : (
                <>
                  <RotateCw className="h-4 w-4 mr-2" />
                  Atualizar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuários */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Usuários do Sistema ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <ButtonLoading className="mr-2" />
                <span className="text-white">Carregando usuários...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                Nenhum usuário encontrado
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      {user.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{user.full_name || 'Sem nome'}</p>
                        <span className={`px-2 py-1 text-xs rounded ${
                          user.role === 'admin' ? 'bg-red-500/20 text-red-300' :
                          user.role === 'client' ? 'bg-green-500/20 text-green-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-sm text-white/60">{user.email}</p>
                      {user.total_points !== undefined && (
                        <p className="text-xs text-white/40">{user.total_points} pontos</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setUserDetailData(user);
                        setIsUserDetailOpen(true);
                      }}
                      className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditUser(user)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isDeleting === user.id}
                          className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                        >
                          {isDeleting === user.id ? (
                            <ButtonLoading className="h-4 w-4" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover {user.full_name}? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Confirmar Exclusão
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes do Usuário */}
      <UserDetailModal
        user={userDetailData}
        isOpen={isUserDetailOpen}
        onClose={() => {
          setIsUserDetailOpen(false);
          setUserDetailData(null);
        }}
      />

      {/* Modal de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-netflix-text">Editar Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                className="bg-netflix-hover border-netflix-border text-netflix-text"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-name">Nome Completo</Label>
              <Input
                id="edit-name"
                value={editForm.full_name}
                onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                className="bg-netflix-hover border-netflix-border text-netflix-text"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-role">Papel</Label>
              <Select value={editForm.role} onValueChange={(value: 'admin' | 'client' | 'visitor') => setEditForm({...editForm, role: value})}>
                <SelectTrigger className="bg-netflix-hover border-netflix-border text-netflix-text">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Cliente</SelectItem>
                  <SelectItem value="visitor">Visitante</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleUpdateUser} 
                disabled={isUpdating}
                className="instituto-button flex-1"
              >
                {isUpdating ? (
                  <>
                    <ButtonLoading className="mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedUser(null);
                  setEditForm({
                    email: '',
                    full_name: '',
                    role: 'client'
                  });
                }}
                disabled={isUpdating}
                className="border-netflix-border text-netflix-text hover:bg-netflix-hover"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};