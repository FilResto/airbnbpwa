// Debug per controllare le variabili d'ambiente
console.log('🔍 Debug Environment Variables:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'PRESENTE' : 'MANCANTE');
console.log('All env:', import.meta.env);

// Import del test completo
console.log('\n🧪 Eseguendo test completo Supabase...');
import('./test-supabase.js').then(() => {
  console.log('✅ Test Supabase completato');
}).catch(error => {
  console.error('❌ Errore nel test Supabase:', error);
}); 