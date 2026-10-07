//#region src/lib/authorized-settings.ts
var KEY = "nt:authorized-settings:v1";
var DEFAULT_AUTHORIZED = {
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
	cardDisclaimer: "Tampering or misuse of this card is a punishable offense."
};
function loadAuthorized() {
	if (typeof window === "undefined") return DEFAULT_AUTHORIZED;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return DEFAULT_AUTHORIZED;
		return {
			...DEFAULT_AUTHORIZED,
			...JSON.parse(raw)
		};
	} catch {
		return DEFAULT_AUTHORIZED;
	}
}
function saveAuthorized(v) {
	if (typeof window === "undefined") return;
	localStorage.setItem(KEY, JSON.stringify(v));
}
//#endregion
export { loadAuthorized as n, saveAuthorized as r, DEFAULT_AUTHORIZED as t };

//# sourceMappingURL=authorized-settings-C6PPe013.js.map