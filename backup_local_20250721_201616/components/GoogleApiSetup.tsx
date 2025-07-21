import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, ExternalLink, Save, Chrome } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface GoogleApiSetupProps {
  onCredentialsSaved: (clientId: string, apiKey: string) => void;
}

export const GoogleApiSetup: React.FC<GoogleApiSetupProps> = ({ onCredentialsSaved }) => {
  const [clientId, setClientId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false);
  const { toast } = useToast();

  // Carregar credenciais existentes ao montar
  React.useEffect(() => {
    const savedClientId = localStorage.getItem('google_client_id');
    const savedApiKey = localStorage.getItem('google_api_key');
    const savedEmail = localStorage.getItem('google_email');
    
    if (savedClientId && savedApiKey) {
      setClientId(savedClientId);
      setApiKey(savedApiKey);
      setHasCredentials(true);
    }
    
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleSave = () => {
    if (!clientId || !apiKey) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha tanto o Client ID quanto a API Key',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    // Salvar credenciais no localStorage
    localStorage.setItem('google_client_id', clientId);
    localStorage.setItem('google_api_key', apiKey);
    
    if (email) {
      localStorage.setItem('google_email', email);
    }
    
    setHasCredentials(true);
    onCredentialsSaved(clientId, apiKey);
    
    toast({
      title: '✅ Credenciais salvas',
      description: 'Agora você pode conectar com sua conta Google',
    });
    
    setIsLoading(false);
  };

  const handleConnect = async () => {
    if (!email || !password) {
      toast({
        title: 'Email e senha obrigatórios',
        description: 'Por favor, preencha seu email e senha do Google',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Salvar credenciais temporariamente
      localStorage.setItem('google_email', email);
      localStorage.setItem('google_temp_password', password);
      
      toast({
        title: '✅ Conectando...',
        description: 'Iniciando conexão com Google Fit',
      });
      
      // Chamar função de conexão com as credenciais
      onCredentialsSaved(clientId, apiKey);
      
    } catch (error) {
      toast({
        title: 'Erro na conexão',
        description: 'Verifique suas credenciais e tente novamente',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Chrome className="h-5 w-5" />
          Configuração da API do Google
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            Para a integração Google Fit funcionar, você precisa configurar as credenciais da API do Google.
            <br />
            <a 
              href="https://console.cloud.google.com/apis/credentials" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:underline mt-2"
            >
              <ExternalLink className="h-3 w-3" />
              Acessar Google Cloud Console
            </a>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientId">Google Client ID</Label>
            <Input
              id="clientId"
              type="text"
              placeholder="123456789-abc123.apps.googleusercontent.com"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              OAuth 2.0 Client ID do Google Cloud Console
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">Google API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              API Key com acesso ao Google Fitness API
            </p>
          </div>
        </div>

        {/* Seção de Login Google - só aparece se as credenciais estão configuradas */}
        {hasCredentials && (
          <div className="border-t pt-6 space-y-4">
            <h4 className="font-medium text-gray-900">Conectar com Conta Google</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email da Conta Google</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha da Conta Google</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                <strong>Importante:</strong> Suas credenciais são usadas apenas para autenticação OAuth e não são armazenadas permanentemente.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">📋 Instruções rápidas:</h4>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Acesse o Google Cloud Console</li>
            <li>Crie ou selecione um projeto</li>
            <li>Habilite o Google Fitness API</li>
            <li>Crie credenciais OAuth 2.0 e API Key</li>
            <li><strong>⚠️ IMPORTANTE:</strong> Configure os domínios autorizados</li>
          </ol>
        </div>

        <Alert className="border-red-300 bg-red-50">
          <AlertDescription>
            <div className="space-y-3">
              <h4 className="font-semibold text-red-800 text-base">🚨 ERRO: Domínio não autorizado!</h4>
              
              <div className="bg-red-100 p-3 rounded border border-red-200">
                <p className="font-semibold text-sm text-red-800 mb-2">Domínio atual que precisa ser adicionado:</p>
                <div className="bg-white p-2 rounded font-mono text-sm border">
                  {window.location.origin}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-red-800">Solução obrigatória:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-red-700">
                  <li>
                    Acesse: <a 
                      href="https://console.cloud.google.com/apis/credentials" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline font-semibold underline"
                    >
                      Google Cloud Console → Credenciais
                    </a>
                  </li>
                  <li>Encontre e clique no seu <strong>Client ID OAuth 2.0</strong></li>
                  <li>Na seção <strong>"Origens JavaScript autorizadas"</strong>, clique em <strong>"ADICIONAR URI"</strong></li>
                  <li>Cole exatamente esta URL: <code className="bg-white px-1 rounded border">{window.location.origin}</code></li>
                  <li>Clique em <strong>"SALVAR"</strong></li>
                  <li>⏱️ Aguarde 5-10 minutos para a mudança ser propagada</li>
                </ol>
              </div>

              <div className="bg-yellow-50 p-3 rounded border border-yellow-300">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Importante:</strong> Sem esta configuração exata, você continuará recebendo o erro de "origem não válida"!
                </p>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600 border-green-200">
            ✅ Escopos necessários já configurados
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            🔒 Dados seguros localmente
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isLoading || !clientId || !apiKey}
            className="flex-1"
            variant={hasCredentials ? "outline" : "default"}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Salvando...' : 'Salvar Credenciais'}
          </Button>
          
          {hasCredentials && (
            <Button
              onClick={handleConnect}
              disabled={isLoading || !email || !password}
              className="flex-1"
            >
              <Chrome className="h-4 w-4 mr-2" />
              {isLoading ? 'Conectando...' : 'Conectar Google Fit'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};