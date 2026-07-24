import fs from 'fs';
import readline from 'readline';

async function run() {
  const logFile = 'C:\\Users\\gorillatech\\.gemini\\antigravity\\brain\\4e937dab-89c8-4a63-a809-b59bb6067587\\.system_generated\\logs\\transcript_full.jsonl';
  const fileStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let index = 0;
  for await (const line of rl) {
    index++;
    if (index === 99) {
      const obj = JSON.parse(line);
      fs.writeFileSync('C:\\Users\\gorillatech\\Music\\TodayTripura\\.agents\\original_heroboard.txt', obj.content);
      console.log('Original HeroBoard.tsx content written to original_heroboard.txt');
      break;
    }
  }
}

run();
