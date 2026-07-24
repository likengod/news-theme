import fs from 'fs';
import readline from 'readline';

async function run() {
  const logFile = 'C:\\Users\\gorillatech\\.gemini\\antigravity\\brain\\4e937dab-89c8-4a63-a809-b59bb6067587\\.system_generated\\logs\\transcript_full.jsonl';
  const fileStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const fileLines = new Map(); // line_number -> line_content

  let index = 0;
  for await (const line of rl) {
    index++;
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'VIEW_FILE' && obj.content && obj.content.includes('HeroBoard.tsx')) {
        // Parse the code lines
        const lines = obj.content.split('\n');
        for (const l of lines) {
          const m = l.match(/^(\d+):\s(.*)$/);
          if (m) {
            const lineNum = parseInt(m[1]);
            const content = m[2];
            fileLines.set(lineNum, content);
          }
        }
      }
    } catch (e) {}
  }

  // Print reconstructed file
  const maxLine = Math.max(...fileLines.keys());
  let output = '';
  for (let i = 1; i <= maxLine; i++) {
    if (fileLines.has(i)) {
      output += fileLines.get(i) + '\n';
    } else {
      output += `// MISSING LINE ${i}\n`;
    }
  }

  fs.writeFileSync('C:\\Users\\gorillatech\\Music\\TodayTripura\\.agents\\reconstructed_heroboard.txt', output);
  console.log(`Reconstructed ${fileLines.size} lines up to line ${maxLine}. Written to reconstructed_heroboard.txt`);
}

run();
