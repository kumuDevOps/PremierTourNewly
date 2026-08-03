const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const zipPath = path.join(__dirname, 'Premier-Tour-Booking-Hostinger-Deployment.zip');
console.log('📦 Starting ZIP Creation:', zipPath);

function createZipWithArchiver() {
  const archiverModule = require('archiver');
  let archive;

  if (typeof archiverModule === 'function') {
    archive = archiverModule('zip', { zlib: { level: 9 } });
  } else if (archiverModule && typeof archiverModule.default === 'function') {
    archive = archiverModule.default('zip', { zlib: { level: 9 } });
  } else if (archiverModule && typeof archiverModule.create === 'function') {
    archive = archiverModule.create('zip', { zlib: { level: 9 } });
  } else {
    throw new TypeError('archiver module is not a callable function or object');
  }

  const output = fs.createWriteStream(zipPath);

  output.on('close', function () {
    console.log(`✅ SUCCESS! Created Hostinger Deployment ZIP: ${zipPath}`);
    console.log(`📦 Archive Size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
  });

  archive.on('error', function (err) {
    console.error('Archive Error:', err);
  });

  archive.pipe(output);

  const files = [
    '.env',
    '.env.example',
    'Hostinger_Deployment_Guide.md',
    'package.json',
    'package-lock.json',
    'vite.config.ts',
    'tsconfig.json',
    'index.html',
    'server.ts',
    'seed_data.json'
  ];

  files.forEach(file => {
    const fp = path.join(__dirname, file);
    if (fs.existsSync(fp)) {
      archive.file(fp, { name: file });
    }
  });

  ['dist', 'src', 'public', 'drizzle'].forEach(d => {
    const dirPath = path.join(__dirname, d);
    if (fs.existsSync(dirPath)) {
      archive.directory(dirPath, d);
    }
  });

  archive.finalize();
}

function createZipWithPowerShell() {
  console.log('🔄 Fallback: Creating ZIP using Windows PowerShell...');
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }
  const items = [
    '.env',
    '.env.example',
    'Hostinger_Deployment_Guide.md',
    'package.json',
    'package-lock.json',
    'vite.config.ts',
    'tsconfig.json',
    'index.html',
    'server.ts',
    'seed_data.json',
    'dist',
    'src',
    'public',
    'drizzle'
  ].filter(item => fs.existsSync(path.join(__dirname, item)));

  const itemsList = items.map(i => `'${i}'`).join(', ');
  const psCmd = `powershell -Command "Compress-Archive -Path ${itemsList} -DestinationPath 'Premier-Tour-Booking-Hostinger-Deployment.zip' -Force"`;

  execSync(psCmd, { cwd: __dirname, stdio: 'inherit' });
  const stat = fs.statSync(zipPath);
  console.log(`✅ Success! Created Hostinger Deployment ZIP: ${zipPath}`);
  console.log(`📦 Final Size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
}

try {
  createZipWithArchiver();
} catch (err) {
  console.warn('Archiver module failed:', err.message);
  try {
    createZipWithPowerShell();
  } catch (psErr) {
    console.error('PowerShell ZIP creation failed:', psErr.message);
  }
}

