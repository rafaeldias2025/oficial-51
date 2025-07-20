import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Send, Users, Calendar, Clock, FileText } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface Tool {
  id: string;
  name: string;
  description?: string;
  total_questions: number;
  estimated_time: number;
}

export const AssessmentSender: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [loadingTools, setLoadingTools] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const { toast } = useToast();
  
  // Carregar usuários
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        
        // Buscar usuários do banco de dados
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .order('full_name', { ascending: true });
          
        if (error) throw error;
        
        const formattedUsers = data.map(user => ({
          id: user.id,
          email: user.email,
          name: user.full_name
        }));
        
        setUsers(formattedUsers);
      } catch (err) {
        console.error('Erro ao carregar usuários:', err);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar a lista de usuários',
          variant: 'destructive'
        });
      } finally {
        setLoadingUsers(false);
      }
    };
    
    fetchUsers();
  }, [toast]);
  
  // Carregar ferramentas
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoadingTools(true);
        
        // Buscar ferramentas do banco de dados
        const { data, error } = await supabase
          .from('coaching_tools')
          .select('id, name, description, total_questions, estimated_time')
          .order('name', { ascending: true });
          
        if (error) {
          console.error('Erro ao carregar ferramentas:', error);
          throw error;
        }
        
        console.log('Ferramentas carregadas:', data?.length || 0);
        setTools(data || []);
      } catch (err) {
        console.error('Erro ao carregar ferramentas:', err);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar a lista de ferramentas',
          variant: 'destructive'
        });
      } finally {
        setLoadingTools(false);
      }
    };
    
    fetchTools();
  }, [toast]);
  
  // Filtrar usuários por busca
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(query)) ||
      user.email.toLowerCase().includes(query)
    );
  });
  
  // Selecionar/deselecionar usuário
  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };
  
  // Selecionar todos os usuários filtrados
  const selectAllFilteredUsers = () => {
    const filteredUserIds = filteredUsers.map(user => user.id);
    setSelectedUsers(filteredUserIds);
  };
  
  // Deselecionar todos os usuários
  const deselectAllUsers = () => {
    setSelectedUsers([]);
  };
  
  // Enviar avaliação para usuários selecionados
  const handleSendAssessment = async () => {
    // Validar formulário
    if (selectedUsers.length === 0) {
      toast({
        title: 'Erro',
        description: 'Selecione pelo menos um usuário',
        variant: 'destructive'
      });
      return;
    }
    
    if (!selectedTool) {
      toast({
        title: 'Erro',
        description: 'Selecione uma ferramenta de avaliação',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Preparar dados para inserção
      const now = new Date().toISOString();
      const assignments = selectedUsers.map(userId => ({
        user_id: userId,
        tool_id: selectedTool,
        instructions: instructions,
        due_date: dueDate || null,
        status: 'pending',
        created_at: now,
        updated_at: now
      }));
      
      // Inserir no banco de dados
      const { error } = await supabase
        .from('assessment_assignments')
        .insert(assignments);
        
      if (error) throw error;
      
      toast({
        title: 'Sucesso',
        description: `Avaliação enviada para ${selectedUsers.length} usuário(s)`,
        variant: 'default'
      });
      
      // Resetar formulário
      setSelectedUsers([]);
      setSelectedTool('');
      setInstructions('');
      setDueDate('');
    } catch (err) {
      console.error('Erro ao enviar avaliação:', err);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a avaliação',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Obter detalhes da ferramenta selecionada
  const selectedToolDetails = tools.find(tool => tool.id === selectedTool);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Enviar Avaliação para Usuários</CardTitle>
          <CardDescription>
            Selecione os usuários e a ferramenta de avaliação para enviar
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Seleção de ferramenta */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">1. Selecione a ferramenta de avaliação</h3>
            
            <Select value={selectedTool} onValueChange={setSelectedTool}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma ferramenta" />
              </SelectTrigger>
              <SelectContent>
                {loadingTools ? (
                  <div className="flex items-center justify-center p-2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                    <span>Carregando...</span>
                  </div>
                ) : tools.length === 0 ? (
                  <div className="p-2 text-center text-muted-foreground">
                    Nenhuma ferramenta encontrada
                  </div>
                ) : (
                  tools.map(tool => (
                    <SelectItem key={tool.id} value={tool.id}>
                      {tool.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            
            {selectedToolDetails && (
              <div className="bg-muted/40 p-4 rounded-md">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedToolDetails.total_questions} perguntas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Aprox. {selectedToolDetails.estimated_time} minutos</span>
                  </div>
                </div>
                {selectedToolDetails.description && (
                  <p className="mt-2 text-muted-foreground">{selectedToolDetails.description}</p>
                )}
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* Instruções e data limite */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">2. Configurar detalhes</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="instructions">Instruções (opcional)</Label>
                <Textarea
                  id="instructions"
                  placeholder="Instruções para os usuários"
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div>
                <Label htmlFor="dueDate">Data limite (opcional)</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Seleção de usuários */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">3. Selecione os usuários</h3>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={selectAllFilteredUsers}
                  disabled={filteredUsers.length === 0}
                >
                  Selecionar todos
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={deselectAllUsers}
                  disabled={selectedUsers.length === 0}
                >
                  Limpar seleção
                </Button>
              </div>
            </div>
            
            <div>
              <div className="relative">
                <Input
                  placeholder="Buscar usuários por nome ou email"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="mt-2 text-sm text-muted-foreground">
                {selectedUsers.length} usuário(s) selecionado(s)
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto">
                {loadingUsers ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                    <span>Carregando usuários...</span>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    {searchQuery ? 'Nenhum usuário encontrado' : 'Nenhum usuário disponível'}
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredUsers.map(user => (
                      <div key={user.id} className="p-3 hover:bg-muted/50">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`user-${user.id}`}
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => toggleUserSelection(user.id)}
                          />
                          <Label
                            htmlFor={`user-${user.id}`}
                            className="flex flex-col cursor-pointer flex-1"
                          >
                            <span className="font-medium">{user.name || 'Sem nome'}</span>
                            <span className="text-sm text-muted-foreground">{user.email}</span>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancelar</Button>
          <Button 
            onClick={handleSendAssessment}
            disabled={loading || selectedUsers.length === 0 || !selectedTool}
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar avaliação
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}; 