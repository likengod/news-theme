import { a as lookupJournalist } from "./journalist.functions-Dd9Vnm8d.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/verified-journalist.tsx
var $$splitComponentImporter = () => import("./verified-journalist-DGmdLXaB.js");
var Route = createFileRoute("/verified-journalist")({
	validateSearch: (search) => ({ id: (typeof search.id === "string" ? search.id : typeof search.uid === "string" ? search.uid : "") || "" }),
	loaderDeps: ({ search }) => ({ id: search.id }),
	loader: async ({ deps }) => {
		const queryId = deps.id?.trim();
		if (!queryId || queryId.length < 3) return {
			queryId: "",
			initialResult: null
		};
		try {
			return {
				queryId,
				initialResult: await lookupJournalist({ data: { publicUserId: queryId } })
			};
		} catch {
			return {
				queryId,
				initialResult: { found: false }
			};
		}
	},
	head: ({ loaderData }) => {
		const res = loaderData?.initialResult;
		const name = res && res.found ? res.displayName : "";
		return { meta: [
			{ title: name ? `Verified Press: ${name} — News Theme` : "Verify a Journalist — News Theme" },
			{
				name: "description",
				content: name ? `Official press credential verification for accredited reporter ${name}.` : "Enter a Journalist ID or 10-digit User ID to verify an accredited News Theme reporter."
			},
			{
				property: "og:title",
				content: name ? `Verified Journalist: ${name}` : "Verify a Journalist — News Theme"
			},
			{
				property: "og:description",
				content: name ? `View official verified credentials and press ID card for ${name}.` : "Instantly check if a byline belongs to a verified News Theme reporter."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
