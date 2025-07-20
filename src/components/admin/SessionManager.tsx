import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Calendar, Users, Clock, Play, CheckCircle, XCircle, Pause, BarChart3, UserCheck, CalendarPlus, Filter, Search } from 'lucide-react';
import { useSessions } from '@/hooks/useSessions';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import type { CoachingSession, CreateSessionRequest, SessionFilters } from '@/types/sessions';

interface User {
  id: string;
  email: string;
  full_name?: string;
}

export const SessionManager = () => {
  console.log('SessionManager component rendering');
  
  const { 
    sessions, 
    tools, 
    stats, 
    loading, 
    error, 
    createSession, 
    updateSession, 
    deleteSession,
    loadSessions,
    clearError 
  } = useSessions();
  
  const { isAdmin } = useAdminAuth();
  console.log('isAdmin:', isAdmin);
  console.log('sessions:', sessions);
  console.log('tools:', tools);
  console.log('loading:', loading);
  console.log('error:', error);
  
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<SessionFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para criar sessão
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateSessionRequest>({
    user_id: '',
    tool_id: 0,
    scheduled_date: '',
    instructions: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  // Carregar usuários disponíveis
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .order('full_name', { ascending: true });

        if (error) throw error;
        setUsers(data || []);
        console.log('Users loaded:', data);
      } catch (err) {
        console.error('Erro ao carregar usuários:', err);
      }
    };

    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  // Filtrar sessões
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = !searchTerm || 
      session.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.tool?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Recarregar sessões quando filtros mudarem
  const handleFiltersChange = (newFilters: SessionFilters) => {
    setFilters(newFilters);
    loadSessions(newFilters);
  };

  // Função para criar sessão
  const handleCreateSession = async () => {
    if (!createForm.user_id || !createForm.tool_id || !createForm.scheduled_date) {
      return;
    }

    setIsCreating(true);
    const success = await createSession(createForm);
    
    if (success) {
      setIsCreateModalOpen(false);
      setCreateForm({
        user_id: '',
        tool_id: 0,
        scheduled_date: '',
        instructions: ''
      });
    }
    setIsCreating(false);
  };

  // Função para atualizar status da sessão
  const handleUpdateStatus = async (sessionId: number, status: string) => {
    await updateSession(sessionId, { status: status as any });
  };

  // Função para deletar sessão
  const handleDeleteSession = async (sessionId: number) => {
    await deleteSession(sessionId);
  };

  // Função para obter cor do badge baseado no status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'outline';
      case 'in_progress': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  // Função para obter ícone baseado no status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <Play className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Pause className="h-4 w-4" />;
    }
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (!isAdmin) {
    console.log('User is not admin, showing restricted access message');
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Acesso restrito a administradores
          </p>
        </CardContent>
      </Card>
    );
  }

  console.log('Rendering SessionManager content');
  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Sessões</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_sessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.pending_sessions || 0} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completed_sessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.completion_rate?.toFixed(1) || 0}% taxa de conclusão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
            <p className="text-xs text-muted-foreground">
              Participando de sessões
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ferramentas Disponíveis</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tools.length}</div>
            <p className="text-xs text-muted-foreground">
              Ferramentas de coaching
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controles de busca e filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gerenciar Sessões</CardTitle>
              <CardDescription>
                Visualize e gerencie todas as sessões de coaching
              </CardDescription>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Nova Sessão
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Criar Nova Sessão</DialogTitle>
                  <DialogDescription>
                    Agende uma nova sessão de coaching para um usuário
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="user">Usuário</Label>
                    <Select
                      value={createForm.user_id}
                      onValueChange={(value) => setCreateForm({ ...createForm, user_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um usuário" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.full_name || user.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tool">Ferramenta</Label>
                    <Select
                      value={createForm.tool_id.toString()}
                      onValueChange={(value) => setCreateForm({ ...createForm, tool_id: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma ferramenta" />
                      </SelectTrigger>
                      <SelectContent>
                        {tools.map((tool) => (
                          <SelectItem key={tool.id} value={tool.id.toString()}>
                            {tool.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Data Agendada</Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={createForm.scheduled_date}
                      onChange={(e) => setCreateForm({ ...createForm, scheduled_date: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="instructions">Instruções</Label>
                    <Textarea
                      id="instructions"
                      placeholder="Instruções específicas para a sessão..."
                      value={createForm.instructions}
                      onChange={(e) => setCreateForm({ ...createForm, instructions: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateSession} disabled={isCreating}>
                    {isCreating ? 'Criando...' : 'Criar Sessão'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Barra de busca */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar sessões..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Lista de sessões */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Carregando sessões...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive">{error}</p>
              <Button onClick={clearError} className="mt-2">
                Tentar Novamente
              </Button>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma sessão encontrada</p>
              <p className="text-sm text-muted-foreground mt-1">
                Crie uma nova sessão para começar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(session.status)}
                          <Badge variant={getStatusBadgeVariant(session.status)}>
                            {session.status === 'pending' && 'Pendente'}
                            {session.status === 'in_progress' && 'Em Andamento'}
                            {session.status === 'completed' && 'Concluída'}
                            {session.status === 'cancelled' && 'Cancelada'}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {session.user?.full_name || session.user?.email || 'Usuário desconhecido'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {session.tool?.name} • {formatDate(session.scheduled_date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(session.id, 'in_progress')}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Iniciar
                          </Button>
                        )}
                        {session.status === 'in_progress' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUpdateStatus(session.id, 'completed')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Concluir
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta sessão? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteSession(session.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 