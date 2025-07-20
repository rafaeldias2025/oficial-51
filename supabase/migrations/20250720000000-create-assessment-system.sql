-- Criar tabela de ferramentas de coaching
CREATE TABLE IF NOT EXISTS public.coaching_tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  total_questions INTEGER NOT NULL DEFAULT 0,
  estimated_time INTEGER NOT NULL DEFAULT 15,
  question_data JSONB NOT NULL DEFAULT '[]'::JSONB,
  scoring_config JSONB DEFAULT '{}'::JSONB,
  instructions TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de resultados de avaliações
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id INTEGER NOT NULL REFERENCES public.coaching_tools(id) ON DELETE CASCADE,
  score DECIMAL(5,2),
  results_data JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de atribuições de avaliações
CREATE TABLE IF NOT EXISTS public.assessment_assignments (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id INTEGER NOT NULL REFERENCES public.coaching_tools(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  instructions TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  result_id INTEGER REFERENCES public.assessment_results(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_coaching_tools_is_active ON public.coaching_tools(is_active);
CREATE INDEX IF NOT EXISTS idx_assessment_results_user_id ON public.assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_tool_id ON public.assessment_results(tool_id);
CREATE INDEX IF NOT EXISTS idx_assessment_assignments_user_id ON public.assessment_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_assignments_tool_id ON public.assessment_assignments(tool_id);
CREATE INDEX IF NOT EXISTS idx_assessment_assignments_status ON public.assessment_assignments(status);

-- Adicionar políticas de segurança (RLS)

-- Habilitar RLS nas tabelas
ALTER TABLE public.coaching_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_assignments ENABLE ROW LEVEL SECURITY;

-- Políticas para coaching_tools
CREATE POLICY coaching_tools_select_policy ON public.coaching_tools
  FOR SELECT USING (true);

CREATE POLICY coaching_tools_insert_policy ON public.coaching_tools
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND (users.raw_user_meta_data->>'is_admin')::text = 'true'
    )
  );

CREATE POLICY coaching_tools_update_policy ON public.coaching_tools
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND (users.raw_user_meta_data->>'is_admin')::text = 'true'
    )
  );

CREATE POLICY coaching_tools_delete_policy ON public.coaching_tools
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND (users.raw_user_meta_data->>'is_admin')::text = 'true'
    )
  );

-- Políticas para assessment_results
CREATE POLICY assessment_results_select_policy ON public.assessment_results
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND (users.raw_user_meta_data->>'is_admin')::text = 'true'
    )
  );

CREATE POLICY assessment_results_insert_policy ON public.assessment_results
  FOR INSERT WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND (users.raw_user_meta_data->>'is_admin')::text = 'true'
    )
  );

CREATE POLICY assessment_results_update_policy ON public.assessment_results
  FOR UPDATE USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND (users.raw_user_meta_data->>'is_admin')::text = 'true'
    )
  );

CREATE POLICY assessment_results_delete_policy ON public.assessment_results
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND (users.raw_user_meta_data->>'is_admin')::text = 'true'
    )
  );

-- Políticas para assessment_assignments
CREATE POLICY assessment_assignments_select_policy ON public.assessment_assignments
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND (users.raw_user_meta_data->>'is_admin')::text = 'true'
    )
  );

CREATE POLICY assessment_assignments_insert_policy ON public.assessment_assignments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND (users.raw_user_meta_data->>'is_admin')::text = 'true'
    )
  );

CREATE POLICY assessment_assignments_update_policy ON public.assessment_assignments
  FOR UPDATE USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND (users.raw_user_meta_data->>'is_admin')::text = 'true'
    )
  );

CREATE POLICY assessment_assignments_delete_policy ON public.assessment_assignments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND (users.raw_user_meta_data->>'is_admin')::text = 'true'
    )
  );

-- Criar dados iniciais para ferramentas de coaching
INSERT INTO public.coaching_tools (name, description, category, total_questions, estimated_time, question_data, scoring_config)
VALUES
  (
    'Roda da Saúde Galileu',
    'Avaliação holística dos 16 sistemas de saúde',
    'Saúde',
    16,
    15,
    '[
      {"number": 1, "text": "Como está sua saúde mental?", "type": "scale", "category": "Mental", "min": 1, "max": 10},
      {"number": 2, "text": "Como está sua saúde emocional?", "type": "scale", "category": "Emocional", "min": 1, "max": 10},
      {"number": 3, "text": "Como está sua saúde cardiovascular?", "type": "scale", "category": "Cardiovascular", "min": 1, "max": 10},
      {"number": 4, "text": "Como está sua saúde visual?", "type": "scale", "category": "Visual", "min": 1, "max": 10},
      {"number": 5, "text": "Como está sua saúde auditiva?", "type": "scale", "category": "Auditiva", "min": 1, "max": 10},
      {"number": 6, "text": "Como está sua saúde respiratória?", "type": "scale", "category": "Respiratória", "min": 1, "max": 10},
      {"number": 7, "text": "Como está sua saúde vocal?", "type": "scale", "category": "Vocal", "min": 1, "max": 10},
      {"number": 8, "text": "Como está sua saúde pulmonar?", "type": "scale", "category": "Pulmonar", "min": 1, "max": 10},
      {"number": 9, "text": "Como está sua saúde digestiva?", "type": "scale", "category": "Digestiva", "min": 1, "max": 10},
      {"number": 10, "text": "Como está sua saúde hepática?", "type": "scale", "category": "Hepática", "min": 1, "max": 10},
      {"number": 11, "text": "Como está sua saúde renal?", "type": "scale", "category": "Renal", "min": 1, "max": 10},
      {"number": 12, "text": "Como está sua saúde muscular?", "type": "scale", "category": "Muscular", "min": 1, "max": 10},
      {"number": 13, "text": "Como está sua saúde óssea?", "type": "scale", "category": "Óssea", "min": 1, "max": 10},
      {"number": 14, "text": "Como está sua saúde imunológica?", "type": "scale", "category": "Imunológica", "min": 1, "max": 10},
      {"number": 15, "text": "Como está sua saúde endócrina?", "type": "scale", "category": "Endócrina", "min": 1, "max": 10},
      {"number": 16, "text": "Como está sua saúde neurológica?", "type": "scale", "category": "Neurológica", "min": 1, "max": 10}
    ]'::JSONB,
    '{"max_score": 10, "categories": ["Mental", "Emocional", "Cardiovascular", "Visual", "Auditiva", "Respiratória", "Vocal", "Pulmonar", "Digestiva", "Hepática", "Renal", "Muscular", "Óssea", "Imunológica", "Endócrina", "Neurológica"]}'::JSONB
  ),
  (
    'SistemaGB',
    'Avaliação completa de bem-estar e qualidade de vida',
    'Bem-estar',
    20,
    20,
    '[
      {"number": 1, "text": "Como você avalia sua qualidade do sono?", "type": "scale", "category": "Fisiológico", "min": 1, "max": 10},
      {"number": 2, "text": "Como você avalia sua alimentação?", "type": "scale", "category": "Fisiológico", "min": 1, "max": 10},
      {"number": 3, "text": "Como você avalia sua hidratação?", "type": "scale", "category": "Fisiológico", "min": 1, "max": 10},
      {"number": 4, "text": "Como você avalia sua atividade física?", "type": "scale", "category": "Fisiológico", "min": 1, "max": 10},
      {"number": 5, "text": "Como você avalia sua respiração?", "type": "scale", "category": "Fisiológico", "min": 1, "max": 10},
      {"number": 6, "text": "Como você avalia sua segurança financeira?", "type": "scale", "category": "Segurança", "min": 1, "max": 10},
      {"number": 7, "text": "Como você avalia sua segurança emocional?", "type": "scale", "category": "Segurança", "min": 1, "max": 10},
      {"number": 8, "text": "Como você avalia sua segurança física?", "type": "scale", "category": "Segurança", "min": 1, "max": 10},
      {"number": 9, "text": "Como você avalia sua segurança jurídica?", "type": "scale", "category": "Segurança", "min": 1, "max": 10},
      {"number": 10, "text": "Como você avalia sua segurança digital?", "type": "scale", "category": "Segurança", "min": 1, "max": 10},
      {"number": 11, "text": "Como você avalia suas relações familiares?", "type": "scale", "category": "Social", "min": 1, "max": 10},
      {"number": 12, "text": "Como você avalia suas amizades?", "type": "scale", "category": "Social", "min": 1, "max": 10},
      {"number": 13, "text": "Como você avalia sua vida amorosa?", "type": "scale", "category": "Social", "min": 1, "max": 10},
      {"number": 14, "text": "Como você avalia suas relações profissionais?", "type": "scale", "category": "Social", "min": 1, "max": 10},
      {"number": 15, "text": "Como você avalia suas relações comunitárias?", "type": "scale", "category": "Social", "min": 1, "max": 10},
      {"number": 16, "text": "Como você avalia sua autoestima?", "type": "scale", "category": "Estima", "min": 1, "max": 10},
      {"number": 17, "text": "Como você avalia o reconhecimento que recebe?", "type": "scale", "category": "Estima", "min": 1, "max": 10},
      {"number": 18, "text": "Como você avalia sua confiança em si mesmo?", "type": "scale", "category": "Estima", "min": 1, "max": 10},
      {"number": 19, "text": "Como você avalia seu respeito próprio?", "type": "scale", "category": "Estima", "min": 1, "max": 10},
      {"number": 20, "text": "Como você avalia sua dignidade?", "type": "scale", "category": "Estima", "min": 1, "max": 10}
    ]'::JSONB,
    '{"max_score": 10, "categories": ["Fisiológico", "Segurança", "Social", "Estima"]}'::JSONB
  ),
  (
    'SistemizeCoach',
    'Avaliação de padrões comportamentais e sabotadores',
    'Comportamento',
    30,
    25,
    '[
      {"number": 1, "text": "Com que frequência você se sente feliz?", "type": "scale", "category": "Emocional", "min": 1, "max": 10},
      {"number": 2, "text": "Com que frequência você se sente motivado(a)?", "type": "scale", "category": "Emocional", "min": 1, "max": 10},
      {"number": 3, "text": "Com que frequência você se sente confiante?", "type": "scale", "category": "Emocional", "min": 1, "max": 10},
      {"number": 4, "text": "Com que frequência você se sente grato(a)?", "type": "scale", "category": "Emocional", "min": 1, "max": 10},
      {"number": 5, "text": "Com que frequência você se sente em paz?", "type": "scale", "category": "Emocional", "min": 1, "max": 10},
      {"number": 6, "text": "Você procrastina tarefas importantes?", "type": "scale", "category": "Comportamental", "min": 1, "max": 10},
      {"number": 7, "text": "Você se distrai facilmente durante o trabalho?", "type": "scale", "category": "Comportamental", "min": 1, "max": 10},
      {"number": 8, "text": "Você tem dificuldade para priorizar tarefas?", "type": "scale", "category": "Comportamental", "min": 1, "max": 10},
      {"number": 9, "text": "Você trabalha em excesso sem pausas?", "type": "scale", "category": "Comportamental", "min": 1, "max": 10},
      {"number": 10, "text": "Você tem dificuldade para dizer não?", "type": "scale", "category": "Comportamental", "min": 1, "max": 10},
      {"number": 11, "text": "Você tem pensamentos negativos recorrentes?", "type": "scale", "category": "Cognitivo", "min": 1, "max": 10},
      {"number": 12, "text": "Você se preocupa excessivamente com o futuro?", "type": "scale", "category": "Cognitivo", "min": 1, "max": 10},
      {"number": 13, "text": "Você tem dificuldade para relaxar?", "type": "scale", "category": "Cognitivo", "min": 1, "max": 10},
      {"number": 14, "text": "Você se sente culpado(a) por coisas que não fez?", "type": "scale", "category": "Cognitivo", "min": 1, "max": 10},
      {"number": 15, "text": "Você tem perfeccionismo excessivo?", "type": "scale", "category": "Cognitivo", "min": 1, "max": 10},
      {"number": 16, "text": "Você tem alimentos calóricos facilmente acessíveis em casa?", "type": "scale", "category": "Ambiental", "min": 1, "max": 10},
      {"number": 17, "text": "Você come em ambientes que distraem sua atenção?", "type": "scale", "category": "Ambiental", "min": 1, "max": 10},
      {"number": 18, "text": "Você come em horários irregulares?", "type": "scale", "category": "Ambiental", "min": 1, "max": 10},
      {"number": 19, "text": "Você come em locais inadequados?", "type": "scale", "category": "Ambiental", "min": 1, "max": 10},
      {"number": 20, "text": "Você come em situações sociais?", "type": "scale", "category": "Ambiental", "min": 1, "max": 10},
      {"number": 21, "text": "Você tem dificuldade para expressar suas necessidades?", "type": "scale", "category": "Social", "min": 1, "max": 10},
      {"number": 22, "text": "Você evita conflitos a qualquer custo?", "type": "scale", "category": "Social", "min": 1, "max": 10},
      {"number": 23, "text": "Você tem dificuldade para confiar nas pessoas?", "type": "scale", "category": "Social", "min": 1, "max": 10},
      {"number": 24, "text": "Você se compara constantemente com outros?", "type": "scale", "category": "Social", "min": 1, "max": 10},
      {"number": 25, "text": "Você tem medo de rejeição?", "type": "scale", "category": "Social", "min": 1, "max": 10},
      {"number": 26, "text": "Você come quando está com sede?", "type": "scale", "category": "Fisiológico", "min": 1, "max": 10},
      {"number": 27, "text": "Você come quando está com sono?", "type": "scale", "category": "Fisiológico", "min": 1, "max": 10},
      {"number": 28, "text": "Você come quando está com cansaço?", "type": "scale", "category": "Fisiológico", "min": 1, "max": 10},
      {"number": 29, "text": "Você come quando está com dor?", "type": "scale", "category": "Fisiológico", "min": 1, "max": 10},
      {"number": 30, "text": "Você come quando está com febre?", "type": "scale", "category": "Fisiológico", "min": 1, "max": 10}
    ]'::JSONB,
    '{"max_score": 10, "categories": ["Emocional", "Comportamental", "Cognitivo", "Ambiental", "Social", "Fisiológico"]}'::JSONB
  ); 