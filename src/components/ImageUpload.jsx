import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  IconButton,
  Card,
  CardMedia,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  PhotoCamera,
  Delete,
  CloudUpload,
} from '@mui/icons-material';

function ImageUpload({ 
  area, 
  images = [], 
  onImagesChange, 
  maxImages = 3,
  disabled = false 
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setError(`Puoi caricare massimo ${maxImages} immagini per area`);
      return;
    }

    setUploading(true);
    setError('');

    try {
      const newImages = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validazione file
        if (!file.type.startsWith('image/')) {
          throw new Error('Solo immagini sono permesse');
        }
        
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          throw new Error('File troppo grande. Massimo 10MB');
        }

        // Crea preview locale
        const preview = URL.createObjectURL(file);
        
        newImages.push({
          file,
          preview,
          area,
          id: Date.now() + i, // ID temporaneo
          uploaded: false,
          uploading: false
        });
      }

      // Aggiungi le nuove immagini subito per mostrare il preview
      const updatedImages = [...images, ...newImages];
      onImagesChange(updatedImages);

      // Avvia l'upload immediato
      await uploadImagesImmediately(newImages, updatedImages);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const uploadImagesImmediately = async (newImages, allImages) => {
    try {
      // Import dinamico di SupabaseService
      const { default: SupabaseServiceModule } = await import('../services/supabaseService');
      const supabaseService = new SupabaseServiceModule();

      for (const imageData of newImages) {
        // Aggiorna lo stato per mostrare che sta caricando
        const updatedImages = allImages.map(img => 
          img.id === imageData.id ? { ...img, uploading: true } : img
        );
        onImagesChange(updatedImages);

        // Upload dell'immagine
        const basePath = `pulizia/${area}/${Date.now()}`;
        const result = await supabaseService.uploadImage(imageData.file, basePath);
        
        if (result.success) {
          // Aggiorna l'immagine con l'URL e marca come caricata
          const finalImages = allImages.map(img => 
            img.id === imageData.id ? {
              ...img,
              url: result.data.url,
              path: result.data.path,
              uploaded: true,
              uploading: false,
              file: null // Rimuovi il file dopo upload
            } : img
          );
          onImagesChange(finalImages);
          allImages = finalImages; // Aggiorna il riferimento per il prossimo ciclo
        } else {
          throw new Error(`Errore upload: ${result.error}`);
        }
      }
    } catch (error) {
      setError(`Errore durante l'upload: ${error.message}`);
      // Rimuovi le immagini che non sono riuscite a caricarsi
      const failedIds = newImages.map(img => img.id);
      const cleanedImages = allImages.filter(img => !failedIds.includes(img.id));
      onImagesChange(cleanedImages);
    }
  };

  const handleRemoveImage = async (imageId) => {
    const imageToRemove = images.find(img => img.id === imageId);
    
    // Se l'immagine è stata caricata su Supabase, rimuovila anche da lì
    if (imageToRemove && imageToRemove.uploaded && imageToRemove.path) {
      try {
        const { default: SupabaseServiceModule } = await import('../services/supabaseService');
        const supabaseService = new SupabaseServiceModule();
        await supabaseService.deleteImage(imageToRemove.path);
      } catch (error) {
        console.warn('Errore nella rimozione dell\'immagine dal storage:', error);
      }
    }
    
    // Cleanup preview URLs
    if (imageToRemove && imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    
    const updatedImages = images.filter(img => img.id !== imageId);
    onImagesChange(updatedImages);
  };

  const getRemainingSlots = () => maxImages - images.length;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
        Carica foto per: {area}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Aiutaci a migliorare mostrando cosa non va. Puoi caricare fino a {maxImages} immagini.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {images.map((image) => (
            <Grid item xs={6} sm={4} key={image.id}>
              <Card sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="120"
                  image={image.preview || image.url}
                  alt={`${area} - foto`}
                  sx={{ objectFit: 'cover' }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImage(image.id)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'rgba(255,255,255,0.8)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
                {(image.uploading || (!image.uploaded && image.file)) && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}
                  >
                    <CircularProgress size={24} sx={{ color: 'white', mb: 1 }} />
                    <Typography variant="caption" sx={{ color: 'white' }}>
                      {image.uploading ? 'Caricamento...' : 'In attesa...'}
                    </Typography>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Upload Button */}
      {getRemainingSlots() > 0 && !disabled && (
        <Box>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id={`image-upload-${area}`}
            multiple
            type="file"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          <label htmlFor={`image-upload-${area}`}>
            <Button
              variant="outlined"
              component="span"
              startIcon={uploading ? <CircularProgress size={20} /> : <PhotoCamera />}
              disabled={uploading}
              fullWidth
              sx={{ py: 1.5 }}
            >
              {uploading ? 'Caricamento...' : `Aggiungi foto (${getRemainingSlots()} rimaste)`}
            </Button>
          </label>
        </Box>
      )}

      {images.length === maxImages && (
        <Alert severity="info" sx={{ mt: 1 }}>
          Hai raggiunto il limite massimo di {maxImages} immagini per questa area.
        </Alert>
      )}
    </Box>
  );
}

export default ImageUpload;
