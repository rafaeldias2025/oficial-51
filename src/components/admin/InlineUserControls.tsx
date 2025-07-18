import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Crown, 
  Upload, 
  UserPlus, 
  UserMinus, 
  Edit, 
  Save,
  X,
  Shield,
  Award,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { DragDropUploader } from './DragDropUploader';
import { AdminImageUpload } from './AdminImageUpload';
import { useFileUpload, FileUploadResult } from '@/hooks/useFileUpload';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface InlineUserControlsProps {
  userId: string;
  userProfile: {
    id: string;
    user_id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
    role: 'admin' | 'client' | 'visitor';
    is_active?: boolean;
    total_points?: number;
  };
  onProfileUpdate?: (updatedProfile: Record<string, unknown>) => void;
  className?: string;
}

export const InlineUserControls: React.FC<InlineUserControlsProps> = ({
  userId,
  userProfile,
  onProfileUpdate,
  className
}) => {
  const { user: currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: userProfile.full_name,
    role: userProfile.role,
    is_active: userProfile.is_active ?? true,
    total_points: userProfile.total_points ?? 0
  });

  // Verificar se usuário atual é admin
  const isCurrentUserAdmin = async () => {
    if (!currentUser) return false;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', currentUser.id)
      .single();
    
    return profile?.role === 'admin';
  };

  // Upload de avatar
  const handleAvatarUpload = async (results: FileUploadResult[]) => {
    if (results.length === 0) return;
    
    const result = results[0];
    
    try {
      // Atualizar avatar_url no perfil
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: result.url })
        .eq('id', userProfile.id);
      
      if (error) throw error;
      
      toast.success('Avatar atualizado com sucesso');
      onProfileUpdate?.({ ...userProfile, avatar_url: result.url });
      setShowAvatarUpload(false);
    } catch (error) {
      console.error('Erro ao atualizar avatar:', error);
      toast.error('Erro ao atualizar avatar');
    }
  };

  // Salvar alterações do perfil
  const handleSaveProfile = async () => {
    if (!(await isCurrentUserAdmin())) {
      toast.error('Apenas administradores podem editar perfis');
      return;
    }

    try {
             // Atualizar perfil
       const { error: profileError } = await supabase
         .from('profiles')
         .update({
           full_name: editForm.full_name,
           role: editForm.role
         })
         .eq('id', userProfile.id);
       
       if (profileError) throw profileError;

       // Atualizar pontos se necessário
       if (editForm.total_points !== userProfile.total_points) {
         const { error: pointsError } = await supabase
           .from('user_points')
           .upsert({
             user_id: userProfile.id,
             total_points: editForm.total_points,
             updated_at: new Date().toISOString()
           });
         
         if (pointsError) {
           console.warn('Erro ao atualizar pontos:', pointsError);
         }
       }

       // TODO: Log da ação admin (será implementado na Phase 4)
       console.log('Admin action logged:', {
         actor: currentUser?.id,
         action: 'profile_update',
         target: userProfile.id,
         changes: editForm
       });

      toast.success('Perfil atualizado com sucesso');
      onProfileUpdate?.({ ...userProfile, ...editForm });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
    }
  };

     // Toggle status ativo/inativo
   const handleToggleActive = async () => {
     if (!(await isCurrentUserAdmin())) {
       toast.error('Apenas administradores podem alterar status');
       return;
     }

     // TODO: Implementar toggle de status na Phase 4 quando is_active for adicionado
     toast.info('Funcionalidade será implementada na próxima versão');
   };

  // Promover/rebaixar usuário
  const handleRoleChange = async (newRole: 'admin' | 'client' | 'visitor') => {
    if (!(await isCurrentUserAdmin())) {
      toast.error('Apenas administradores podem alterar roles');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userProfile.id);
      
      if (error) throw error;

             // TODO: Log da ação admin (será implementado na Phase 4)
       console.log('Admin role change:', {
         actor: currentUser?.id,
         action: 'role_change',
         target: userProfile.id,
         old_role: userProfile.role,
         new_role: newRole
       });

      toast.success(`Role alterado para ${newRole}`);
      onProfileUpdate?.({ ...userProfile, role: newRole });
    } catch (error) {
      console.error('Erro ao alterar role:', error);
      toast.error('Erro ao alterar role do usuário');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500 text-white';
      case 'client': return 'bg-blue-500 text-white';
      case 'visitor': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Crown;
      case 'client': return Award;
      case 'visitor': return Eye;
      default: return Shield;
    }
  };

  return (
    <Card className={`border-l-4 border-l-orange-500 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-orange-500" />
            <CardTitle className="text-lg">Controles Administrativos</CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={getRoleColor(userProfile.role)}
            >
              {React.createElement(getRoleIcon(userProfile.role), { className: "w-3 h-3 mr-1" })}
              {userProfile.role.toUpperCase()}
            </Badge>
            
            <Badge 
              variant={userProfile.is_active ? "default" : "secondary"}
              className={userProfile.is_active ? "bg-green-500" : "bg-gray-500"}
            >
              {userProfile.is_active ? "ATIVO" : "INATIVO"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Controles rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Upload de Avatar */}
          <Dialog open={showAvatarUpload} onOpenChange={setShowAvatarUpload}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Upload className="w-4 h-4 mr-2" />
                Imagens
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Gerenciar Imagens do Usuário</DialogTitle>
              </DialogHeader>
              <AdminImageUpload
                userId={userProfile.id}
                currentAvatar={userProfile.avatar_url}
                onImageUpdate={(type, url) => {
                  if (type === 'avatar') {
                    onProfileUpdate?.({ ...userProfile, avatar_url: url });
                  }
                }}
              />
            </DialogContent>
          </Dialog>

          {/* Toggle Status */}
          <Button
            variant={userProfile.is_active ? "destructive" : "default"}
            size="sm"
            onClick={handleToggleActive}
            className="h-10"
          >
            {userProfile.is_active ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Desativar
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Ativar
              </>
            )}
          </Button>

          {/* Promover para Admin */}
          {userProfile.role !== 'admin' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 text-red-600 border-red-300">
                  <Crown className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Promover para Administrador</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja promover "{userProfile.full_name}" para administrador?
                    <br /><br />
                    <strong>Administradores podem:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Gerenciar todos os usuários</li>
                      <li>Criar e editar cursos</li>
                      <li>Acessar dados analíticos</li>
                      <li>Fazer uploads de mídia</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleRoleChange('admin')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Promover para Admin
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Editar Perfil */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="h-10"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </>
            )}
          </Button>
        </div>

        {/* Formulário de edição */}
        {isEditing && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Nome Completo</Label>
                <Input
                  id="full_name"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'admin' | 'client' | 'visitor' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="visitor">Visitante</option>
                  <option value="client">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div>
                <Label htmlFor="total_points">Pontos Totais</Label>
                <Input
                  id="total_points"
                  type="number"
                  value={editForm.total_points}
                  onChange={(e) => setEditForm({ ...editForm, total_points: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={editForm.is_active}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, is_active: checked })}
                />
                <Label htmlFor="is_active">
                  Usuário Ativo
                </Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveProfile} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setEditForm({
                    full_name: userProfile.full_name,
                    role: userProfile.role,
                    is_active: userProfile.is_active ?? true,
                    total_points: userProfile.total_points ?? 0
                  });
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Informações do usuário */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-500">ID:</span>
              <p className="text-gray-900 font-mono text-xs">{userProfile.id.slice(0, 8)}...</p>
            </div>
            
            <div>
              <span className="font-medium text-gray-500">Email:</span>
              <p className="text-gray-900 truncate">{userProfile.email}</p>
            </div>
            
            <div>
              <span className="font-medium text-gray-500">Pontos:</span>
              <p className="text-gray-900 font-semibold">{userProfile.total_points ?? 0}</p>
            </div>
            
            <div>
              <span className="font-medium text-gray-500">Status:</span>
              <p className={`font-medium ${userProfile.is_active ? 'text-green-600' : 'text-red-600'}`}>
                {userProfile.is_active ? 'Ativo' : 'Inativo'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 