import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/site/ArchiveFinder.tsx
function ArchiveFinder() {
	const navigate = useNavigate();
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: (e) => {
			e.preventDefault();
			const fd = new FormData(e.currentTarget);
			const d = fd.get("day") || "";
			const m = fd.get("month") || "";
			const y = fd.get("year") || "";
			navigate({
				to: "/archive",
				search: {
					...d ? { day: d } : {},
					...m ? { month: m } : {},
					...y ? { year: y } : {},
					page: 1
				}
			});
		},
		className: "space-y-2 border border-border bg-card p-4",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "text-xs font-bold uppercase tracking-[0.2em] text-foreground",
				children: "Archive"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-[11px] text-muted-foreground",
				children: "Find stories by date"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ jsxs("select", {
						name: "day",
						"aria-label": "Day",
						defaultValue: "",
						className: "w-full border border-border bg-background px-2 py-2 text-sm outline-none focus:border-foreground",
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "Day"
						}), Array.from({ length: 31 }, (_, i) => i + 1).map((d) => /* @__PURE__ */ jsx("option", {
							value: String(d).padStart(2, "0"),
							children: d
						}, d))]
					}),
					/* @__PURE__ */ jsxs("select", {
						name: "month",
						"aria-label": "Month",
						defaultValue: "",
						className: "w-full border border-border bg-background px-2 py-2 text-sm outline-none focus:border-foreground",
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "Month"
						}), [
							"Jan",
							"Feb",
							"Mar",
							"Apr",
							"May",
							"Jun",
							"Jul",
							"Aug",
							"Sep",
							"Oct",
							"Nov",
							"Dec"
						].map((m, i) => /* @__PURE__ */ jsx("option", {
							value: String(i + 1).padStart(2, "0"),
							children: m
						}, m))]
					}),
					/* @__PURE__ */ jsxs("select", {
						name: "year",
						"aria-label": "Year",
						defaultValue: "",
						className: "w-full border border-border bg-background px-2 py-2 text-sm outline-none focus:border-foreground",
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "Year"
						}), Array.from({ length: 16 }, (_, i) => 2026 - i).map((y) => /* @__PURE__ */ jsx("option", {
							value: String(y),
							children: y
						}, y))]
					})
				]
			}),
			/* @__PURE__ */ jsx("button", {
				type: "submit",
				className: "w-full bg-foreground px-3 py-2 text-sm font-bold uppercase tracking-widest text-background hover:opacity-80",
				children: "Find Archive"
			})
		]
	});
}
//#endregion
export { ArchiveFinder as t };

//# sourceMappingURL=ArchiveFinder-CRW_hGql.js.map