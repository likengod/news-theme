async function checkScripts() {
  const res = await fetch('https://vanguardtripura.com/admin/updates');
  const html = await res.text();
  const scriptMatches = [...html.matchAll(/src=["'](\/assets\/[^"']+)["']/g)].map(m => m[1]);
  console.log('Script sources:', scriptMatches);
  for (const src of scriptMatches) {
    const sRes = await fetch('https://vanguardtripura.com' + src);
    console.log(src, '-> Status:', sRes.status);
    if (sRes.status !== 200) {
      const errText = await sRes.text();
      console.log('Error content:', errText.slice(0, 200));
    }
  }
}
checkScripts();
