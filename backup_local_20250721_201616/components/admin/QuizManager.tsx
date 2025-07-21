import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, CheckCircle, FileText, Target, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points: number;
  order: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  lessonId: string;
  isActive: boolean;
  timeLimit?: number; // em minutos
  passingScore: number; // porcentagem
  questionCount: number;
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

interface QuizFormData {
  title: string;
  description: string;
  lessonId: string;
  isActive: boolean;
  timeLimit?: number;
  passingScore: number;
}

interface QuestionFormData {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
  order: number;
}

export const QuizManager: React.FC = () => {
  // Dados mockados para demonstração
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: '1',
      title: 'Quiz - CHAVE 01 (PACIÊNCIA)',
      description: 'Teste seus conhecimentos sobre paciência',
      lessonId: '1',
      isActive: true,
      timeLimit: 10,
      passingScore: 70,
      questionCount: 5,
      totalPoints: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Quiz - CHAVE 02 (IMAGINAÇÃO)',
      description: 'Avalie sua compreensão sobre imaginação criativa',
      lessonId: '2',
      isActive: true,
      timeLimit: 15,
      passingScore: 80,
      questionCount: 8,
      totalPoints: 80,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const [questions, setQuestions] = useState<QuizQuestion[]>([
    // Quiz 1 - Paciência
    {
      id: '1',
      question: 'Qual é a primeira chave para o sucesso?',
      options: ['Paciência', 'Persistência', 'Perfeição', 'Pressa'],
      correctAnswer: 0,
      explanation: 'A paciência é fundamental para alcançar objetivos duradouros.',
      points: 10,
      order: 1
    },
    {
      id: '2',
      question: 'Como a paciência ajuda no desenvolvimento pessoal?',
      options: ['Acelerando resultados', 'Permitindo crescimento gradual', 'Evitando esforços', 'Ignorando desafios'],
      correctAnswer: 1,
      explanation: 'A paciência permite um crescimento sustentável e duradouro.',
      points: 10,
      order: 2
    },
    {
      id: '3',
      question: 'Qual frase melhor representa a paciência?',
      options: ['"Quero tudo agora"', '"Tudo tem seu tempo"', '"Não posso esperar"', '"É urgente"'],
      correctAnswer: 1,
      explanation: 'Tudo tem seu tempo é a essência da paciência.',
      points: 10,
      order: 3
    },
    {
      id: '4',
      question: 'A paciência está relacionada a:',
      options: ['Ansiedade', 'Autocontrole', 'Impulsividade', 'Pressa'],
      correctAnswer: 1,
      explanation: 'A paciência é diretamente relacionada ao autocontrole.',
      points: 10,
      order: 4
    },
    {
      id: '5',
      question: 'Qual benefício a paciência traz para relacionamentos?',
      options: ['Conflitos constantes', 'Compreensão mútua', 'Isolamento', 'Impulsividade'],
      correctAnswer: 1,
      explanation: 'A paciência permite compreensão e respeito mútuo.',
      points: 10,
      order: 5
    },
    // Quiz 2 - Imaginação
    {
      id: '6',
      question: 'A imaginação criativa é importante para:',
      options: ['Limitar possibilidades', 'Expandir horizontes', 'Manter rotinas', 'Evitar mudanças'],
      correctAnswer: 1,
      explanation: 'A imaginação expande nossos horizontes e possibilidades.',
      points: 10,
      order: 1
    },
    {
      id: '7',
      question: 'Como desenvolver a imaginação criativa?',
      options: ['Seguindo sempre o mesmo caminho', 'Explorando novas experiências', 'Evitando desafios', 'Mantendo rotinas'],
      correctAnswer: 1,
      explanation: 'Explorar novas experiências estimula a criatividade.',
      points: 10,
      order: 2
    }
  ]);

  // Estados do formulário
  const [isAddQuizDialogOpen, setIsAddQuizDialogOpen] = useState(false);
  const [isEditQuizDialogOpen, setIsEditQuizDialogOpen] = useState(false);
  const [isAddQuestionDialogOpen, setIsAddQuestionDialogOpen] = useState(false);
  const [isEditQuestionDialogOpen, setIsEditQuestionDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  
  const [quizFormData, setQuizFormData] = useState<QuizFormData>({
    title: '',
    description: '',
    lessonId: '',
    isActive: true,
    timeLimit: 10,
    passingScore: 70
  });

  const [questionFormData, setQuestionFormData] = useState<QuestionFormData>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    points: 10,
    order: 1
  });

  // Dados mockados de aulas
  const lessons = [
    { id: '1', title: 'CHAVE 01 (PACIÊNCIA)' },
    { id: '2', title: 'CHAVE 02 (IMAGINAÇÃO)' },
    { id: '3', title: 'CHAVE 03 (ADAPTAÇÃO)' },
    { id: '4', title: 'CHAVE 04 (HABITO)' },
    { id: '5', title: 'CHAVE 05 (I.E)' }
  ];

  const handleAddQuiz = () => {
    setIsAddQuizDialogOpen(true);
    setQuizFormData({
      title: '',
      description: '',
      lessonId: '',
      isActive: true,
      timeLimit: 10,
      passingScore: 70
    });
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setQuizFormData({
      title: quiz.title,
      description: quiz.description,
      lessonId: quiz.lessonId,
      isActive: quiz.isActive,
      timeLimit: quiz.timeLimit,
      passingScore: quiz.passingScore
    });
    setIsEditQuizDialogOpen(true);
  };

  const handleSaveQuiz = () => {
    if (editingQuiz) {
      // Editar quiz existente
      setQuizzes(quizzes.map(quiz => 
        quiz.id === editingQuiz.id 
          ? { ...quiz, ...quizFormData, updatedAt: new Date() }
          : quiz
      ));
      setIsEditQuizDialogOpen(false);
      setEditingQuiz(null);
    } else {
      // Adicionar novo quiz
      const newQuiz: Quiz = {
        id: Date.now().toString(),
        ...quizFormData,
        questionCount: 0,
        totalPoints: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setQuizzes([...quizzes, newQuiz]);
      setIsAddQuizDialogOpen(false);
    }
    
    setQuizFormData({
      title: '',
      description: '',
      lessonId: '',
      isActive: true,
      timeLimit: 10,
      passingScore: 70
    });
  };

  const handleAddQuestion = (quizId: string) => {
    setQuestionFormData({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 10,
      order: getQuizQuestions(quizId).length + 1
    });
    setIsAddQuestionDialogOpen(true);
  };

  const handleEditQuestion = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setQuestionFormData({
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || '',
      points: question.points,
      order: question.order
    });
    setIsEditQuestionDialogOpen(true);
  };

  const handleSaveQuestion = () => {
    if (editingQuestion) {
      // Editar questão existente
      setQuestions(questions.map(question => 
        question.id === editingQuestion.id 
          ? { ...question, ...questionFormData, updatedAt: new Date() }
          : question
      ));
      setIsEditQuestionDialogOpen(false);
      setEditingQuestion(null);
    } else {
      // Adicionar nova questão
      const newQuestion: QuizQuestion = {
        id: Date.now().toString(),
        ...questionFormData
      };
      setQuestions([...questions, newQuestion]);
      setIsAddQuestionDialogOpen(false);
    }
    
    setQuestionFormData({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 10,
      order: 1
    });
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
    setQuestions(questions.filter(question => {
      const quiz = quizzes.find(q => q.id === quizId);
      return quiz ? question.id !== quizId : true;
    }));
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(question => question.id !== questionId));
  };

  const handleToggleQuizActive = (quizId: string) => {
    setQuizzes(quizzes.map(quiz => 
      quiz.id === quizId 
        ? { ...quiz, isActive: !quiz.isActive, updatedAt: new Date() }
        : quiz
    ));
  };

  const getQuizQuestions = (quizId: string) => {
    return questions.filter(question => {
      const quiz = quizzes.find(q => q.id === quizId);
      return quiz ? question.id.startsWith(quizId) : false;
    }).sort((a, b) => a.order - b.order);
  };

  const getLessonTitle = (lessonId: string) => {
    return lessons.find(lesson => lesson.id === lessonId)?.title || 'Aula não encontrada';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Quizzes</h2>
          <p className="text-gray-600">Crie e gerencie quizzes para suas aulas</p>
        </div>
        <Dialog open={isAddQuizDialogOpen} onOpenChange={setIsAddQuizDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddQuiz}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Quiz</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="lesson">Aula</Label>
                <Select value={quizFormData.lessonId} onValueChange={(value) => setQuizFormData({...quizFormData, lessonId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma aula" />
                  </SelectTrigger>
                  <SelectContent>
                    {lessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quiz-title">Título do Quiz</Label>
                <Input
                  id="quiz-title"
                  value={quizFormData.title}
                  onChange={(e) => setQuizFormData({...quizFormData, title: e.target.value})}
                  placeholder="Ex: Quiz - CHAVE 01"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quiz-description">Descrição</Label>
                <Textarea
                  id="quiz-description"
                  value={quizFormData.description}
                  onChange={(e) => setQuizFormData({...quizFormData, description: e.target.value})}
                  placeholder="Descreva o quiz"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time-limit">Limite de Tempo (minutos)</Label>
                <Input
                  id="time-limit"
                  type="number"
                  value={quizFormData.timeLimit}
                  onChange={(e) => setQuizFormData({...quizFormData, timeLimit: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="passing-score">Pontuação Mínima (%)</Label>
                <Input
                  id="passing-score"
                  type="number"
                  value={quizFormData.passingScore}
                  onChange={(e) => setQuizFormData({...quizFormData, passingScore: parseInt(e.target.value)})}
                  min="0"
                  max="100"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="quiz-isActive"
                  checked={quizFormData.isActive}
                  onCheckedChange={(checked) => setQuizFormData({...quizFormData, isActive: checked})}
                />
                <Label htmlFor="quiz-isActive">Quiz Ativo</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddQuizDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveQuiz}>
                Salvar Quiz
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Quizzes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => {
          const quizQuestions = getQuizQuestions(quiz.id);
          return (
            <Card key={quiz.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  </div>
                  <Badge variant={quiz.isActive ? "default" : "secondary"}>
                    {quiz.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{quiz.description}</p>
                <p className="text-xs text-gray-500">Aula: {getLessonTitle(quiz.lessonId)}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span>{quizQuestions.length} questões</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{quiz.timeLimit} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-gray-500" />
                    <span>{quiz.passingScore}% mínimo</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{quiz.totalPoints} pontos</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditQuiz(quiz)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddQuestion(quiz.id)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleQuizActive(quiz.id)}
                  >
                    {quiz.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteQuiz(quiz.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Questions List */}
                {quizQuestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Questões:</h4>
                    {quizQuestions.map((question, index) => (
                      <div key={question.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="line-clamp-1">{question.question}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">{question.points} pts</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditQuestion(question)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialog de Adicionar Questão */}
      <Dialog open={isAddQuestionDialogOpen} onOpenChange={setIsAddQuestionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Questão</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="question-text">Pergunta</Label>
              <Textarea
                id="question-text"
                value={questionFormData.question}
                onChange={(e) => setQuestionFormData({...questionFormData, question: e.target.value})}
                placeholder="Digite a pergunta"
              />
            </div>
            <div className="grid gap-2">
              <Label>Opções de Resposta</Label>
              {questionFormData.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={questionFormData.correctAnswer === index}
                    onChange={() => setQuestionFormData({...questionFormData, correctAnswer: index})}
                    className="w-4 h-4 text-purple-600"
                  />
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...questionFormData.options];
                      newOptions[index] = e.target.value;
                      setQuestionFormData({...questionFormData, options: newOptions});
                    }}
                    placeholder={`Opção ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="question-explanation">Explicação (opcional)</Label>
              <Textarea
                id="question-explanation"
                value={questionFormData.explanation}
                onChange={(e) => setQuestionFormData({...questionFormData, explanation: e.target.value})}
                placeholder="Explique a resposta correta"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="question-points">Pontos</Label>
              <Input
                id="question-points"
                type="number"
                value={questionFormData.points}
                onChange={(e) => setQuestionFormData({...questionFormData, points: parseInt(e.target.value)})}
                min="1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="question-order">Ordem</Label>
              <Input
                id="question-order"
                type="number"
                value={questionFormData.order}
                onChange={(e) => setQuestionFormData({...questionFormData, order: parseInt(e.target.value)})}
                min="1"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddQuestionDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveQuestion}>
              Salvar Questão
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Editar Questão */}
      <Dialog open={isEditQuestionDialogOpen} onOpenChange={setIsEditQuestionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Questão</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-question-text">Pergunta</Label>
              <Textarea
                id="edit-question-text"
                value={questionFormData.question}
                onChange={(e) => setQuestionFormData({...questionFormData, question: e.target.value})}
                placeholder="Digite a pergunta"
              />
            </div>
            <div className="grid gap-2">
              <Label>Opções de Resposta</Label>
              {questionFormData.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="edit-correctAnswer"
                    checked={questionFormData.correctAnswer === index}
                    onChange={() => setQuestionFormData({...questionFormData, correctAnswer: index})}
                    className="w-4 h-4 text-purple-600"
                  />
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...questionFormData.options];
                      newOptions[index] = e.target.value;
                      setQuestionFormData({...questionFormData, options: newOptions});
                    }}
                    placeholder={`Opção ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-question-explanation">Explicação (opcional)</Label>
              <Textarea
                id="edit-question-explanation"
                value={questionFormData.explanation}
                onChange={(e) => setQuestionFormData({...questionFormData, explanation: e.target.value})}
                placeholder="Explique a resposta correta"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-question-points">Pontos</Label>
              <Input
                id="edit-question-points"
                type="number"
                value={questionFormData.points}
                onChange={(e) => setQuestionFormData({...questionFormData, points: parseInt(e.target.value)})}
                min="1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-question-order">Ordem</Label>
              <Input
                id="edit-question-order"
                type="number"
                value={questionFormData.order}
                onChange={(e) => setQuestionFormData({...questionFormData, order: parseInt(e.target.value)})}
                min="1"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditQuestionDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveQuestion}>
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Editar Quiz */}
      <Dialog open={isEditQuizDialogOpen} onOpenChange={setIsEditQuizDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Quiz</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-lesson">Aula</Label>
              <Select value={quizFormData.lessonId} onValueChange={(value) => setQuizFormData({...quizFormData, lessonId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma aula" />
                </SelectTrigger>
                <SelectContent>
                  {lessons.map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-quiz-title">Título do Quiz</Label>
              <Input
                id="edit-quiz-title"
                value={quizFormData.title}
                onChange={(e) => setQuizFormData({...quizFormData, title: e.target.value})}
                placeholder="Ex: Quiz - CHAVE 01"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-quiz-description">Descrição</Label>
              <Textarea
                id="edit-quiz-description"
                value={quizFormData.description}
                onChange={(e) => setQuizFormData({...quizFormData, description: e.target.value})}
                placeholder="Descreva o quiz"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-time-limit">Limite de Tempo (minutos)</Label>
              <Input
                id="edit-time-limit"
                type="number"
                value={quizFormData.timeLimit}
                onChange={(e) => setQuizFormData({...quizFormData, timeLimit: parseInt(e.target.value)})}
                min="1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-passing-score">Pontuação Mínima (%)</Label>
              <Input
                id="edit-passing-score"
                type="number"
                value={quizFormData.passingScore}
                onChange={(e) => setQuizFormData({...quizFormData, passingScore: parseInt(e.target.value)})}
                min="0"
                max="100"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-quiz-isActive"
                checked={quizFormData.isActive}
                onCheckedChange={(checked) => setQuizFormData({...quizFormData, isActive: checked})}
              />
              <Label htmlFor="edit-quiz-isActive">Quiz Ativo</Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditQuizDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveQuiz}>
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 