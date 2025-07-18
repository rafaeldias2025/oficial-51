import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  FileImage, 
  FileVideo, 
  FileText, 
  File,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useFileUpload, FileUploadOptions, FileUploadResult } from '@/hooks/useFileUpload';
import { cn } from '@/lib/utils';

interface DragDropUploaderProps {
  onUploadComplete?: (results: FileUploadResult[]) => void;
  onUploadError?: (error: string) => void;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  uploadOptions?: Partial<FileUploadOptions>;
  accept?: Record<string, string[]>;
  placeholder?: {
    title?: string;
    description?: string;
  };
}

interface FileWithPreview extends File {
  preview?: string;
  id: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  result?: FileUploadResult;
  error?: string;
}

const getFileIcon = (type?: string) => {
  if (!type) return File;
  if (type.startsWith('image/')) return FileImage;
  if (type.startsWith('video/')) return FileVideo;
  if (type.includes('pdf')) return FileText;
  return File;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const DragDropUploader: React.FC<DragDropUploaderProps> = ({
  onUploadComplete,
  onUploadError,
  multiple = true,
  disabled = false,
  className,
  uploadOptions = {},
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    'video/*': ['.mp4', '.webm'],
    'application/pdf': ['.pdf']
  },
  placeholder = {
    title: 'Arraste arquivos aqui',
    description: 'ou clique para selecionar'
  }
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const { uploading, progress, uploadFile, uploadMultiple } = useFileUpload(uploadOptions);

  // Configurar dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (disabled) return;

    const newFiles: FileWithPreview[] = acceptedFiles.map(file => {
      const fileWithPreview = Object.assign(file, {
        id: `${Date.now()}-${Math.random()}`,
        status: 'pending' as const,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      });
      return fileWithPreview;
    });

    setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
  }, [disabled, multiple]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    multiple,
    disabled: disabled || uploading,
    maxSize: uploadOptions.maxSize || 5 * 1024 * 1024
  });

  // Remover arquivo
  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      // Revogar URL de preview
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  }, []);

  // Fazer upload dos arquivos
  const handleUpload = useCallback(async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    // Marcar arquivos como uploading
    setFiles(prev => prev.map(f => 
      f.status === 'pending' ? { ...f, status: 'uploading' } : f
    ));

    try {
      const results: FileUploadResult[] = [];

      // Upload um por vez para melhor controle
      for (const file of pendingFiles) {
        try {
          const result = await uploadFile(file);
          if (result) {
            results.push(result);
            
            // Marcar como completo
            setFiles(prev => prev.map(f => 
              f.id === file.id 
                ? { ...f, status: 'completed', result }
                : f
            ));
          } else {
            throw new Error('Upload falhou');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro no upload';
          
          // Marcar como erro
          setFiles(prev => prev.map(f => 
            f.id === file.id 
              ? { ...f, status: 'error', error: errorMessage }
              : f
          ));
          
          onUploadError?.(errorMessage);
        }
      }

      if (results.length > 0) {
        onUploadComplete?.(results);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no upload';
      onUploadError?.(errorMessage);
    }
  }, [files, uploadFile, onUploadComplete, onUploadError]);

  // Limpar arquivos completados
  const clearCompleted = useCallback(() => {
    setFiles(prev => {
      const toKeep = prev.filter(f => f.status !== 'completed');
      const toRemove = prev.filter(f => f.status === 'completed');
      
      // Revogar URLs de preview
      toRemove.forEach(f => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
      
      return toKeep;
    });
  }, []);

  const pendingCount = files.filter(f => f.status === 'pending').length;
  const completedCount = files.filter(f => f.status === 'completed').length;
  const errorCount = files.filter(f => f.status === 'error').length;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Área de Drop */}
      <Card className={cn(
        'transition-all duration-200 border-2 border-dashed',
        isDragActive && !isDragReject && 'border-blue-500 bg-blue-50',
        isDragReject && 'border-red-500 bg-red-50',
        disabled && 'opacity-50 cursor-not-allowed',
        !isDragActive && !isDragReject && 'border-gray-300 hover:border-gray-400'
      )}>
        <CardContent className="p-8">
          <div {...getRootProps()} className="text-center cursor-pointer">
            <input {...getInputProps()} />
            
            <Upload className={cn(
              'mx-auto h-12 w-12 mb-4',
              isDragActive ? 'text-blue-500' : 'text-gray-400'
            )} />
            
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {isDragActive ? 'Solte os arquivos aqui' : placeholder.title}
            </h3>
            
            <p className="text-gray-500 mb-4">
              {isDragActive ? 'Arquivos serão adicionados à lista' : placeholder.description}
            </p>
            
            <div className="text-xs text-gray-400">
              Tipos aceitos: {Object.values(accept).flat().join(', ')}
              {uploadOptions.maxSize && (
                <> • Máx: {formatFileSize(uploadOptions.maxSize)}</>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Arquivos */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-700">
                Arquivos Selecionados ({files.length})
              </h4>
              
              <div className="flex gap-2">
                {completedCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCompleted}
                  >
                    Limpar Concluídos ({completedCount})
                  </Button>
                )}
                
                {pendingCount > 0 && (
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    size="sm"
                  >
                    {uploading ? 'Enviando...' : `Enviar ${pendingCount} arquivo(s)`}
                  </Button>
                )}
              </div>
            </div>

            {/* Progress Global */}
            {uploading && progress && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Enviando arquivo...</span>
                  <span>{Math.round(progress.percentage)}%</span>
                </div>
                <Progress value={progress.percentage} className="w-full" />
              </div>
            )}

            {/* Lista */}
            <div className="space-y-2">
              {files.map(file => {
                const FileIcon = getFileIcon(file.type);
                
                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50"
                  >
                    {/* Preview ou Ícone */}
                    <div className="flex-shrink-0">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <FileIcon className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                    </div>

                    {/* Info do Arquivo */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                      {file.error && (
                        <p className="text-xs text-red-500 mt-1">
                          {file.error}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex-shrink-0">
                      {file.status === 'pending' && (
                        <Badge variant="secondary">Pendente</Badge>
                      )}
                      {file.status === 'uploading' && (
                        <Badge variant="default">Enviando...</Badge>
                      )}
                      {file.status === 'completed' && (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Concluído
                        </Badge>
                      )}
                      {file.status === 'error' && (
                        <Badge variant="destructive">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Erro
                        </Badge>
                      )}
                    </div>

                    {/* Botão Remover */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      disabled={file.status === 'uploading'}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Resumo */}
            {(completedCount > 0 || errorCount > 0) && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex gap-4 text-sm">
                  {completedCount > 0 && (
                    <span className="text-green-600">
                      ✓ {completedCount} concluído(s)
                    </span>
                  )}
                  {errorCount > 0 && (
                    <span className="text-red-600">
                      ✗ {errorCount} com erro(s)
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 