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