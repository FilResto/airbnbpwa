// Debug per controllare le variabili d'ambiente
console.log('🔍 Debug Environment Variables:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'PRESENTE' : 'MANCANTE');
console.log('All env:', import.meta.env);

// Test di connessione Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔗 Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseKey?.length);

if (supabaseUrl && supabaseKey) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test semplice di connessione
  supabase
    .from('feedback_forms')
    .select('count', { count: 'exact', head: true })
    .then(({ data, error }) => {
      if (error) {
        console.error('❌ Errore connessione:', error);
      } else {
        console.log('✅ Connessione riuscita!', data);
      }
    });
} else {
  console.error('❌ Variabili d\'ambiente mancanti!');
} 