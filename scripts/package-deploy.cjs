const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const AdmZip = require('jszip');

async function main() {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  const version = pkg.version || '1.2.25';

  console.log(`=== Step 1: Running Production Build for v${version} ===`);
  execSync('npm run build', { stdio: 'inherit' });

  console.log('\n=== Step 2: Syncing assets directory ===');
  const clientAssetsDir = path.join(__dirname, '..', 'dist', 'client', 'assets');
  const rootAssetsDir = path.join(__dirname, '..', 'assets');

  if (fs.existsSync(rootAssetsDir)) {
    fs.rmSync(rootAssetsDir, { recursive: true, force: true });
  }
  fs.mkdirSync(rootAssetsDir, { recursive: true });

  if (fs.existsSync(clientAssetsDir)) {
    for (const f of fs.readdirSync(clientAssetsDir)) {
      fs.copyFileSync(path.join(clientAssetsDir, f), path.join(rootAssetsDir, f));
    }
    console.log(`Copied ${fs.readdirSync(clientAssetsDir).length} files to root assets/`);
  }

  console.log(`\n=== Step 3: Packaging hostinger-full-deploy-v${version}.zip ===`);
  const zip = new AdmZip();

  function addDirectoryToZip(dirPath, zipPrefix) {
    if (!fs.existsSync(dirPath)) return;
    for (const item of fs.readdirSync(dirPath)) {
      const fullPath = path.join(dirPath, item);
      const zipPath = zipPrefix ? `${zipPrefix}/${item}` : item;
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        addDirectoryToZip(fullPath, zipPath);
      } else {
        zip.file(zipPath, fs.readFileSync(fullPath));
      }
    }
  }

  // Add directories
  console.log('Adding dist/...');
  addDirectoryToZip(path.join(__dirname, '..', 'dist'), 'dist');

  console.log('Adding public/...');
  addDirectoryToZip(path.join(__dirname, '..', 'public'), 'public');

  console.log('Adding assets/...');
  addDirectoryToZip(path.join(__dirname, '..', 'assets'), 'assets');

  // Add root files
  const rootFilesToInclude = [
    'server.js',
    'ecosystem.config.cjs',
    'package.json',
    'package-lock.json',
    'app.config.ts',
    'vite.config.ts',
    'tsconfig.json',
    'components.json',
    '.env',
  ];

  for (const rf of rootFilesToInclude) {
    const fullPath = path.join(__dirname, '..', rf);
    if (fs.existsSync(fullPath)) {
      console.log(`Adding ${rf}...`);
      zip.file(rf, fs.readFileSync(fullPath));
    }
  }

  console.log('\nGenerating ZIP file...');
  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const fullDeployPath = path.join(__dirname, '..', `hostinger-full-deploy-v${version}.zip`);
  const deployPath = path.join(__dirname, '..', `hostinger-deploy-v${version}.zip`);

  fs.writeFileSync(fullDeployPath, buffer);
  fs.writeFileSync(deployPath, buffer);

  const sizeMb = (fs.statSync(fullDeployPath).size / 1024 / 1024).toFixed(2);
  console.log(`\nSUCCESS! Created:`);
  console.log(`1) hostinger-full-deploy-v${version}.zip (${sizeMb} MB)`);
  console.log(`2) hostinger-deploy-v${version}.zip (${sizeMb} MB)`);
}

main().catch((err) => {
  console.error('Packaging failed:', err);
  process.exit(1);
});
