import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  DollarSign,
  Tag,
  ToggleLeft,
  ToggleRight,
  SortAsc,
  SortDesc
} from 'lucide-react';

export interface CourseFilters {
  search: string;
  category: string;
  status: string; // all, active, inactive
  priceRange: string; // all, free, paid, low, mid, high
  dateFrom: string;
  dateTo: string;
  sortBy: string; // created_at, title, price, updated_at
  sortOrder: 'asc' | 'desc';
}

interface CourseFiltersProps {
  filters: CourseFilters;
  onFiltersChange: (filters: CourseFilters) => void;
  totalCourses: number;
  filteredCourses: number;
  className?: string;
}

const CATEGORIES = [
  { value: 'all', label: 'Todas as categorias' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'nutrition', label: 'Nutrição' },
  { value: 'mindfulness', label: 'Mindfulness' },
  { value: 'psychology', label: 'Psicologia' },
  { value: 'wellness', label: 'Bem-estar' },
  { value: 'pilates', label: 'Pilates' }
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos os status' },
  { value: 'active', label: 'Apenas ativos' },
  { value: 'inactive', label: 'Apenas inativos' }
];

const PRICE_RANGES = [
  { value: 'all', label: 'Todos os preços' },
  { value: 'free', label: 'Gratuitos (R$ 0)' },
  { value: 'low', label: 'Baixo (R$ 1-50)' },
  { value: 'mid', label: 'Médio (R$ 51-100)' },
  { value: 'high', label: 'Alto (R$ 100+)' }
];

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Data de criação' },
  { value: 'updated_at', label: 'Última atualização' },
  { value: 'title', label: 'Título (A-Z)' },
  { value: 'price', label: 'Preço' }
];

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  filters,
  onFiltersChange,
  totalCourses,
  filteredCourses,
  className
}) => {
  const updateFilter = (key: keyof CourseFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category: 'all',
      status: 'all',
      priceRange: 'all',
      dateFrom: '',
      dateTo: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.status !== 'all' ||
    filters.priceRange !== 'all' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '';

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.priceRange !== 'all') count++;
    if (filters.dateFrom || filters.dateTo) count++;
    return count;
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        {/* Header com estatísticas */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <div>
              <h3 className="font-semibold text-gray-900">Filtros de Cursos</h3>
              <p className="text-sm text-gray-500">
                {filteredCourses} de {totalCourses} cursos
                {hasActiveFilters && (
                  <span className="ml-2">
                    • {getActiveFiltersCount()} filtro(s) ativo(s)
                  </span>
                )}
              </p>
            </div>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600"
            >
              <X className="w-4 h-4 mr-1" />
              Limpar Filtros
            </Button>
          )}
        </div>

        {/* Filtros principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Busca por texto */}
          <div className="space-y-2">
            <Label htmlFor="search">Buscar cursos</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="search"
                placeholder="Título, descrição..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filtro por categoria */}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  {filters.status === 'active' ? (
                    <ToggleRight className="w-4 h-4 text-green-500" />
                  ) : filters.status === 'inactive' ? (
                    <ToggleLeft className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ToggleLeft className="w-4 h-4" />
                  )}
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por faixa de preço */}
          <div className="space-y-2">
            <Label>Faixa de Preço</Label>
            <Select value={filters.priceRange} onValueChange={(value) => updateFilter('priceRange', value)}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {PRICE_RANGES.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtros avançados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Período de criação */}
          <div className="space-y-2">
            <Label>Data de Início</Label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => updateFilter('dateFrom', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Data de Fim</Label>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => updateFilter('dateTo', e.target.value)}
            />
          </div>

          {/* Ordenação */}
          <div className="space-y-2">
            <Label>Ordenar por</Label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Direção da ordenação */}
          <div className="space-y-2">
            <Label>Direção</Label>
            <Select value={filters.sortOrder} onValueChange={(value: 'asc' | 'desc') => updateFilter('sortOrder', value)}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  {filters.sortOrder === 'asc' ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  )}
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Decrescente</SelectItem>
                <SelectItem value="asc">Crescente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tags de filtros ativos */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Filtros ativos:</span>
              
              {filters.search && (
                <Badge variant="secondary" className="gap-1">
                  Busca: "{filters.search}"
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => updateFilter('search', '')}
                  />
                </Badge>
              )}
              
              {filters.category !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {CATEGORIES.find(c => c.value === filters.category)?.label}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => updateFilter('category', 'all')}
                  />
                </Badge>
              )}
              
              {filters.status !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {STATUS_OPTIONS.find(s => s.value === filters.status)?.label}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => updateFilter('status', 'all')}
                  />
                </Badge>
              )}
              
              {filters.priceRange !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {PRICE_RANGES.find(p => p.value === filters.priceRange)?.label}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => updateFilter('priceRange', 'all')}
                  />
                </Badge>
              )}
              
              {(filters.dateFrom || filters.dateTo) && (
                <Badge variant="secondary" className="gap-1">
                  <Calendar className="w-3 h-3" />
                  {filters.dateFrom && filters.dateTo 
                    ? `${filters.dateFrom} - ${filters.dateTo}`
                    : filters.dateFrom 
                      ? `A partir de ${filters.dateFrom}`
                      : `Até ${filters.dateTo}`
                  }
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => {
                      updateFilter('dateFrom', '');
                      updateFilter('dateTo', '');
                    }}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 