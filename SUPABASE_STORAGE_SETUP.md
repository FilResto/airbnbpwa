# Configurazione Supabase Storage per Upload Immagini

## Setup del bucket storage

Per abilitare l'upload delle immagini nella sezione pulizia, devi configurare un bucket di storage in Supabase.

### 1. Creare il bucket

Vai nella dashboard di Supabase:
1. Clicca su "Storage" nel menu laterale
2. Clicca "Create bucket"
3. Nome bucket: `feedback-images`
4. Seleziona "Public bucket" (per URL pubblici)
5. Clicca "Save"

### 2. Configurare le politiche di accesso (RLS)

Aggiungi queste politiche SQL:

```sql
-- Permetti l'upload a tutti (per ora)
CREATE POLICY "Permetti upload immagini" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'feedback-images');

-- Permetti la lettura a tutti
CREATE POLICY "Permetti lettura immagini" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'feedback-images');

-- Permetti la cancellazione (per cleanup)
CREATE POLICY "Permetti cancellazione immagini" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'feedback-images');
```

### 3. Configurazione opzionale per maggiore sicurezza

Se vuoi limitare l'accesso solo agli utenti autenticati:

```sql
-- Sostituisci le policy sopra con queste per utenti autenticati
CREATE POLICY "Upload solo per autenticati" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'feedback-images');

CREATE POLICY "Lettura pubblica immagini" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'feedback-images');

CREATE POLICY "Cancellazione solo per autenticati" 
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id = 'feedback-images');
```

### 4. Configurazione limiti di upload

Nel dashboard Supabase > Storage > Settings:
- Massima dimensione file: 10MB
- Tipi di file permessi: `image/*`

### 5. Test della configurazione

Per testare che tutto funzioni:
1. Avvia l'app in modalità sviluppo
2. Compila il form fino alla sezione pulizia
3. Metti 2 stelle o meno nella valutazione complessiva
4. Seleziona un'area (es. "Cucina")
5. Prova a caricare un'immagine

### 6. Monitoraggio

Puoi monitorare gli upload:
- Dashboard Supabase > Storage > `feedback-images`
- Vedrai i file organizzati per data e area (es. `pulizia/Cucina/1234567890-abc123.jpg`)

### Struttura dei file nel bucket

```
feedback-images/
├── pulizia/
│   ├── Cucina/
│   │   ├── 1641234567890-abc123.jpg
│   │   └── 1641234567891-def456.jpg
│   ├── Bagno/
│   │   └── 1641234567892-ghi789.jpg
│   └── Camera da letto/
│       └── 1641234567893-jkl012.jpg
```

### Troubleshooting

**Errore: "Unable to upload"**
- Verifica che il bucket `feedback-images` esista
- Controlla le politiche RLS
- Verifica che la chiave API Supabase sia corretta

**Errore: "File too large"**
- Il limite è 10MB per file
- Controlla le impostazioni del bucket

**Immagini non visibili**
- Verifica che il bucket sia pubblico
- Controlla la policy di lettura

### Note importanti

- Le immagini vengono caricate immediatamente quando selezionate
- Se l'utente rimuove un'area, le immagini associate vengono eliminate dal storage
- Il form salva solo i link alle immagini nel database, non i file stessi
