import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AssessmentSender } from './AssessmentSender';
import { 
  Search, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  User, 
  Calendar,
  ArrowUpDown,
  Eye
} from 'lucide-react';

interface AssignmentStatus {
  pending: string;
  completed: string;
  expired: string;
  cancelled: string;
}

const STATUS_LABELS: AssignmentStatus = {
  pending: 'Pendente',
  completed: 'Concluído',
  expired: 'Expirado',
  cancelled: 'Cancelado'
};

const STATUS_COLORS: AssignmentStatus = {
  pending: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50',
  completed: 'bg-green-500/20 text-green-700 border-green-500/50',
  expired: 'bg-red-500/20 text-red-700 border-red-500/50',
  cancelled: 'bg-gray-500/20 text-gray-700 border-gray-500/50'
};

interface Assignment {
  id: string;
  user_id: string;
  tool_id: string;
  status: keyof AssignmentStatus;
  created_at: string;
  due_date: string | null;
  instructions: string | null;
  user_name?: string;
  user_email?: string;
  tool_name?: string;
  result_id?: string;
  completed_at?: string;
}

export const AssessmentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('assignments');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Assignment>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<(keyof AssignmentStatus)[]>([]);
  
  const { toast } = useToast();
  
  // Carregar avaliações
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        
        // Buscar avaliações do banco de dados
        const { data, error } = await supabase
          .from('assessment_assignments')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Erro ao carregar avaliações:', error);
          throw error;
        }
        
        // Buscar dados dos usuários e ferramentas separadamente
        const userIds = [...new Set(data?.map(item => item.user_id) || [])];
        const toolIds = [...new Set(data?.map(item => item.tool_id) || [])];
        
        // Buscar perfis dos usuários
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);
          
        if (profilesError) {
          console.error('Erro ao carregar perfis:', profilesError);
        }
        
        // Buscar ferramentas
        const { data: tools, error: toolsError } = await supabase
          .from('coaching_tools')
          .select('id, name')
          .in('id', toolIds);
          
        if (toolsError) {
          console.error('Erro ao carregar ferramentas:', toolsError);
        }
        
        // Formatar dados
        const formattedAssignments = data?.map(item => {
          const profile = profiles?.find(p => p.id === item.user_id);
          const tool = tools?.find(t => t.id === item.tool_id);
          
          return {
            id: item.id,
            user_id: item.user_id,
            tool_id: item.tool_id,
            status: item.status,
            created_at: item.created_at,
            due_date: item.due_date,
            instructions: item.instructions,
            user_name: profile?.full_name,
            user_email: profile?.email,
            tool_name: tool?.name,
            result_id: item.result_id,
            completed_at: item.completed_at
          };
        }) || [];
        
        console.log('Atribuições carregadas:', formattedAssignments.length);
        setAssignments(formattedAssignments);
      } catch (err) {
        console.error('Erro ao carregar avaliações:', err);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as avaliações',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssignments();
  }, [toast]);
  
  // Filtrar avaliações
  const filteredAssignments = assignments.filter(assignment => {
    // Filtrar por status
    if (statusFilter.length > 0 && !statusFilter.includes(assignment.status)) {
      return false;
    }
    
    // Filtrar por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (assignment.user_name && assignment.user_name.toLowerCase().includes(query)) ||
        (assignment.user_email && assignment.user_email.toLowerCase().includes(query)) ||
        (assignment.tool_name && assignment.tool_name.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Ordenar avaliações
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];
    
    if (fieldA === null || fieldA === undefined) return sortDirection === 'asc' ? -1 : 1;
    if (fieldB === null || fieldB === undefined) return sortDirection === 'asc' ? 1 : -1;
    
    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sortDirection === 'asc'
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }
    
    return sortDirection === 'asc'
      ? (fieldA > fieldB ? 1 : -1)
      : (fieldA < fieldB ? 1 : -1);
  });
  
  // Alternar ordenação
  const toggleSort = (field: keyof Assignment) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Alternar filtro de status
  const toggleStatusFilter = (status: keyof AssignmentStatus) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter(s => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };
  
  // Cancelar avaliação
  const handleCancelAssignment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('assessment_assignments')
        .update({ status: 'cancelled' })
        .eq('id', id);
        
      if (error) throw error;
      
      // Atualizar lista
      setAssignments(assignments.map(assignment => 
        assignment.id === id
          ? { ...assignment, status: 'cancelled' }
          : assignment
      ));
      
      toast({
        title: 'Sucesso',
        description: 'Avaliação cancelada com sucesso',
        variant: 'default'
      });
    } catch (err) {
      console.error('Erro ao cancelar avaliação:', err);
      toast({
        title: 'Erro',
        description: 'Não foi possível cancelar a avaliação',
        variant: 'destructive'
      });
    }
  };
  
  // Reenviar avaliação
  const handleResendAssignment = async (id: string) => {
    try {
      const assignment = assignments.find(a => a.id === id);
      if (!assignment) return;
      
      // Criar nova avaliação com os mesmos dados
      const { error } = await supabase
        .from('assessment_assignments')
        .insert({
          user_id: assignment.user_id,
          tool_id: assignment.tool_id,
          instructions: assignment.instructions,
          due_date: assignment.due_date,
          status: 'pending',
          created_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      toast({
        title: 'Sucesso',
        description: 'Avaliação reenviada com sucesso',
        variant: 'default'
      });
      
      // Recarregar lista
      window.location.reload();
    } catch (err) {
      console.error('Erro ao reenviar avaliação:', err);
      toast({
        title: 'Erro',
        description: 'Não foi possível reenviar a avaliação',
        variant: 'destructive'
      });
    }
  };
  
  // Visualizar resultado
  const handleViewResult = (resultId: string) => {
    window.open(`/assessment/results/${resultId}`, '_blank');
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="assignments">
            <FileText className="h-4 w-4 mr-2" />
            Avaliações Enviadas
          </TabsTrigger>
          <TabsTrigger value="send">
            <Send className="h-4 w-4 mr-2" />
            Enviar Nova Avaliação
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Avaliações</CardTitle>
              <CardDescription>
                Visualize e gerencie as avaliações enviadas para os usuários
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Filtros */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, email ou ferramenta"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(STATUS_LABELS) as Array<keyof AssignmentStatus>).map(status => (
                    <Badge
                      key={status}
                      variant="outline"
                      className={`cursor-pointer ${statusFilter.includes(status) ? STATUS_COLORS[status] : ''}`}
                      onClick={() => toggleStatusFilter(status)}
                    >
                      {STATUS_LABELS[status]}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Tabela de avaliações */}
              <div className="border rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th 
                          className="px-4 py-3 text-left text-sm font-medium cursor-pointer"
                          onClick={() => toggleSort('user_name')}
                        >
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            Usuário
                            {sortField === 'user_name' && (
                              <ArrowUpDown className={`h-3 w-3 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-sm font-medium cursor-pointer"
                          onClick={() => toggleSort('tool_name')}
                        >
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            Ferramenta
                            {sortField === 'tool_name' && (
                              <ArrowUpDown className={`h-3 w-3 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-sm font-medium cursor-pointer"
                          onClick={() => toggleSort('created_at')}
                        >
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Enviado em
                            {sortField === 'created_at' && (
                              <ArrowUpDown className={`h-3 w-3 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-sm font-medium cursor-pointer"
                          onClick={() => toggleSort('status')}
                        >
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Status
                            {sortField === 'status' && (
                              <ArrowUpDown className={`h-3 w-3 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                            )}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    
                    <tbody className="divide-y">
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center">
                            <div className="flex items-center justify-center">
                              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                              <span>Carregando avaliações...</span>
                            </div>
                          </td>
                        </tr>
                      ) : sortedAssignments.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                            {searchQuery || statusFilter.length > 0
                              ? 'Nenhuma avaliação encontrada com os filtros atuais'
                              : 'Nenhuma avaliação enviada ainda'}
                          </td>
                        </tr>
                      ) : (
                        sortedAssignments.map(assignment => (
                          <tr key={assignment.id} className="hover:bg-muted/50">
                            <td className="px-4 py-4">
                              <div className="flex flex-col">
                                <span className="font-medium">{assignment.user_name || 'Sem nome'}</span>
                                <span className="text-sm text-muted-foreground">{assignment.user_email}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span>{assignment.tool_name}</span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col">
                                <span>{new Date(assignment.created_at).toLocaleDateString('pt-BR')}</span>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(assignment.created_at).toLocaleTimeString('pt-BR')}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <Badge
                                className={STATUS_COLORS[assignment.status]}
                                variant="outline"
                              >
                                {STATUS_LABELS[assignment.status]}
                              </Badge>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                {assignment.status === 'completed' && assignment.result_id && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewResult(assignment.result_id!)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                )}
                                
                                {assignment.status === 'pending' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCancelAssignment(assignment.id)}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                )}
                                
                                {(assignment.status === 'expired' || assignment.status === 'cancelled') && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleResendAssignment(assignment.id)}
                                  >
                                    <Send className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="send">
          <AssessmentSender />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 