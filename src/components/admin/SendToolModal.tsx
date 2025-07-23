import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarIcon, Check, Loader2, Mail, MessageSquare, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { CoachingTool } from '@/types/sessions';

interface SendToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: CoachingTool | null;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

export const SendToolModal: React.FC<SendToolModalProps> = ({ isOpen, onClose, tool }) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [customMessage, setCustomMessage] = useState('');
  const [notificationOptions, setNotificationOptions] = useState({
    email: true,
    sms: false,
    whatsapp: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isOpen) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url')
          .order('full_name');
        
        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar a lista de usuários.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen, toast]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllFilteredUsers = () => {
    const filteredUserIds = filteredUsers.map(user => user.id);
    
    if (filteredUserIds.every(id => selectedUsers.includes(id))) {
      // If all filtered users are already selected, deselect them
      setSelectedUsers(prev => prev.filter(id => !filteredUserIds.includes(id)));
    } else {
      // Otherwise, add all filtered users to selection
      setSelectedUsers(prev => {
        const newSelection = [...prev];
        filteredUserIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendTool = async () => {
    if (!tool) return;
    if (selectedUsers.length === 0) {
      toast({
        title: 'Erro',
        description: 'Selecione pelo menos um usuário.',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!adminProfile) throw new Error('Perfil de administrador não encontrado');

      const toolAssignments = selectedUsers.map(userId => ({
        user_id: userId,
        tool_id: tool.id,
        assigned_by: adminProfile.id,
        status: 'pending',
        scheduled_date: isScheduled && scheduledDate ? scheduledDate.toISOString() : null,
        custom_message: customMessage || null,
        email_sent: notificationOptions.email,
        sms_sent: notificationOptions.sms,
        whatsapp_sent: notificationOptions.whatsapp
      }));

      // TODO: Implementar inserção na tabela user_tools quando ela for criada
      // const { error } = await supabase
      //   .from('user_tools')
      //   .insert(toolAssignments);

      // if (error) throw error;

      // Placeholder para lógica real de envio de notificações
      if (notificationOptions.email) { console.log('Enviando emails para:', selectedUsers); }
      if (notificationOptions.sms) { console.log('Enviando SMS para:', selectedUsers); }
      if (notificationOptions.whatsapp) { console.log('Enviando WhatsApp para:', selectedUsers); }

      toast({
        title: 'Sucesso!',
        description: `Ferramenta enviada para ${selectedUsers.length} usuário(s).`,
        variant: 'default',
      });

      // Reset form and close modal
      setSelectedUsers([]);
      setSearchQuery('');
      setIsScheduled(false);
      setScheduledDate(undefined);
      setCustomMessage('');
      setNotificationOptions({ email: true, sms: false, whatsapp: false });
      onClose();
    } catch (error) {
      console.error('Erro ao enviar ferramenta:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a ferramenta. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-netflix-card border-netflix-border text-netflix-text max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-netflix-text">
            Enviar Ferramenta para Usuários
          </DialogTitle>
          <DialogDescription className="text-netflix-text-muted">
            {tool ? `Ferramenta: ${tool.name}` : 'Selecione os usuários para enviar a ferramenta.'}
          </DialogDescription>
        </DialogHeader>

        {/* Tool Info */}
        {tool && (
          <div className="bg-netflix-card/50 p-4 rounded-md border border-netflix-border mb-4">
            <h3 className="font-medium text-netflix-text">{tool.name}</h3>
            <p className="text-sm text-netflix-text-muted mt-1">{tool.description}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-netflix-red/20 text-netflix-red px-2 py-1 rounded">
                {tool.category}
              </span>
              <span className="text-xs bg-netflix-card text-netflix-text-muted px-2 py-1 rounded border border-netflix-border">
                {tool.total_questions} questões
              </span>
              <span className="text-xs bg-netflix-card text-netflix-text-muted px-2 py-1 rounded border border-netflix-border">
                {tool.estimated_time} min
              </span>
            </div>
          </div>
        )}

        {/* User Selection */}
        <div className="space-y-4 my-4">
          <div className="space-y-2">
            <Label htmlFor="search-users" className="text-netflix-text">Buscar Usuários</Label>
            <Input
              id="search-users"
              placeholder="Digite nome ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-netflix-card/50 border-netflix-border text-netflix-text"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="select-all" 
                checked={filteredUsers.length > 0 && filteredUsers.every(user => selectedUsers.includes(user.id))}
                onCheckedChange={selectAllFilteredUsers}
                className="border-netflix-border data-[state=checked]:bg-netflix-red"
              />
              <Label 
                htmlFor="select-all" 
                className="text-sm text-netflix-text cursor-pointer"
              >
                {filteredUsers.length > 0 && filteredUsers.every(user => selectedUsers.includes(user.id))
                  ? "Desmarcar todos"
                  : "Selecionar todos"}
              </Label>
            </div>
            <span className="text-sm text-netflix-text-muted">
              {selectedUsers.length} selecionado(s)
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 text-netflix-red animate-spin" />
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto border border-netflix-border rounded-md">
              {filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-netflix-text-muted">
                  Nenhum usuário encontrado
                </div>
              ) : (
                <div className="divide-y divide-netflix-border">
                  {filteredUsers.map((user) => (
                    <div 
                      key={user.id}
                      className={cn(
                        "flex items-center p-3 hover:bg-netflix-card/50 cursor-pointer",
                        selectedUsers.includes(user.id) && "bg-netflix-card/50"
                      )}
                      onClick={() => toggleUserSelection(user.id)}
                    >
                      <Checkbox 
                        checked={selectedUsers.includes(user.id)}
                        className="border-netflix-border data-[state=checked]:bg-netflix-red mr-3"
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-netflix-text truncate">{user.full_name}</p>
                        <p className="text-xs text-netflix-text-muted truncate">{user.email}</p>
                      </div>
                      {selectedUsers.includes(user.id) && (
                        <Check className="h-4 w-4 text-netflix-red flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Scheduling */}
        <div className="space-y-4 my-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="schedule" 
              checked={isScheduled}
              onCheckedChange={(checked) => setIsScheduled(!!checked)}
              className="border-netflix-border data-[state=checked]:bg-netflix-red"
            />
            <Label 
              htmlFor="schedule" 
              className="text-sm text-netflix-text cursor-pointer"
            >
              Agendar envio
            </Label>
          </div>

          {isScheduled && (
            <div className="pl-6">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-netflix-card/50 border-netflix-border text-netflix-text",
                      !scheduledDate && "text-netflix-text-muted"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-netflix-card border-netflix-border">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    initialFocus
                    className="bg-netflix-card text-netflix-text"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Custom Message */}
        <div className="space-y-2 my-4">
          <Label htmlFor="custom-message" className="text-netflix-text">Mensagem Personalizada (opcional)</Label>
          <Textarea
            id="custom-message"
            placeholder="Adicione uma mensagem personalizada para os usuários..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="bg-netflix-card/50 border-netflix-border text-netflix-text min-h-[100px]"
          />
        </div>

        {/* Notification Options */}
        <div className="space-y-3 my-4">
          <Label className="text-netflix-text">Opções de Notificação</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="email-notification" 
                checked={notificationOptions.email}
                onCheckedChange={(checked) => 
                  setNotificationOptions(prev => ({ ...prev, email: !!checked }))
                }
                className="border-netflix-border data-[state=checked]:bg-netflix-red"
              />
              <Label 
                htmlFor="email-notification" 
                className="text-sm text-netflix-text cursor-pointer flex items-center"
              >
                <Mail className="h-4 w-4 mr-2" />
                Enviar por Email
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sms-notification" 
                checked={notificationOptions.sms}
                onCheckedChange={(checked) => 
                  setNotificationOptions(prev => ({ ...prev, sms: !!checked }))
                }
                className="border-netflix-border data-[state=checked]:bg-netflix-red"
              />
              <Label 
                htmlFor="sms-notification" 
                className="text-sm text-netflix-text cursor-pointer flex items-center"
              >
                <Phone className="h-4 w-4 mr-2" />
                Enviar por SMS
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="whatsapp-notification" 
                checked={notificationOptions.whatsapp}
                onCheckedChange={(checked) => 
                  setNotificationOptions(prev => ({ ...prev, whatsapp: !!checked }))
                }
                className="border-netflix-border data-[state=checked]:bg-netflix-red"
              />
              <Label 
                htmlFor="whatsapp-notification" 
                className="text-sm text-netflix-text cursor-pointer flex items-center"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Enviar por WhatsApp
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-transparent border-netflix-border text-netflix-text hover:bg-netflix-card/50"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSendTool}
            disabled={isSending || selectedUsers.length === 0}
            className="bg-netflix-red text-white hover:bg-netflix-red/90"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar Ferramenta'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 