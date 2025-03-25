// Script to generate placeholder wallet images
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make sure the wallets directory exists
const walletsDir = path.join(__dirname, '..', 'public', 'wallets');
if (!fs.existsSync(walletsDir)) {
  fs.mkdirSync(walletsDir, { recursive: true });
}

// List of wallets that need placeholder images
const wallets = [
  'metamask',
  'trustwallet',
  'ledger',
  'blockchain',
  'rainbow',
  'viawallet',
  'ownbit',
  'zelcore',
  'xdc',
  'vision',
  'atomic',
  'crypto-com',
  'mathwallet',
  'morix',
  'safepal',
  'sparkpoint',
  'unstoppable',
  'peakdefi',
  'infinity',
  'exodus',
  'lobstr'
];

// Generate a placeholder image for each wallet
wallets.forEach(wallet => {
  const imagePath = path.join(walletsDir, `${wallet}.png`);
  
  // Skip if the image already exists
  if (fs.existsSync(imagePath)) {
    console.log(`Image for ${wallet} already exists, skipping...`);
    return;
  }
  
  // Generate a placeholder image using placehold.co
  const placeholderUrl = `https://placehold.co/200x200/4F46E5/FFFFFF?text=${wallet.charAt(0).toUpperCase() + wallet.slice(1)}`;
  
  // Download the image
  https.get(placeholderUrl, (response) => {
    const fileStream = fs.createWriteStream(imagePath);
    response.pipe(fileStream);
    
    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`Generated placeholder image for ${wallet}`);
    });
  }).on('error', (err) => {
    console.error(`Error generating placeholder for ${wallet}:`, err.message);
  });
});

console.log('Placeholder generation script completed!');
