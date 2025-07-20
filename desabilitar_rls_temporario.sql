-- Desabilitar RLS temporariamente para teste
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_tools DISABLE ROW LEVEL SECURITY;

-- Inserir alguns usuários de teste
INSERT INTO public.profiles (id, full_name, email, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'João Silva', 'joao.silva@teste.com', NOW()),
('22222222-2222-2222-2222-222222222222', 'Maria Santos', 'maria.santos@teste.com', NOW()),
('33333333-3333-3333-3333-333333333333', 'Pedro Oliveira', 'pedro.oliveira@teste.com', NOW()),
('44444444-4444-4444-4444-444444444444', 'Ana Costa', 'ana.costa@teste.com', NOW())
ON CONFLICT (id) DO NOTHING;

-- Verificar se os dados foram inseridos
SELECT id, full_name, email FROM public.profiles LIMIT 10; 