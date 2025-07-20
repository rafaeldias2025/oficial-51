import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Users, MessageCircle, Heart, Share2, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  created_at: string;
  likes: number;
  is_liked?: boolean;
}

interface CommunityChatProps {
  courseId?: string;
}

export const CommunityChat: React.FC<CommunityChatProps> = ({ courseId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Scroll para o final das mensagens
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Carregar mensagens existentes
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('community_messages')
          .select(`
            id,
            content,
            user_id,
            created_at,
            likes,
            profiles!inner(
              full_name,
              avatar_url
            )
          `)
          .eq('course_id', courseId || 'general')
          .order('created_at', { ascending: true })
          .limit(50);

        if (error) throw error;

        const formattedMessages = data?.map(msg => ({
          id: msg.id,
          content: msg.content,
          user_id: msg.user_id,
          user_name: msg.profiles.full_name || 'Usuário',
          user_avatar: msg.profiles.avatar_url,
          created_at: msg.created_at,
          likes: msg.likes || 0,
          is_liked: false // TODO: Implementar verificação de like
        })) || [];

        setMessages(formattedMessages);
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
      }
    };

    loadMessages();

    // Simular usuários online
    setOnlineUsers(Math.floor(Math.random() * 50) + 10);
  }, [courseId]);

  // Enviar nova mensagem
  const sendMessage = async () => {
    if (!newMessage.trim() || !user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('community_messages')
        .insert({
          content: newMessage.trim(),
          user_id: user.id,
          course_id: courseId || 'general',
          likes: 0
        })
        .select()
        .single();

      if (error) throw error;

      const newMsg: Message = {
        id: data.id,
        content: data.content,
        user_id: data.user_id,
        user_name: user.email?.split('@')[0] || 'Você',
        user_avatar: undefined,
        created_at: data.created_at,
        likes: 0,
        is_liked: false
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Dar like em uma mensagem
  const likeMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('community_messages')
        .update({ likes: messages.find(m => m.id === messageId)?.likes + 1 })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, likes: msg.likes + 1, is_liked: true }
          : msg
      ));
    } catch (error) {
      console.error('Erro ao dar like:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comunidade
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {onlineUsers} online
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Área de mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-3 ${
                  message.user_id === user?.id ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.user_avatar} />
                  <AvatarFallback className="text-xs">
                    {message.user_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className={`flex-1 max-w-[70%] ${
                  message.user_id === user?.id ? 'text-right' : ''
                }`}>
                  <div className={`inline-block p-3 rounded-lg ${
                    message.user_id === user?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium">
                        {message.user_name}
                      </span>
                      <span className="text-xs opacity-70">
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>

                  {/* Ações da mensagem */}
                  <div className={`flex items-center gap-2 mt-1 ${
                    message.user_id === user?.id ? 'justify-end' : 'justify-start'
                  }`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => likeMessage(message.id)}
                      className={`h-6 px-2 text-xs ${
                        message.is_liked ? 'text-red-500' : 'text-muted-foreground'
                      }`}
                    >
                      <Heart className={`h-3 w-3 mr-1 ${
                        message.is_liked ? 'fill-current' : ''
                      }`} />
                      {message.likes}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-muted-foreground"
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Compartilhar
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-muted-foreground"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Área de input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Digite sua mensagem..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 