// Authorized/office signature block for the Journalist verification workflow.
// Persisted client-side (matches the pattern used by journalist-ranks).

export type AuthorizedSettings = {
  signatureName: string;
  signatureTitle: string;
  signatureLabel: string;
  signatureImageUrl: string;
  officeAddress: string;
  officeState: string;
  officeCountry: string;
  officePhone: string;
  officeEmail: string;
  officeWebsite: string;
  officePin: string;
  cardNote: string;
  cardDisclaimer: string;
};

const KEY = "nt:authorized-settings:v1";

export const DEFAULT_AUTHORIZED: AuthorizedSettings = {
  signatureName: "Editor-in-Chief",
  signatureTitle: "Editor-in-Chief",
  signatureLabel: "AUTHORIZED SIGNATURE",
  signatureImageUrl: "",
  officeAddress: "College Road, Kailasahar",
  officeState: "Tripura",
  officeCountry: "India",
  officePhone: "9089050144",
  officeEmail: "contact@northeasttimeline.com",
  officeWebsite: "northeasttimeline.com",
  officePin: "799277",
  cardNote: "This card certifies that the bearer is an authorized journalist of News Theme. If found, please return to the above address.",
  cardDisclaimer: "Tampering or misuse of this card is a punishable offense.",
};

export function loadAuthorized(): AuthorizedSettings {
  if (typeof window === "undefined") return DEFAULT_AUTHORIZED;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_AUTHORIZED;
    return { ...DEFAULT_AUTHORIZED, ...(JSON.parse(raw) as Partial<AuthorizedSettings>) };
  } catch {
    return DEFAULT_AUTHORIZED;
  }
}

export function saveAuthorized(v: AuthorizedSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(v));
}