import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FileUploadOptions {
  bucket: string;
  folder?: string;
  maxSize?: number; // em bytes
  allowedTypes?: string[];
  compress?: boolean;
  generateThumbnail?: boolean;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileUploadResult {
  url: string;
  path: string;
  file: File;
  thumbnail?: string;
}

const DEFAULT_OPTIONS: FileUploadOptions = {
  bucket: 'uploads',
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  compress: true,
  generateThumbnail: true
};

export const useFileUpload = (options: Partial<FileUploadOptions> = {}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Validar arquivo
  const validateFile = useCallback((file: File): boolean => {
    setError(null);

    // Verificar tamanho
    if (file.size > opts.maxSize!) {
      const maxSizeMB = (opts.maxSize! / 1024 / 1024).toFixed(1);
      setError(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
      return false;
    }

    // Verificar tipo
    if (opts.allowedTypes && !opts.allowedTypes.includes(file.type)) {
      setError(`Tipo de arquivo não permitido. Tipos aceitos: ${opts.allowedTypes.join(', ')}`);
      return false;
    }

    return true;
  }, [opts.maxSize, opts.allowedTypes]);

  // Comprimir imagem
  const compressImage = useCallback((file: File, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(file);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calcular dimensões mantendo aspect ratio
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Desenhar e comprimir
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Gerar thumbnail
  const generateThumbnail = useCallback((file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(null);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        const size = 150; // Thumbnail 150x150
        canvas.width = size;
        canvas.height = size;

        // Crop para quadrado
        const minDim = Math.min(img.width, img.height);
        const x = (img.width - minDim) / 2;
        const y = (img.height - minDim) / 2;

        ctx.drawImage(img, x, y, minDim, minDim, 0, 0, size, size);
        
        const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
        resolve(thumbnail);
      };

      img.onerror = () => resolve(null);
      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Upload de arquivo
  const uploadFile = useCallback(async (
    file: File, 
    fileName?: string
  ): Promise<FileUploadResult | null> => {
    if (!validateFile(file)) {
      return null;
    }

    setUploading(true);
    setProgress({ loaded: 0, total: file.size, percentage: 0 });
    setError(null);

    try {
      let fileToUpload = file;

      // Comprimir se necessário
      if (opts.compress && file.type.startsWith('image/')) {
        fileToUpload = await compressImage(file);
        toast.success('Imagem comprimida para otimizar carregamento');
      }

      // Gerar nome único se não fornecido
      const fileExt = file.name.split('.').pop();
      const uploadFileName = fileName || `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      // Construir caminho
      const folder = opts.folder ? `${opts.folder}/` : '';
      const filePath = `${folder}${uploadFileName}`;

      // Simular progresso (Supabase não tem progress nativo)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev && prev.percentage < 90) {
            const newPercentage = prev.percentage + Math.random() * 10;
            return {
              loaded: (newPercentage / 100) * file.size,
              total: file.size,
              percentage: Math.min(newPercentage, 90)
            };
          }
          return prev;
        });
      }, 200);

      // Upload para Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(opts.bucket)
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública
      const { data } = supabase.storage
        .from(opts.bucket)
        .getPublicUrl(filePath);

      // Gerar thumbnail se solicitado
      let thumbnail: string | undefined;
      if (opts.generateThumbnail) {
        thumbnail = (await generateThumbnail(file)) || undefined;
      }

      setProgress({ loaded: file.size, total: file.size, percentage: 100 });

      const result: FileUploadResult = {
        url: data.publicUrl,
        path: filePath,
        file: fileToUpload,
        thumbnail
      };

      toast.success('Arquivo enviado com sucesso!');
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no upload';
      setError(errorMessage);
      toast.error(`Erro no upload: ${errorMessage}`);
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(null), 1000);
    }
  }, [validateFile, opts, compressImage, generateThumbnail]);

  // Upload múltiplo
  const uploadMultiple = useCallback(async (
    files: File[]
  ): Promise<FileUploadResult[]> => {
    const results: FileUploadResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await uploadFile(file);
      if (result) {
        results.push(result);
      }
    }

    return results;
  }, [uploadFile]);

  // Deletar arquivo
  const deleteFile = useCallback(async (filePath: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from(opts.bucket)
        .remove([filePath]);

      if (error) {
        throw error;
      }

      toast.success('Arquivo removido com sucesso');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover arquivo';
      toast.error(`Erro ao remover: ${errorMessage}`);
      return false;
    }
  }, [opts.bucket]);

  return {
    uploading,
    progress,
    error,
    uploadFile,
    uploadMultiple,
    deleteFile,
    validateFile
  };
}; 