import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Paper,
  Divider,
  Alert,
  InputAdornment,
} from '@mui/material';
import { 
  Comment, 
  Favorite, 
  TrendingUp, 
  Phone, 
  Email,
  ContactSupport 
} from '@mui/icons-material';

function CommentiSection({ formik }) {
  const { values, handleChange } = formik;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Comment sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
        <Typography variant="h5" color="primary">
          Sezione 4 – Commenti e Suggerimenti
        </Typography>
      </Box>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        {/* Domanda 7: Cosa apprezzato */}
        <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
          <FormLabel component="legend" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 500 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Favorite sx={{ fontSize: 20, mr: 1, color: 'error.main' }} />
              7. Qual è stata la cosa che hai apprezzato di più?
            </Box>
          </FormLabel>
          <TextField
            fullWidth
            name="cosa_apprezzato"
            value={values.cosa_apprezzato || ''}
            onChange={handleChange}
            multiline
            rows={4}
            placeholder="Raccontaci cosa ti è piaciuto di più del soggiorno..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Favorite color="error" />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        <Divider sx={{ my: 3 }} />

        {/* Domanda 8: Cosa migliorare */}
        <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
          <FormLabel component="legend" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 500 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ fontSize: 20, mr: 1, color: 'warning.main' }} />
              8. Cosa possiamo migliorare per rendere l'esperienza eccellente?
            </Box>
          </FormLabel>
          <TextField
            fullWidth
            name="cosa_migliorare"
            value={values.cosa_migliorare || ''}
            onChange={handleChange}
            multiline
            rows={4}
            placeholder="Condividi i tuoi suggerimenti per migliorare il servizio..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TrendingUp color="warning" />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        <Divider sx={{ my: 3 }} />

        {/* Domanda 9: Ricontattare */}
        <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
          <FormLabel component="legend" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 500 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ContactSupport sx={{ fontSize: 20, mr: 1, color: 'info.main' }} />
              9. Possiamo ricontattarti per approfondire il tuo feedback?
            </Box>
          </FormLabel>
          
          <RadioGroup
            name="ricontattare"
            value={values.ricontattare || ''}
            onChange={handleChange}
          >
            <FormControlLabel 
              value="si" 
              control={<Radio color="success" />} 
              label="Sì, sono disponibile per un follow-up" 
            />
            <FormControlLabel 
              value="no" 
              control={<Radio color="error" />} 
              label="No, preferisco non essere ricontattato" 
            />
          </RadioGroup>
        </FormControl>

        {/* Campo contatto condizionale */}
        {values.ricontattare === 'si' && (
          <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ mb: 2, fontSize: '1rem', fontWeight: 500 }}>
                Indica un contatto (email o telefono - facoltativo):
              </FormLabel>
              <TextField
                fullWidth
                name="contatto"
                value={values.contatto || ''}
                onChange={handleChange}
                placeholder="email@esempio.com o +39 123 456 7890"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Email fontSize="small" />
                        <Phone fontSize="small" />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Il contatto è completamente facoltativo e verrà utilizzato solo per approfondire 
                il tuo feedback se necessario.
              </Typography>
            </FormControl>
          </Box>
        )}
      </Paper>

      <Alert severity="success" sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Quasi finito!</strong> I tuoi commenti sono molto preziosi per noi. 
          Ci aiutano a capire meglio cosa funziona e cosa possiamo migliorare.
        </Typography>
      </Alert>

      <Alert severity="info">
        <Typography variant="body2">
          <strong>Privacy:</strong> Tutti i tuoi dati vengono trattati in conformità al GDPR 
          e utilizzati esclusivamente per migliorare la qualità del nostro servizio.
        </Typography>
      </Alert>
    </Box>
  );
}

export default CommentiSection; 