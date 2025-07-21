import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { Search, X, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: string;
}

interface UserSelectorProps {
  selectedUsers: string[];
  onSelectionChange: (userIds: string[]) => void;
  maxSelection?: number;
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  selectedUsers,
  onSelectionChange,
  maxSelection
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, role')
        .eq('role', 'client')
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleUserToggle = (userId: string) => {
    const isSelected = selectedUsers.includes(userId);
    
    if (isSelected) {
      onSelectionChange(selectedUsers.filter(id => id !== userId));
    } else {
      if (maxSelection && selectedUsers.length >= maxSelection) {
        return; // Não permite seleção além do limite
      }
      onSelectionChange([...selectedUsers, userId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      onSelectionChange([]);
    } else {
      const userIds = maxSelection 
        ? filteredUsers.slice(0, maxSelection).map(u => u.id)
        : filteredUsers.map(u => u.id);
      onSelectionChange(userIds);
    }
  };

  const removeUser = (userId: string) => {
    onSelectionChange(selectedUsers.filter(id => id !== userId));
  };

  const getSelectedUserNames = () => {
    return users
      .filter(u => selectedUsers.includes(u.id))
      .map(u => u.full_name || u.email);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          className="min-w-24"
        >
          {selectedUsers.length === filteredUsers.length ? 'Desmarcar' : 'Selecionar'} Todos
        </Button>
      </div>

      {/* Selected Users */}
      {selectedUsers.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">
              {selectedUsers.length} usuário{selectedUsers.length !== 1 ? 's' : ''} selecionado{selectedUsers.length !== 1 ? 's' : ''}
              {maxSelection && ` (máx: ${maxSelection})`}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {getSelectedUserNames().map((name, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {name}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => removeUser(selectedUsers[index])}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Users List */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-64">
            {filteredUsers.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredUsers.map((user) => {
                  const isSelected = selectedUsers.includes(user.id);
                  const isDisabled = maxSelection && !isSelected && selectedUsers.length >= maxSelection;
                  
                  return (
                    <div
                      key={user.id}
                      className={`
                        flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors
                        ${isSelected ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'}
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      onClick={() => !isDisabled && handleUserToggle(user.id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => !isDisabled && handleUserToggle(user.id)}
                      />
                      
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>
                          {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {user.full_name || 'Nome não informado'}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {maxSelection && (
        <p className="text-xs text-muted-foreground">
          Máximo de {maxSelection} usuário{maxSelection !== 1 ? 's' : ''} podem ser selecionados
        </p>
      )}
    </div>
  );
};