import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Coffee,
  Star,
  Timeline,
  Home,
  Email,
  Phone,
  Refresh,
} from '@mui/icons-material';

function ThankYouSection() {
  const handleNewSubmission = () => {
    window.location.reload();
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      {/* Success Header */}
      <Box sx={{ mb: 4 }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" color="success.main" gutterBottom sx={{ fontWeight: 600 }}>
          Questionario Completato!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Grazie per aver dedicato il tuo tempo prezioso
        </Typography>
      </Box>

      {/* Success Message */}
      <Alert severity="success" sx={{ mb: 4, textAlign: 'left' }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Il tuo feedback è stato inviato con successo!</strong>
        </Typography>
        <Typography variant="body2">
          Le tue risposte sono già in elaborazione e ci aiuteranno a migliorare 
          l'esperienza per tutti i nostri futuri ospiti.
        </Typography>
      </Alert>

      {/* Benefits Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent>
              <Coffee sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                🎁 Il Tuo Omaggio
              </Typography>
              <Typography variant="body2">
                Nel prossimo soggiorno riceverai un piccolo omaggio come ringraziamento 
                per il tuo prezioso feedback.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent>
              <Timeline sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                📈 Miglioramento Continuo
              </Typography>
              <Typography variant="body2">
                Il tuo feedback viene analizzato per identificare aree di miglioramento 
                e mantenere alti standard di qualità.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', bgcolor: 'info.light', color: 'info.contrastText' }}>
            <CardContent>
              <Star sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                ⭐ Esperienza Migliore
              </Typography>
              <Typography variant="body2">
                Grazie al tuo contributo, possiamo offrire un'esperienza 
                sempre più personalizzata e di qualità.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* What Happens Next */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, textAlign: 'left' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Timeline sx={{ mr: 1, color: 'primary.main' }} />
          Cosa succede ora?
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Analisi immediata"
              secondary="Il tuo feedback viene immediatamente elaborato e categorizzato"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Interventi rapidi"
              secondary="Eventuali problemi segnalati vengono affrontati prioritariamente"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Report mensili"
              secondary="I dati aggregati vengono utilizzati per miglioramenti sistematici"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Follow-up personalizzato"
              secondary="Se richiesto, ti contatteremo per approfondimenti"
            />
          </ListItem>
        </List>
      </Paper>

      {/* Contact Info */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>
          Hai bisogno di assistenza immediata?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Per qualsiasi necessità urgente, non esitare a contattarci direttamente:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<Email />}
            href="mailto:support@airbnb-feedback.com"
            sx={{ textTransform: 'none' }}
          >
            support@airbnb-feedback.com
          </Button>
          <Button
            variant="outlined"
            startIcon={<Phone />}
            href="tel:+393331234567"
            sx={{ textTransform: 'none' }}
          >
            +39 333 123 4567
          </Button>
        </Box>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Additional Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Vuoi compilare un altro questionario?
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<Refresh />}
          onClick={handleNewSubmission}
          sx={{ mr: 2 }}
        >
          Nuovo Questionario
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<Home />}
          onClick={() => window.location.href = '/'}
        >
          Torna alla Home
        </Button>
      </Box>

      {/* Footer Message */}
      <Box sx={{ mt: 4, p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
        <Typography variant="body2" color="primary.contrastText">
          <strong>Grazie ancora per essere stato nostro ospite!</strong><br />
          La tua opinione è fondamentale per continuare a offrire 
          un servizio di eccellenza. Ti auguriamo di tornare presto!
        </Typography>
      </Box>
    </Box>
  );
}

export default ThankYouSection; 