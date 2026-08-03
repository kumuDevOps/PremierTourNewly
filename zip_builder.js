import fs from 'fs';
import path from 'path';
import { ZipArchive } from 'archiver';

const root = process.cwd();
const zipPath = path.join(root, 'Premier-Tour-Booking-Hostinger-Deployment.zip');

console.log('📦 Starting Archive Builder for Hostinger...');

const output = fs.createWriteStream(zipPath);
const archive = new ZipArchive({ zlib: { level: 9 } });

output.on('close', () => {
  console.log(`🎉 ARCHIVE GENERATED: ${zipPath} (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
});

archive.on('error', (err) => {
  console.error('ZIP error:', err);
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

files.forEach(f => {
  const p = path.join(root, f);
  if (fs.existsSync(p)) {
    archive.file(p, { name: f });
  }
});

['dist', 'src', 'public'].forEach(d => {
  const p = path.join(root, d);
  if (fs.existsSync(p)) {
    archive.directory(p, d);
  }
});

archive.finalize();
