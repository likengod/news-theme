var e = `nt:authorized-settings:v1`,
  t = {
    signatureName: `Editor-in-Chief`,
    signatureTitle: `Editor-in-Chief`,
    signatureLabel: `AUTHORIZED SIGNATURE`,
    signatureImageUrl: ``,
    officeAddress: `College Road, Kailasahar`,
    officeState: `Tripura`,
    officeCountry: `India`,
    officePhone: `9089050144`,
    officeEmail: `contact@northeasttimeline.com`,
    officeWebsite: `northeasttimeline.com`,
    officePin: `799277`,
    cardNote: `This card certifies that the bearer is an authorized journalist of News Theme. If found, please return to the above address.`,
    cardDisclaimer: `Tampering or misuse of this card is a punishable offense.`,
  };
function n() {
  if (typeof window > `u`) return t;
  try {
    let n = localStorage.getItem(e);
    return n ? { ...t, ...JSON.parse(n) } : t;
  } catch {
    return t;
  }
}
function r(t) {
  typeof window > `u` || localStorage.setItem(e, JSON.stringify(t));
}
export { n, r, t };
