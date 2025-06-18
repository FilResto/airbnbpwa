import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Alert,
} from '@mui/material';
import { Build } from '@mui/icons-material';

const elettrodomestici = [
  'Frigorifero / Congelatore',
  'Forno / Piano cottura',
  'Microonde',
  'Lavastoviglie',
  'Macchina da caffè',
  'Bollitore elettrico',
  'Tostapane (non c\'è quasi mai)',
  'Lavatrice',
  'Asciugatrice (o funzione asciugatura)',
  'Ferro da stiro (non c\'è quasi mai)',
  'Aspirapolvere / Scopa elettrica',
  'Aria condizionata',
  'Riscaldamento',
  'Acqua calda (doccia/lavandini)',
  'Wi-Fi / Connessione Internet',
  'TV',
  'Telecomando TV',
  'Serratura / Chiavi / Codice ingresso',
  'Luci / Lampadine',
];

function FunzionamentoSection({ formik }) {
  const { values, setFieldValue } = formik;

  const handleStatusChange = (dispositivo, status) => {
    setFieldValue(`elettrodomestici.${dispositivo}.status`, status);
    // Clear problem description if status is not "no"
    if (status !== 'no') {
      setFieldValue(`elettrodomestici.${dispositivo}.problema`, '');
    }
  };

  const handleProblemChange = (dispositivo, problema) => {
    setFieldValue(`elettrodomestici.${dispositivo}.problema`, problema);
  };

  const getStatusValue = (dispositivo) => {
    return values.elettrodomestici?.[dispositivo]?.status || '';
  };

  const getProblemValue = (dispositivo) => {
    return values.elettrodomestici?.[dispositivo]?.problema || '';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Build sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
        <Typography variant="h5" color="primary">
          Sezione 2 – Funzionamento di Elettrodomestici e Impianti
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Legenda:</strong> ✅ Sì = funzionante • ❌ No = problema • ⭕ NA = non presente/usato
        </Typography>
      </Alert>

      <Paper elevation={1} sx={{ mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.light' }}>
                <TableCell sx={{ fontWeight: 600, color: 'primary.contrastText', minWidth: 250 }}>
                  Dispositivo / Servizio
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: 'primary.contrastText', width: 80 }}>
                  Sì ✅
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: 'primary.contrastText', width: 80 }}>
                  No ❌
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: 'primary.contrastText', width: 80 }}>
                  NA ⭕
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'primary.contrastText', minWidth: 200 }}>
                  Se "No": descrivi il problema
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {elettrodomestici.map((dispositivo, index) => (
                <TableRow 
                  key={dispositivo} 
                  sx={{ 
                    '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                    '&:hover': { bgcolor: 'action.selected' }
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {dispositivo}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Radio
                      checked={getStatusValue(dispositivo) === 'si'}
                      onChange={() => handleStatusChange(dispositivo, 'si')}
                      value="si"
                      name={`${dispositivo}_status`}
                      color="success"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Radio
                      checked={getStatusValue(dispositivo) === 'no'}
                      onChange={() => handleStatusChange(dispositivo, 'no')}
                      value="no"
                      name={`${dispositivo}_status`}
                      color="error"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Radio
                      checked={getStatusValue(dispositivo) === 'na'}
                      onChange={() => handleStatusChange(dispositivo, 'na')}
                      value="na"
                      name={`${dispositivo}_status`}
                      color="default"
                    />
                  </TableCell>
                  <TableCell>
                    {getStatusValue(dispositivo) === 'no' && (
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Descrivi il problema..."
                        value={getProblemValue(dispositivo)}
                        onChange={(e) => handleProblemChange(dispositivo, e.target.value)}
                        multiline
                        maxRows={2}
                        sx={{ minWidth: 200 }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Alert severity="warning" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Suggerimento:</strong> Se non hai utilizzato un dispositivo durante il soggiorno, 
          seleziona "NA" (Non Applicabile). Questo ci aiuta a concentrarci sui servizi che usi realmente.
        </Typography>
      </Alert>
    </Box>
  );
}

export default FunzionamentoSection; 