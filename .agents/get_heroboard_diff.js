import fs from 'fs';
import readline from 'readline';

async function run() {
  const logFile = 'C:\\Users\\gorillatech\\.gemini\\antigravity\\brain\\4e937dab-89c8-4a63-a809-b59bb6067587\\.system_generated\\logs\\transcript.jsonl';
  const fileStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let index = 0;
  for await (const line of rl) {
    index++;
    if (line.includes('replace_file_content') && line.includes('HeroBoard.tsx')) {
      try {
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            if (tc.name === 'replace_file_content') {
              console.log(`Line ${index}: replaced inside HeroBoard.tsx`);
              console.log('TargetContent:', tc.args.TargetContent);
              console.log('ReplacementContent:', tc.args.ReplacementContent);
              console.log('-------------------------------------------');
            }
          }
        }
      } catch (e) {}
    }
  }
}

run();
