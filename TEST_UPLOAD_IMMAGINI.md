# Test Upload Immagini - Sezione Pulizia

## Come testare la nuova funzionalità

### 1. Preparazione
- Assicurati che Supabase Storage sia configurato (vedi SUPABASE_STORAGE_SETUP.md)
- Avvia l'app: `npm run dev`

### 2. Test del flusso completo

1. **Apri l'app nel browser**
   - Vai su `http://localhost:5173`

2. **Naviga nella sezione pulizia**
   - Compila il form fino alla sezione "Pulizia"
   - Nella domanda "Valuta la pulizia complessiva", metti **2 stelle o meno**

3. **Verifica apparizione aree**
   - Dovrebbe apparire la sezione "Quali aree erano meno pulite?"
   - Seleziona almeno un'area (es. "Cucina")

4. **Test upload immagini**
   - Dovrebbe apparire il componente di upload sotto l'area selezionata
   - Clicca "Aggiungi foto" 
   - Seleziona 1-3 immagini dal tuo dispositivo
   - Le immagini dovrebbero:
     - Mostrare un preview immediato
     - Iniziare l'upload automaticamente
     - Mostrare "Caricamento..." durante l'upload
     - Mostrare l'immagine finale quando completato

5. **Test rimozione immagini**
   - Clicca l'icona di cancellazione (🗑️) su un'immagine
   - L'immagine dovrebbe essere rimossa sia visivamente che dal storage

6. **Test multiple aree**
   - Seleziona più aree (es. "Cucina" + "Bagno")
   - Carica immagini diverse per ogni area
   - Verifica che le immagini siano separate per area

7. **Test invio form**
   - Completa il resto del questionario
   - Invia il form
   - Controlla nella dashboard admin che:
     - Il form è stato salvato
     - I link alle immagini sono presenti nei dati
     - Le immagini sono visibili nelle statistiche

### 3. Verifica su Supabase

1. **Storage**
   - Dashboard Supabase → Storage → feedback-images
   - Dovresti vedere i file organizzati come:
     ```
     pulizia/Cucina/[timestamp]-[random].jpg
     pulizia/Bagno/[timestamp]-[random].jpg
     ```

2. **Database**
   - Tabella `feedback` → colonna `form_data`
   - Cerca un campo `pulizia_immagini` con struttura:
     ```json
     {
       "Cucina": [
         {
           "url": "https://[project].supabase.co/storage/v1/object/public/feedback-images/pulizia/Cucina/...",
           "path": "pulizia/Cucina/[timestamp]-[random].jpg",
           "area": "Cucina"
         }
       ]
     }
     ```

### 4. Test casi limite

1. **File troppo grandi**: Prova con file > 10MB (dovrebbe dare errore)
2. **File non immagini**: Prova con PDF/TXT (dovrebbe dare errore)
3. **Troppe immagini**: Prova a caricare più di 3 per area (dovrebbe bloccare)
4. **Deseleziona area**: Togli il check da un'area con immagini (dovrebbe rimuovere le immagini)
5. **Rating > 2 stelle**: Metti 3+ stelle (la sezione immagini non dovrebbe apparire)

### 5. Controllo console

Apri Developer Tools → Console e verifica:
- Nessun errore durante l'upload
- Log di conferma upload successo
- Eventuali warning ma non errori critici

### 6. Test su dispositivi mobili

- Prova su smartphone/tablet
- Verifica che il bottone "Aggiungi foto" apra la camera o galleria
- Controlla la responsività del layout

### 7. Verifica Admin Panel

1. Accedi all'admin panel
2. Visualizza i feedback ricevuti
3. Controlla che le immagini siano mostrate correttamente
4. Verifica l'export CSV includa i link alle immagini

## Comportamenti attesi

✅ **Upload automatico**: Le immagini si caricano appena selezionate
✅ **Preview immediato**: L'utente vede subito cosa ha selezionato  
✅ **Feedback visivo**: Indicatori di caricamento chiari
✅ **Gestione errori**: Messaggi di errore comprensibili
✅ **Pulizia storage**: Rimozione file quando l'utente cancella
✅ **Organizzazione**: File organizzati per area nel storage
✅ **Dati strutturati**: Link salvati correttamente nel database

## Risoluzione problemi comuni

**Upload non funziona:**
- Verifica configurazione Supabase Storage
- Controlla VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
- Verifica politiche RLS del bucket

**Immagini non visibili:**
- Bucket deve essere pubblico
- URL devono essere accessibili senza autenticazione

**Errori di rete:**
- Verifica connessione internet
- Controlla CORS settings su Supabase
