import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Chip,
} from '@mui/material';
import {
  Kitchen,
  Save,
  Refresh,
  CheckCircle,
} from '@mui/icons-material';

// Dynamic import of SupabaseService
let SupabaseService = null;

// Standard amenities list
const STANDARD_AMENITIES = [
  { id: 'frigorifero', name: 'Frigorifero', icon: '❄️' },
  { id: 'congelatore', name: 'Congelatore', icon: '🧊' },
  { id: 'forno', name: 'Forno', icon: '🔥' },
  { id: 'microonde', name: 'Microonde', icon: '📡' },
  { id: 'lavastoviglie', name: 'Lavastoviglie', icon: '🍽️' },
  { id: 'lavatrice', name: 'Lavatrice', icon: '👕' },
  { id: 'asciugatrice', name: 'Asciugatrice', icon: '🌞' },
  { id: 'caffettiera', name: 'Caffettiera', icon: '☕' },
  { id: 'bollitore', name: 'Bollitore', icon: '💧' },
  { id: 'tostapane', name: 'Tostapane', icon: '🍞' },
  { id: 'frullatore', name: 'Frullatore', icon: '🥤' },
  { id: 'robot_cucina', name: 'Robot da Cucina', icon: '⚙️' },
  { id: 'aria_condizionata', name: 'Aria Condizionata', icon: '❄️' },
  { id: 'riscaldamento', name: 'Riscaldamento', icon: '🔥' },
  { id: 'wifi', name: 'WiFi', icon: '📶' },
  { id: 'tv', name: 'TV', icon: '📺' },
  { id: 'asciugacapelli', name: 'Asciugacapelli', icon: '💨' },
  { id: 'ferro_stiro', name: 'Ferro da Stiro', icon: '👔' },
  { id: 'aspirapolvere', name: 'Aspirapolvere', icon: '🧹' },
  { id: 'parcheggio', name: 'Parcheggio', icon: '🚗' },
  { id: 'giardino', name: 'Giardino/Terrazza', icon: '🌿' },
  { id: 'piscina', name: 'Piscina', icon: '🏊' },
  { id: 'barbecue', name: 'Barbecue', icon: '🍖' },
];

function AmenityConfigurator({ propertyId }) {
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (propertyId) {
      loadAmenities();
    }
  }, [propertyId]);

  const loadAmenities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Dynamic import of SupabaseService
      const { default: SupabaseServiceModule } = await import('../services/supabaseService');
      const supabaseService = new SupabaseServiceModule();
      
      const result = await supabaseService.getPropertyAmenities(propertyId);
      if (result.success) {
        // Transform amenities list to array of IDs
        const amenityIds = result.data.map(amenity => amenity.amenity_name);
        setSelectedAmenities(amenityIds);
      } else {
        setError('Error loading amenities: ' + result.error);
      }
    } catch (error) {
      console.error('Error loading amenities:', error);
      setError('Database connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleAmenityChange = (amenityId, checked) => {
    if (checked) {
      setSelectedAmenities(prev => [...prev, amenityId]);
    } else {
      setSelectedAmenities(prev => prev.filter(id => id !== amenityId));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      const { default: SupabaseServiceModule } = await import('../services/supabaseService');
      const supabaseService = new SupabaseServiceModule();
      const result = await supabaseService.savePropertyAmenities(propertyId, selectedAmenities);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000); // Hide message after 3 seconds
      } else {
        setError('Save error: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving amenities:', error);
      setError('Database connection error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedAmenities([]);
    setError(null);
    setSuccess(false);
  };

  if (!propertyId) {
    return (
      <Alert severity="warning">
        Property ID not provided. Unable to configure amenities.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <Kitchen sx={{ mr: 2, color: 'primary.main' }} />
          Configurazione Elettrodomestici
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleReset}
            disabled={saving}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} /> : <Save />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salva Configurazione'}
          </Button>
        </Box>
      </Box>

      {/* Property ID Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Proprietà ID: {propertyId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Seleziona gli elettrodomestici e servizi disponibili in questa proprietà.
          </Typography>
        </CardContent>
      </Card>

      {/* Success Alert */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle sx={{ mr: 1 }} />
            Configurazione salvata con successo!
          </Box>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Amenities Configuration */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Elettrodomestici e Servizi ({selectedAmenities.length} selezionati)
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {/* Kitchen Appliances */}
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                🍳 Cucina
              </Typography>
              <FormGroup row>
                {STANDARD_AMENITIES.slice(0, 12).map((amenity) => (
                  <FormControlLabel
                    key={amenity.id}
                    control={
                      <Checkbox
                        checked={selectedAmenities.includes(amenity.id)}
                        onChange={(e) => handleAmenityChange(amenity.id, e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{amenity.icon}</span>
                        <span>{amenity.name}</span>
                      </Box>
                    }
                    sx={{ minWidth: 200, mb: 1 }}
                  />
                ))}
              </FormGroup>

              <Divider sx={{ my: 2 }} />

              {/* Comfort & Services */}
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                🏠 Comfort e Servizi
              </Typography>
              <FormGroup row>
                {STANDARD_AMENITIES.slice(12).map((amenity) => (
                  <FormControlLabel
                    key={amenity.id}
                    control={
                      <Checkbox
                        checked={selectedAmenities.includes(amenity.id)}
                        onChange={(e) => handleAmenityChange(amenity.id, e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{amenity.icon}</span>
                        <span>{amenity.name}</span>
                      </Box>
                    }
                    sx={{ minWidth: 200, mb: 1 }}
                  />
                ))}
              </FormGroup>

              {/* Selected Amenities Summary */}
              {selectedAmenities.length > 0 && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Amenità Selezionate:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedAmenities.map(amenityId => {
                      const amenity = STANDARD_AMENITIES.find(a => a.id === amenityId);
                      return (
                        <Chip
                          key={amenityId}
                          label={`${amenity?.icon} ${amenity?.name}`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Istruzioni:</strong> Seleziona tutti gli elettrodomestici e servizi disponibili 
          nella proprietà. Questi appariranno nel questionario di feedback per gli ospiti.
        </Typography>
      </Alert>
    </Box>
  );
}

export default AmenityConfigurator; 