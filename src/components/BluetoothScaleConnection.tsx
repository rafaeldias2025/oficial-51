
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useBluetoothScale, ScaleReading } from '@/hooks/useBluetoothScale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useDadosSaude } from '@/hooks/useDadosSaude';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RiscoCardiometabolico } from '@/components/RiscoCardiometabolico';
import { EvolucaoSemanal } from '@/components/EvolucaoSemanal';

import { 
  Bluetooth, 
  Scale,
  CheckCircle,
  Timer,
  X,
  Loader,
  AlertCircle,
  Wifi,
  Ruler,
  TrendingUp,
  BarChart3,
  User
} from 'lucide-react';

interface BluetoothScaleConnectionProps {
  trigger?: React.ReactNode;
  onDataSaved?: () => void;
}

export const BluetoothScaleConnection: React.FC<BluetoothScaleConnectionProps> = ({ 
  trigger, 
  onDataSaved 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isProcessingData, setIsProcessingData] = React.useState(false);
  const [showCircunferenciaInput, setShowCircunferenciaInput] = React.useState(false);
  const [circunferenciaAbdominal, setCircunferenciaAbdominal] = React.useState<number>(90);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { dadosSaude, refetch } = useDadosSaude();
  
  const {
    state,
    connectDevice,
    disconnectDevice,
    startReading,
    stopReading
  } = useBluetoothScale();

  const {
    isConnected,
    isConnecting,
    isReading,
    device,
    lastReading,
    countdown,
    status
  } = state;

  const processAndSaveScaleData = async (reading: ScaleReading, confirmedData?: {
    circunferencia_abdominal_cm?: number;
    meta_peso_kg?: number;
  }) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para salvar os dados",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // 🔄 ETAPA 1: Buscar profile do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;

      // Buscar dados físicos para altura, idade e sexo
      const { data: dadosFisicos } = await supabase
        .from('dados_fisicos_usuario')
        .select('altura_cm, data_nascimento, sexo')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Calcular idade
      const idade = dadosFisicos?.data_nascimento 
        ? Math.floor((new Date().getTime() - new Date(dadosFisicos.data_nascimento).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
        : 30;

      const isMale = dadosFisicos?.sexo === 'Masculino';
      const altura = dadosFisicos?.altura_cm || 170;

      // 🔄 ETAPA 2: Salvar pesagem
      const { error: pesagemError } = await supabase
        .from('pesagens')
        .insert({
          user_id: profile.id,
          peso_kg: reading.weight,
          agua_corporal_pct: reading.bodyWater,
          gordura_corporal_pct: reading.bodyFat,
          gordura_visceral: reading.visceralFat,
          massa_muscular_kg: reading.muscleMass,
          massa_ossea_kg: 2.9, // Valor padrão
          taxa_metabolica_basal: reading.basalMetabolism,
          tipo_corpo: reading.bodyType,
          origem_medicao: 'openScale',
          data_medicao: reading.timestamp.toISOString(),
          circunferencia_abdominal_cm: confirmedData?.circunferencia_abdominal_cm || circunferenciaAbdominal
        });

      if (pesagemError) throw pesagemError;

      // 🔄 ETAPA 3: Atualizar dados de saúde
      const { error: dadosSaudeError } = await supabase
        .from('dados_saude_usuario')
        .upsert({
          user_id: profile.id,
          peso_atual_kg: reading.weight,
          altura_cm: altura,
          circunferencia_abdominal_cm: confirmedData?.circunferencia_abdominal_cm || circunferenciaAbdominal,
          meta_peso_kg: confirmedData?.meta_peso_kg || reading.weight * 0.9,
          imc: reading.weight / Math.pow(altura / 100, 2),
          data_atualizacao: new Date().toISOString()
        });

      if (dadosSaudeError) throw dadosSaudeError;

      // 🔄 ETAPA 4: Atualizar dados físicos
      const { error: dadosFisicosError } = await supabase
        .from('dados_fisicos_usuario')
        .upsert({
          user_id: profile.id,
          nome_completo: user?.user_metadata?.full_name || 'Usuário',
          peso_atual_kg: reading.weight,
          altura_cm: altura,
          circunferencia_abdominal_cm: confirmedData?.circunferencia_abdominal_cm || circunferenciaAbdominal,
          meta_peso_kg: confirmedData?.meta_peso_kg || reading.weight * 0.9,
          data_nascimento: dadosFisicos?.data_nascimento || new Date().toISOString(),
          sexo: dadosFisicos?.sexo || 'Não informado'
        });

      if (dadosFisicosError) throw dadosFisicosError;

      // 🔄 ETAPA 5: Atualizar interface
      await refetch();
      onDataSaved?.();

      toast({
        title: "✅ Pesagem registrada com sucesso!",
        description: `Peso: ${reading.weight} kg | IMC: ${(reading.weight / Math.pow(altura / 100, 2)).toFixed(1)}`,
      });

      setIsOpen(false);

    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast({
        title: "Erro ao salvar dados",
        description: "Tente novamente ou entre em contato com o suporte",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartReading = async () => {
    if (!isConnected) {
      await connectDevice();
      return;
    }

    try {
      setIsProcessingData(true);
      await startReading();
    } catch (error) {
      console.error('Erro ao iniciar leitura:', error);
      toast({
        title: "Erro ao iniciar leitura",
        description: "Verifique se a openScale está ligada e próxima",
        variant: "destructive",
      });
    } finally {
      setIsProcessingData(false);
    }
  };

  const handleSaveReading = async () => {
    if (!lastReading) return;
    
    await processAndSaveScaleData(lastReading, {
      circunferencia_abdominal_cm: circunferenciaAbdominal
    });
  };

  const getStatusIcon = () => {
    if (isConnecting) return <Loader className="h-4 w-4 animate-spin" />;
    if (isConnected) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusColor = () => {
    if (isConnecting) return 'text-blue-600';
    if (isConnected) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full">
            <Scale className="mr-2 h-4 w-4" />
            Conectar openScale
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bluetooth className="h-5 w-5" />
            openScale - Balança Inteligente
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status da conexão */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <span className={`text-sm font-medium ${getStatusColor()}`}>
                    {status}
                  </span>
                </div>
                {device && (
                  <span className="text-xs text-muted-foreground">
                    {device.name}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Controles */}
          <div className="flex gap-2">
            {!isConnected ? (
              <Button 
                onClick={handleStartReading}
                disabled={isConnecting}
                className="flex-1"
              >
                {isConnecting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Bluetooth className="mr-2 h-4 w-4" />
                    Conectar openScale
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleStartReading}
                  disabled={isReading}
                  className="flex-1"
                >
                  {isReading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Lendo...
                    </>
                  ) : (
                    <>
                      <Scale className="mr-2 h-4 w-4" />
                      Iniciar Pesagem
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={disconnectDevice}
                  size="icon"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Leitura atual */}
          {lastReading && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leitura Atual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Peso</Label>
                    <p className="text-2xl font-bold text-primary">
                      {lastReading.weight} kg
                    </p>
                  </div>
                  {lastReading.bodyFat && (
                    <div>
                      <Label className="text-sm font-medium">Gordura Corporal</Label>
                      <p className="text-lg font-semibold">
                        {lastReading.bodyFat}%
                      </p>
                    </div>
                  )}
                </div>
                
                {lastReading.muscleMass && (
                  <div>
                    <Label className="text-sm font-medium">Massa Muscular</Label>
                    <p className="text-lg font-semibold">
                      {lastReading.muscleMass} kg
                    </p>
                  </div>
                )}

                {lastReading.bodyWater && (
                  <div>
                    <Label className="text-sm font-medium">Água Corporal</Label>
                    <p className="text-lg font-semibold">
                      {lastReading.bodyWater}%
                    </p>
                  </div>
                )}

                {lastReading.basalMetabolism && (
                  <div>
                    <Label className="text-sm font-medium">Taxa Metabólica</Label>
                    <p className="text-lg font-semibold">
                      {lastReading.basalMetabolism} kcal
                    </p>
                  </div>
                )}

                {/* Input para circunferência abdominal */}
                <div>
                  <Label htmlFor="circunferencia" className="text-sm font-medium">
                    Circunferência Abdominal (cm)
                  </Label>
                  <Input
                    id="circunferencia"
                    type="number"
                    value={circunferenciaAbdominal}
                    onChange={(e) => setCircunferenciaAbdominal(Number(e.target.value))}
                    placeholder="90"
                    className="mt-1"
                  />
                </div>

                {/* Botão salvar */}
                <Button 
                  onClick={handleSaveReading}
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Salvar Pesagem
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Instruções */}
          {!lastReading && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>📱 Certifique-se de que a Xiaomi Mi Body Scale 2 está ligada</p>
                  <p>🔗 Mantenha o dispositivo próximo ao computador</p>
                  <p>⚖️ Suba na balança quando solicitado</p>
                  <p>⏳ Aguarde a estabilização da leitura</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
