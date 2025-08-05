import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Import dinamico di SupabaseService
      const { default: SupabaseService } = await import('../services/supabaseService');
      const supabaseService = new SupabaseService();
      
      const result = await supabaseService.signIn(credentials.email, credentials.password);
      
      if (result.success) {
        onLogin(true);
      } else {
        setError(result.error || 'Credenziali non valide. Riprova.');
      }
    } catch (error) {
      console.error('Errore login:', error);
      setError('Errore di connessione. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Lock sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Accesso Admin
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Inserisci le credenziali per accedere al pannello amministrativo
            </Typography>
          </Box>

          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'warning.light' }}>
            <Typography variant="body2" color="warning.contrastText">
              <strong>Credenziali di test:</strong><br />
              Email: <code>admin@airbnb-feedback.com</code><br />
              Password: <code>airbnb2024</code>
            </Typography>
          </Paper>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={credentials.email}
              onChange={handleChange('email')}
              margin="normal"
              required
              autoFocus
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={handleChange('password')}
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ minWidth: 'auto', p: 1 }}
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                ),
              }}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Accesso in corso...
                </Box>
              ) : (
                'Accedi'
              )}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Accesso riservato al personale autorizzato
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login; 