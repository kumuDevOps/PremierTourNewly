const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = __dirname;
const zipFile = path.join(root, 'Premier-Tour-Booking-Hostinger-Deployment.zip');

console.log('Building deployment zip package at:', zipFile);

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

  const output = fs.createWriteStream(zipFile);

  output.on('close', () => {
    console.log(`✅ Success! Created deployment archive (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
  });

  archive.on('error', (err) => {
    console.error('Error during zip generation:', err);
  });

  archive.pipe(output);

  const topFiles = [
    '.env',
    '.env.example',
    '.npmrc',
    'Hostinger_Deployment_Guide.md',
    'package.json',
    'vite.config.ts',
    'tsconfig.json',
    'index.html',
    'server.ts',
    'seed_data.json'
  ];

  topFiles.forEach(f => {
    const p = path.join(root, f);
    if (fs.existsSync(p)) {
      archive.file(p, { name: f });
    }
  });

  ['dist', 'src', 'public', 'drizzle'].forEach(d => {
    const p = path.join(root, d);
    if (fs.existsSync(p)) {
      archive.directory(p, d);
    }
  });

  archive.finalize();
}

function createZipWithPowerShell() {
  console.log('🔄 Fallback: Creating ZIP using Windows PowerShell...');
  if (fs.existsSync(zipFile)) {
    fs.unlinkSync(zipFile);
  }
  const items = [
    '.env',
    '.env.example',
    '.npmrc',
    'Hostinger_Deployment_Guide.md',
    'package.json',
    'vite.config.ts',
    'tsconfig.json',
    'index.html',
    'server.ts',
    'seed_data.json',
    'dist',
    'src',
    'public',
    'drizzle'
  ].filter(item => fs.existsSync(path.join(root, item)));

  const itemsList = items.map(i => `'${i}'`).join(', ');
  const psCmd = `powershell -Command "Compress-Archive -Path ${itemsList} -DestinationPath 'Premier-Tour-Booking-Hostinger-Deployment.zip' -Force"`;

  execSync(psCmd, { cwd: root, stdio: 'inherit' });
  const stat = fs.statSync(zipFile);
  console.log(`✅ Success! Created Hostinger Deployment ZIP: ${zipFile}`);
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

