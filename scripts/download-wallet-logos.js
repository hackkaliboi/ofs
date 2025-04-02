import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create wallets directory if it doesn't exist
const walletsDir = path.join(__dirname, '../public/wallets');
if (!fs.existsSync(walletsDir)) {
  fs.mkdirSync(walletsDir, { recursive: true });
}

// List of wallets with their logo URLs
const wallets = [
  {
    id: 'metamask',
    name: 'Metamask',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg'
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    logoUrl: 'https://trustwallet.com/assets/images/media/assets/trust_platform.svg'
  },
  {
    id: 'ledger',
    name: 'Ledger',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/ledger-2.svg'
  },
  {
    id: 'exodus',
    name: 'Exodus Wallet',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/exodus-1.svg'
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    logoUrl: 'https://rainbowkit.com/rainbow.svg'
  },
  {
    id: 'atomic',
    name: 'Atomic',
    logoUrl: 'https://atomicwallet.io/images/logo-a.svg'
  },
  {
    id: 'crypto',
    name: 'Crypto.com DeFi Wallet',
    logoUrl: 'https://crypto.com/static/logo-white.svg'
  },
  {
    id: 'mathwallet',
    name: 'MathWallet',
    logoUrl: 'https://mathwallet.org/icon/mathwallet.svg'
  },
  {
    id: 'zelcore',
    name: 'Zelcore',
    logoUrl: 'https://zelcore.io/images/ZelCore-Round.svg'
  },
  {
    id: 'viawallet',
    name: 'ViaWallet',
    logoUrl: 'https://www.viawallet.com/images/logo.svg'
  },
  {
    id: 'xdc',
    name: 'XDC Wallet',
    logoUrl: 'https://xinfin.org/assets/images/brand-assets/xdc-icon.svg'
  },
  {
    id: 'ownbit',
    name: 'Ownbit',
    logoUrl: 'https://ownbit.io/images/logo-blue.svg'
  },
  {
    id: 'vision',
    name: 'Vision',
    logoUrl: 'https://www.visionwallet.io/img/logo-vision.svg'
  },
  {
    id: 'morix',
    name: 'MoriX Wallet',
    logoUrl: 'https://placeholder-wallet.svg' // Fallback to placeholder
  },
  {
    id: 'safepal',
    name: 'SafePal',
    logoUrl: 'https://safepal.io/images/logo.svg'
  },
  {
    id: 'sparkpoint',
    name: 'SparkPoint',
    logoUrl: 'https://sparkpoint.io/assets/img/logo.svg'
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    logoUrl: 'https://unstoppable.money/images/logo.svg'
  },
  {
    id: 'peakdefi',
    name: 'PeakDeFi Wallet',
    logoUrl: 'https://peakdefi.com/img/peakdefi-logo.svg'
  },
  {
    id: 'infinity',
    name: 'Infinity Wallet',
    logoUrl: 'https://infinitywallet.io/images/logo.svg'
  },
  {
    id: 'lobstr',
    name: 'Lobstr Wallet',
    logoUrl: 'https://lobstr.co/static/images/lobstr-logo.svg'
  }
];

// Function to download a file
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        console.log(`Redirecting to: ${response.headers.location}`);
        return downloadFile(response.headers.location, destination)
          .then(resolve)
          .catch(reject);
      }
      
      // Check if the request was successful
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
      
      // Create a write stream to save the file
      const fileStream = fs.createWriteStream(destination);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${destination}`);
        resolve();
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(destination, () => {}); // Delete the file if there was an error
        reject(err);
      });
    });
    
    request.on('error', (err) => {
      reject(err);
    });
    
    // Set a timeout for the request
    request.setTimeout(10000, () => {
      request.abort();
      reject(new Error(`Request timeout: ${url}`));
    });
  });
}

// Download all wallet logos
async function downloadWalletLogos() {
  console.log('Starting to download wallet logos...');
  
  for (const wallet of wallets) {
    const filePath = path.join(walletsDir, `${wallet.id}.svg`);
    
    try {
      await downloadFile(wallet.logoUrl, filePath);
      console.log(`Successfully downloaded ${wallet.name} logo`);
    } catch (error) {
      console.error(`Error downloading ${wallet.name} logo:`, error.message);
      
      // If download fails, copy the placeholder wallet image
      try {
        const placeholderPath = path.join(__dirname, '../public/placeholder-wallet.svg');
        if (fs.existsSync(placeholderPath)) {
          fs.copyFileSync(placeholderPath, filePath);
          console.log(`Used placeholder for ${wallet.name}`);
        } else {
          console.error('Placeholder wallet image not found');
        }
      } catch (copyError) {
        console.error(`Error copying placeholder for ${wallet.name}:`, copyError.message);
      }
    }
  }
  
  console.log('Finished downloading wallet logos');
}

// Run the download function
downloadWalletLogos().catch(console.error);
