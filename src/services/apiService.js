import axios from 'axios';

// Configurazione API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondi
});

class ApiService {
  
  // Salva un questionario nel database
  async saveForm(formData) {
    try {
      const response = await apiClient.post('/forms', {
        timestamp: new Date().toISOString(),
        data: formData,
        status: 'completed'
      });
      
      console.log('Form salvato nel database:', response.data);
      return { success: true, id: response.data.id };
    } catch (error) {
      console.error('Errore salvataggio database:', error);
      
      // Fallback a localStorage se il server non è disponibile
      if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
        console.log('Server non disponibile, salvando localmente...');
        return { success: false, fallback: true, error: 'Server non raggiungibile' };
      }
      
      return { success: false, error: error.message };
    }
  }

  // Recupera tutti i form dal database
  async getAllForms() {
    try {
      const response = await apiClient.get('/forms');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Errore recupero dal database:', error);
      return { success: false, error: error.message };
    }
  }

  // Recupera statistiche dal database
  async getStats() {
    try {
      const response = await apiClient.get('/forms/stats');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Errore recupero statistiche:', error);
      return { success: false, error: error.message };
    }
  }

  // Esporta dati dal database
  async exportCSV() {
    try {
      const response = await apiClient.get('/forms/export', {
        responseType: 'blob'
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Errore export CSV:', error);
      return { success: false, error: error.message };
    }
  }

  // Test connessione
  async healthCheck() {
    try {
      const response = await apiClient.get('/health');
      return { success: true, status: response.data };
    } catch (error) {
      return { success: false, error: 'Server non raggiungibile' };
    }
  }
}

export default new ApiService();

// Esempi di implementazione backend
export const BACKEND_EXAMPLES = {
  
  // Esempio con Node.js + Express + MongoDB
  nodejs_mongodb: `
    // server.js
    const express = require('express');
    const mongoose = require('mongoose');
    const cors = require('cors');
    
    const app = express();
    app.use(cors());
    app.use(express.json());
    
    // Schema MongoDB
    const FormSchema = new mongoose.Schema({
      timestamp: { type: Date, default: Date.now },
      data: mongoose.Schema.Types.Mixed,
      status: { type: String, default: 'completed' }
    });
    
    const Form = mongoose.model('Form', FormSchema);
    
    // Routes
    app.post('/api/forms', async (req, res) => {
      try {
        const form = new Form(req.body);
        await form.save();
        res.json({ success: true, id: form._id });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
    
    app.get('/api/forms', async (req, res) => {
      try {
        const forms = await Form.find().sort({ timestamp: -1 });
        res.json(forms);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    app.listen(3001, () => console.log('Server running on port 3001'));
  `,
  
  // Esempio con Supabase
  supabase: `
    // supabaseService.js
    import { createClient } from '@supabase/supabase-js';
    
    const supabaseUrl = 'YOUR_SUPABASE_URL';
    const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    export async function saveFormToSupabase(formData) {
      const { data, error } = await supabase
        .from('feedback_forms')
        .insert({
          timestamp: new Date().toISOString(),
          form_data: formData,
          status: 'completed'
        });
      
      if (error) throw error;
      return data;
    }
  `,
  
  // Esempio con Firebase
  firebase: `
    // firebaseService.js
    import { initializeApp } from 'firebase/app';
    import { getFirestore, collection, addDoc } from 'firebase/firestore';
    
    const firebaseConfig = { /* your config */ };
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    export async function saveFormToFirebase(formData) {
      try {
        const docRef = await addDoc(collection(db, 'feedback_forms'), {
          timestamp: new Date(),
          data: formData,
          status: 'completed'
        });
        return { success: true, id: docRef.id };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  `
}; 