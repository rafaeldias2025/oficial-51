import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Upload, 
  Trash2, 
  Download, 
  Copy, 
  Eye, 
  Image, 
  Video, 
  FileText,
  Filter,
  Search,
  Grid,
  List,
  FolderOpen,
  File,
  Calendar,
  User,
  Folder,
  Plus,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import { DragDropUploader } from './DragDropUploader';
import { FileUploadResult } from '@/hooks/useFileUpload';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MediaFile {
  id: string;
  name: string;
  path: string;
  url: string;
  size: number;
  type: string;
  bucket: string;
  folder?: string;
  uploaded_by?: string;
  uploaded_at: string;
  metadata?: Record<string, string>;
}

interface EnhancedMediaManagerProps {
  className?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return Image;
  if (type.startsWith('video/')) return Video;
  if (type.includes('pdf')) return FileText;
  return File;
};

const AVAILABLE_BUCKETS = [
  { id: 'uploads', name: 'Uploads Gerais', description: 'Arquivos diversos', icon: Upload },
  { id: 'course-images', name: 'Imagens de Cursos', description: 'Apenas imagens de cursos', icon: Image },
  { id: 'user-content', name: 'Conteúdo dos Usuários', description: 'Conteúdo enviado pelos usuários', icon: User },
  { id: 'avatars', name: 'Avatares', description: 'Fotos de perfil', icon: User }
];

export const EnhancedMediaManager: React.FC<EnhancedMediaManagerProps> = ({
  className
}) => {
  const { user } = useAuth();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState('uploads');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showUploader, setShowUploader] = useState(false);

  // Verificar se é admin
  const isAdmin = useCallback(async () => {
    if (!user) return false;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    return profile?.role === 'admin';
  }, [user]);

  // Carregar arquivos do bucket selecionado
  const loadFiles = useCallback(async () => {
    if (!(await isAdmin())) {
      toast.error('Apenas administradores podem acessar o gerenciador de mídia');
      return;
    }

    try {
      setLoading(true);
      
      const { data: bucketFiles, error } = await supabase.storage
        .from(selectedBucket)
        .list('', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      // Converter para formato MediaFile
      const mediaFiles: MediaFile[] = bucketFiles.map(file => {
        const { data } = supabase.storage
          .from(selectedBucket)
          .getPublicUrl(file.name);

        return {
          id: file.id || file.name,
          name: file.name,
          path: file.name,
          url: data.publicUrl,
          size: file.metadata?.size || 0,
          type: file.metadata?.mimetype || 'application/octet-stream',
          bucket: selectedBucket,
          uploaded_at: file.created_at || new Date().toISOString(),
          metadata: file.metadata as Record<string, string>
        };
      });

      setFiles(mediaFiles);
      toast.success(`${mediaFiles.length} arquivo(s) carregado(s) do bucket ${selectedBucket}`);
    } catch (error) {
      console.error('Erro ao carregar arquivos:', error);
      toast.error('Erro ao carregar arquivos');
    } finally {
      setLoading(false);
    }
  }, [selectedBucket, isAdmin]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // Filtrar arquivos
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || file.type.startsWith(typeFilter);
    return matchesSearch && matchesType;
  });

  // Upload concluído
  const handleUploadComplete = useCallback((results: FileUploadResult[]) => {
    toast.success(`${results.length} arquivo(s) enviado(s) com sucesso!`);
    loadFiles(); // Recarregar lista
    setShowUploader(false);
  }, [loadFiles]);

  // Copiar URL
  const copyUrl = useCallback((url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copiada para área de transferência');
  }, []);

  // Download arquivo
  const downloadFile = useCallback(async (file: MediaFile) => {
    try {
      const { data, error } = await supabase.storage
        .from(file.bucket)
        .download(file.path);

      if (error) throw error;

      // Criar URL temporária e iniciar download
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Download iniciado');
    } catch (error) {
      console.error('Erro no download:', error);
      toast.error('Erro ao fazer download');
    }
  }, []);

  // Deletar arquivo
  const deleteFile = useCallback(async (file: MediaFile) => {
    if (!(await isAdmin())) {
      toast.error('Apenas administradores podem deletar arquivos');
      return;
    }

    try {
      const { error } = await supabase.storage
        .from(file.bucket)
        .remove([file.path]);

      if (error) throw error;

      toast.success('Arquivo removido com sucesso');
      loadFiles(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao remover arquivo:', error);
      toast.error('Erro ao remover arquivo');
    }
  }, [isAdmin, loadFiles]);

  // Deletar múltiplos arquivos
  const deleteSelectedFiles = useCallback(async () => {
    if (!(await isAdmin())) {
      toast.error('Apenas administradores podem deletar arquivos');
      return;
    }

    try {
      const filesToDelete = files.filter(f => selectedFiles.has(f.id));
      const paths = filesToDelete.map(f => f.path);

      const { error } = await supabase.storage
        .from(selectedBucket)
        .remove(paths);

      if (error) throw error;

      toast.success(`${filesToDelete.length} arquivo(s) removido(s)`);
      setSelectedFiles(new Set());
      loadFiles();
    } catch (error) {
      console.error('Erro ao remover arquivos:', error);
      toast.error('Erro ao remover arquivos');
    }
  }, [isAdmin, files, selectedFiles, selectedBucket, loadFiles]);

  // Toggle seleção
  const toggleSelection = useCallback((fileId: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  }, []);

  // Selecionar todos
  const selectAll = useCallback(() => {
    setSelectedFiles(new Set(filteredFiles.map(f => f.id)));
  }, [filteredFiles]);

  // Limpar seleção
  const clearSelection = useCallback(() => {
    setSelectedFiles(new Set());
  }, []);

  const FileCard: React.FC<{ file: MediaFile }> = ({ file }) => {
    const isSelected = selectedFiles.has(file.id);
    const FileIcon = getFileIcon(file.type);

    return (
      <Card className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        isSelected && 'ring-2 ring-blue-500',
        'hover:ring-1 hover:ring-gray-300'
      )}>
        <CardContent className="p-4">
          {/* Preview ou Ícone */}
          <div className="aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden relative">
            {file.type.startsWith('image/') ? (
              <img
                src={file.url}
                alt={file.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FileIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
            
            {/* Overlay de seleção */}
            <div 
              className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              onClick={() => toggleSelection(file.id)}
            >
              <div className={cn(
                'w-6 h-6 rounded-full border-2 border-white flex items-center justify-center',
                isSelected ? 'bg-blue-500' : 'bg-white/20'
              )}>
                {isSelected && <Check className="text-white w-3 h-3" />}
              </div>
            </div>
          </div>

          {/* Info do arquivo */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-900 truncate" title={file.name}>
              {file.name}
            </h4>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{formatFileSize(file.size)}</span>
              <Badge variant="secondary" className="text-xs">
                {file.type.split('/')[0]}
              </Badge>
            </div>

            {/* Ações */}
            <div className="flex gap-1 mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyUrl(file.url)}
                className="flex-1 text-xs"
              >
                <Copy className="w-3 h-3 mr-1" />
                URL
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => downloadFile(file)}
              >
                <Download className="w-3 h-3" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir "{file.name}"? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteFile(file)} className="bg-red-600 hover:bg-red-700">
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">Gerenciador de Mídia</h3>
          <p className="text-white/60">
            {filteredFiles.length} arquivo(s) encontrado(s) • Bucket: {selectedBucket}
            {selectedFiles.size > 0 && ` • ${selectedFiles.size} selecionado(s)`}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadFiles}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Carregando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </>
            )}
          </Button>

          <Dialog open={showUploader} onOpenChange={setShowUploader}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Enviar Arquivos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Enviar Arquivos para: {selectedBucket}</DialogTitle>
              </DialogHeader>
              <DragDropUploader
                uploadOptions={{ 
                  bucket: selectedBucket,
                  maxSize: 10 * 1024 * 1024 // 10MB
                }}
                onUploadComplete={handleUploadComplete}
                accept={{
                  'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
                  'video/*': ['.mp4', '.webm'],
                  'application/pdf': ['.pdf'],
                  'text/plain': ['.txt'],
                  'application/msword': ['.doc'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
                }}
              />
            </DialogContent>
          </Dialog>

          {selectedFiles.size > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir ({selectedFiles.size})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir {selectedFiles.size} arquivo(s)? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteSelectedFiles} className="bg-red-600 hover:bg-red-700">
                    Excluir Arquivos
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Seleção de Bucket */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Selecionar Bucket de Storage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {AVAILABLE_BUCKETS.map((bucket) => {
              const IconComponent = bucket.icon;
              return (
                <Card 
                  key={bucket.id} 
                  className={cn(
                    'cursor-pointer transition-all',
                    selectedBucket === bucket.id 
                      ? 'bg-primary/20 border-primary ring-2 ring-primary/50' 
                      : 'bg-white/5 border-white/20 hover:bg-white/10'
                  )}
                  onClick={() => setSelectedBucket(bucket.id)}
                >
                  <CardContent className="p-4 text-center">
                    <IconComponent className="w-8 h-8 mx-auto mb-2 text-white" />
                    <h4 className="font-medium text-white">{bucket.name}</h4>
                    <p className="text-xs text-white/60 mt-1">{bucket.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filtros e Busca */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <Label htmlFor="search" className="text-white">Buscar arquivos</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Digite o nome do arquivo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            {/* Filtro por tipo */}
            <div className="md:w-48">
              <Label htmlFor="type-filter" className="text-white">Tipo de arquivo</Label>
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
              >
                <option value="all">Todos os tipos</option>
                <option value="image">Imagens</option>
                <option value="video">Vídeos</option>
                <option value="application">Documentos</option>
                <option value="text">Textos</option>
              </select>
            </div>

            {/* Modo de visualização */}
            <div className="flex items-end gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Seleção */}
            <div className="flex items-end gap-2">
              <Button size="sm" variant="outline" onClick={selectAll}>
                Selecionar Todos
              </Button>
              <Button size="sm" variant="outline" onClick={clearSelection}>
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Arquivos */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : filteredFiles.length === 0 ? (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-12 text-center">
            <FolderOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white/60 mb-2">
              Nenhum arquivo encontrado
            </h3>
            <p className="text-white/40">
              {searchTerm || typeFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Faça upload de alguns arquivos para começar'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'space-y-2'
        )}>
          {filteredFiles.map(file => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
};