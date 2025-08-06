import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import {
  Add,
  Settings,
  Home,
  Edit,
  Delete,
  Visibility,
  Logout,
  Assessment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AmenityConfigurator from './AmenityConfigurator';

// Import dinamico di SupabaseService
let SupabaseService = null;

function PropertyManager({ onLogout, user }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProperty, setNewProperty] = useState({ name: '', description: '' });
  const [error, setError] = useState(null);
  const [selectedPropertyForConfig, setSelectedPropertyForConfig] = useState(null);
  const [showAmenityConfigurator, setShowAmenityConfigurator] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Debug: verifica variabili d'ambiente
      //console.log('🔍 Debug Environment Variables:');
      //console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
      //console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'PRESENTE' : 'MANCANTE');
      
      // Import dinamico di SupabaseService
      const { default: SupabaseServiceModule } = await import('../services/supabaseService');
      const supabaseService = new SupabaseServiceModule();
      
      const result = await supabaseService.getAllProperties();
      console.log('📊 Result getAllProperties:', result);
      
      if (result.success) {
        setProperties(result.data);
      } else {
        setError('Errore nel caricamento delle proprietà: ' + result.error);
      }
    } catch (error) {
      console.error('Errore nel caricamento proprietà:', error);
      setError('Errore di connessione al database: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = async () => {
    if (!newProperty.name.trim()) {
      setError('Il nome della proprietà è obbligatorio');
      return;
    }

    try {
      const { default: SupabaseServiceModule } = await import('../services/supabaseService');
      const supabaseService = new SupabaseServiceModule();
      const result = await supabaseService.createProperty(newProperty);
      if (result.success) {
        setOpenDialog(false);
        setNewProperty({ name: '', description: '' });
        loadProperties(); // Ricarica la lista
        setError(null);
      } else {
        setError('Errore nel salvataggio: ' + result.error);
      }
    } catch (error) {
      console.error('Errore nel salvataggio proprietà:', error);
      setError('Errore di connessione al database');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa proprietà? Questa azione non può essere annullata.')) {
      return;
    }

    try {
      const { default: SupabaseServiceModule } = await import('../services/supabaseService');
      const supabaseService = new SupabaseServiceModule();
      const result = await supabaseService.deleteProperty(propertyId);
      if (result.success) {
        loadProperties(); // Ricarica la lista
        setError(null);
      } else {
        setError('Errore nell\'eliminazione: ' + result.error);
      }
    } catch (error) {
      console.error('Errore nell\'eliminazione proprietà:', error);
      setError('Errore di connessione al database');
    }
  };

  const handleConfigureAppliances = (propertyId) => {
    setSelectedPropertyForConfig(propertyId);
    setShowAmenityConfigurator(true);
  };

  const handleViewProperty = (propertyId) => {
    // Apri il form con il property_id specifico
    window.open(`/?casa=${propertyId}`, '_blank');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <Home sx={{ mr: 2, color: 'primary.main' }} />
          Gestione Proprietà
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<Assessment />}
            onClick={() => navigate('/admin')}
            size="small"
          >
            Pannello Admin
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Nuova Proprietà
          </Button>
          {user && (
            <Chip 
              label={`Admin: ${user.email}`}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
          {onLogout && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              onClick={onLogout}
            >
              Logout
            </Button>
          )}
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Properties List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Proprietà ({properties.length})
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : properties.length === 0 ? (
            <Alert severity="info">
              Nessuna proprietà trovata. Crea la tua prima proprietà per iniziare.
            </Alert>
          ) : (
            <List>
              {properties.map((property, index) => (
                <React.Fragment key={property.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6">{property.name}</Typography>
                          <Chip 
                            label={`ID: ${property.id.slice(0, 8)}...`} 
                            size="small" 
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {property.description || 'Nessuna descrizione'}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          color="primary"
                          onClick={() => handleViewProperty(property.id)}
                          title="Visualizza Form"
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => handleConfigureAppliances(property.id)}
                          title="Configura Elettrodomestici"
                        >
                          <Settings />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteProperty(property.id)}
                          title="Elimina Proprietà"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < properties.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Add Property Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Add sx={{ mr: 1, color: 'primary.main' }} />
            Nuova Proprietà
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Nome Proprietà *"
              value={newProperty.name}
              onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
              sx={{ mb: 2 }}
              placeholder="Es: Appartamento Centro, Villa Mare..."
            />
            <TextField
              fullWidth
              label="Descrizione (opzionale)"
              value={newProperty.description}
              onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
              multiline
              rows={3}
              placeholder="Breve descrizione della proprietà..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Annulla
          </Button>
          <Button 
            onClick={handleAddProperty}
            variant="contained"
            disabled={!newProperty.name.trim()}
          >
            Salva Proprietà
          </Button>
        </DialogActions>
      </Dialog>

      {/* Amenity Configurator Dialog */}
      <Dialog 
        open={showAmenityConfigurator} 
        onClose={() => setShowAmenityConfigurator(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Configurazione Elettrodomestici - {selectedPropertyForConfig}
            </Typography>
            <Button onClick={() => setShowAmenityConfigurator(false)}>
              Chiudi
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedPropertyForConfig && (
            <AmenityConfigurator propertyId={selectedPropertyForConfig} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default PropertyManager; 