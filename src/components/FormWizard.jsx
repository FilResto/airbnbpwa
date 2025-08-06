import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  LinearProgress,
} from '@mui/material';
import { CheckCircle, Home } from '@mui/icons-material';

import IntroSection from './sections/IntroSection';
import PuliziaSection from './sections/PuliziaSection';
import FunzionamentoSection from './sections/FunzionamentoSection';
import ValutazioniSection from './sections/ValutazioniSection';
import CommentiSection from './sections/CommentiSection';
import ThankYouSection from './sections/ThankYouSection';
import FormService from '../services/formService';

const steps = [
  'Introduzione',
  'Pulizia',
  'Funzionamento',
  'Valutazioni',
  'Commenti',
  'Completato'
];

const validationSchemas = [
  Yup.object({}), // Intro - no validation needed
  Yup.object({
    pulizia_complessiva: Yup.number().required('Valutazione richiesta'),
  }),
  Yup.object({}), // Funzionamento - optional
  Yup.object({
    nps_score: Yup.number().required('Punteggio NPS richiesto'),
    valutazione_complessiva: Yup.number().required('Valutazione complessiva richiesta'),
    tornare: Yup.string().required('Risposta richiesta'),
  }),
  Yup.object({}), // Commenti - optional
  Yup.object({}), // Thank you
];

const initialValues = {
  // Cleaning Section
  pulizia_complessiva: '',
  aree_meno_pulite: [],
  aree_meno_pulite_altro: '',
  lenzuola_pulite: '',
  lenzuola_dettagli: '',
  alloggio_ordinato: '',
  alloggio_dettagli: '',
  
  // Functionality Section
  elettrodomestici: {},
  
  // Ratings Section
  nps_score: '',
  nps_motivo: '',
  valutazione_complessiva: '',
  tornare: '',
  
  // Comments Section
  cosa_apprezzato: '',
  cosa_migliorare: '',
  ricontattare: '',
  contatto: '',
};

function FormWizard({ amenities = [] }) {
  const { step } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [propertyId, setPropertyId] = useState(null);

  useEffect(() => {
    // Read property_id from URL at startup and save it
    const urlParams = new URLSearchParams(window.location.search);
    const casaParam = urlParams.get('casa');
    console.log('URL params:', window.location.search);
    console.log('Casa param:', casaParam);
    if (casaParam) {
      setPropertyId(casaParam);
      console.log('Property ID saved:', casaParam);
    } else {
      console.log('No property_id found in URL');
    }
  }, []);

  useEffect(() => {
    if (step) {
      const stepIndex = parseInt(step) - 1;
      if (stepIndex >= 0 && stepIndex < steps.length) {
        setActiveStep(stepIndex);
      }
    }
  }, [step]);

  const handleNext = () => {
    const nextStep = activeStep + 1;
    setActiveStep(nextStep);
    navigate(`/sezione/${nextStep + 1}`);
  };

  const handleBack = () => {
    const prevStep = activeStep - 1;
    setActiveStep(prevStep);
    if (prevStep === 0) {
      navigate('/');
    } else {
      navigate(`/sezione/${prevStep + 1}`);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (activeStep < steps.length - 2) {
      handleNext();
      setSubmitting(false);
      return;
    }

    // Submit final form
    setIsSubmitting(true);
    try {
      console.log('Form submitted:', values);
      console.log('Property ID from state:', propertyId);
      
      let saveResult;
      if (propertyId) {
        // Save with property_id if available
        saveResult = await FormService.saveWithPropertyId(values, propertyId);
        console.log('SaveResult with property_id:', saveResult);
      } else {
        // Save without property_id (fallback)
        saveResult = await FormService.saveForm(values);
        console.log('SaveResult without property_id:', saveResult);
      }
      
      if (saveResult.success) {
        try {
          // Simulate server submission (optional)
          const serverResult = await FormService.sendToServer(values);
          console.log('Server result:', serverResult);
        } catch (serverError) {
          console.warn('Server communication failed, but data is saved:', serverError);
          // Don't block flow if server fails
        }
        
        // Show specific success message
        if (saveResult.savedToDatabase) {
          console.log('✅ Form saved successfully in database and locally');
        } else {
          console.log('⚠️ Form saved only locally (database not available)');
        }
        
        setSubmitSuccess(true);
        handleNext();
      } else {
        console.error('Save failed:', saveResult.error);
        throw new Error(saveResult.error);
      }
    } catch (error) {
      console.error('Submission error:', error);
      
      // Show more specific message based on error type
      if (error.message && error.message !== 'undefined') {
        alert(`Errore: ${error.message}`);
      } else {
        alert('Errore nel salvataggio del questionario. I dati sono stati salvati localmente.');
      }
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const renderStepContent = (step, formikProps) => {
    switch (step) {
      case 0:
        return <IntroSection />;
      case 1:
        return <PuliziaSection formik={formikProps} />;
      case 2:
        return <FunzionamentoSection formik={formikProps} amenities={amenities} />;
      case 3:
        return <ValutazioniSection formik={formikProps} />;
      case 4:
        return <CommentiSection formik={formikProps} />;
      case 5:
        return <ThankYouSection />;
      default:
        return <div>Sezione non trovata</div>;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Home sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" color="primary">
              Questionario Post-Soggiorno
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Grazie per aver soggiornato presso il nostro appartamento! Le tue risposte ci aiutano a mantenere standard elevati.
          </Typography>
        </CardContent>
      </Card>

      {/* Progress Stepper */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{
              // Hide labels on mobile
              '& .MuiStepLabel-label': {
                display: { xs: 'none', sm: 'block' }
              },
              // Reduce spacing between steps on mobile
              '& .MuiStep-root': {
                padding: { xs: '0 8px', sm: '0 16px' }
              }
            }}
          >
            {steps.map((label, index) => (
              <Step key={label} completed={index < activeStep}>
                <StepLabel 
                  icon={index === steps.length - 1 && activeStep === steps.length - 1 ? <CheckCircle /> : undefined}
                  sx={{
                    // Show labels only on large screens
                    '& .MuiStepLabel-label': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      lineHeight: { xs: 1.2, sm: 1.4 }
                    }
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {/* Show step labels on mobile in compact format */}
          <Box sx={{ 
            display: { xs: 'flex', sm: 'none' }, 
            justifyContent: 'space-between', 
            mt: 2,
            px: 1
          }}>
            {steps.map((label, index) => (
              <Box 
                key={label} 
                sx={{ 
                  textAlign: 'center',
                  flex: 1,
                  fontSize: '0.7rem',
                  color: index <= activeStep ? 'primary.main' : 'text.secondary',
                  fontWeight: index === activeStep ? 600 : 400
                }}
              >
                {label}
              </Box>
            ))}
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={(activeStep / (steps.length - 1)) * 100} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchemas[activeStep]}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formikProps) => (
          <Form>
            <Card>
              <CardContent>
                {isSubmitting && (
                  <Box sx={{ mb: 2 }}>
                    <Alert severity="info">Invio del questionario in corso...</Alert>
                    <LinearProgress sx={{ mt: 1 }} />
                  </Box>
                )}
                
                {submitSuccess && activeStep === steps.length - 2 && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Questionario inviato con successo!
                  </Alert>
                )}

                {renderStepContent(activeStep, formikProps)}

                {/* Navigation Buttons */}
                {activeStep < steps.length - 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                      onClick={handleBack}
                      disabled={activeStep === 0 || isSubmitting}
                      variant="outlined"
                    >
                      Indietro
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      variant="contained"
                      size="large"
                    >
                      {activeStep === steps.length - 2 ? 'Invia Questionario' : 'Avanti'}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Form>
        )}
      </Formik>
    </Box>
  );
}

export default FormWizard; 