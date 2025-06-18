import React from 'react';
import {
  Box,
  Typography,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Timer,
  Lock,
  TrendingUp,
  Star,
} from '@mui/icons-material';

function IntroSection() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
        Benvenuto nel nostro questionario post-soggiorno
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body1">
          <strong>Tempo stimato:</strong> 2-3 minuti per completare tutte le sezioni
        </Typography>
      </Alert>

      <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>
          Perché il tuo feedback è importante
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <TrendingUp color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Miglioramento continuo"
              secondary="Ci aiuta a mantenere standard elevati di pulizia e funzionamento"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Star color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Esperienza personalizzata"
              secondary="Ogni feedback ci permette di offrire un servizio sempre migliore"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Timer color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Interventi rapidi"
              secondary="Ci aiuta a risolvere velocemente eventuali problemi per i prossimi ospiti"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Lock color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Privacy garantita"
              secondary="Tutti i dati restano privati e vengono usati solo per migliorare il servizio"
            />
          </ListItem>
        </List>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
        <Typography variant="h6" gutterBottom>
          🎁 Piccolo omaggio per il tuo tempo
        </Typography>
        <Typography variant="body1">
          Come segno di riconoscenza per il tuo prezioso feedback, riceverai un piccolo omaggio 
          (ad esempio caffè gratis) nel tuo prossimo soggiorno presso una nostra struttura.
        </Typography>
      </Paper>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Pronto per iniziare? Clicca "Avanti" per procedere con la prima sezione.
        </Typography>
      </Box>
    </Box>
  );
}

export default IntroSection; 