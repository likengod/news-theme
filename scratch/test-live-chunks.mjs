async function checkChunks() {
  const res = await fetch('https://vanguardtripura.com/assets/index-C_--juI-.js');
  const code = await res.text();
  const jsMatches = [...code.matchAll(/([a-zA-Z0-9_\-]+\.js)/g)].map(m => m[1]);
  const uniqueJs = [...new Set(jsMatches)];
  console.log('Referenced JS files:', uniqueJs);
  for (const js of uniqueJs) {
    const r = await fetch('https://vanguardtripura.com/assets/' + js);
    console.log(js, '->', r.status);
    if (r.status !== 200) {
      console.log('FAILED CHUNK:', js, r.status);
    }
  }
}
checkChunks();
