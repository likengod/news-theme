import fs from 'fs';
import path from 'path';

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.output' && file !== '.tanstack') {
        searchDir(fullPath);
      }
    } else if (stat.isFile()) {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css') || file.endsWith('.json')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.toLowerCase().includes('follow') && content.toLowerCase().includes('tags')) {
          console.log(`Found in: ${fullPath}`);
        }
      }
    }
  }
}

console.log('Searching for tags components...');
searchDir('c:\\Users\\gorillatech\\Music\\TodayTripura\\src');
