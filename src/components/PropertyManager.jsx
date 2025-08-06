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
  Tooltip,
  Paper,
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
  QrCode,
  Link,
  ContentCopy,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import AmenityConfigurator from './AmenityConfigurator';

// Dynamic import of SupabaseService
let SupabaseService = null;

function PropertyManager({ onLogout, user }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProperty, setNewProperty] = useState({ name: '', description: '' });
  const [error, setError] = useState(null);
  const [selectedPropertyForConfig, setSelectedPropertyForConfig] = useState(null);
  const [showAmenityConfigurator, setShowAmenityConfigurator] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedPropertyForQR, setSelectedPropertyForQR] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Debug: check environment variables
      //console.log('🔍 Debug Environment Variables:');
      //console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
      //console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'PRESENTE' : 'MANCANTE');
      
      // Dynamic import of SupabaseService
      const { default: SupabaseServiceModule } = await import('../services/supabaseService');
      const supabaseService = new SupabaseServiceModule();
      
      const result = await supabaseService.getAllProperties();
      console.log('📊 Result getAllProperties:', result);
      
      if (result.success) {
        setProperties(result.data);
      } else {
        setError('Error loading properties: ' + result.error);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      setError('Database connection error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = async () => {
    if (!newProperty.name.trim()) {
      setError('Property name is required');
      return;
    }

    try {
      const { default: SupabaseServiceModule } = await import('../services/supabaseService');
      const supabaseService = new SupabaseServiceModule();
      const result = await supabaseService.createProperty(newProperty);
      if (result.success) {
        setOpenDialog(false);
        setNewProperty({ name: '', description: '' });
        loadProperties(); // Reload list
        setError(null);
      } else {
        setError('Save error: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving property:', error);
      setError('Database connection error');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      const { default: SupabaseServiceModule } = await import('../services/supabaseService');
      const supabaseService = new SupabaseServiceModule();
      const result = await supabaseService.deleteProperty(propertyId);
      if (result.success) {
        loadProperties(); // Reload list
        setError(null);
      } else {
        setError('Deletion error: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      setError('Database connection error');
    }
  };

  const handleConfigureAppliances = (propertyId) => {
    setSelectedPropertyForConfig(propertyId);
    setShowAmenityConfigurator(true);
  };

  const handleViewProperty = (propertyId) => {
    // Open form with specific property_id
    window.open(`/?casa=${propertyId}`, '_blank');
  };

  const generatePropertyLink = (propertyId) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/?casa=${propertyId}`;
  };

  const handleShowQRCode = (property) => {
    setSelectedPropertyForQR(property);
    setShowQRDialog(true);
    setCopiedLink(false);
  };

  const handleCopyLink = async (propertyId) => {
    const link = generatePropertyLink(propertyId);
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(true);
      // Find property to show correct feedback
      const property = properties.find(p => p.id === propertyId);
      if (property) {
        setSelectedPropertyForQR(property);
        setCopyMessage(`Link for "${property.name}" copied to clipboard!`);
      }
      setTimeout(() => {
        setCopiedLink(false);
        setCopyMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error copying link:', error);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedLink(true);
      // Find property to show correct feedback
      const property = properties.find(p => p.id === propertyId);
      if (property) {
        setSelectedPropertyForQR(property);
        setCopyMessage(`Link for "${property.name}" copied to clipboard!`);
      }
      setTimeout(() => {
        setCopiedLink(false);
        setCopyMessage('');
      }, 2000);
    }
  };

  const handleCopyLinkFromDialog = async () => {
    if (selectedPropertyForQR) {
      await handleCopyLink(selectedPropertyForQR.id);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        gap: { xs: 2, sm: 0 },
        mb: 3 
      }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <Home sx={{ mr: 2, color: 'primary.main' }} />
          Gestione Proprietà
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 1 }, 
          alignItems: { xs: 'stretch', sm: 'center' },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Button
            variant="outlined"
            startIcon={<Assessment />}
            onClick={() => navigate('/admin')}
            size="small"
            fullWidth={false}
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              order: { xs: 1, sm: 1 }
            }}
          >
            Pannello Admin
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            fullWidth={false}
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              order: { xs: 2, sm: 2 }
            }}
          >
            Nuova Proprietà
          </Button>
          {user && (
            <Chip 
              label={`Admin: ${user.email}`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ 
                order: { xs: 3, sm: 3 },
                alignSelf: { xs: 'center', sm: 'auto' }
              }}
            />
          )}
          {onLogout && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              onClick={onLogout}
              fullWidth={false}
              sx={{ 
                width: { xs: '100%', sm: 'auto' },
                order: { xs: 4, sm: 4 }
              }}
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

      {/* Success Alert */}
      {copyMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setCopyMessage('')}>
          {copyMessage}
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
                  <ListItem sx={{ 
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                    gap: { xs: 2, sm: 0 }
                  }}>
                    <ListItemText
                      primary={
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'flex-start', sm: 'center' }, 
                          gap: 1 
                        }}>
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
                      sx={{ 
                        flex: 1,
                        minWidth: 0 // Allow text to wrap
                      }}
                    />
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'row', sm: 'row' },
                      gap: { xs: 0.5, sm: 1 },
                      flexWrap: 'wrap',
                      justifyContent: { xs: 'center', sm: 'flex-end' },
                      width: { xs: '100%', sm: 'auto' }
                    }}>
                      <Tooltip title="Visualizza Form" placement="top">
                        <IconButton
                          color="primary"
                          onClick={() => handleViewProperty(property.id)}
                          size="small"
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Genera QR Code" placement="top">
                        <IconButton
                          color="info"
                          onClick={() => handleShowQRCode(property)}
                          size="small"
                        >
                          <QrCode />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Copia Link" placement="top">
                        <IconButton
                          color="success"
                          onClick={() => handleCopyLink(property.id)}
                          size="small"
                        >
                          {copiedLink && selectedPropertyForQR?.id === property.id ? <CheckCircle /> : <Link />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Configura Elettrodomestici" placement="top">
                        <IconButton
                          color="secondary"
                          onClick={() => handleConfigureAppliances(property.id)}
                          size="small"
                        >
                          <Settings />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Elimina Proprietà" placement="top">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteProperty(property.id)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                  {index < properties.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Add Property Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { 
            width: { xs: '95%', sm: 'auto' },
            maxWidth: { xs: '95%', sm: '600px' }
          }
        }}
      >
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
        <DialogActions sx={{ 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 },
          p: { xs: 2, sm: 2 }
        }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            fullWidth={false}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Annulla
          </Button>
          <Button 
            onClick={handleAddProperty}
            variant="contained"
            disabled={!newProperty.name.trim()}
            fullWidth={false}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
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

      {/* QR Code Dialog */}
      <Dialog 
        open={showQRDialog} 
        onClose={() => setShowQRDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { 
            width: { xs: '95%', sm: 'auto' },
            maxWidth: { xs: '95%', sm: '600px' }
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <QrCode sx={{ mr: 1, color: 'primary.main' }} />
            QR Code per {selectedPropertyForQR?.name}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPropertyForQR && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Scansiona questo QR code per accedere direttamente al questionario di feedback
              </Typography>
              
              <Paper elevation={3} sx={{ 
                p: { xs: 2, sm: 3 }, 
                display: 'inline-block', 
                mb: 3 
              }}>
                <QRCode
                  value={generatePropertyLink(selectedPropertyForQR.id)}
                  size={window.innerWidth < 600 ? 150 : 200}
                  level="M"
                  style={{ background: 'white' }}
                />
              </Paper>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Link diretto:
                </Typography>
                <TextField
                  fullWidth
                  value={generatePropertyLink(selectedPropertyForQR.id)}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <IconButton
                        onClick={() => handleCopyLink(selectedPropertyForQR.id)}
                        size="small"
                      >
                        {copiedLink ? <CheckCircle color="success" /> : <ContentCopy />}
                      </IconButton>
                    ),
                  }}
                />
              </Box>
              
              <Alert severity="info" sx={{ textAlign: 'left' }}>
                <Typography variant="body2">
                  <strong>Come utilizzare:</strong><br />
                  • Condividi il QR code con gli ospiti alla fine del soggiorno<br />
                  • Gli ospiti possono scansionare il codice con la fotocamera del telefono<br />
                  • Il link si aprirà direttamente nel questionario per questa proprietà
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 },
          p: { xs: 2, sm: 2 }
        }}>
          <Button 
            onClick={() => setShowQRDialog(false)}
            fullWidth={false}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Chiudi
          </Button>
          <Button 
            onClick={handleCopyLinkFromDialog}
            variant="contained"
            startIcon={copiedLink ? <CheckCircle /> : <ContentCopy />}
            fullWidth={false}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            {copiedLink ? 'Link Copiato!' : 'Copia Link'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PropertyManager; 