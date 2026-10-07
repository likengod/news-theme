const fs = require('fs');
let c = fs.readFileSync('src/lib/deploy.server.ts', 'utf8');
c = c.replace(/"npm run build 2>&1"/g, '"npm install --no-audit --no-fund && npm run build 2>&1"');
fs.writeFileSync('src/lib/deploy.server.ts', c);
console.log("Replaced!");
