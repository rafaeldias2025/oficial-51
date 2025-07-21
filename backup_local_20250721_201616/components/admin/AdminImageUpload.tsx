import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Image, User, Camera } from 'lucide-react';
import { DragDropUploader } from './DragDropUploader';
import { useFileUpload, FileUploadResult } from '@/hooks/useFileUpload';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AdminImageUploadProps {
  userId: string;
  currentAvatar?: string;
  currentBanner?: string;
  onImageUpdate?: (type: 'avatar' | 'banner', url: string) => void;
  className?: string;
}

export const AdminImageUpload: React.FC<AdminImageUploadProps> = ({
  userId,
  currentAvatar,
  currentBanner,
  onImageUpdate,
  className
}) => {
  const { user: currentUser } = useAuth();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

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
    
    if (!(await isCurrentUserAdmin())) {
      toast.error('Apenas administradores podem fazer upload de imagens');
      return;
    }

    const result = results[0];
    setUploadingAvatar(true);
    
    try {
      // Atualizar avatar_url no perfil
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: result.url })
        .eq('id', userId);
      
      if (error) throw error;

      // Log da ação admin (será implementado quando admin_logs estiver disponível)
      console.log('Admin action:', {
        actor: currentUser?.id,
        action: 'avatar_update',
        target: userId,
        url: result.url
      });
      
      toast.success('Avatar atualizado com sucesso');
      onImageUpdate?.('avatar', result.url);
    } catch (error) {
      console.error('Erro ao atualizar avatar:', error);
      toast.error('Erro ao atualizar avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Upload de banner
  const handleBannerUpload = async (results: FileUploadResult[]) => {
    if (results.length === 0) return;
    
    if (!(await isCurrentUserAdmin())) {
      toast.error('Apenas administradores podem fazer upload de imagens');
      return;
    }

    const result = results[0];
    setUploadingBanner(true);
    
    try {
      // Log da ação admin (será implementado quando admin_logs estiver disponível)
      console.log('Admin action:', {
        actor: currentUser?.id,
        action: 'banner_update',
        target: userId,
        url: result.url
      });
      
      toast.success(`Banner salvo: ${result.url}`);
      onImageUpdate?.('banner', result.url);
    } catch (error) {
      console.error('Erro ao atualizar banner:', error);
      toast.error('Erro ao atualizar banner');
    } finally {
      setUploadingBanner(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload de Avatar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Avatar do Usuário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentAvatar && (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                <img 
                  src={currentAvatar} 
                  alt="Avatar atual" 
                  className="w-full h-full object-cover"
                />
              </div>
              <Label className="text-sm text-gray-600">Avatar Atual</Label>
            </div>
          )}
          
          <DragDropUploader
            uploadOptions={{ 
              bucket: 'avatars',
              allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
              maxSize: 5 * 1024 * 1024 // 5MB
            }}
            onUploadComplete={handleAvatarUpload}
            disabled={uploadingAvatar}
            className="min-h-[120px]"
            multiple={false}
            placeholder={{
              title: 'Upload de Avatar',
              description: 'Arraste ou clique para selecionar imagem'
            }}
          />
        </CardContent>
      </Card>

      {/* Upload de Banner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Banner do Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentBanner && (
            <div className="space-y-2">
              <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src={currentBanner} 
                  alt="Banner atual" 
                  className="w-full h-full object-cover"
                />
              </div>
              <Label className="text-sm text-gray-600">Banner Atual</Label>
            </div>
          )}
          
          <DragDropUploader
            uploadOptions={{ 
              bucket: 'user-content',
              allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
              maxSize: 5 * 1024 * 1024 // 5MB
            }}
            onUploadComplete={handleBannerUpload}
            disabled={uploadingBanner}
            className="min-h-[120px]"
            multiple={false}
            placeholder={{
              title: 'Upload de Banner',
              description: 'Arraste ou clique para selecionar imagem'
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}; 