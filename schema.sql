-- Schema per Airbnb Feedback PWA
-- Tabelle per gestire proprietà, amenità e feedback

-- Tabella proprietà
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT
);

-- Tabella amenità delle proprietà
CREATE TABLE property_amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    amenity_name TEXT NOT NULL,
    is_present BOOLEAN NOT NULL DEFAULT true
);

-- Tabella feedback degli ospiti
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    form_data JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indici per migliorare le performance
CREATE INDEX idx_property_amenities_property_id ON property_amenities(property_id);
CREATE INDEX idx_feedback_property_id ON feedback(property_id);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);
CREATE INDEX idx_feedback_form_data ON feedback USING GIN(form_data);

-- Commenti per documentazione
COMMENT ON TABLE properties IS 'Tabella delle proprietà Airbnb';
COMMENT ON TABLE property_amenities IS 'Amenità disponibili per ogni proprietà';
COMMENT ON TABLE feedback IS 'Feedback degli ospiti per ogni proprietà'; 