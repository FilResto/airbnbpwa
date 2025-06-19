import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import FormWizard from './components/FormWizard';
import AdminPanel from './components/AdminPanel';

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container maxWidth="md" sx={{ py: 4, px: { xs: 2, sm: 3 }, mx: 'auto' }}>
          <Routes>
            <Route path="/" element={<FormWizard />} />
            <Route path="/sezione/:step" element={<FormWizard />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
