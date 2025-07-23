-- Script para inserir dados de exemplo das ferramentas de coaching
-- Execute este script após a migração de sessões

-- Inserir ferramentas de coaching
INSERT INTO coaching_tools (name, description, category, total_questions, estimated_time, question_data, scoring_config) VALUES

-- RODA DA SAÚDE GALILEU
('Roda da Saúde Galileu', 'Avaliação holística dos 16 sistemas de saúde', 'Saúde', 16, 15,
'[
  {"number": 1, "text": "Como está sua saúde mental?", "type": "scale", "category": "Neurológico", "min": 1, "max": 10},
  {"number": 2, "text": "Como está sua saúde emocional?", "type": "scale", "category": "Emocional", "min": 1, "max": 10},
  {"number": 3, "text": "Como está sua saúde cardiovascular?", "type": "scale", "category": "Cardiovascular", "min": 1, "max": 10},
  {"number": 4, "text": "Como está sua saúde visual?", "type": "scale", "category": "Visual", "min": 1, "max": 10},
  {"number": 5, "text": "Como está sua saúde auditiva?", "type": "scale", "category": "Auditivo", "min": 1, "max": 10},
  {"number": 6, "text": "Como está sua saúde respiratória?", "type": "scale", "category": "Respiratório", "min": 1, "max": 10},
  {"number": 7, "text": "Como está sua saúde vocal?", "type": "scale", "category": "Vocal", "min": 1, "max": 10},
  {"number": 8, "text": "Como está sua saúde pulmonar?", "type": "scale", "category": "Pulmonar", "min": 1, "max": 10},
  {"number": 9, "text": "Como está sua saúde digestiva?", "type": "scale", "category": "Digestivo", "min": 1, "max": 10},
  {"number": 10, "text": "Como está sua saúde hepática (fígado)?", "type": "scale", "category": "Hepático", "min": 1, "max": 10},
  {"number": 11, "text": "Como está sua saúde renal (rins)?", "type": "scale", "category": "Renal", "min": 1, "max": 10},
  {"number": 12, "text": "Como está sua saúde muscular?", "type": "scale", "category": "Muscular", "min": 1, "max": 10},
  {"number": 13, "text": "Como está sua saúde óssea?", "type": "scale", "category": "Ósseo", "min": 1, "max": 10},
  {"number": 14, "text": "Como está sua saúde imunológica?", "type": "scale", "category": "Imunológico", "min": 1, "max": 10},
  {"number": 15, "text": "Como está sua saúde endócrina (hormônios)?", "type": "scale", "category": "Endócrino", "min": 1, "max": 10},
  {"number": 16, "text": "Como está sua saúde neurológica?", "type": "scale", "category": "Neurológico", "min": 1, "max": 10}
]',
'{"categories": ["Neurológico", "Emocional", "Cardiovascular", "Visual", "Auditivo", "Respiratório", "Vocal", "Pulmonar", "Digestivo", "Hepático", "Renal", "Muscular", "Ósseo", "Imunológico", "Endócrino"], "max_score": 10, "interpretation": {"0-3": "Sistema comprometido", "4-6": "Sistema necessita atenção", "7-8": "Sistema saudável", "9-10": "Sistema excelente"}}'),

-- INSTITUTO DOS SONHOS
('Instituto dos Sonhos', 'Avaliação completa de bem-estar e qualidade de vida', 'Bem-estar', 20, 20,
'[
  {"number": 1, "text": "Como você avalia sua qualidade do sono?", "type": "scale", "category": "Fisiológico", "min": 1, "max": 10},
  {"number": 2, "text": "Como você avalia sua alimentação?", "type": "scale", "category": "Fisiológico", "min": 1, "max": 10},
  {"number": 3, "text": "Como você avalia sua hidratação?", "type": "scale", "category": "Fisiológico", "min": 1, "max": 10},
  {"number": 4, "text": "Como você avalia sua atividade física?", "type": "scale", "category": "Fisiológico", "min": 1, "max": 10},
  {"number": 5, "text": "Como você avalia sua respiração e relaxamento?", "type": "scale", "category": "Fisiológico", "min": 1, "max": 10},
  {"number": 6, "text": "Como você avalia sua segurança financeira?", "type": "scale", "category": "Segurança", "min": 1, "max": 10},
  {"number": 7, "text": "Como você avalia sua segurança emocional?", "type": "scale", "category": "Segurança", "min": 1, "max": 10},
  {"number": 8, "text": "Como você avalia sua segurança física?", "type": "scale", "category": "Segurança", "min": 1, "max": 10},
  {"number": 9, "text": "Como você avalia sua segurança profissional?", "type": "scale", "category": "Segurança", "min": 1, "max": 10},
  {"number": 10, "text": "Como você avalia sua segurança habitacional?", "type": "scale", "category": "Segurança", "min": 1, "max": 10},
  {"number": 11, "text": "Como você avalia suas relações familiares?", "type": "scale", "category": "Sociais", "min": 1, "max": 10},
  {"number": 12, "text": "Como você avalia suas amizades?", "type": "scale", "category": "Sociais", "min": 1, "max": 10},
  {"number": 13, "text": "Como você avalia sua vida amorosa?", "type": "scale", "category": "Sociais", "min": 1, "max": 10},
  {"number": 14, "text": "Como você avalia suas relações profissionais?", "type": "scale", "category": "Sociais", "min": 1, "max": 10},
  {"number": 15, "text": "Como você avalia suas relações comunitárias?", "type": "scale", "category": "Sociais", "min": 1, "max": 10},
  {"number": 16, "text": "Como você avalia sua autoestima?", "type": "scale", "category": "Estima", "min": 1, "max": 10},
  {"number": 17, "text": "Como você avalia o reconhecimento que recebe?", "type": "scale", "category": "Estima", "min": 1, "max": 10},
  {"number": 18, "text": "Como você avalia sua confiança em si mesmo?", "type": "scale", "category": "Estima", "min": 1, "max": 10},
  {"number": 19, "text": "Como você avalia seu respeito próprio?", "type": "scale", "category": "Estima", "min": 1, "max": 10},
  {"number": 20, "text": "Como você avalia sua reputação?", "type": "scale", "category": "Estima", "min": 1, "max": 10}
]',
'{"categories": ["Fisiológico", "Segurança", "Sociais", "Estima"], "max_score": 10, "interpretation": {"0-3": "Necessidade crítica", "4-6": "Necessidade parcialmente atendida", "7-8": "Necessidade bem atendida", "9-10": "Necessidade plenamente satisfeita"}}'),

-- SISTEMIZECOACH
('SistemizeCoach', 'Avaliação de padrões comportamentais e sabotadores', 'Comportamento', 30, 25,
'[
  {"number": 1, "text": "Você come quando está ansioso(a) ou estressado(a)?", "type": "multiple_choice", "category": "Emocional", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 2, "text": "Você come por hábito, mesmo sem fome?", "type": "multiple_choice", "category": "Comportamental", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 3, "text": "Você come rápido, sem mastigar adequadamente?", "type": "multiple_choice", "category": "Comportamental", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 4, "text": "Você come em frente à TV ou computador?", "type": "multiple_choice", "category": "Ambiental", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 5, "text": "Você pula refeições regularmente?", "type": "multiple_choice", "category": "Comportamental", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 6, "text": "Você come por tédio ou solidão?", "type": "multiple_choice", "category": "Emocional", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 7, "text": "Você come por recompensa emocional?", "type": "multiple_choice", "category": "Emocional", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 8, "text": "Você come por pressão social?", "type": "multiple_choice", "category": "Social", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 9, "text": "Você come em horários irregulares?", "type": "multiple_choice", "category": "Comportamental", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 10, "text": "Você come por impulso?", "type": "multiple_choice", "category": "Comportamental", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 11, "text": "Você pensa já que quebrei a dieta, vou comer tudo?", "type": "multiple_choice", "category": "Cognitivo", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 12, "text": "Você acredita que precisa comer tudo no prato?", "type": "multiple_choice", "category": "Cognitivo", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 13, "text": "Você pensa amanhã eu começo a dieta?", "type": "multiple_choice", "category": "Cognitivo", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 14, "text": "Você acredita que não consegue controlar a alimentação?", "type": "multiple_choice", "category": "Cognitivo", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 15, "text": "Você pensa só mais um pedaço não vai fazer diferença?", "type": "multiple_choice", "category": "Cognitivo", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 16, "text": "Você tem alimentos calóricos facilmente acessíveis em casa?", "type": "multiple_choice", "category": "Ambiental", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 17, "text": "Você come em ambientes que distraem sua atenção?", "type": "multiple_choice", "category": "Ambiental", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 18, "text": "Você come em situações sociais mesmo sem fome?", "type": "multiple_choice", "category": "Social", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 19, "text": "Você come quando está feliz ou celebrando?", "type": "multiple_choice", "category": "Emocional", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 20, "text": "Você come quando está triste ou deprimido(a)?", "type": "multiple_choice", "category": "Emocional", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 21, "text": "Você come quando está frustrado(a) ou irritado(a)?", "type": "multiple_choice", "category": "Emocional", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 22, "text": "Você usa comida como válvula de escape?", "type": "multiple_choice", "category": "Emocional", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 23, "text": "Você come quando está com sede e confunde com fome?", "type": "multiple_choice", "category": "Fisiológico", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 24, "text": "Você come quando está com sono ou cansaço?", "type": "multiple_choice", "category": "Fisiológico", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 25, "text": "Você come quando está entediado(a)?", "type": "multiple_choice", "category": "Emocional", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 26, "text": "Você come por hábito em determinados horários?", "type": "multiple_choice", "category": "Comportamental", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 27, "text": "Você come mais quando está sozinho(a)?", "type": "multiple_choice", "category": "Social", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 28, "text": "Você come escondido ou com vergonha?", "type": "multiple_choice", "category": "Emocional", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 29, "text": "Você come por prazer, mesmo sem fome?", "type": "multiple_choice", "category": "Comportamental", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
  {"number": 30, "text": "Você sente culpa depois de comer determinados alimentos?", "type": "multiple_choice", "category": "Emocional", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]}
]',
'{"categories": ["Emocional", "Comportamental", "Cognitivo", "Ambiental", "Social", "Fisiológico"], "scoring": {"Nunca": 0, "Raramente": 1, "Às vezes": 2, "Frequentemente": 3, "Sempre": 4}, "interpretation": {"0-30": "Baixo nível de sabotadores", "31-60": "Nível moderado de sabotadores", "61-90": "Nível alto de sabotadores", "91-120": "Nível crítico de sabotadores"}}');

-- Verificar se os dados foram inseridos
SELECT name, description, category, total_questions FROM coaching_tools; 