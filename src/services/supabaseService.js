import { createClient } from '@supabase/supabase-js';

// Configurazione Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Crea client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseService {
  
  // Test connessione
  async healthCheck() {
    try {
      const { data, error } = await supabase
        .from('feedback_forms')
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
      const { data, error } = await supabase
        .from('feedback_forms')
        .insert({
          form_data: formData,
          timestamp: new Date().toISOString(),
          status: 'completed'
        })
        .select();

      if (error) throw error;
      
      console.log('Form salvato in Supabase:', data);
      return { success: true, id: data[0].id };
    } catch (error) {
      console.error('Errore salvataggio Supabase:', error);
      return { success: false, error: error.message };
    }
  }

  // Recupera tutti i form
  async getAllForms() {
    try {
      const { data, error } = await supabase
        .from('feedback_forms')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      
      // Trasforma i dati nel formato aspettato dall'app
      const transformedData = data.map(row => ({
        id: row.id,
        timestamp: row.timestamp,
        data: row.form_data,
        status: row.status
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
      const { data, error } = await supabase
        .from('feedback_forms')
        .select('form_data, timestamp');

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
          lastSubmission: data[0]?.timestamp
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
}

export default new SupabaseService(); 