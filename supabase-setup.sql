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
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    form_data JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indici per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_property_amenities_property_id ON property_amenities(property_id);
CREATE INDEX IF NOT EXISTS idx_feedback_property_id ON feedback(property_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_form_data ON feedback USING GIN(form_data);

-- Rimuovi la tabella feedback_forms (non più necessaria)
DROP TABLE IF EXISTS feedback_forms;

-- Abilita Row Level Security su tutte le tabelle
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;

-- Funzione per verificare se l'utente è admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.role() = 'authenticated';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Rimuovi tutte le policy esistenti per evitare conflitti
DROP POLICY IF EXISTS "Enable read access for all users" ON properties;
DROP POLICY IF EXISTS "Enable insert for all users" ON properties;
DROP POLICY IF EXISTS "Enable update for all users" ON properties;
DROP POLICY IF EXISTS "Enable delete for all users" ON properties;

DROP POLICY IF EXISTS "Enable read access for all users" ON property_amenities;
DROP POLICY IF EXISTS "Enable insert for all users" ON property_amenities;
DROP POLICY IF EXISTS "Enable update for all users" ON property_amenities;
DROP POLICY IF EXISTS "Enable delete for all users" ON property_amenities;

DROP POLICY IF EXISTS "Enable read access for all users" ON feedback;
DROP POLICY IF EXISTS "Enable insert for all users" ON feedback;

DROP POLICY IF EXISTS "Admin can read all feedback" ON feedback;
DROP POLICY IF EXISTS "Admin can manage properties" ON properties;
DROP POLICY IF EXISTS "Admin can manage property amenities" ON property_amenities;

-- Policy per la tabella feedback (solo admin può leggere)
CREATE POLICY "Admin can read all feedback" ON feedback
    FOR SELECT USING (is_admin());

-- Policy per permettere inserimento feedback da utenti non autenticati
CREATE POLICY "Anyone can insert feedback" ON feedback
    FOR INSERT WITH CHECK (true);

-- Policy per la tabella properties (solo admin può gestire)
CREATE POLICY "Admin can manage properties" ON properties
    FOR ALL USING (is_admin());

-- Policy per la tabella property_amenities (solo admin può gestire)
CREATE POLICY "Admin can manage property amenities" ON property_amenities
    FOR ALL USING (is_admin());

-- Commenti per documentazione
COMMENT ON TABLE properties IS 'Tabella delle proprietà Airbnb';
COMMENT ON TABLE feedback IS 'Tabella per salvare i questionari di feedback Airbnb';
COMMENT ON TABLE property_amenities IS 'Tabella per le amenità delle proprietà';
COMMENT ON COLUMN feedback.form_data IS 'Dati del questionario in formato JSON';
COMMENT ON COLUMN feedback.property_id IS 'ID della proprietà associata al feedback'; 