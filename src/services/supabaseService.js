import { createClient } from '@supabase/supabase-js';

// Configurazione Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Crea client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseService {
  constructor() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  // Authentication methods
  async signIn(email, password) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getSession() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data: session };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return this.supabase.auth.onAuthStateChange(callback);
  }
  
  // Test connessione
  async healthCheck() {
    try {
      const { data, error } = await this.supabase
        .from('feedback')
        .select('count', { count: 'exact', head: true });
      
      if (error) throw error;
      return { success: true, message: 'Database connesso' };
    } catch (error) {
      console.error('Health check failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Salva un questionario
  async saveForm(formData) {
    try {
      console.log('🔍 Tentativo salvataggio in Supabase...');
      console.log('📦 Dati form da salvare:', formData);
      
      const formToInsert = {
        form_data: formData,
        created_at: new Date().toISOString(),
        property_id: null // Permette di salvare senza property_id
      };
      
      console.log('📄 Payload da inserire:', formToInsert);
      
      const { data, error } = await this.supabase
        .from('feedback')
        .insert(formToInsert)
        .select();

      if (error) {
        console.error('❌ Errore Supabase:', error);
        throw error;
      }
      
      console.log('✅ Form salvato in Supabase con successo:', data);
      return { success: true, id: data[0].id };
    } catch (error) {
      console.error('💥 Errore salvataggio Supabase:', error);
      console.error('💥 Dettagli errore:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return { success: false, error: error.message };
    }
  }

  // Recupera tutti i form con i dati delle proprietà
  async getAllForms() {
    try {
      const { data, error } = await this.supabase
        .from('feedback')
        .select(`
          *,
          properties:property_id (
            id,
            name,
            description
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Trasforma i dati nel formato aspettato dall'app
      const transformedData = data.map(row => ({
        id: row.id,
        timestamp: row.created_at,
        data: row.form_data,
        property_id: row.property_id,
        property_name: row.properties?.name || 'Proprietà non specificata',
        property_description: row.properties?.description || '',
        status: 'completed'
      }));

      return { success: true, data: transformedData };
    } catch (error) {
      console.error('Errore recupero da Supabase:', error);
      return { success: false, error: error.message };
    }
  }

  // Recupera statistiche
  async getStats() {
    try {
      const { data, error } = await this.supabase
        .from('feedback')
        .select('form_data, created_at');

      if (error) throw error;

      if (data.length === 0) {
        return {
          success: true,
          data: {
            totalForms: 0,
            averageRating: 0,
            averageNPS: 0,
            lastSubmission: null
          }
        };
      }

      let totalRating = 0;
      let totalNPS = 0;
      let ratingCount = 0;
      let npsCount = 0;

      data.forEach(row => {
        const formData = row.form_data;
        
        if (formData.pulizia_complessiva) {
          totalRating += formData.pulizia_complessiva;
          ratingCount++;
        }
        if (formData.valutazione_complessiva) {
          totalRating += formData.valutazione_complessiva;
          ratingCount++;
        }
        if (formData.nps_score !== undefined && formData.nps_score !== '') {
          totalNPS += formData.nps_score;
          npsCount++;
        }
      });

      return {
        success: true,
        data: {
          totalForms: data.length,
          averageRating: ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0,
          averageNPS: npsCount > 0 ? (totalNPS / npsCount).toFixed(1) : 0,
          lastSubmission: data[0]?.created_at
        }
      };
    } catch (error) {
      console.error('Errore statistiche Supabase:', error);
      return { success: false, error: error.message };
    }
  }

  // Esporta dati CSV
  async exportCSV() {
    try {
      const result = await this.getAllForms();
      if (!result.success) throw new Error(result.error);

      const forms = result.data;
      if (forms.length === 0) {
        return { success: false, error: 'Nessun dato da esportare' };
      }

      // Usa la stessa logica di export del FormService
      const headers = [
        'ID',
        'Data Invio',
        'Pulizia Complessiva',
        'Aree Meno Pulite',
        'Aree Meno Pulite Altro',
        'Lenzuola Pulite',
        'Lenzuola Dettagli',
        'Alloggio Ordinato',
        'Alloggio Dettagli',
        'Elettrodomestici Funzionanti',
        'Elettrodomestici Problematici',
        'Elettrodomestici Non Presenti',
        'Dettagli Problemi Elettrodomestici',
        'NPS Score',
        'Motivo NPS',
        'Valutazione Complessiva',
        'Tornare',
        'Cosa Apprezzato',
        'Cosa Migliorare',
        'Ricontattare',
        'Contatto'
      ];

      const rows = forms.map(form => {
        const data = form.data;
        
        // Elabora dati elettrodomestici
        const elettrodomestici = data.elettrodomestici || {};
        const funzionanti = [];
        const problematici = [];
        const nonPresenti = [];
        const dettagliProblemi = [];
        
        Object.keys(elettrodomestici).forEach(dispositivo => {
          const info = elettrodomestici[dispositivo];
          if (info.status === 'si') {
            funzionanti.push(dispositivo);
          } else if (info.status === 'no') {
            problematici.push(dispositivo);
            if (info.problema) {
              dettagliProblemi.push(`${dispositivo}: ${info.problema}`);
            }
          } else if (info.status === 'na') {
            nonPresenti.push(dispositivo);
          }
        });
        
        return [
          form.id,
          new Date(form.timestamp).toLocaleString('it-IT'),
          data.pulizia_complessiva || '',
          Array.isArray(data.aree_meno_pulite) ? data.aree_meno_pulite.join('; ') : '',
          data.aree_meno_pulite_altro || '',
          data.lenzuola_pulite || '',
          data.lenzuola_dettagli || '',
          data.alloggio_ordinato || '',
          data.alloggio_dettagli || '',
          funzionanti.join('; '),
          problematici.join('; '),
          nonPresenti.join('; '),
          dettagliProblemi.join(' | '),
          data.nps_score || '',
          data.nps_motivo || '',
          data.valutazione_complessiva || '',
          data.tornare || '',
          data.cosa_apprezzato || '',
          data.cosa_migliorare || '',
          data.ricontattare || '',
          data.contatto || ''
        ];
      });

      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      return { success: true, data: csvContent };
    } catch (error) {
      console.error('Errore export CSV Supabase:', error);
      return { success: false, error: error.message };
    }
  }

  // Recupera tutte le proprietà
  async getAllProperties() {
    try {
      const { data, error } = await this.supabase
        .from('properties')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Errore recupero proprietà da Supabase:', error);
      return { success: false, error: error.message };
    }
  }

  // Crea una nuova proprietà
  async createProperty(propertyData) {
    try {
      const { data, error } = await this.supabase
        .from('properties')
        .insert({
          name: propertyData.name,
          description: propertyData.description || null
        })
        .select();

      if (error) throw error;
      
      console.log('Proprietà creata in Supabase:', data);
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Errore creazione proprietà in Supabase:', error);
      return { success: false, error: error.message };
    }
  }

  // Elimina una proprietà
  async deleteProperty(propertyId) {
    try {
      const { error } = await this.supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;
      
      console.log('Proprietà eliminata da Supabase:', propertyId);
      return { success: true };
    } catch (error) {
      console.error('Errore eliminazione proprietà da Supabase:', error);
      return { success: false, error: error.message };
    }
  }

  // Recupera amenità di una proprietà specifica
  async fetchPropertyAmenities(propertyId) {
    try {
      const { data, error } = await this.supabase
        .from('property_amenities')
        .select('amenity_name')
        .eq('property_id', propertyId)
        .eq('is_present', true);

      if (error) throw error;
      
      const amenities = data.map(row => row.amenity_name);
      return { success: true, data: amenities };
    } catch (error) {
      console.error('Errore recupero amenità da Supabase:', error);
      return { success: false, error: error.message };
    }
  }

  // Salva form con property_id specifico
  async saveFormWithPropertyId(formData, propertyId) {
    try {
      console.log('🔍 Tentativo salvataggio con property_id in Supabase...');
      console.log('📦 Dati form da salvare:', formData);
      console.log('🏠 Property ID:', propertyId);
      
      const formToInsert = {
        form_data: formData,
        property_id: propertyId,
        created_at: new Date().toISOString()
      };
      
      console.log('📄 Payload da inserire:', formToInsert);
      
      const { data, error } = await this.supabase
        .from('feedback')
        .insert(formToInsert)
        .select();

      if (error) {
        console.error('❌ Errore Supabase con property_id:', error);
        throw error;
      }
      
      console.log('✅ Form salvato in Supabase con property_id con successo:', data);
      return { success: true, id: data[0].id };
    } catch (error) {
      console.error('💥 Errore salvataggio Supabase con property_id:', error);
      console.error('💥 Dettagli errore:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return { success: false, error: error.message };
    }
  }

  // Recupera amenità di una proprietà specifica (per configuratore)
  async getPropertyAmenities(propertyId) {
    try {
      const { data, error } = await this.supabase
        .from('property_amenities')
        .select('*')
        .eq('property_id', propertyId);

      if (error) throw error;
      
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Errore recupero amenità proprietà da Supabase:', error);
      return { success: false, error: error.message };
    }
  }

  // Salva amenità di una proprietà
  async savePropertyAmenities(propertyId, amenityIds) {
    try {
      // Prima elimina tutte le amenità esistenti per questa proprietà
      const { error: deleteError } = await this.supabase
        .from('property_amenities')
        .delete()
        .eq('property_id', propertyId);

      if (deleteError) throw deleteError;

      // Poi inserisce le nuove amenità selezionate
      if (amenityIds.length > 0) {
        const amenitiesToInsert = amenityIds.map(amenityId => ({
          property_id: propertyId,
          amenity_name: amenityId,
          is_present: true
        }));

        const { data, error: insertError } = await this.supabase
          .from('property_amenities')
          .insert(amenitiesToInsert)
          .select();

        if (insertError) throw insertError;
        
        console.log('Amenità salvate in Supabase:', data);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Errore salvataggio amenità in Supabase:', error);
      return { success: false, error: error.message };
    }
  }

  // Elimina tutti i form
  async clearAllForms() {
    try {
      const { error } = await this.supabase
        .from('feedback')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Errore eliminazione form:', error);
      return { success: false, error: error.message };
    }
  }

  // Image upload methods
  async uploadImage(file, path) {
    try {
      // Genera un nome file unico
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const fullPath = `${path}/${fileName}`;

      const { data, error } = await this.supabase.storage
        .from('feedback-images')
        .upload(fullPath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        return { success: false, error: error.message };
      }

      // Ottieni l'URL pubblico
      const { data: { publicUrl } } = this.supabase.storage
        .from('feedback-images')
        .getPublicUrl(fullPath);

      return { 
        success: true, 
        data: {
          path: fullPath,
          url: publicUrl,
          fileName
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async uploadMultipleImages(images, basePath) {
    try {
      const uploadPromises = images.map(async (imageData) => {
        if (!imageData.file || imageData.uploaded) {
          return imageData; // Già caricata o non è un file
        }

        const result = await this.uploadImage(imageData.file, basePath);
        if (result.success) {
          return {
            ...imageData,
            url: result.data.url,
            path: result.data.path,
            uploaded: true,
            file: null // Rimuovi il file object dopo upload
          };
        } else {
          throw new Error(`Errore upload ${imageData.area}: ${result.error}`);
        }
      });

      const uploadedImages = await Promise.all(uploadPromises);
      return { success: true, data: uploadedImages };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteImage(path) {
    try {
      const { error } = await this.supabase.storage
        .from('feedback-images')
        .remove([path]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Metodo aggiornato per salvare form con immagini
  async saveFormWithImages(formData) {
    try {
      console.log('🖼️ Salvataggio form con immagini...');
      console.log('📦 Form data originale:', formData);
      
      // Prepara i dati delle immagini per il salvataggio
      let processedFormData = { ...formData };
      
      if (formData.pulizia_immagini) {
        console.log('🔍 Processando immagini pulizia...');
        const imagesByArea = {};

        // Processa le immagini per area
        Object.entries(formData.pulizia_immagini).forEach(([area, images]) => {
          console.log(`📁 Area ${area}:`, images);
          if (images && images.length > 0) {
            // Filtra solo le immagini già caricate con successo
            const uploadedImages = images.filter(img => img.uploaded && img.url);
            console.log(`✅ Immagini caricate per ${area}:`, uploadedImages);
            
            if (uploadedImages.length > 0) {
              imagesByArea[area] = uploadedImages.map(img => ({
                url: img.url,
                path: img.path,
                area: img.area
              }));
            }
          }
        });

        // Sostituisci con le immagini processate
        processedFormData.pulizia_immagini = Object.keys(imagesByArea).length > 0 ? imagesByArea : null;
        console.log('🔄 Form data processato:', processedFormData);
      }

      // Salva il form con i link alle immagini
      console.log('💾 Chiamando saveForm...');
      
      // Se c'è un property_id nei dati processati, usa saveFormWithPropertyId
      if (processedFormData.property_id) {
        console.log('🏠 Property ID rilevato, usando saveFormWithPropertyId');
        const propertyId = processedFormData.property_id;
        delete processedFormData.property_id; // Rimuovi dai form_data per evitare duplicazione
        const result = await this.saveFormWithPropertyId(processedFormData, propertyId);
        console.log('📊 Risultato saveFormWithPropertyId:', result);
        return result;
      } else {
        const result = await this.saveForm(processedFormData);
        console.log('📊 Risultato saveForm:', result);
        return result;
      }
    } catch (error) {
      console.error('💥 Errore in saveFormWithImages:', error);
      return { success: false, error: error.message };
    }
  }
}

export default SupabaseService; 