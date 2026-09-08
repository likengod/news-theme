import { p as loadSettings } from "./site-content-kV02Zm6x.js";
import { t as useServerFn } from "./useServerFn-BqzygRuj.js";
import { a as loadRoles, d as upgradeToPremiumServer, l as setCurrentRoleId, r as getCurrentRoleId } from "./roles-f1YzV8G3.js";
import { t as Footer } from "./Footer-cLkegEdN.js";
import { t as Header } from "./Header-CCoPs4GL.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Check, Crown } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/subscription.tsx?tsr-split=component
function SubscriptionPage() {
	const [cycle, setCycle] = useState("monthly");
	const upgradeFn = useServerFn(upgradeToPremiumServer);
	const [settings, setSettings] = useState(() => {
		return loadSettings();
	});
	const isIndia = Intl.DateTimeFormat().resolvedOptions().timeZone.includes("Kolkata") || Intl.DateTimeFormat().resolvedOptions().timeZone.includes("Calcutta");
	const currencySymbol = isIndia ? "₹" : "$";
	const price = cycle === "monthly" ? (isIndia ? settings.subscriptionPriceINRMonthly : settings.subscriptionPriceUSDMonthly) || (isIndia ? "149" : "4.99") : (isIndia ? settings.subscriptionPriceINRYearly : settings.subscriptionPriceUSDYearly) || (isIndia ? "1499" : "49.99");
	const suffix = cycle === "monthly" ? "/month" : "/year";
	const saving = cycle === "yearly" ? isIndia ? "Save vs monthly" : "Save vs monthly" : "Cancel anytime";
	const upgrade = async (plan) => {
		if (!loadRoles().find((r) => r.id === "premium")) return toast.error("Premium role not configured");
		const current = getCurrentRoleId();
		if (![
			"admin",
			"editor",
			"journalist",
			"author",
			"premium"
		].includes(current)) setCurrentRoleId("premium");
		try {
			await upgradeFn({ data: {} });
		} catch (e) {}
		toast.success(`Welcome to Premium (${plan})! Your account is upgraded.`);
	};
	const featuresList = settings.subscriptionFeatures ? settings.subscriptionFeatures.split("\n").filter(Boolean) : [
		"Ad-free reading across the entire site",
		"Exclusive premium stories & long-reads",
		"Early access to breaking news alerts",
		"Downloadable PDF weekly digest",
		"Support independent Northeast journalism"
	];
	const introHtml = (settings.subscriptionIntro || "Upgrade to a Premium account for ad-free reading and exclusive stories.").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ jsx(Header, {
				showTicker: false,
				showBreakingBar: false
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-5xl px-4 py-12",
				children: [/* @__PURE__ */ jsxs("header", {
					className: "text-center",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground",
							children: "Membership"
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "headline mt-2 text-4xl md:text-5xl",
							style: { WebkitLineClamp: "unset" },
							children: settings.subscriptionTitle || "Go Premium"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mx-auto mt-3 max-w-2xl text-[15px] text-muted-foreground",
							dangerouslySetInnerHTML: { __html: introHtml }
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mx-auto mt-6 inline-flex rounded-full border border-border bg-card/40 p-1",
							children: ["monthly", "yearly"].map((c) => /* @__PURE__ */ jsx("button", {
								onClick: () => setCycle(c),
								className: `rounded-full px-5 py-1.5 text-sm font-semibold capitalize transition ${cycle === c ? "bg-foreground text-background" : "text-muted-foreground"}`,
								children: c
							}, c))
						})
					]
				}), /* @__PURE__ */ jsxs("section", {
					className: "mx-auto mt-10 max-w-md rounded-2xl border border-border bg-card/40 p-8 shadow-sm",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Crown, { className: "h-5 w-5" }), /* @__PURE__ */ jsx("h2", {
								className: "text-xl font-bold",
								children: settings.subscriptionTitle || "Premium"
							})]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-4 text-5xl font-black tracking-tight",
							children: [
								currencySymbol,
								price,
								/* @__PURE__ */ jsx("span", {
									className: "text-base font-medium text-muted-foreground",
									children: suffix
								})
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground",
							children: saving
						}),
						/* @__PURE__ */ jsx("ul", {
							className: "mt-6 space-y-2.5",
							children: featuresList.map((p) => /* @__PURE__ */ jsxs("li", {
								className: "flex items-start gap-2 text-sm",
								children: [
									/* @__PURE__ */ jsx(Check, { className: "mt-0.5 h-4 w-4 shrink-0" }),
									" ",
									p
								]
							}, p))
						}),
						[
							"admin",
							"editor",
							"journalist",
							"author",
							"premium"
						].includes(getCurrentRoleId()) ? /* @__PURE__ */ jsx("div", {
							className: "mt-8 rounded-md bg-green-900/20 py-4 text-center text-sm font-semibold text-green-400",
							children: "You already have Premium access included with your role."
						}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("button", {
							onClick: () => upgrade(cycle),
							className: "mt-8 w-full rounded-md bg-foreground py-3 text-sm font-semibold text-background hover:opacity-90",
							children: [
								"Upgrade to Premium — ",
								currencySymbol,
								price,
								suffix
							]
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-3 text-center text-[11px] text-muted-foreground",
							children: "Demo checkout. Your viewer role switches to Premium user immediately."
						})] })
					]
				})]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { SubscriptionPage as component };
