-- Script para resolver problemas de "out of shared memory" no PostgreSQL
-- Execute este script como superusuário (postgres)

-- 1. Aumentar max_locks_per_transaction (resolve o erro "out of shared memory")
ALTER SYSTEM SET max_locks_per_transaction = 256;

-- 2. Configurar shared_buffers (ajuste conforme a memória disponível)
-- Recomendado: 25% da RAM total, máximo 1GB
ALTER SYSTEM SET shared_buffers = '256MB';

-- 3. Configurar work_mem para operações de ordenação e hash
ALTER SYSTEM SET work_mem = '4MB';

-- 4. Configurar maintenance_work_mem para operações de manutenção
ALTER SYSTEM SET maintenance_work_mem = '64MB';

-- 5. Configurar effective_cache_size (ajuste conforme a memória disponível)
-- Recomendado: 75% da RAM total
ALTER SYSTEM SET effective_cache_size = '1GB';

-- 6. Configurar max_connections (ajuste conforme necessário)
ALTER SYSTEM SET max_connections = 100;

-- 7. Configurar checkpoint_completion_target para melhor performance
ALTER SYSTEM SET checkpoint_completion_target = 0.9;

-- 8. Configurar wal_buffers
ALTER SYSTEM SET wal_buffers = '16MB';

-- 9. Configurar random_page_cost para SSDs
ALTER SYSTEM SET random_page_cost = 1.1;

-- 10. Configurar effective_io_concurrency para SSDs
ALTER SYSTEM SET effective_io_concurrency = 200;

-- 11. Configurar timeouts para evitar travamentos
ALTER SYSTEM SET statement_timeout = '60s';
ALTER SYSTEM SET lock_timeout = '30s';
ALTER SYSTEM SET idle_in_transaction_session_timeout = '10min';

-- 12. Recarregar configurações
SELECT pg_reload_conf();

-- 13. Verificar configurações aplicadas
SELECT name, setting, unit, context, category 
FROM pg_settings 
WHERE name IN (
  'max_locks_per_transaction',
  'shared_buffers',
  'work_mem',
  'maintenance_work_mem',
  'effective_cache_size',
  'max_connections',
  'checkpoint_completion_target',
  'wal_buffers',
  'random_page_cost',
  'effective_io_concurrency',
  'statement_timeout',
  'lock_timeout',
  'idle_in_transaction_session_timeout'
)
ORDER BY category, name;

-- 14. Verificar uso de memória compartilhada
SELECT 
  name,
  setting,
  unit,
  context
FROM pg_settings 
WHERE name LIKE '%memory%' OR name LIKE '%lock%'
ORDER BY name;
