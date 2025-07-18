import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Trash2, 
  Archive, 
  Eye, 
  EyeOff, 
  Tag, 
  DollarSign,
  CheckSquare,
  X
} from 'lucide-react';
import { Course } from '@/hooks/useCourses';
import { toast } from 'sonner';

interface CourseBulkActionsProps {
  selectedCourses: Course[];
  onClearSelection: () => void;
  onBulkUpdate: (action: string, data?: Record<string, unknown>) => Promise<void>;
  className?: string;
}

export const CourseBulkActions: React.FC<CourseBulkActionsProps> = ({
  selectedCourses,
  onClearSelection,
  onBulkUpdate,
  className
}) => {
  const [isPerformingAction, setIsPerformingAction] = useState(false);

  const selectedCount = selectedCourses.length;

  // Estatísticas rápidas
  const activeCount = selectedCourses.filter(c => c.is_active).length;
  const inactiveCount = selectedCount - activeCount;
  const categories = [...new Set(selectedCourses.map(c => c.category))];
  const totalValue = selectedCourses.reduce((sum, c) => sum + (c.price || 0), 0);

  // Ação de ativação/desativação em massa
  const handleToggleActive = async (activate: boolean) => {
    try {
      setIsPerformingAction(true);
      await onBulkUpdate('toggle_active', { is_active: activate });
      toast.success(`${selectedCount} curso(s) ${activate ? 'ativado(s)' : 'desativado(s)'} com sucesso`);
    } catch (error) {
      toast.error('Erro ao atualizar cursos');
    } finally {
      setIsPerformingAction(false);
    }
  };

  // Ação de atualização de categoria em massa
  const handleUpdateCategory = async (category: string) => {
    try {
      setIsPerformingAction(true);
      await onBulkUpdate('update_category', { category });
      toast.success(`Categoria atualizada para ${selectedCount} curso(s)`);
    } catch (error) {
      toast.error('Erro ao atualizar categoria');
    } finally {
      setIsPerformingAction(false);
    }
  };

  // Ação de atualização de preço em massa
  const handleUpdatePrice = async (price: number) => {
    try {
      setIsPerformingAction(true);
      await onBulkUpdate('update_price', { price });
      toast.success(`Preço atualizado para ${selectedCount} curso(s)`);
    } catch (error) {
      toast.error('Erro ao atualizar preço');
    } finally {
      setIsPerformingAction(false);
    }
  };

  // Ação de exclusão em massa
  const handleBulkDelete = async () => {
    try {
      setIsPerformingAction(true);
      await onBulkUpdate('delete');
      toast.success(`${selectedCount} curso(s) excluído(s) com sucesso`);
      onClearSelection();
    } catch (error) {
      toast.error('Erro ao excluir cursos');
    } finally {
      setIsPerformingAction(false);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900">
              {selectedCount} curso(s) selecionado(s)
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-blue-600 hover:text-blue-800"
          >
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        </div>

        {/* Estatísticas rápidas */}
        <div className="flex gap-2">
          {activeCount > 0 && (
            <Badge variant="default" className="bg-green-500">
              {activeCount} ativo(s)
            </Badge>
          )}
          {inactiveCount > 0 && (
            <Badge variant="secondary">
              {inactiveCount} inativo(s)
            </Badge>
          )}
          {categories.length > 0 && (
            <Badge variant="outline">
              {categories.length} categoria(s)
            </Badge>
          )}
          {totalValue > 0 && (
            <Badge variant="outline">
              R$ {totalValue.toFixed(2)}
            </Badge>
          )}
        </div>
      </div>

      {/* Ações em massa */}
      <div className="flex flex-wrap gap-3">
        {/* Toggle Ativo/Inativo */}
        <div className="flex gap-1">
          {inactiveCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleToggleActive(true)}
              disabled={isPerformingAction}
              className="text-green-600 border-green-300 hover:bg-green-50"
            >
              <Eye className="w-4 h-4 mr-1" />
              Ativar ({inactiveCount})
            </Button>
          )}
          
          {activeCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleToggleActive(false)}
              disabled={isPerformingAction}
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              <EyeOff className="w-4 h-4 mr-1" />
              Desativar ({activeCount})
            </Button>
          )}
        </div>

        {/* Alterar categoria */}
        <Select onValueChange={handleUpdateCategory} disabled={isPerformingAction}>
          <SelectTrigger className="w-40">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <SelectValue placeholder="Categoria" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fitness">Fitness</SelectItem>
            <SelectItem value="nutrition">Nutrição</SelectItem>
            <SelectItem value="mindfulness">Mindfulness</SelectItem>
            <SelectItem value="psychology">Psicologia</SelectItem>
            <SelectItem value="wellness">Bem-estar</SelectItem>
            <SelectItem value="pilates">Pilates</SelectItem>
          </SelectContent>
        </Select>

        {/* Alterar preço */}
        <Select onValueChange={(value) => handleUpdatePrice(parseFloat(value))} disabled={isPerformingAction}>
          <SelectTrigger className="w-32">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <SelectValue placeholder="Preço" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Gratuito</SelectItem>
            <SelectItem value="29.90">R$ 29,90</SelectItem>
            <SelectItem value="49.90">R$ 49,90</SelectItem>
            <SelectItem value="79.90">R$ 79,90</SelectItem>
            <SelectItem value="99.90">R$ 99,90</SelectItem>
            <SelectItem value="149.90">R$ 149,90</SelectItem>
            <SelectItem value="199.90">R$ 199,90</SelectItem>
          </SelectContent>
        </Select>

        {/* Exportar selecionados */}
        <Button
          size="sm"
          variant="outline"
          disabled={isPerformingAction}
          onClick={() => {
            // Implementar exportação CSV/Excel dos cursos selecionados
            const csvData = selectedCourses.map(course => ({
              id: course.id,
              title: course.title,
              category: course.category,
              price: course.price,
              active: course.is_active ? 'Sim' : 'Não',
              created_at: course.created_at
            }));
            
            const csvContent = [
              ['ID', 'Título', 'Categoria', 'Preço', 'Ativo', 'Criado em'],
              ...csvData.map(row => Object.values(row))
            ].map(row => row.join(',')).join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `cursos-selecionados-${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            URL.revokeObjectURL(url);
            
            toast.success('Cursos exportados com sucesso');
          }}
        >
          📊 Exportar
        </Button>

        {/* Excluir em massa */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="destructive"
              disabled={isPerformingAction}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Excluir ({selectedCount})
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão em massa</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir {selectedCount} curso(s) selecionado(s)? 
                Esta ação não pode ser desfeita e irá remover:
                <br /><br />
                <ul className="list-disc list-inside space-y-1">
                  <li>{selectedCount} curso(s)</li>
                  <li>Todos os módulos associados</li>
                  <li>Todas as aulas associadas</li>
                  <li>Todo o progresso dos usuários</li>
                </ul>
                <br />
                <strong>Cursos a serem excluídos:</strong>
                <ul className="list-disc list-inside text-sm mt-2 max-h-32 overflow-y-auto">
                  {selectedCourses.map(course => (
                    <li key={course.id}>{course.title}</li>
                  ))}
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir {selectedCount} Curso(s)
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Resumo da seleção */}
      {selectedCourses.length > 0 && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Cursos selecionados:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCourses.slice(0, 5).map(course => (
              <Badge key={course.id} variant="outline" className="text-xs">
                {course.title}
              </Badge>
            ))}
            {selectedCourses.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{selectedCourses.length - 5} mais
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 