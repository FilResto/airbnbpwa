// Script di test per verificare la connessione e i permessi Supabase

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variabili d\'ambiente Supabase mancanti!');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'PRESENTE' : 'MANCANTE');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'PRESENTE' : 'MANCANTE');
} else {
  console.log('✅ Variabili d\'ambiente Supabase presenti');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test 1: Health check
  console.log('\n🔍 Test 1: Health check della tabella feedback...');
  supabase
    .from('feedback')
    .select('count', { count: 'exact', head: true })
    .then(({ data, error, count }) => {
      if (error) {
        console.error('❌ Errore health check:', error);
      } else {
        console.log('✅ Health check riuscito!');
        console.log('📊 Numero record in feedback:', count);
      }
    });
  
  // Test 2: Tentativo di inserimento
  console.log('\n🔍 Test 2: Tentativo inserimento record di test...');
  const testData = {
    pulizia_complessiva: 5,
    test: true,
    timestamp: new Date().toISOString()
  };
  
  supabase
    .from('feedback')
    .insert({
      form_data: testData,
      created_at: new Date().toISOString(),
      property_id: null
    })
    .select()
    .then(({ data, error }) => {
      if (error) {
        console.error('❌ Errore inserimento test:', error);
        console.error('💥 Dettagli:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
      } else {
        console.log('✅ Inserimento test riuscito!');
        console.log('📄 Dati inseriti:', data);
        
        // Cleanup: rimuovi il record di test
        if (data && data[0]) {
          supabase
            .from('feedback')
            .delete()
            .eq('id', data[0].id)
            .then(() => {
              console.log('🧹 Record di test rimosso');
            });
        }
      }
    });
  
  // Test 3: Verifica policy
  console.log('\n🔍 Test 3: Verifica policy di lettura...');
  supabase
    .from('feedback')
    .select('id, created_at')
    .limit(1)
    .then(({ data, error }) => {
      if (error) {
        console.error('❌ Errore lettura (potrebbero essere policy):', error);
      } else {
        console.log('✅ Lettura riuscita o tabella vuota');
        console.log('📄 Dati letti:', data);
      }
    });
}

// Export solo se necessario
