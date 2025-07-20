-- Verificar se as ferramentas foram inseridas no banco
SELECT 
    id,
    name,
    category,
    total_questions,
    estimated_time,
    created_at
FROM coaching_tools 
ORDER BY created_at DESC;
