import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, CircularProgress } from '@mui/material';
import FormWizard from './components/FormWizard';
import AdminPanel from './components/AdminPanel';
import PropertyManager from './components/PropertyManager';
import ProtectedRoute from './components/ProtectedRoute';
import FormService from './services/formService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5A5F', // Airbnb red
    },
    secondary: {
      main: '#00A699', // Airbnb teal
    },
    background: {
      default: '#f7f7f7',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: { xs: '1.5rem', sm: '2.125rem' },
    },
    h5: {
      fontWeight: 500,
      fontSize: { xs: '1.25rem', sm: '1.5rem' },
    },
    h6: {
      fontSize: { xs: '1.1rem', sm: '1.25rem' },
    },
    body1: {
      fontSize: { xs: '0.875rem', sm: '1rem' },
    },
    body2: {
      fontSize: { xs: '0.8rem', sm: '0.875rem' },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: { xs: '0.875rem', sm: '1rem' },
          padding: { xs: '8px 16px', sm: '10px 20px' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: { xs: '16px', sm: '24px' },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          padding: { xs: '8px 0', sm: '16px 0' },
        },
      },
    },
  },
});

function App() {
  const [propertyId, setPropertyId] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [loadingAmenities, setLoadingAmenities] = useState(false);

  useEffect(() => {
    // Leggi parametro ?casa=X dall'URL
    const urlParams = new URLSearchParams(window.location.search);
    const casaParam = urlParams.get('casa');
    
    if (casaParam) {
      setPropertyId(casaParam);
      console.log('Property ID from URL:', casaParam);
    }
  }, []);

  useEffect(() => {
    // Fetch amenities quando propertyId cambia
    if (propertyId) {
      setLoadingAmenities(true);
      
      FormService.fetchPropertyAmenities(propertyId)
        .then(result => {
          if (result.success) {
            setAmenities(result.data);
            console.log('Amenities loaded:', result.data);
          } else {
            console.warn('Failed to load amenities:', result.error);
            setAmenities([]); // Fallback a array vuoto
          }
        })
        .catch(error => {
          console.error('Error fetching amenities:', error);
          setAmenities([]); // Fallback a array vuoto
        })
        .finally(() => {
          setLoadingAmenities(false);
        });
    } else {
      setAmenities([]); // Reset se non c'è propertyId
    }
  }, [propertyId]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            overflowY: 'auto',
            backgroundColor: 'background.default',
            py: 4,
          }}
        >
          <Container 
            maxWidth="sm" 
            sx={{ 
              px: { xs: 1, sm: 2, md: 3 },
              width: '100%',
              maxWidth: { xs: '100%', sm: '600px', md: '800px' },
              py: { xs: 2, sm: 4 }
            }}
          >
            {loadingAmenities ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                <CircularProgress size={60} />
              </Box>
            ) : (
              <Routes>
                <Route path="/" element={<FormWizard amenities={amenities} />} />
                <Route path="/sezione/:step" element={<FormWizard amenities={amenities} />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                } />
                <Route path="/properties" element={
                  <ProtectedRoute>
                    <PropertyManager />
                  </ProtectedRoute>
                } />
              </Routes>
            )}
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
