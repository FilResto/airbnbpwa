// Utility per generare icone PWA semplici programmaticamente
export function generateIcon(size = 192, backgroundColor = '#FF5A5F', text = 'A') {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = size;
  canvas.height = size;
  
  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, size, size);
  
  // Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${size * 0.4}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size / 2);
  
  return canvas.toDataURL('image/png');
}

export function generatePWAIcons() {
  const icons = [
    { size: 192, name: 'pwa-192x192.png' },
    { size: 512, name: 'pwa-512x512.png' },
    { size: 180, name: 'apple-touch-icon.png' }
  ];
  
  icons.forEach(icon => {
    const dataUrl = generateIcon(icon.size, '#FF5A5F', 'A');
    downloadIcon(dataUrl, icon.name);
  });
}

function downloadIcon(dataUrl, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

// Genera un manifest icon programmaticamente
export function createManifestIcon() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 192;
  canvas.height = 192;
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 192, 192);
  gradient.addColorStop(0, '#FF5A5F');
  gradient.addColorStop(1, '#FF385C');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 192, 192);
  
  // House icon simulation
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 8;
  
  // House outline
  ctx.beginPath();
  ctx.moveTo(60, 96);
  ctx.lineTo(96, 60);
  ctx.lineTo(132, 96);
  ctx.lineTo(132, 140);
  ctx.lineTo(60, 140);
  ctx.closePath();
  ctx.fill();
  
  // Door
  ctx.fillStyle = '#FF5A5F';
  ctx.fillRect(84, 115, 24, 25);
  
  return canvas.toDataURL('image/png');
} 

export function generatePWAIcon(size = 192, backgroundColor = '#FF5A5F', foregroundColor = '#FFFFFF') {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Sfondo circolare con colore Airbnb
  ctx.fillStyle = backgroundColor;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, 2 * Math.PI);
  ctx.fill();

  // Disegna una casa stilizzata
  const houseSize = size * 0.4;
  const houseX = size/2 - houseSize/2;
  const houseY = size/2 - houseSize/2;

  // Tetto della casa
  ctx.fillStyle = foregroundColor;
  ctx.beginPath();
  ctx.moveTo(houseX, houseY + houseSize * 0.3);
  ctx.lineTo(houseX + houseSize/2, houseY);
  ctx.lineTo(houseX + houseSize, houseY + houseSize * 0.3);
  ctx.fill();

  // Corpo della casa
  ctx.fillStyle = foregroundColor;
  ctx.fillRect(houseX, houseY + houseSize * 0.3, houseSize, houseSize * 0.7);

  // Porta
  ctx.fillStyle = backgroundColor;
  const doorWidth = houseSize * 0.2;
  const doorHeight = houseSize * 0.4;
  const doorX = houseX + houseSize/2 - doorWidth/2;
  const doorY = houseY + houseSize * 0.6;
  ctx.fillRect(doorX, doorY, doorWidth, doorHeight);

  // Finestra
  ctx.fillStyle = backgroundColor;
  const windowSize = houseSize * 0.15;
  const windowX = houseX + houseSize * 0.2;
  const windowY = houseY + houseSize * 0.4;
  ctx.fillRect(windowX, windowY, windowSize, windowSize);

  // Simbolo di feedback (bolla di chat)
  const chatSize = size * 0.15;
  const chatX = size * 0.7;
  const chatY = size * 0.2;
  
  ctx.fillStyle = foregroundColor;
  ctx.beginPath();
  ctx.arc(chatX, chatY, chatSize, 0, 2 * Math.PI);
  ctx.fill();
  
  // Puntino della bolla
  ctx.beginPath();
  ctx.moveTo(chatX + chatSize * 0.3, chatY + chatSize);
  ctx.lineTo(chatX + chatSize * 0.5, chatY + chatSize * 1.2);
  ctx.lineTo(chatX + chatSize * 0.7, chatY + chatSize);
  ctx.fill();

  return canvas.toDataURL('image/png');
}

export function createPWAIcons() {
  console.log('🎨 Generando icone PWA...');
  
  // Genera icona 192x192
  const icon192 = generatePWAIcon(192);
  downloadIcon(icon192, 'pwa-192x192.png');
  
  // Genera icona 512x512
  const icon512 = generatePWAIcon(512);
  downloadIcon(icon512, 'pwa-512x512.png');
  
  // Genera apple-touch-icon
  const appleIcon = generatePWAIcon(180);
  downloadIcon(appleIcon, 'apple-touch-icon.png');
  
  console.log('✅ Icone PWA generate con successo!');
} 