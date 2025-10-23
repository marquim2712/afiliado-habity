-- Criar tabela de afiliados
CREATE TABLE IF NOT EXISTS public.afiliados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  cidade TEXT NOT NULL,
  descricao TEXT NOT NULL,
  codigo TEXT NOT NULL UNIQUE,
  link TEXT NOT NULL,
  qr_url TEXT,
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índice para busca por código
CREATE INDEX idx_afiliados_codigo ON public.afiliados(codigo);

-- Criar índice para ordenação por data
CREATE INDEX idx_afiliados_data ON public.afiliados(data_cadastro DESC);

-- Habilitar RLS (Row Level Security) - Dados públicos para leitura
ALTER TABLE public.afiliados ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública (para exibir lista de afiliados)
CREATE POLICY "Permitir leitura pública de afiliados"
ON public.afiliados
FOR SELECT
USING (true);

-- Permitir inserção pública (para cadastro sem login)
CREATE POLICY "Permitir cadastro público de afiliados"
ON public.afiliados
FOR INSERT
WITH CHECK (true);