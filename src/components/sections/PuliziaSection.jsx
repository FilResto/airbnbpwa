import React from 'react';
import { Field } from 'formik';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  TextField,
  Paper,
  Divider,
  Rating,
  Alert,
} from '@mui/material';
import { CleaningServices } from '@mui/icons-material';

function PuliziaSection({ formik }) {
  const { values, setFieldValue, errors, touched } = formik;

  const areeOptions = [
    'Cucina',
    'Bagno',
    'Camera da letto',
    'Soggiorno',
    'Altro'
  ];

  const showAreaSelection = values.pulizia_complessiva && values.pulizia_complessiva <= 3;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <CleaningServices sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
        <Typography variant="h5" color="primary">
          Sezione 1 – Pulizia
        </Typography>
      </Box>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        {/* Domanda 1: Valutazione pulizia complessiva */}
        <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
          <FormLabel component="legend" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 500 }}>
            1. Valuta la pulizia complessiva al tuo arrivo *
          </FormLabel>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            (1 = pessima • 5 = eccellente)
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Rating
              name="pulizia_complessiva"
              value={values.pulizia_complessiva || 0}
              onChange={(event, newValue) => {
                setFieldValue('pulizia_complessiva', newValue);
              }}
              size="large"
              max={5}
            />
            {values.pulizia_complessiva && (
              <Typography variant="body1" sx={{ ml: 1 }}>
                {values.pulizia_complessiva}/5
              </Typography>
            )}
          </Box>

          {errors.pulizia_complessiva && touched.pulizia_complessiva && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors.pulizia_complessiva}
            </Alert>
          )}
        </FormControl>

        {/* Domanda 1a: Aree meno pulite (condizionale) */}
        {showAreaSelection && (
          <Box sx={{ mb: 4, p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ mb: 2, fontSize: '1rem', fontWeight: 500 }}>
                1a. Quali aree erano meno pulite? (seleziona tutte quelle applicabili)
              </FormLabel>
              
              <FormGroup>
                {areeOptions.map((area) => (
                  <FormControlLabel
                    key={area}
                    control={
                      <Checkbox
                        checked={values.aree_meno_pulite?.includes(area) || false}
                        onChange={(event) => {
                          const currentAree = values.aree_meno_pulite || [];
                          if (event.target.checked) {
                            setFieldValue('aree_meno_pulite', [...currentAree, area]);
                          } else {
                            setFieldValue('aree_meno_pulite', currentAree.filter(a => a !== area));
                          }
                        }}
                        name="aree_meno_pulite"
                      />
                    }
                    label={area}
                  />
                ))}
              </FormGroup>

              {values.aree_meno_pulite?.includes('Altro') && (
                <TextField
                  fullWidth
                  label="Specifica altro"
                  name="aree_meno_pulite_altro"
                  value={values.aree_meno_pulite_altro || ''}
                  onChange={formik.handleChange}
                  sx={{ mt: 2 }}
                  size="small"
                />
              )}
            </FormControl>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Domanda 2: Lenzuola e asciugamani */}
        <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
          <FormLabel component="legend" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 500 }}>
            2. Lenzuola e asciugamani erano puliti?
          </FormLabel>
          
          <RadioGroup
            name="lenzuola_pulite"
            value={values.lenzuola_pulite || ''}
            onChange={formik.handleChange}
          >
            <FormControlLabel value="si" control={<Radio />} label="Sì" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>

          {values.lenzuola_pulite === 'no' && (
            <TextField
              fullWidth
              label="Dettagli"
              name="lenzuola_dettagli"
              value={values.lenzuola_dettagli || ''}
              onChange={formik.handleChange}
              multiline
              rows={2}
              sx={{ mt: 2 }}
              placeholder="Descrivi il problema..."
            />
          )}
        </FormControl>

        <Divider sx={{ my: 3 }} />

        {/* Domanda 3: Alloggio in ordine */}
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 500 }}>
            3. L'alloggio era in ordine (niente rifiuti/oggetti lasciati)?
          </FormLabel>
          
          <RadioGroup
            name="alloggio_ordinato"
            value={values.alloggio_ordinato || ''}
            onChange={formik.handleChange}
          >
            <FormControlLabel value="si" control={<Radio />} label="Sì" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>

          {values.alloggio_ordinato === 'no' && (
            <TextField
              fullWidth
              label="Dettagli"
              name="alloggio_dettagli"
              value={values.alloggio_dettagli || ''}
              onChange={formik.handleChange}
              multiline
              rows={2}
              sx={{ mt: 2 }}
              placeholder="Descrivi cosa hai trovato..."
            />
          )}
        </FormControl>
      </Paper>
    </Box>
  );
}

export default PuliziaSection; 