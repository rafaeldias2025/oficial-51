import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Crop, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface UploadThumbnailProps {
  type: 'course' | 'module' | 'lesson';
  aspectRatio: '16:9' | '4:3' | '1:1';
  maxSize: number; // em MB
  onUpload: (file: File, url: string) => void;
  currentImage?: string;
  className?: string;
}

export const UploadThumbnail: React.FC<UploadThumbnailProps> = ({
  type,
  aspectRatio,
  maxSize,
  onUpload,
  currentImage,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '16:9': return 'aspect-video';
      case '4:3': return 'aspect-[4/3]';
      case '1:1': return 'aspect-square';
      default: return 'aspect-video';
    }
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSizeBytes = maxSize * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setError('Formato de arquivo não suportado. Use JPG, PNG ou WebP.');
      return false;
    }

    if (file.size > maxSizeBytes) {
      setError(`Arquivo muito grande. Máximo ${maxSize}MB.`);
      return false;
    }

    setError(null);
    return true;
  };

  const processImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calcular dimensões mantendo proporção
        let { width, height } = img;
        const targetRatio = aspectRatio === '16:9' ? 16/9 : aspectRatio === '4:3' ? 4/3 : 1;

        if (width / height > targetRatio) {
          height = width / targetRatio;
        } else {
          width = height * targetRatio;
        }

        canvas.width = width;
        canvas.height = height;

        // Desenhar imagem centralizada
        ctx.drawImage(img, 0, 0, width, height);

        // Converter para WebP com compressão
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          }
        }, 'image/webp', 0.8);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Processar imagem
      const processedUrl = await processImage(file);
      
      // Simular upload para servidor
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadProgress(100);
      setPreview(processedUrl);
      onUpload(file, processedUrl);
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);

    } catch (err) {
      setError('Erro ao processar imagem. Tente novamente.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onUpload(new File([], ''), '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={dropRef}
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all duration-200
          ${isDragging ? 'border-brand-500 bg-brand-50' : 'border-gray-300'}
          ${preview ? 'bg-gray-50' : 'bg-white'}
          ${isUploading ? 'pointer-events-none opacity-75' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className={`w-full ${getAspectRatioClass()} object-cover rounded-lg`}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto w-12 h-12 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload de Thumbnail
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Arraste uma imagem ou clique para selecionar
            </p>
            <div className="text-xs text-gray-400 mb-4">
              Formatos: JPG, PNG, WebP • Máximo: {maxSize}MB • Proporção: {aspectRatio}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Selecionar Imagem
            </Button>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Processando imagem...</p>
              <Progress value={uploadProgress} className="w-32 mt-2" />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}; 