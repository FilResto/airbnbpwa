# 🏠 Airbnb Feedback PWA

Una Progressive Web App (PWA) per raccogliere feedback post-soggiorno da ospiti Airbnb. Costruita con React, Material-UI e Vite.

## ✨ Caratteristiche

- **📱 PWA Completa**: Installabile su desktop e mobile
- **🎨 UI Moderna**: Interfaccia elegante con Material-UI e tema Airbnb
- **📋 Form Multi-Step**: Questionario diviso in sezioni intuitive
- **💾 Salvataggio Locale**: Dati salvati automaticamente nel browser
- **📊 Pannello Admin**: Visualizzazione statistiche e esportazione dati
- **🌐 Offline Ready**: Funziona anche senza connessione internet
- **📱 Responsive**: Ottimizzato per tutti i dispositivi

## 🚀 Quick Start

### Prerequisiti
- Node.js (versione 16 o superiore)
- npm o yarn

### Installazione

1. **Clona o scarica il progetto**
```bash
git clone <repository-url>
cd airbnbpwa
```

2. **Installa le dipendenze**
```bash
npm install
```

3. **Avvia il server di sviluppo**
```bash
npm run dev
```

4. **Apri nel browser**
   - Vai su `http://localhost:5173`
   - L'applicazione sarà pronta all'uso!

## 📱 Generazione Icone PWA

Per generare le icone PWA necessarie:

1. Apri `http://localhost:5173/icon-generator.html` nel browser
2. Clicca su "Genera e Scarica Icone"
3. Salva le icone generate nella cartella `public/`

Le icone necessarie sono:
- `pwa-192x192.png` (192x192 px)
- `pwa-512x512.png` (512x512 px)  
- `apple-touch-icon.png` (180x180 px)

## 📊 Sezioni del Questionario

### 1. **Introduzione**
- Spiegazione dell'importanza del feedback
- Informazioni sulla privacy
- Tempo stimato di completamento

### 2. **Pulizia**
- Valutazione pulizia complessiva (1-5 stelle)
- Aree specifiche meno pulite (condizionale)
- Stato lenzuola e asciugamani
- Ordine generale dell'alloggio

### 3. **Funzionamento Elettrodomestici**
- Tabella completa con tutti gli elettrodomestici
- Stato: Funzionante / Problema / Non Presente
- Campo descrizione problemi (condizionale)

### 4. **Valutazioni Globali**
- NPS Score (0-10) con slider interattivo
- Motivo della valutazione NPS
- Valutazione complessiva soggiorno (1-5 stelle)
- Probabilità di tornare

### 5. **Commenti e Suggerimenti**
- Cosa è stato apprezzato di più
- Suggerimenti per miglioramenti
- Consenso per ricontatto
- Informazioni di contatto (opzionali)

### 6. **Ringraziamento**
- Conferma invio
- Informazioni su prossimi passi
- Possibilità di compilare nuovo questionario

## 🔧 Pannello Amministrativo

Accedi al pannello admin su `/admin` per:

### 📈 Statistiche in Tempo Reale
- Numero totale questionari
- Valutazione media (stelle)
- NPS medio
- Data ultimo invio

### 📋 Gestione Dati
- Visualizzazione tutti i questionari
- Dettagli completi di ogni submission
- Filtri e ricerca avanzata

### 📥 Esportazione
- **Export CSV**: Scarica tutti i dati in formato CSV
- **Analisi Excel**: Compatibile con Excel e Google Sheets
- **Backup**: Funzione di backup e ripristino dati

## 💾 Gestione Dati

### Salvataggio Locale
- I dati vengono salvati automaticamente nel `localStorage` del browser
- Nessun server richiesto per il funzionamento base
- Persistenza dei dati tra le sessioni

### Struttura Dati
```javascript
{
  id: "unique_id",
  timestamp: "2024-01-15T10:30:00Z",
  data: {
    pulizia_complessiva: 5,
    aree_meno_pulite: ["Bagno"],
    nps_score: 9,
    valutazione_complessiva: 5,
    // ... altri campi
  },
  status: "completed"
}
```

### Integrazione Server (Opzionale)
Per integrare con un backend:

1. Modifica `src/services/formService.js`
2. Implementa la funzione `sendToServer()`
3. Configura endpoint API nel file di configurazione

## 🛠️ Tecnologie Utilizzate

- **React 18**: Framework JavaScript
- **Material-UI 5**: Libreria componenti UI
- **Formik**: Gestione form e validazione
- **Yup**: Schema validation
- **React Router**: Routing e navigazione
- **Vite**: Build tool e dev server
- **PWA Plugin**: Service worker e manifest

## 📁 Struttura Progetto

```
airbnbpwa/
├── public/
│   ├── manifest.json
│   ├── icon-generator.html
│   └── [icone PWA]
├── src/
│   ├── components/
│   │   ├── FormWizard.jsx
│   │   ├── AdminPanel.jsx
│   │   └── sections/
│   │       ├── IntroSection.jsx
│   │       ├── PuliziaSection.jsx
│   │       ├── FunzionamentoSection.jsx
│   │       ├── ValutazioniSection.jsx
│   │       ├── CommentiSection.jsx
│   │       └── ThankYouSection.jsx
│   ├── services/
│   │   └── formService.js
│   ├── utils/
│   │   └── generateIcons.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Deploy in Produzione

### Build per Produzione
```bash
npm run build
```

### Deploy Options

#### 1. **Netlify** (Raccomandato)
```bash
npm run build
# Carica la cartella dist/ su Netlify
```

#### 2. **Vercel**
```bash
npm run build
# Deploy automatico tramite Vercel CLI
```

#### 3. **Server Statico**
```bash
npm run build
# Copia dist/ sul tuo server web
```

### Configurazione HTTPS
⚠️ **Importante**: Le PWA richiedono HTTPS in produzione!

## 🔒 Privacy e GDPR

L'applicazione è progettata per essere conforme GDPR:

- ✅ Consenso esplicito per il trattamento dati
- ✅ Informativa privacy chiara
- ✅ Possibilità di non fornire dati opzionali
- ✅ Diritto di ricontatto opzionale
- ✅ Dati salvati localmente (privacy by design)

## 🎨 Personalizzazione

### Tema e Colori
Modifica `src/App.jsx` per personalizzare:
```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5A5F', // Cambia colore primario
    },
    // ... altri colori
  },
});
```

### Aggiungere Domande
1. Modifica `src/components/FormWizard.jsx` (initialValues)
2. Aggiorna la sezione appropriata in `src/components/sections/`
3. Aggiorna lo schema di validazione se necessario

## 🐛 Troubleshooting

### Problemi Comuni

**PWA non si installa**
- Verifica HTTPS in produzione
- Controlla che tutte le icone siano presenti
- Verifica il manifest.json

**Dati non si salvano**
- Controlla la console per errori JavaScript
- Verifica che localStorage sia abilitato
- Testa in modalità incognito

**Errori di build**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📞 Supporto

Per problemi o domande:
- 📧 Email: [inserisci email]
- 🐛 Issues: [Link repository GitHub]
- 📖 Documentazione: [Link documentazione]

## 📄 Licenza

MIT License - Vedi file LICENSE per dettagli.

---

**Sviluppato con ❤️ per migliorare l'esperienza ospiti Airbnb**
