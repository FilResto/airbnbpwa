# Airbnb Feedback PWA

Una Progressive Web App per la gestione dei feedback post-soggiorno degli ospiti Airbnb.

## 🚀 Funzionalità Principali

### Gestione Proprietà
- **Creazione proprietà**: Aggiungi nuove proprietà con nome e descrizione
- **Configurazione elettrodomestici**: Personalizza gli elettrodomestici disponibili per ogni proprietà
- **Generazione QR Code**: Crea QR code personalizzati per ogni proprietà
- **Link diretti**: Genera link diretti per accedere al questionario specifico

### Questionario di Feedback
- **Sezioni multiple**: Pulizia, funzionamento elettrodomestici, valutazioni, commenti
- **Personalizzazione**: Questionario adattato agli elettrodomestici configurati
- **Salvataggio**: Dati salvati localmente e opzionalmente su database

### Pannello Amministrativo
- **Statistiche**: Visualizza metriche sui feedback ricevuti
- **Esportazione CSV**: Esporta tutti i dati in formato CSV
- **Gestione dati**: Elimina tutti i questionari se necessario

## 📱 Come Utilizzare i QR Code

### Per il Proprietario
1. Accedi al pannello amministrativo (`/admin`)
2. Vai alla sezione "Gestione Proprietà" (`/properties`)
3. Per ogni proprietà, clicca sull'icona QR Code (📱)
4. Il QR code generato contiene il link diretto al questionario per quella proprietà
5. Condividi il QR code con gli ospiti alla fine del soggiorno

### Per gli Ospiti
1. Scansiona il QR code con la fotocamera del telefono
2. Il link si aprirà direttamente nel questionario personalizzato per quella proprietà
3. Compila il questionario (2-3 minuti)
4. I dati vengono salvati automaticamente

## 🔧 Installazione

```bash
npm install
npm run dev
```

## 📊 Database

L'applicazione supporta sia il salvataggio locale che su Supabase. Configura le variabili d'ambiente:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎯 Vantaggi

- **Facilità d'uso**: QR code semplici da scansionare
- **Personalizzazione**: Questionari adattati a ogni proprietà
- **Offline**: Funziona anche senza connessione internet
- **PWA**: Installabile come app nativa
- **Responsive**: Ottimizzata per mobile e desktop

## 📈 Metriche Disponibili

- Numero totale di questionari
- Valutazione media della pulizia
- NPS (Net Promoter Score) medio
- Tasso di ritorno degli ospiti
- Ultimo invio ricevuto

## 🔐 Sicurezza

- Accesso amministrativo protetto
- Dati salvati localmente con fallback
- Nessun dato personale richiesto agli ospiti
- Conformità GDPR
