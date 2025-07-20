import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  ClipboardList, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Users,
  BarChart3,
  FileText,
  Heart,
  Brain,
  Target,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp
} from 'lucide-react';
import { AnamneseResults } from './AnamneseResults';

interface Question {
  id: string;
  text: string;
  category: string;
  type: 'multiple_choice' | 'scale' | 'text';
  options?: string[];
  required: boolean;
  order: number;
}

interface AnamneseTest {
  id: string;
  name: string;
  description: string;
  category: string;
  questions: Question[];
  isActive: boolean;
  createdAt: string;
  totalResponses: number;
}

const anamneseTests: AnamneseTest[] = [
  {
    id: '1',
    name: 'Sabotadores do Emagrecimento',
    description: 'Avaliação completa dos comportamentos que sabotam o processo de emagrecimento',
    category: 'Comportamento',
    isActive: true,
    createdAt: '2024-01-15',
    totalResponses: 45,
    questions: [
      // SABOTADORES COMPORTAMENTAIS
      {
        id: '1.1',
        text: 'Você come quando está ansioso(a) ou estressado(a)?',
        category: 'Comportamental',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 1
      },
      {
        id: '1.2',
        text: 'Você come por hábito, mesmo sem fome?',
        category: 'Comportamental',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 2
      },
      {
        id: '1.3',
        text: 'Você come rápido, sem mastigar adequadamente?',
        category: 'Comportamental',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 3
      },
      {
        id: '1.4',
        text: 'Você come em frente à TV ou computador?',
        category: 'Comportamental',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 4
      },
      {
        id: '1.5',
        text: 'Você pula refeições regularmente?',
        category: 'Comportamental',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 5
      },
      {
        id: '1.6',
        text: 'Você come por tédio ou solidão?',
        category: 'Comportamental',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 6
      },
      {
        id: '1.7',
        text: 'Você come por recompensa emocional?',
        category: 'Comportamental',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 7
      },
      {
        id: '1.8',
        text: 'Você come por pressão social?',
        category: 'Comportamental',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 8
      },
      // SABOTADORES EMOCIONAIS
      {
        id: '1.9',
        text: 'Você usa comida como válvula de escape?',
        category: 'Emocional',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 9
      },
      {
        id: '1.10',
        text: 'Você come quando está triste ou deprimido(a)?',
        category: 'Emocional',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 10
      },
      {
        id: '1.11',
        text: 'Você come quando está feliz ou celebrando?',
        category: 'Emocional',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 11
      },
      {
        id: '1.12',
        text: 'Você come quando está frustrado(a) ou irritado(a)?',
        category: 'Emocional',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 12
      },
      // SABOTADORES AMBIENTAIS
      {
        id: '1.13',
        text: 'Você tem alimentos calóricos facilmente acessíveis em casa?',
        category: 'Ambiental',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 13
      },
      {
        id: '1.14',
        text: 'Você come em ambientes que distraem sua atenção?',
        category: 'Ambiental',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 14
      },
      {
        id: '1.15',
        text: 'Você come em horários irregulares?',
        category: 'Ambiental',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 15
      },
      // SABOTADORES COGNITIVOS
      {
        id: '1.16',
        text: 'Você pensa "já que quebrei a dieta, vou comer tudo"?',
        category: 'Cognitivo',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 16
      },
      {
        id: '1.17',
        text: 'Você acredita que precisa comer tudo no prato?',
        category: 'Cognitivo',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 17
      },
      {
        id: '1.18',
        text: 'Você pensa "amanhã eu começo a dieta"?',
        category: 'Cognitivo',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 18
      },
      {
        id: '1.19',
        text: 'Você acredita que não consegue controlar a alimentação?',
        category: 'Cognitivo',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 19
      },
      {
        id: '1.20',
        text: 'Você pensa "só mais um pedaço não vai fazer diferença"?',
        category: 'Cognitivo',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 20
      }
    ]
  },
  {
    id: '2',
    name: 'Necessidades Humanas',
    description: 'Avaliação das necessidades básicas e de desenvolvimento pessoal',
    category: 'Desenvolvimento',
    isActive: true,
    createdAt: '2024-01-15',
    totalResponses: 32,
    questions: [
      // NECESSIDADES FISIOLÓGICAS
      {
        id: '2.1',
        text: 'Como você avalia sua qualidade do sono?',
        category: 'Fisiológica',
        type: 'scale',
        options: ['1 - Muito ruim', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Excelente'],
        required: true,
        order: 1
      },
      {
        id: '2.2',
        text: 'Como você avalia sua alimentação?',
        category: 'Fisiológica',
        type: 'scale',
        options: ['1 - Muito ruim', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Excelente'],
        required: true,
        order: 2
      },
      {
        id: '2.3',
        text: 'Como você avalia sua hidratação?',
        category: 'Fisiológica',
        type: 'scale',
        options: ['1 - Muito ruim', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Excelente'],
        required: true,
        order: 3
      },
      {
        id: '2.4',
        text: 'Como você avalia sua atividade física?',
        category: 'Fisiológica',
        type: 'scale',
        options: ['1 - Muito ruim', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Excelente'],
        required: true,
        order: 4
      },
      // NECESSIDADES DE SEGURANÇA
      {
        id: '2.5',
        text: 'Como você avalia sua segurança financeira?',
        category: 'Segurança',
        type: 'scale',
        options: ['1 - Muito ruim', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Excelente'],
        required: true,
        order: 5
      },
      {
        id: '2.6',
        text: 'Como você avalia sua segurança emocional?',
        category: 'Segurança',
        type: 'scale',
        options: ['1 - Muito ruim', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Excelente'],
        required: true,
        order: 6
      },
      {
        id: '2.7',
        text: 'Como você avalia sua segurança física?',
        category: 'Segurança',
        type: 'scale',
        options: ['1 - Muito ruim', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Excelente'],
        required: true,
        order: 7
      },
      // NECESSIDADES SOCIAIS
      {
        id: '2.8',
        text: 'Como você avalia suas relações familiares?',
        category: 'Social',
        type: 'scale',
        options: ['1 - Muito ruim', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Excelente'],
        required: true,
        order: 8
      },
      {
        id: '2.9',
        text: 'Como você avalia suas amizades?',
        category: 'Social',
        type: 'scale',
        options: ['1 - Muito ruim', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Excelente'],
        required: true,
        order: 9
      },
      {
        id: '2.10',
        text: 'Como você avalia sua vida amorosa?',
        category: 'Social',
        type: 'scale',
        options: ['1 - Muito ruim', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Excelente'],
        required: true,
        order: 10
      },
      // NECESSIDADES DE ESTIMA
      {
        id: '2.11',
        text: 'Como você avalia sua autoestima?',
        category: 'Estima',
        type: 'scale',
        options: ['1 - Muito ruim', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Excelente'],
        required: true,
        order: 11
      },
      {
        id: '2.12',
        text: 'Como você avalia o reconhecimento que recebe?',
        category: 'Estima',
        type: 'scale',
        options: ['1 - Muito ruim', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Excelente'],
        required: true,
        order: 12
      },
      {
        id: '2.13',
        text: 'Como você avalia sua confiança em si mesmo?',
        category: 'Estima',
        type: 'scale',
        options: ['1 - Muito ruim', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Excelente'],
        required: true,
        order: 13
      },
      // NECESSIDADES DE AUTORREALIZAÇÃO
      {
        id: '2.14',
        text: 'Como você avalia seu desenvolvimento pessoal?',
        category: 'Autorrealização',
        type: 'scale',
        options: ['1 - Muito ruim', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Excelente'],
        required: true,
        order: 14
      },
      {
        id: '2.15',
        text: 'Como você avalia sua realização profissional?',
        category: 'Autorrealização',
        type: 'scale',
        options: ['1 - Muito ruim', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Excelente'],
        required: true,
        order: 15
      },
      {
        id: '2.16',
        text: 'Como você avalia seu propósito de vida?',
        category: 'Autorrealização',
        type: 'scale',
        options: ['1 - Muito ruim', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Excelente'],
        required: true,
        order: 16
      }
    ]
  },
  {
    id: '3',
    name: 'Estados Emocionais',
    description: 'Avaliação do estado emocional atual e padrões de comportamento',
    category: 'Emocional',
    isActive: true,
    createdAt: '2024-01-15',
    totalResponses: 28,
    questions: [
      // ESTADOS POSITIVOS
      {
        id: '3.1',
        text: 'Com que frequência você se sente feliz?',
        category: 'Positivo',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 1
      },
      {
        id: '3.2',
        text: 'Com que frequência você se sente motivado(a)?',
        category: 'Positivo',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 2
      },
      {
        id: '3.3',
        text: 'Com que frequência você se sente confiante?',
        category: 'Positivo',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 3
      },
      {
        id: '3.4',
        text: 'Com que frequência você se sente grato(a)?',
        category: 'Positivo',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 4
      },
      {
        id: '3.5',
        text: 'Com que frequência você se sente em paz?',
        category: 'Positivo',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 5
      },
      // ESTADOS NEGATIVOS
      {
        id: '3.6',
        text: 'Com que frequência você se sente ansioso(a)?',
        category: 'Negativo',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 6
      },
      {
        id: '3.7',
        text: 'Com que frequência você se sente estressado(a)?',
        category: 'Negativo',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 7
      },
      {
        id: '3.8',
        text: 'Com que frequência você se sente triste?',
        category: 'Negativo',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 8
      },
      {
        id: '3.9',
        text: 'Com que frequência você se sente irritado(a)?',
        category: 'Negativo',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 9
      },
      {
        id: '3.10',
        text: 'Com que frequência você se sente frustrado(a)?',
        category: 'Negativo',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 10
      },
      // ESTADOS NEUTROS
      {
        id: '3.11',
        text: 'Com que frequência você se sente neutro(a)?',
        category: 'Neutro',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 11
      },
      {
        id: '3.12',
        text: 'Com que frequência você se sente indiferente?',
        category: 'Neutro',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 12
      },
      {
        id: '3.13',
        text: 'Com que frequência você se sente cansado(a)?',
        category: 'Neutro',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 13
      },
      // GATILHOS EMOCIONAIS
      {
        id: '3.14',
        text: 'O que mais te deixa ansioso(a)?',
        category: 'Gatilhos',
        type: 'text',
        required: false,
        order: 14
      },
      {
        id: '3.15',
        text: 'O que mais te deixa estressado(a)?',
        category: 'Gatilhos',
        type: 'text',
        required: false,
        order: 15
      },
      {
        id: '3.16',
        text: 'O que mais te deixa feliz?',
        category: 'Gatilhos',
        type: 'text',
        required: false,
        order: 16
      }
    ]
  },
  {
    id: '4',
    name: 'Sabotadores Plus',
    description: 'Avaliação avançada de comportamentos limitantes e crenças sabotadoras',
    category: 'Comportamento Avançado',
    isActive: true,
    createdAt: '2024-01-15',
    totalResponses: 19,
    questions: [
      // SABOTADORES DE PRODUTIVIDADE
      {
        id: '4.1',
        text: 'Você procrastina tarefas importantes?',
        category: 'Produtividade',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 1
      },
      {
        id: '4.2',
        text: 'Você se distrai facilmente durante o trabalho?',
        category: 'Produtividade',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 2
      },
      {
        id: '4.3',
        text: 'Você tem dificuldade para priorizar tarefas?',
        category: 'Produtividade',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 3
      },
      {
        id: '4.4',
        text: 'Você trabalha em excesso sem pausas?',
        category: 'Produtividade',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 4
      },
      {
        id: '4.5',
        text: 'Você tem dificuldade para dizer "não"?',
        category: 'Produtividade',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 5
      },
      // SABOTADORES DE RELACIONAMENTOS
      {
        id: '4.6',
        text: 'Você tem dificuldade para expressar suas necessidades?',
        category: 'Relacionamentos',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 6
      },
      {
        id: '4.7',
        text: 'Você evita conflitos a qualquer custo?',
        category: 'Relacionamentos',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 7
      },
      {
        id: '4.8',
        text: 'Você tem dificuldade para confiar nas pessoas?',
        category: 'Relacionamentos',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 8
      },
      {
        id: '4.9',
        text: 'Você se compara constantemente com outros?',
        category: 'Relacionamentos',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 9
      },
      {
        id: '4.10',
        text: 'Você tem medo de rejeição?',
        category: 'Relacionamentos',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 10
      },
      // SABOTADORES DE SAÚDE MENTAL
      {
        id: '4.11',
        text: 'Você tem pensamentos negativos recorrentes?',
        category: 'Saúde Mental',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 11
      },
      {
        id: '4.12',
        text: 'Você se preocupa excessivamente com o futuro?',
        category: 'Saúde Mental',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 12
      },
      {
        id: '4.13',
        text: 'Você tem dificuldade para relaxar?',
        category: 'Saúde Mental',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 13
      },
      {
        id: '4.14',
        text: 'Você se sente culpado(a) por coisas que não fez?',
        category: 'Saúde Mental',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 14
      },
      {
        id: '4.15',
        text: 'Você tem perfeccionismo excessivo?',
        category: 'Saúde Mental',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 15
      },
      // SABOTADORES DE DESENVOLVIMENTO
      {
        id: '4.16',
        text: 'Você tem medo de falhar?',
        category: 'Desenvolvimento',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 16
      },
      {
        id: '4.17',
        text: 'Você evita sair da sua zona de conforto?',
        category: 'Desenvolvimento',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 17
      },
      {
        id: '4.18',
        text: 'Você tem dificuldade para aceitar feedback?',
        category: 'Desenvolvimento',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 18
      },
      {
        id: '4.19',
        text: 'Você se compara com sua versão ideal?',
        category: 'Desenvolvimento',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 19
      },
      {
        id: '4.20',
        text: 'Você tem medo de sucesso?',
        category: 'Desenvolvimento',
        type: 'multiple_choice',
        options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
        required: true,
        order: 20
      }
    ]
  }
];

export const AnamneseManager: React.FC = () => {
  const [tests, setTests] = useState<AnamneseTest[]>(anamneseTests);
  const [selectedTest, setSelectedTest] = useState<AnamneseTest | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tests' | 'results'>('tests');

  const handleCreateTest = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditTest = (test: AnamneseTest) => {
    setSelectedTest(test);
    setIsEditDialogOpen(true);
  };

  const handleViewTest = (test: AnamneseTest) => {
    setSelectedTest(test);
    setIsViewDialogOpen(true);
  };

  const handleDeleteTest = (testId: string) => {
    setTests(tests.filter(test => test.id !== testId));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Comportamento':
        return <Target className="w-4 h-4" />;
      case 'Desenvolvimento':
        return <Brain className="w-4 h-4" />;
      case 'Emocional':
        return <Heart className="w-4 h-4" />;
      case 'Comportamento Avançado':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Comportamento':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Desenvolvimento':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Emocional':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Comportamento Avançado':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Questionários de Anamnese</h2>
            <p className="text-gray-600">Gerencie os questionários de avaliação dos clientes</p>
          </div>
          <Button onClick={handleCreateTest} className="bg-brand-500 hover:bg-brand-600">
            <Plus className="w-4 h-4 mr-2" />
            Novo Questionário
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-1 bg-white p-1 rounded-lg border border-gray-200">
          <Button
            variant={activeTab === 'tests' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('tests')}
            className="flex items-center space-x-2"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Questionários</span>
          </Button>
          <Button
            variant={activeTab === 'results' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('results')}
            className="flex items-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Resultados</span>
          </Button>
        </nav>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ClipboardList className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Questionários</p>
                <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Respostas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tests.reduce((sum, test) => sum + test.totalResponses, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tests.filter(test => test.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Média de Perguntas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(tests.reduce((sum, test) => sum + test.questions.length, 0) / tests.length)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'tests' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
          <Card key={test.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(test.category)}
                  <div>
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                    <Badge className={`mt-1 ${getCategoryColor(test.category)}`}>
                      {test.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Switch
                    checked={test.isActive}
                    onCheckedChange={() => {
                      setTests(tests.map(t => 
                        t.id === test.id ? { ...t, isActive: !t.isActive } : t
                      ));
                    }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{test.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Perguntas:</span>
                  <span className="font-medium">{test.questions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Respostas:</span>
                  <span className="font-medium">{test.totalResponses}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Criado em:</span>
                  <span className="font-medium">{new Date(test.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewTest(test)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditTest(test)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteTest(test.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      ) : (
        <AnamneseResults />
      )}

      {/* Create Test Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Criar Novo Questionário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Questionário</Label>
              <Input id="name" placeholder="Ex: Avaliação de Hábitos Alimentares" />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                placeholder="Descreva o objetivo e conteúdo do questionário"
              />
            </div>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comportamento">Comportamento</SelectItem>
                  <SelectItem value="desenvolvimento">Desenvolvimento</SelectItem>
                  <SelectItem value="emocional">Emocional</SelectItem>
                  <SelectItem value="comportamento-avancado">Comportamento Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Criar Questionário
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Test Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTest?.name}</DialogTitle>
          </DialogHeader>
          {selectedTest && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-gray-600">{selectedTest.description}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Perguntas ({selectedTest.questions.length})</h3>
                <div className="space-y-4">
                  {selectedTest.questions.map((question) => (
                    <Card key={question.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {question.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {question.type === 'multiple_choice' ? 'Múltipla Escolha' : 
                                 question.type === 'scale' ? 'Escala' : 'Texto'}
                              </Badge>
                              {question.required && (
                                <Badge variant="outline" className="text-xs text-red-600">
                                  Obrigatória
                                </Badge>
                              )}
                            </div>
                            <p className="font-medium">{question.text}</p>
                            {question.options && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-1">Opções:</p>
                                <div className="space-y-1">
                                  {question.options.map((option, index) => (
                                    <div key={index} className="text-sm text-gray-600">
                                      • {option}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 ml-4">
                            #{question.order}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 