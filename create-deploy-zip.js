const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = __dirname;
const zipPath = path.join(projectRoot, 'Premier-Tour-Booking-Hostinger-Deployment.zip');

console.log('📦 Creating Hostinger Deployment Package at:', zipPath);

function createZipWithArchiver() {
  const archiverModule = require('archiver');
  let archive;

  if (typeof archiverModule === 'function') {
    archive = archiverModule('zip', { zlib: { level: 9 } });
  } else if (archiverModule && typeof archiverModule.create === 'function') {
    archive = archiverModule.create('zip', { zlib: { level: 9 } });
  } else if (archiverModule && archiverModule.ZipArchive) {
    archive = new archiverModule.ZipArchive({ zlib: { level: 9 } });
  } else if (archiverModule && archiverModule.default) {
    archive = typeof archiverModule.default === 'function' 
      ? archiverModule.default('zip', { zlib: { level: 9 } })
      : new archiverModule.default.ZipArchive({ zlib: { level: 9 } });
  } else {
    throw new Error('Unsupported archiver module format');
  }

  const output = fs.createWriteStream(zipPath);

  output.on('close', function () {
    const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
    console.log(`✅ Success! Created Hostinger Deployment ZIP: ${zipPath}`);
    console.log(`📦 Final Size: ${sizeMB} MB`);
  });

  archive.on('error', function (err) {
    console.error('Archive Error:', err);
  });

  archive.pipe(output);

  const files = [
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

  files.forEach(file => {
    const fp = path.join(projectRoot, file);
    if (fs.existsSync(fp)) {
      archive.file(fp, { name: file });
    }
  });

  ['dist', 'src', 'public', 'drizzle'].forEach(dirName => {
    const dirPath = path.join(projectRoot, dirName);
    if (fs.existsSync(dirPath)) {
      archive.directory(dirPath, dirName);
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
  ].filter(item => fs.existsSync(path.join(projectRoot, item)));

  const itemsList = items.map(i => `'${i}'`).join(', ');
  const psCmd = `powershell -Command "Compress-Archive -Path ${itemsList} -DestinationPath 'Premier-Tour-Booking-Hostinger-Deployment.zip' -Force"`;

  execSync(psCmd, { cwd: projectRoot, stdio: 'inherit' });
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


