import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, Star, MessageCircle, Send } from 'lucide-react';
import { usePremiumCourses } from '@/hooks/usePremiumCourses';
import { Comment, Rating, Favorite } from '@/types/premium';
import { useAuth } from '@/hooks/useAuth';

interface SocialInteractionProps {
  courseId: string;
}

export const SocialInteraction: React.FC<SocialInteractionProps> = ({ courseId }) => {
  const { user } = useAuth();
  const {
    getComments,
    addComment,
    getFavorites,
    toggleFavorite,
    getRatings,
    addRating
  } = usePremiumCourses();

  const [comments, setComments] = useState<Comment[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [commentsData, favoritesData, ratingsData] = await Promise.all([
          getComments(courseId),
          getFavorites(courseId),
          getRatings(courseId)
        ]);

        setComments(commentsData);
        setFavorites(favoritesData);
        setRatings(ratingsData);

        // Verificar se o usuário favoritou o curso
        if (user) {
          const userFavorite = favoritesData.find(fav => fav.user_id === user.id);
          setIsFavorite(!!userFavorite);

          // Verificar a avaliação do usuário
          const existingRating = ratingsData.find(rating => rating.user_id === user.id);
          if (existingRating) {
            setUserRating(existingRating.rating);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados sociais:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId, getComments, getFavorites, getRatings, user]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    await addComment(courseId, newComment);
    setNewComment('');
    
    // Recarregar comentários
    const updatedComments = await getComments(courseId);
    setComments(updatedComments);
  };

  const handleToggleFavorite = async () => {
    if (!user) return;

    await toggleFavorite(courseId);
    setIsFavorite(!isFavorite);
    
    // Recarregar favoritos
    const updatedFavorites = await getFavorites(courseId);
    setFavorites(updatedFavorites);
  };

  const handleRating = async (rating: number) => {
    if (!user) return;

    await addRating(courseId, rating);
    setUserRating(rating);
    
    // Recarregar avaliações
    const updatedRatings = await getRatings(courseId);
    setRatings(updatedRatings);
  };

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length 
    : 0;

  if (loading) {
    return (
      <div className="grid gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-32 bg-muted" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Avaliações e Favoritos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Avaliações</span>
            </span>
            <Button
              variant={isFavorite ? "default" : "outline"}
              size="sm"
              onClick={handleToggleFavorite}
              disabled={!user}
            >
              <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Favoritado' : 'Favoritar'} ({favorites.length})
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer transition-colors ${
                      star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} ({ratings.length} avaliações)
              </span>
            </div>

            {user && (
              <div>
                <p className="text-sm font-medium mb-2">Sua avaliação:</p>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`h-5 w-5 cursor-pointer transition-colors ${
                        star <= userRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                      onClick={() => handleRating(star)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comentários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Comentários ({comments.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Escreva seu comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Comentário
                </Button>
              </div>
            )}

            <ScrollArea className="h-[400px] w-full">
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum comentário ainda. Seja o primeiro a comentar!
                  </p>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="flex space-x-3 p-4 rounded-lg border">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.profiles?.avatar_url || ''} />
                        <AvatarFallback>
                          {comment.profiles?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            {comment.profiles?.full_name || 'Usuário'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {comment.comment}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Sociais */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{favorites.length}</div>
              <div className="text-sm text-muted-foreground">Favoritos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{comments.length}</div>
              <div className="text-sm text-muted-foreground">Comentários</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{ratings.length}</div>
              <div className="text-sm text-muted-foreground">Avaliações</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 