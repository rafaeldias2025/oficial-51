import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Send, Users, MessageCircle, Heart, Share2, MoreHorizontal, 
  ThumbsUp, Smile, Image, Video, MapPin, Calendar, 
  Bookmark, Flag, Edit, Trash, Reply, Search, Bell, Home, User, Users2, Store, Play,
  Trophy, Crown, Star, TrendingUp, Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  content: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  created_at: string;
  likes: number;
  comments: number;
  shares: number;
  is_liked?: boolean;
  image_url?: string;
  location?: string;
  feeling?: string;
}

interface Comment {
  id: string;
  post_id: string;
  content: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  created_at: string;
  likes: number;
  is_liked?: boolean;
}

interface RankingUser {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  level: number;
  position: number;
}

interface AdminInfo {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'tip' | 'motivation';
}

interface FacebookStyleCommunityProps {
  courseId?: string;
}

export const FacebookStyleCommunity: React.FC<FacebookStyleCommunityProps> = ({ courseId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [showCommentInput, setShowCommentInput] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [rankingUsers, setRankingUsers] = useState<RankingUser[]>([]);
  const [adminInfo, setAdminInfo] = useState<AdminInfo[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const postsEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Scroll para o final dos posts
  const scrollToBottom = () => {
    postsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [posts]);

  // Verificar se é admin (mockado)
  useEffect(() => {
    // Mock admin status - você pode implementar a verificação real depois
    setIsAdmin(user?.email?.includes('admin') || false);
  }, [user]);

  // Carregar posts existentes
  useEffect(() => {
    const loadPosts = () => {
      // Dados mockados para demonstração
      const mockPosts: Post[] = [
        {
          id: '1',
          content: 'Acabei de completar minha primeira missão do dia! 💪 Estou muito feliz com meu progresso no Instituto dos Sonhos.',
          user_id: 'user1',
          user_name: 'João Silva',
          user_avatar: undefined,
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          likes: 12,
          comments: 3,
          shares: 1,
          is_liked: false,
          image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
          location: 'São Paulo, SP',
          feeling: '😊 Feliz'
        },
        {
          id: '2',
          content: 'Hoje foi um dia incrível! Consegui beber 2L de água e completar minha atividade física. O Instituto dos Sonhos está transformando minha vida!',
          user_id: 'user2',
          user_name: 'Maria Santos',
          user_avatar: undefined,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          likes: 8,
          comments: 2,
          shares: 0,
          is_liked: false,
          image_url: undefined,
          location: undefined,
          feeling: '💪 Motivado'
        },
        {
          id: '3',
          content: 'Alguém mais está participando do desafio da semana? Estou adorando a competição saudável! 🏆',
          user_id: 'user3',
          user_name: 'Pedro Costa',
          user_avatar: undefined,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          likes: 15,
          comments: 7,
          shares: 2,
          is_liked: false,
          image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
          location: 'Rio de Janeiro, RJ',
          feeling: '🏆 Competitivo'
        }
      ];

      setPosts(mockPosts);
      setOnlineUsers(Math.floor(Math.random() * 50) + 10);
    };

    loadPosts();
  }, [courseId]);

  // Carregar ranking
  useEffect(() => {
    const loadRanking = () => {
      const mockRanking: RankingUser[] = [
        { id: '1', name: 'João Silva', points: 1250, level: 8, position: 1 },
        { id: '2', name: 'Maria Santos', points: 980, level: 6, position: 2 },
        { id: '3', name: 'Pedro Costa', points: 850, level: 5, position: 3 },
        { id: '4', name: 'Ana Oliveira', points: 720, level: 4, position: 4 },
        { id: '5', name: 'Carlos Lima', points: 650, level: 4, position: 5 }
      ];
      setRankingUsers(mockRanking);
    };

    loadRanking();
  }, []);

  // Carregar informações admin
  useEffect(() => {
    const loadAdminInfo = () => {
      const mockAdminInfo: AdminInfo[] = [
        {
          id: '1',
          title: '🏆 Desafio da Semana',
          content: 'Esta semana o desafio é completar 5 missões diárias! Quem conseguir ganha pontos extras.',
          type: 'announcement'
        },
        {
          id: '2',
          title: '💡 Dica de Saúde',
          content: 'Lembre-se de beber água! Manter-se hidratado é fundamental para sua saúde.',
          type: 'tip'
        },
        {
          id: '3',
          title: '🌟 Motivação',
          content: 'Cada pequeno passo conta! Você está fazendo um excelente progresso.',
          type: 'motivation'
        }
      ];
      setAdminInfo(mockAdminInfo);
    };

    loadAdminInfo();
  }, []);

  // Criar novo post
  const createPost = async () => {
    if (!newPost.trim() || !user?.id) return;

    setIsLoading(true);
    try {
      const newPostData: Post = {
        id: Date.now().toString(),
        content: newPost.trim(),
        user_id: user.id,
        user_name: user.email?.split('@')[0] || 'Você',
        user_avatar: undefined,
        created_at: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0,
        is_liked: false
      };

      setPosts(prev => [newPostData, ...prev]);
      setNewPost('');
      
      toast({
        title: "Post criado!",
        description: "Seu post foi publicado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao criar post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Dar like em um post
  const likePost = async (postId: string) => {
    try {
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1, is_liked: true }
          : post
      ));
    } catch (error) {
      console.error('Erro ao dar like:', error);
    }
  };

  // Adicionar comentário
  const addComment = async (postId: string) => {
    if (!newComment.trim() || !user?.id) return;

    try {
      const comment: Comment = {
        id: Date.now().toString(),
        post_id: postId,
        content: newComment.trim(),
        user_id: user.id,
        user_name: user.email?.split('@')[0] || 'Você',
        user_avatar: undefined,
        created_at: new Date().toISOString(),
        likes: 0,
        is_liked: false
      };

      setComments(prev => [...prev, comment]);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments: post.comments + 1 }
          : post
      ));
      setNewComment('');
      setShowCommentInput(null);
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
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

  const getLevelColor = (level: number) => {
    if (level >= 8) return '#ffd700'; // Ouro
    if (level >= 5) return '#c0c0c0'; // Prata
    if (level >= 3) return '#cd7f32'; // Bronze
    return '#4a90e2'; // Azul
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f2f5', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header do Instituto dos Sonhos */}
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm" style={{ borderColor: '#dddfe2' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo Instituto dos Sonhos */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1877f2' }}>
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <div>
                <h1 className="font-bold text-lg" style={{ color: '#1877f2' }}>Instituto dos Sonhos</h1>
                <p className="text-xs" style={{ color: '#65676b' }}>{onlineUsers} pessoas online</p>
              </div>
            </div>

            {/* Navegação central */}
            <div className="flex items-center gap-1">
              <button className={`p-3 rounded-lg ${activeTab === 'home' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}>
                <Home className="h-6 w-6" style={{ color: '#1877f2' }} />
              </button>
              <button className="p-3 rounded-lg hover:bg-gray-100">
                <Users2 className="h-6 w-6" style={{ color: '#65676b' }} />
              </button>
              <button className="p-3 rounded-lg hover:bg-gray-100">
                <Trophy className="h-6 w-6" style={{ color: '#65676b' }} />
              </button>
              <button className="p-3 rounded-lg hover:bg-gray-100">
                <Users className="h-6 w-6" style={{ color: '#65676b' }} />
              </button>
              {isAdmin && (
                <button className="p-3 rounded-lg hover:bg-gray-100">
                  <Settings className="h-6 w-6" style={{ color: '#65676b' }} />
                </button>
              )}
            </div>

            {/* Ações do usuário */}
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200" style={{ backgroundColor: '#f0f2f5' }}>
                <User className="h-5 w-5" style={{ color: '#65676b' }} />
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200" style={{ backgroundColor: '#f0f2f5' }}>
                <MessageCircle className="h-5 w-5" style={{ color: '#65676b' }} />
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200" style={{ backgroundColor: '#f0f2f5' }}>
                <Bell className="h-5 w-5" style={{ color: '#65676b' }} />
              </button>
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar esquerda */}
          <div className="col-span-3 space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user?.email?.split('@')[0] || 'Você'}</span>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1877f2' }}>
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <span>Comunidade</span>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#42a5f5' }}>
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <span>Ranking</span>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#7c4dff' }}>
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <span>Conquistas</span>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ff9800' }}>
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <span>Progresso</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feed central */}
          <div className="col-span-6 space-y-4">
            {/* Área de criar post */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <input
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Compartilhe sua jornada no Instituto dos Sonhos..."
                    className="w-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                    style={{ backgroundColor: '#f0f2f5' }}
                  />
                  <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTopColor: '#dddfe2' }}>
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 text-sm hover:bg-gray-100 px-3 py-2 rounded-lg" style={{ color: '#65676b' }}>
                        <Image className="h-5 w-5" style={{ color: '#45bd62' }} />
                        Foto
                      </button>
                      <button className="flex items-center gap-2 text-sm hover:bg-gray-100 px-3 py-2 rounded-lg" style={{ color: '#65676b' }}>
                        <Video className="h-5 w-5" style={{ color: '#f02849' }} />
                        Vídeo
                      </button>
                      <button className="flex items-center gap-2 text-sm hover:bg-gray-100 px-3 py-2 rounded-lg" style={{ color: '#65676b' }}>
                        <MapPin className="h-5 w-5" style={{ color: '#1877f2' }} />
                        Localização
                      </button>
                    </div>
                    <button
                      onClick={createPost}
                      disabled={!newPost.trim() || isLoading}
                      className="px-6 py-2 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
                      style={{ backgroundColor: '#1877f2', color: 'white' }}
                    >
                      Publicar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Admin */}
            {isAdmin && adminInfo.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Settings className="h-5 w-5" style={{ color: '#1877f2' }} />
                  Informações Administrativas
                </h3>
                <div className="space-y-3">
                  {adminInfo.map((info) => (
                    <div key={info.id} className="p-3 rounded-lg border-l-4" style={{ 
                      borderLeftColor: info.type === 'announcement' ? '#1877f2' : 
                                   info.type === 'tip' ? '#45bd62' : '#ff9800',
                      backgroundColor: '#f8f9fa'
                    }}>
                      <h4 className="font-medium text-sm mb-1">{info.title}</h4>
                      <p className="text-sm" style={{ color: '#65676b' }}>{info.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feed de posts */}
            <div className="space-y-4">
              <AnimatePresence>
                {posts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-lg shadow-sm"
                  >
                    {/* Header do post */}
                    <div className="p-4 pb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={post.user_avatar} />
                          <AvatarFallback>
                            {post.user_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{post.user_name}</span>
                            {post.feeling && (
                              <span className="text-sm" style={{ color: '#65676b' }}>{post.feeling}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs" style={{ color: '#65676b' }}>
                            <span>{formatTime(post.created_at)}</span>
                            {post.location && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {post.location}
                                </span>
                              </>
                            )}
                            <span>•</span>
                            <span>🌐</span>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                          <MoreHorizontal className="h-4 w-4" style={{ color: '#65676b' }} />
                        </button>
                      </div>
                    </div>

                    {/* Conteúdo do post */}
                    <div className="px-4 pb-3">
                      <p className="text-sm mb-3" style={{ color: '#050505' }}>{post.content}</p>
                      {post.image_url && (
                        <img 
                          src={post.image_url} 
                          alt="Post" 
                          className="w-full rounded-lg mb-3"
                        />
                      )}
                    </div>

                    {/* Estatísticas */}
                    <div className="px-4 py-2" style={{ borderTopColor: '#dddfe2' }}>
                      <div className="flex items-center justify-between text-xs" style={{ color: '#65676b' }}>
                        <div className="flex items-center gap-1">
                          <div className="flex -space-x-1">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1877f2' }}>
                              <ThumbsUp className="h-3 w-3 text-white" />
                            </div>
                            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f02849' }}>
                              <Heart className="h-3 w-3 text-white" />
                            </div>
                          </div>
                          <span>{post.likes} curtidas</span>
                        </div>
                        <div className="flex gap-4">
                          <span>{post.comments} comentários</span>
                          <span>{post.shares} compartilhamentos</span>
                        </div>
                      </div>
                    </div>

                    {/* Ações do post */}
                    <div className="px-4 py-2" style={{ borderTopColor: '#dddfe2' }}>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => likePost(post.id)}
                          className="flex items-center gap-2 flex-1 justify-center py-2 rounded-lg hover:bg-gray-100 text-sm"
                          style={{ color: post.is_liked ? '#1877f2' : '#65676b' }}
                        >
                          <ThumbsUp className={`h-4 w-4 ${
                            post.is_liked ? 'fill-current' : ''
                          }`} />
                          Curtir
                        </button>
                        <button
                          onClick={() => setShowCommentInput(post.id)}
                          className="flex items-center gap-2 flex-1 justify-center py-2 rounded-lg hover:bg-gray-100 text-sm"
                          style={{ color: '#65676b' }}
                        >
                          <MessageCircle className="h-4 w-4" />
                          Comentar
                        </button>
                        <button className="flex items-center gap-2 flex-1 justify-center py-2 rounded-lg hover:bg-gray-100 text-sm" style={{ color: '#65676b' }}>
                          <Share2 className="h-4 w-4" />
                          Compartilhar
                        </button>
                      </div>
                    </div>

                    {/* Input de comentário */}
                    {showCommentInput === post.id && (
                      <div className="px-4 py-3" style={{ borderTopColor: '#dddfe2' }}>
                        <div className="flex gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user?.user_metadata?.avatar_url} />
                            <AvatarFallback>
                              {user?.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <input
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Escreva um comentário..."
                              className="w-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                              style={{ backgroundColor: '#f0f2f5' }}
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => addComment(post.id)}
                                disabled={!newComment.trim()}
                                className="px-4 py-1 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                                style={{ backgroundColor: '#1877f2', color: 'white' }}
                              >
                                Comentar
                              </button>
                              <button
                                onClick={() => setShowCommentInput(null)}
                                className="text-sm hover:underline"
                                style={{ color: '#65676b' }}
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Comentários */}
                    {comments.filter(c => c.post_id === post.id).length > 0 && (
                      <div className="px-4 py-3" style={{ borderTopColor: '#dddfe2', backgroundColor: '#f0f2f5' }}>
                        {comments
                          .filter(c => c.post_id === post.id)
                          .map((comment) => (
                            <div key={comment.id} className="flex gap-3 mb-3 last:mb-0">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={comment.user_avatar} />
                                <AvatarFallback>
                                  {comment.user_name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-white rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm">
                                      {comment.user_name}
                                    </span>
                                    <span className="text-xs" style={{ color: '#65676b' }}>
                                      {formatTime(comment.created_at)}
                                    </span>
                                  </div>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-xs" style={{ color: '#65676b' }}>
                                  <button className="hover:underline">Curtir</button>
                                  <button className="hover:underline">Responder</button>
                                  <span>{formatTime(comment.created_at)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={postsEndRef} />
            </div>
          </div>

          {/* Sidebar direita - Ranking */}
          <div className="col-span-3 space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Trophy className="h-5 w-5" style={{ color: '#ffd700' }} />
                Ranking Semanal
              </h3>
              <div className="space-y-3">
                {rankingUsers.map((user, index) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm" style={{ 
                      backgroundColor: index === 0 ? '#ffd700' : 
                                   index === 1 ? '#c0c0c0' : 
                                   index === 2 ? '#cd7f32' : '#e4e6eb',
                      color: index < 3 ? 'white' : '#65676b'
                    }}>
                      {index + 1}
                    </div>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{user.name}</span>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getLevelColor(user.level) }}></div>
                      </div>
                      <div className="flex items-center gap-2 text-xs" style={{ color: '#65676b' }}>
                        <span>{user.points} pontos</span>
                        <span>•</span>
                        <span>Nível {user.level}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 