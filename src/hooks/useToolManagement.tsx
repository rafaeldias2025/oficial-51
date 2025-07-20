import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  CoachingTool,
  ToolQuestion,
  UseToolManagementReturn
} from '@/types/session-system';

export const useToolManagement = (): UseToolManagementReturn => {
  const [tools, setTools] = useState<CoachingTool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar todas as ferramentas
  const loadTools = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('coaching_tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Carregar perguntas para cada ferramenta
      const toolsWithQuestions = await Promise.all(
        data.map(async (tool) => {
          const { data: questions } = await supabase
            .from('tool_questions')
            .select('*')
            .eq('tool_id', tool.id)
            .order('question_order');

          return {
            ...tool,
            questions: questions || []
          };
        })
      );

      setTools(toolsWithQuestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar ferramentas');
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar nova ferramenta
  const createTool = useCallback(async (tool: Partial<CoachingTool>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('coaching_tools')
        .insert({
          name: tool.name,
          description: tool.description,
          category: tool.category,
          estimated_time: tool.estimatedTime || 30,
          is_active: tool.isActive ?? true
        })
        .select()
        .single();

      if (error) throw error;

      // Se há perguntas, inseri-las
      if (tool.questions && tool.questions.length > 0) {
        const questionsToInsert = tool.questions.map((question, index) => ({
          tool_id: data.id,
          question_text: question.questionText,
          question_type: question.questionType,
          category: question.category,
          question_order: index + 1,
          options: question.options,
          scale_range: question.scaleRange,
          is_required: question.isRequired
        }));

        const { error: questionsError } = await supabase
          .from('tool_questions')
          .insert(questionsToInsert);

        if (questionsError) throw questionsError;
      }

      // Recarregar ferramentas
      await loadTools();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar ferramenta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadTools]);

  // Atualizar ferramenta
  const updateTool = useCallback(async (id: string, tool: Partial<CoachingTool>) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('coaching_tools')
        .update({
          name: tool.name,
          description: tool.description,
          category: tool.category,
          estimated_time: tool.estimatedTime,
          is_active: tool.isActive
        })
        .eq('id', id);

      if (error) throw error;

      // Se há perguntas atualizadas, atualizá-las
      if (tool.questions) {
        // Primeiro, deletar perguntas existentes
        await supabase
          .from('tool_questions')
          .delete()
          .eq('tool_id', id);

        // Depois, inserir novas perguntas
        const questionsToInsert = tool.questions.map((question, index) => ({
          tool_id: parseInt(id),
          question_text: question.questionText,
          question_type: question.questionType,
          category: question.category,
          question_order: index + 1,
          options: question.options,
          scale_range: question.scaleRange,
          is_required: question.isRequired
        }));

        const { error: questionsError } = await supabase
          .from('tool_questions')
          .insert(questionsToInsert);

        if (questionsError) throw questionsError;
      }

      // Recarregar ferramentas
      await loadTools();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar ferramenta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadTools]);

  // Deletar ferramenta
  const deleteTool = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('coaching_tools')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Recarregar ferramentas
      await loadTools();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar ferramenta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadTools]);

  // Obter ferramenta específica
  const getTool = useCallback((id: string): CoachingTool | null => {
    return tools.find(tool => tool.id === id) || null;
  }, [tools]);

  // Carregar ferramentas na inicialização
  useState(() => {
    loadTools();
  });

  return {
    tools,
    loading,
    error,
    createTool,
    updateTool,
    deleteTool,
    getTool
  };
}; 