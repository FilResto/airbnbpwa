import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, CircularProgress } from '@mui/material';
import FormWizard from './components/FormWizard';
import AdminPanel from './components/AdminPanel';
import PropertyManager from './components/PropertyManager';
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
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
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
              px: { xs: 2, sm: 3 },
              width: '100%',
              maxWidth: { xs: '100%', sm: '1000px' }
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
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/properties" element={<PropertyManager />} />
              </Routes>
            )}
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
