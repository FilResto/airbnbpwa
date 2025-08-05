// Import dinamico per evitare problemi con import.meta.env
let ApiService = null;

// Service per gestire il salvataggio dei dati del form
class FormService {
  constructor() {
    this.storageKey = 'airbnb_feedback_forms';
    this.useDatabase = true; // Database Supabase configurato
  }

  // Salva un nuovo form (database + localStorage come backup)
  async saveForm(formData) {
    let databaseSuccess = false;
    
    // Prova prima con il database se abilitato
    if (this.useDatabase) {
      try {
        // Import dinamico di SupabaseService
        const { default: SupabaseService } = await import('./supabaseService');
        
        const result = await SupabaseService.saveForm(formData);
        if (result.success) {
          databaseSuccess = true;
          console.log('Form salvato nel database con successo');
        }
      } catch (error) {
        console.warn('Fallback a localStorage:', error);
      }
    }
    
    // Salva sempre in localStorage come backup
    try {
      const existingForms = this.getAllForms();
      const newForm = {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        data: formData,
        status: 'completed',
        savedToDatabase: databaseSuccess
      };
      
      existingForms.push(newForm);
      localStorage.setItem(this.storageKey, JSON.stringify(existingForms));
      
      console.log('Form salvato localmente:', newForm);
      return { 
        success: true, 
        formId: newForm.id,
        savedToDatabase: databaseSuccess,
        message: databaseSuccess ? 'Salvato in database e localmente' : 'Salvato solo localmente'
      };
    } catch (error) {
      console.error('Errore nel salvataggio del form:', error);
      return { success: false, error: error.message };
    }
  }

  // Recupera tutti i form salvati
  getAllForms() {
    try {
      const formsJson = localStorage.getItem(this.storageKey);
      return formsJson ? JSON.parse(formsJson) : [];
    } catch (error) {
      console.error('Errore nel recupero dei form:', error);
      return [];
    }
  }

  // Recupera un form specifico per ID
  getFormById(id) {
    const forms = this.getAllForms();
    return forms.find(form => form.id === id);
  }

  // Recupera statistiche dei form
  getFormStats() {
    const forms = this.getAllForms();
    
    if (forms.length === 0) {
      return {
        totalForms: 0,
        averageRating: 0,
        averageNPS: 0,
        lastSubmission: null
      };
    }

    let totalRating = 0;
    let totalNPS = 0;
    let ratingCount = 0;
    let npsCount = 0;

    forms.forEach(form => {
      if (form.data.pulizia_complessiva) {
        totalRating += form.data.pulizia_complessiva;
        ratingCount++;
      }
      if (form.data.valutazione_complessiva) {
        totalRating += form.data.valutazione_complessiva;
        ratingCount++;
      }
      if (form.data.nps_score !== undefined && form.data.nps_score !== '') {
        totalNPS += form.data.nps_score;
        npsCount++;
      }
    });

    return {
      totalForms: forms.length,
      averageRating: ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0,
      averageNPS: npsCount > 0 ? (totalNPS / npsCount).toFixed(1) : 0,
      lastSubmission: forms[forms.length - 1]?.timestamp
    };
  }

  // Esporta dati in formato CSV
  exportToCSV() {
    const forms = this.getAllForms();
    if (forms.length === 0) return null;

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

    return csvContent;
  }

  // Genera un ID univoco
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Elimina tutti i form (per test/reset)
  clearAllForms() {
    localStorage.removeItem(this.storageKey);
    console.log('Tutti i form sono stati eliminati');
  }

  // Simula invio a server (per future implementazioni)
  async sendToServer(formData) {
    // Qui potresti implementare l'invio a un server reale
    // Per ora simuliamo con un delay
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Dati inviati al server:', formData);
        resolve({ success: true, serverResponse: 'OK' });
      }, 1000);
    });
  }

  // Recupera amenità di una proprietà specifica
  async fetchPropertyAmenities(propertyId) {
    try {
      // Import dinamico di SupabaseService
      const { default: SupabaseService } = await import('./supabaseService');
      
      const result = await SupabaseService.fetchPropertyAmenities(propertyId);
      if (result.success) {
        console.log('Amenità recuperate:', result.data);
        return { success: true, data: result.data };
      } else {
        console.warn('Errore nel recupero amenità:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Errore nel fetch amenità:', error);
      return { success: false, error: error.message };
    }
  }

  // Salva form con property_id specifico
  async saveWithPropertyId(formData, propertyId) {
    let databaseSuccess = false;
    
    // Prova prima con il database se abilitato
    if (this.useDatabase) {
      try {
        // Import dinamico di SupabaseService
        const { default: SupabaseService } = await import('./supabaseService');
        
        const result = await SupabaseService.saveFormWithPropertyId(formData, propertyId);
        if (result.success) {
          databaseSuccess = true;
          console.log('Form salvato nel database con property_id:', propertyId);
        }
      } catch (error) {
        console.warn('Fallback a localStorage:', error);
      }
    }
    
    // Salva sempre in localStorage come backup
    try {
      const existingForms = this.getAllForms();
      const newForm = {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        data: formData,
        propertyId: propertyId, // Aggiungi property_id anche in localStorage
        status: 'completed',
        savedToDatabase: databaseSuccess
      };
      
      existingForms.push(newForm);
      localStorage.setItem(this.storageKey, JSON.stringify(existingForms));
      
      console.log('Form salvato localmente con property_id:', newForm);
      return { 
        success: true, 
        formId: newForm.id,
        propertyId: propertyId,
        savedToDatabase: databaseSuccess,
        message: databaseSuccess ? 'Salvato in database e localmente' : 'Salvato solo localmente'
      };
    } catch (error) {
      console.error('Errore nel salvataggio del form:', error);
      return { success: false, error: error.message };
    }
  }
}

// Esporta un'istanza singleton del servizio
export default new FormService(); 