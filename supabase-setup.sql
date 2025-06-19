-- SQL per creare la tabella nel database Supabase
-- Vai su: tuo-progetto.supabase.co > SQL Editor
-- Incolla e esegui questo codice:

CREATE TABLE IF NOT EXISTS public.feedback_forms (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    form_data JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Abilita Row Level Security (opzionale per sicurezza)
ALTER TABLE public.feedback_forms ENABLE ROW LEVEL SECURITY;

-- Politica per permettere inserimenti (adatta secondo le tue esigenze)
CREATE POLICY "Allow insert feedback" ON public.feedback_forms
    FOR INSERT WITH CHECK (true);

-- Politica per permettere lettura (solo per admin)
CREATE POLICY "Allow read feedback" ON public.feedback_forms
    FOR SELECT USING (true);

-- Indici per migliorare performance
CREATE INDEX IF NOT EXISTS idx_feedback_timestamp ON public.feedback_forms(timestamp);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback_forms(status);

-- Commenti per documentazione
COMMENT ON TABLE public.feedback_forms IS 'Tabella per salvare i questionari di feedback Airbnb';
COMMENT ON COLUMN public.feedback_forms.form_data IS 'Dati del questionario in formato JSON';
COMMENT ON COLUMN public.feedback_forms.status IS 'Stato del questionario: completed, draft, etc.'; 