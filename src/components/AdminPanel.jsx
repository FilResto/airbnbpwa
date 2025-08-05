import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Download,
  Assessment,
  People,
  Star,
  TrendingUp,
  Delete,
  Visibility,
  Logout,
} from '@mui/icons-material';
import FormService from '../services/formService';

function AdminPanel({ onLogout, user }) {
  const [stats, setStats] = useState(null);
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dbStatus, setDbStatus] = useState('checking');

  useEffect(() => {
    loadData();
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      // Import dinamico di SupabaseService
      const { default: SupabaseServiceModule } = await import('../services/supabaseService');
      const supabaseService = new SupabaseServiceModule();
      const result = await supabaseService.healthCheck();
      setDbStatus(result.success ? 'connected' : 'disconnected');
    } catch (error) {
      console.warn('Errore nel controllo database:', error);
      setDbStatus('disconnected');
    }
  };

  const loadData = async () => {
    try {
      // Import dinamico di SupabaseService
      const { default: SupabaseServiceModule } = await import('../services/supabaseService');
      const supabaseService = new SupabaseServiceModule();
      
      // Carica dati da Supabase
      const formsResult = await supabaseService.getAllForms();
      const statsResult = await supabaseService.getStats();
      
      if (formsResult.success) {
        setForms(formsResult.data);
      } else {
        console.error('Errore caricamento forms:', formsResult.error);
        setForms([]);
      }
      
      if (statsResult.success) {
        setStats(statsResult.data);
      } else {
        console.error('Errore caricamento stats:', statsResult.error);
        setStats(null);
      }
    } catch (error) {
      console.error('Errore nel caricamento dati:', error);
      setForms([]);
      setStats(null);
    }
  };

  const handleExportCSV = async () => {
    try {
      const { default: SupabaseServiceModule } = await import('../services/supabaseService');
      const supabaseService = new SupabaseServiceModule();
      const result = await supabaseService.exportCSV();
      
      if (result.success) {
        const blob = new Blob([result.data], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `feedback_airbnb_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Errore nell\'esportazione: ' + result.error);
      }
    } catch (error) {
      console.error('Errore export CSV:', error);
      alert('Errore nell\'esportazione dei dati');
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Sei sicuro di voler eliminare tutti i questionari? Questa azione non può essere annullata.')) {
          try {
      const { default: SupabaseServiceModule } = await import('../services/supabaseService');
      const supabaseService = new SupabaseServiceModule();
      const result = await supabaseService.clearAllForms();
        
        if (result.success) {
          loadData();
        } else {
          alert('Errore nell\'eliminazione: ' + result.error);
        }
      } catch (error) {
        console.error('Errore eliminazione:', error);
        alert('Errore nell\'eliminazione dei dati');
      }
    }
  };

  const handleViewForm = (form) => {
    setSelectedForm(form);
    setOpenDialog(true);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('it-IT');
  };

  const getReturnLikelihood = (value) => {
    const labels = {
      'sicuramente_si': 'Sicuramente sì',
      'probabilmente_si': 'Probabilmente sì',
      'non_so': 'Non so',
      'probabilmente_no': 'Probabilmente no',
      'sicuramente_no': 'Sicuramente no'
    };
    return labels[value] || value;
  };

  if (!stats) {
    return <Box>Caricamento...</Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <Assessment sx={{ mr: 2 }} />
          Pannello Amministrativo - Feedback Airbnb
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip 
            label={dbStatus === 'connected' ? 'Database Connesso' : 
                  dbStatus === 'disconnected' ? 'Solo localStorage' : 'Verificando...'}
            color={dbStatus === 'connected' ? 'success' : 
                   dbStatus === 'disconnected' ? 'warning' : 'default'}
            variant="outlined"
            size="small"
          />
          {user && (
            <Chip 
              label={`Admin: ${user.email}`}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
          {onLogout && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              onClick={onLogout}
              size="small"
            >
              Logout
            </Button>
          )}
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.totalForms}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Questionari Totali
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Star sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.averageRating}/5</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Valutazione Media
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.averageNPS}/10</Typography>
                  <Typography variant="body2" color="text.secondary">
                    NPS Medio
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Ultimo Invio
                </Typography>
                <Typography variant="body1">
                  {stats.lastSubmission 
                    ? formatDate(stats.lastSubmission)
                    : 'Nessuno'
                  }
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleExportCSV}
          disabled={forms.length === 0}
        >
          Esporta CSV
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={handleClearAll}
          disabled={forms.length === 0}
        >
          Elimina Tutti
        </Button>
      </Box>

      {/* Forms Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Questionari Ricevuti ({forms.length})
          </Typography>
          
          {forms.length === 0 ? (
            <Alert severity="info">
              Nessun questionario ricevuto ancora.
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Proprietà</TableCell>
                    <TableCell>Pulizia</TableCell>
                    <TableCell>NPS</TableCell>
                    <TableCell>Valutazione</TableCell>
                    <TableCell>Tornare</TableCell>
                    <TableCell>Azioni</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {forms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell>
                        {formatDate(form.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {form.property_name}
                          </Typography>
                          {form.property_id && (
                            <Typography variant="caption" color="text.secondary">
                              ID: {form.property_id.slice(0, 8)}...
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {form.data.pulizia_complessiva ? (
                          <Chip 
                            label={`${form.data.pulizia_complessiva}/5`}
                            color={form.data.pulizia_complessiva >= 4 ? 'success' : 
                                   form.data.pulizia_complessiva >= 3 ? 'warning' : 'error'}
                            size="small"
                          />
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {form.data.nps_score !== undefined && form.data.nps_score !== '' ? (
                          <Chip 
                            label={`${form.data.nps_score}/10`}
                            color={form.data.nps_score >= 9 ? 'success' : 
                                   form.data.nps_score >= 7 ? 'warning' : 'error'}
                            size="small"
                          />
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {form.data.valutazione_complessiva ? (
                          <Chip 
                            label={`${form.data.valutazione_complessiva}/5`}
                            color={form.data.valutazione_complessiva >= 4 ? 'success' : 
                                   form.data.valutazione_complessiva >= 3 ? 'warning' : 'error'}
                            size="small"
                          />
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {form.data.tornare ? (
                          <Chip 
                            label={getReturnLikelihood(form.data.tornare)}
                            color={form.data.tornare.includes('si') ? 'success' : 
                                   form.data.tornare === 'non_so' ? 'warning' : 'error'}
                            size="small"
                          />
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => handleViewForm(form)}
                        >
                          Dettagli
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Form Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Dettagli Questionario - {selectedForm && formatDate(selectedForm.timestamp)}
          {selectedForm?.property_name && (
            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
              Proprietà: {selectedForm.property_name}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedForm && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Sezione Pulizia</Typography>
              <Typography><strong>Pulizia complessiva:</strong> {selectedForm.data.pulizia_complessiva}/5</Typography>
              <Typography><strong>Lenzuola pulite:</strong> {selectedForm.data.lenzuola_pulite || 'N/A'}</Typography>
              <Typography><strong>Alloggio ordinato:</strong> {selectedForm.data.alloggio_ordinato || 'N/A'}</Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Valutazioni</Typography>
              <Typography><strong>NPS Score:</strong> {selectedForm.data.nps_score}/10</Typography>
              <Typography><strong>Motivo NPS:</strong> {selectedForm.data.nps_motivo || 'N/A'}</Typography>
              <Typography><strong>Valutazione complessiva:</strong> {selectedForm.data.valutazione_complessiva}/5</Typography>
              <Typography><strong>Tornerebbe:</strong> {getReturnLikelihood(selectedForm.data.tornare)}</Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Commenti</Typography>
              <Typography><strong>Cosa apprezzato:</strong> {selectedForm.data.cosa_apprezzato || 'N/A'}</Typography>
              <Typography><strong>Cosa migliorare:</strong> {selectedForm.data.cosa_migliorare || 'N/A'}</Typography>
              <Typography><strong>Ricontattare:</strong> {selectedForm.data.ricontattare || 'N/A'}</Typography>
              {selectedForm.data.contatto && (
                <Typography><strong>Contatto:</strong> {selectedForm.data.contatto}</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Chiudi</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminPanel; 