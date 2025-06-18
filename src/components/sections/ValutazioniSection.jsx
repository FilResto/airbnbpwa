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
  Rating,
  Alert,
  Slider,
  Chip,
} from '@mui/material';
import { Assessment, ThumbUp } from '@mui/icons-material';

function ValutazioniSection({ formik }) {
  const { values, setFieldValue, errors, touched, handleChange } = formik;

  const npsLabels = {
    0: 'Per niente',
    1: '1',
    2: '2', 
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: 'Assolutamente'
  };

  const getNPSColor = (score) => {
    if (score >= 9) return 'success';
    if (score >= 7) return 'warning';
    return 'error';
  };

  const getNPSCategory = (score) => {
    if (score >= 9) return 'Sicuramente';
    if (score >= 7) return 'Forse';
    return 'No';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Assessment sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
        <Typography variant="h5" color="primary">
          Sezione 3 – Valutazioni Globali
        </Typography>
      </Box>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        {/* Domanda 4: NPS Score */}
        <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
          <FormLabel component="legend" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 500 }}>
            4. Probabilità di consigliarci a un amico (NPS) *
          </FormLabel>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            (0 = per niente • 10 = assolutamente)
          </Typography>
          
          <Box sx={{ px: 2 }}>
            <Slider
              value={values.nps_score || 0}
              onChange={(event, newValue) => setFieldValue('nps_score', newValue)}
              min={0}
              max={10}
              step={1}
              marks={Object.keys(npsLabels).map(key => ({
                value: parseInt(key),
                label: key === '0' || key === '10' ? npsLabels[key] : key
              }))}
              valueLabelDisplay="on"
              sx={{ mb: 2 }}
            />
          </Box>

          {values.nps_score !== '' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Chip 
                label={`${values.nps_score}/10 - ${getNPSCategory(values.nps_score)}`}
                color={getNPSColor(values.nps_score)}
                variant="outlined"
                size="medium"
              />
            </Box>
          )}

          {errors.nps_score && touched.nps_score && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors.nps_score}
            </Alert>
          )}
        </FormControl>

        {/* Domanda 4a: Motivo NPS */}
        <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
          <FormLabel component="legend" sx={{ mb: 2, fontSize: '1rem', fontWeight: 500 }}>
            4a. Perché hai scelto questo punteggio?
          </FormLabel>
          <TextField
            fullWidth
            name="nps_motivo"
            value={values.nps_motivo || ''}
            onChange={handleChange}
            multiline
            rows={3}
            placeholder="Condividi i motivi della tua valutazione..."
          />
        </FormControl>

        <Divider sx={{ my: 3 }} />

        {/* Domanda 5: Valutazione complessiva */}
        <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
          <FormLabel component="legend" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 500 }}>
            5. Valutazione complessiva del soggiorno *
          </FormLabel>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            (1 = pessimo • 5 = eccellente)
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Rating
              name="valutazione_complessiva"
              value={values.valutazione_complessiva || 0}
              onChange={(event, newValue) => {
                setFieldValue('valutazione_complessiva', newValue);
              }}
              size="large"
              max={5}
            />
            {values.valutazione_complessiva && (
              <Typography variant="body1" sx={{ ml: 1 }}>
                {values.valutazione_complessiva}/5
              </Typography>
            )}
          </Box>

          {errors.valutazione_complessiva && touched.valutazione_complessiva && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors.valutazione_complessiva}
            </Alert>
          )}
        </FormControl>

        <Divider sx={{ my: 3 }} />

        {/* Domanda 6: Tornare */}
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 500 }}>
            6. Torneresti a soggiornare da noi? *
          </FormLabel>
          
          <RadioGroup
            name="tornare"
            value={values.tornare || ''}
            onChange={handleChange}
          >
            <FormControlLabel 
              value="sicuramente_si" 
              control={<Radio color="success" />} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ThumbUp sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                  Sicuramente sì
                </Box>
              }
            />
            <FormControlLabel 
              value="probabilmente_si" 
              control={<Radio color="success" />} 
              label="Probabilmente sì" 
            />
            <FormControlLabel 
              value="non_so" 
              control={<Radio color="warning" />} 
              label="Non so" 
            />
            <FormControlLabel 
              value="probabilmente_no" 
              control={<Radio color="error" />} 
              label="Probabilmente no" 
            />
            <FormControlLabel 
              value="sicuramente_no" 
              control={<Radio color="error" />} 
              label="Sicuramente no" 
            />
          </RadioGroup>

          {errors.tornare && touched.tornare && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors.tornare}
            </Alert>
          )}
        </FormControl>
      </Paper>

      <Alert severity="info">
        <Typography variant="body2">
          <strong>Nota:</strong> Le tue valutazioni ci aiutano a capire cosa funziona bene e cosa possiamo migliorare. 
          Grazie per la tua onestà!
        </Typography>
      </Alert>
    </Box>
  );
}

export default ValutazioniSection; 