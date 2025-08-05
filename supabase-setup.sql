-- SQL per creare le tabelle nel database Supabase
-- Vai su: tuo-progetto.supabase.co > SQL Editor
-- Incolla e esegui questo codice:

-- Tabella proprietà
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT
);

-- Tabella amenità delle proprietà
CREATE TABLE IF NOT EXISTS public.property_amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    amenity_name TEXT NOT NULL,
    is_present BOOLEAN NOT NULL DEFAULT true
);

-- Tabella feedback degli ospiti
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    form_data JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabella feedback_forms (per compatibilità)
CREATE TABLE IF NOT EXISTS public.feedback_forms (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    form_data JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indici per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_property_amenities_property_id ON property_amenities(property_id);
CREATE INDEX IF NOT EXISTS idx_feedback_property_id ON feedback(property_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_form_data ON feedback USING GIN(form_data);
CREATE INDEX IF NOT EXISTS idx_feedback_timestamp ON public.feedback_forms(timestamp);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback_forms(status);

-- Abilita Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_forms ENABLE ROW LEVEL SECURITY;

-- Policy per properties
CREATE POLICY "Enable read access for all users" ON properties FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON properties FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON properties FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON properties FOR DELETE USING (true);

-- Policy per property_amenities
CREATE POLICY "Enable read access for all users" ON property_amenities FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON property_amenities FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON property_amenities FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON property_amenities FOR DELETE USING (true);

-- Policy per feedback
CREATE POLICY "Enable read access for all users" ON feedback FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON feedback FOR INSERT WITH CHECK (true);

-- Policy per feedback_forms
CREATE POLICY "Allow insert feedback" ON public.feedback_forms FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read feedback" ON public.feedback_forms FOR SELECT USING (true);

-- Commenti per documentazione
COMMENT ON TABLE properties IS 'Tabella delle proprietà Airbnb';
COMMENT ON TABLE property_amenities IS 'Amenità disponibili per ogni proprietà';
COMMENT ON TABLE feedback IS 'Feedback degli ospiti per ogni proprietà';
COMMENT ON TABLE public.feedback_forms IS 'Tabella per salvare i questionari di feedback Airbnb';
COMMENT ON COLUMN public.feedback_forms.form_data IS 'Dati del questionario in formato JSON';
COMMENT ON COLUMN public.feedback_forms.status IS 'Stato del questionario: completed, draft, etc.'; 