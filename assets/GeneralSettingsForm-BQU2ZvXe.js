import { s as e, t } from "./jsx-runtime-CF8L0Gwd.js";
import { t as n } from "./react-YNiYR47K.js";
import { T as r, p as i } from "./site-content-BDGWQAlc.js";
import { t as a } from "./save-DCSXhHjW.js";
import { Bt as o } from "./index-CMlkpObp.js";
import { a as s } from "./SettingsHelpers-nrY-Ajj-.js";
var c = e(n()),
  l = t(),
  u = [
    {
      title: `Brand Information`,
      fields: [
        { key: `siteName`, label: `Site Name`, placeholder: `News Timeline` },
        { key: `logoText`, label: `Logo Text`, placeholder: `News Timeline` },
        {
          key: `logoDisplayMode`,
          label: `Brand Display Mode`,
          select: !0,
          options: [
            { value: `logo_only`, label: `Logo Only` },
            { value: `text_only`, label: `Text Only` },
            { value: `both`, label: `Both (Logo + Text)` },
          ],
        },
        { key: `tagline`, label: `Tagline`, placeholder: `Breaking News · Finance · Markets` },
        {
          key: `metaDescription`,
          label: `SEO Meta Description`,
          textarea: !0,
          placeholder: `Independent newsroom...`,
        },
      ],
    },
    {
      title: `Contact Details`,
      fields: [
        { key: `contactEmail`, label: `Contact Email`, placeholder: `hello@newstimeline.com` },
        { key: `contactPhone`, label: `Contact Phone`, placeholder: `+91 99999 99999` },
        {
          key: `address`,
          label: `Office Address`,
          textarea: !0,
          placeholder: `Agartala, Tripura...`,
        },
      ],
    },
    {
      title: `Footer & Copyright`,
      fields: [
        { key: `footerNote`, label: `Footer Intro Text`, textarea: !0 },
        { key: `copyright`, label: `Copyright Statement` },
      ],
    },
  ];
function d() {
  let [e, t] = (0, c.useState)(() => i()),
    [n, d] = (0, c.useState)(!1),
    f = (e, n) => t((t) => ({ ...t, [e]: n }));
  return (0, l.jsxs)(`div`, {
    className: `space-y-6`,
    children: [
      u.map((t) =>
        (0, l.jsxs)(
          `section`,
          {
            className: `rounded-xl border border-slate-200 bg-white p-5 shadow-sm`,
            children: [
              (0, l.jsx)(`h2`, {
                className: `mb-4 text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2`,
                children: t.title,
              }),
              (0, l.jsx)(`div`, {
                className: `grid gap-4 sm:grid-cols-2`,
                children: t.fields.map((t) => {
                  let n = e[t.key] || ``;
                  return (0, l.jsxs)(
                    `div`,
                    {
                      className: t.textarea ? `sm:col-span-2` : ``,
                      children: [
                        (0, l.jsx)(`label`, {
                          className: `mb-1 block text-xs font-semibold text-slate-600`,
                          children: t.label,
                        }),
                        t.textarea
                          ? (0, l.jsx)(`textarea`, {
                              value: n,
                              onChange: (e) => f(t.key, e.target.value),
                              placeholder: t.placeholder,
                              rows: 3,
                              className: `w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-slate-900 focus:outline-none`,
                            })
                          : t.select
                            ? (0, l.jsx)(`select`, {
                                value: n,
                                onChange: (e) => f(t.key, e.target.value),
                                className: `h-10 w-full rounded-lg border border-slate-200 px-3 bg-white text-sm focus:border-slate-900 focus:outline-none`,
                                children: t.options?.map((e) =>
                                  (0, l.jsx)(
                                    `option`,
                                    { value: e.value, children: e.label },
                                    e.value,
                                  ),
                                ),
                              })
                            : (0, l.jsx)(`input`, {
                                type: `text`,
                                value: n,
                                onChange: (e) => f(t.key, e.target.value),
                                placeholder: t.placeholder,
                                className: `h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none`,
                              }),
                        t.hint &&
                          (0, l.jsx)(`p`, {
                            className: `mt-1 text-[11px] text-slate-400`,
                            children: t.hint,
                          }),
                      ],
                    },
                    t.key,
                  );
                }),
              }),
              t.title === `Brand Information` &&
                (0, l.jsxs)(l.Fragment, {
                  children: [
                    (0, l.jsxs)(`div`, {
                      className: `mt-6 border-t border-slate-100 pt-6`,
                      children: [
                        (0, l.jsxs)(`div`, {
                          className: `flex items-center justify-between mb-3`,
                          children: [
                            (0, l.jsx)(`h3`, {
                              className: `text-xs font-bold uppercase tracking-wider text-slate-500`,
                              children: `Logo Text & Two-Tone Colors`,
                            }),
                            (0, l.jsx)(`span`, {
                              className: `text-[11px] text-slate-400`,
                              children: `Customize each word and its color independently`,
                            }),
                          ],
                        }),
                        (0, l.jsxs)(`div`, {
                          className: `mb-4 rounded-xl border border-slate-200 bg-slate-50/90 p-5 text-center shadow-inner`,
                          children: [
                            (0, l.jsx)(`span`, {
                              className: `text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-2`,
                              children: `Live Header Preview`,
                            }),
                            (0, l.jsxs)(`div`, {
                              className: `text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-wide inline-block`,
                              style: {
                                fontFamily: `"Inter", system-ui, sans-serif`,
                                letterSpacing: `0.05em`,
                              },
                              children: [
                                (0, l.jsx)(`span`, {
                                  style: { color: e.logoColorPrimary || `#000000` },
                                  children:
                                    e.logoTextPrimary !== void 0 && e.logoTextPrimary !== ``
                                      ? e.logoTextPrimary
                                      : `NEWS`,
                                }),
                                ` `,
                                (0, l.jsx)(`span`, {
                                  style: { color: e.logoColorSecondary || `#dc2626` },
                                  children:
                                    e.logoTextSecondary !== void 0 && e.logoTextSecondary !== ``
                                      ? e.logoTextSecondary
                                      : `THEME`,
                                }),
                              ],
                            }),
                          ],
                        }),
                        (0, l.jsxs)(`div`, {
                          className: `grid gap-4 sm:grid-cols-2`,
                          children: [
                            (0, l.jsxs)(`div`, {
                              className: `rounded-lg border border-slate-200 bg-white p-3.5 space-y-2.5`,
                              children: [
                                (0, l.jsxs)(`div`, {
                                  className: `flex items-center justify-between`,
                                  children: [
                                    (0, l.jsx)(`label`, {
                                      className: `text-xs font-bold text-slate-700`,
                                      children: `Part 1 Text (e.g. News)`,
                                    }),
                                    (0, l.jsx)(`span`, {
                                      className: `text-[10px] text-slate-400`,
                                      children: `First Word`,
                                    }),
                                  ],
                                }),
                                (0, l.jsx)(`input`, {
                                  type: `text`,
                                  value: e.logoTextPrimary ?? `News`,
                                  onChange: (t) => {
                                    let n = t.target.value,
                                      r = e.logoTextSecondary ?? `Theme`;
                                    (f(`logoTextPrimary`, n), f(`logoText`, `${n} ${r}`.trim()));
                                  },
                                  placeholder: `News`,
                                  className: `h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none`,
                                }),
                                (0, l.jsxs)(`div`, {
                                  children: [
                                    (0, l.jsx)(`label`, {
                                      className: `text-[11px] font-semibold text-slate-500 block mb-1`,
                                      children: `Part 1 Text Color`,
                                    }),
                                    (0, l.jsxs)(`div`, {
                                      className: `flex items-center gap-2`,
                                      children: [
                                        (0, l.jsx)(`input`, {
                                          type: `color`,
                                          value:
                                            e.logoColorPrimary && e.logoColorPrimary.startsWith(`#`)
                                              ? e.logoColorPrimary
                                              : `#000000`,
                                          onChange: (e) => f(`logoColorPrimary`, e.target.value),
                                          className: `h-8 w-10 cursor-pointer rounded border border-slate-200 p-0.5`,
                                        }),
                                        (0, l.jsx)(`input`, {
                                          type: `text`,
                                          value: e.logoColorPrimary || `#000000`,
                                          onChange: (e) => f(`logoColorPrimary`, e.target.value),
                                          placeholder: `#000000`,
                                          className: `h-8 flex-1 rounded-md border border-slate-200 px-2.5 text-xs font-mono focus:border-slate-900 focus:outline-none`,
                                        }),
                                        (0, l.jsx)(`button`, {
                                          type: `button`,
                                          onClick: () => f(`logoColorPrimary`, `#000000`),
                                          className: `px-2 py-1 text-[10px] rounded bg-slate-100 hover:bg-slate-200 text-slate-700`,
                                          title: `Set Black`,
                                          children: `Black`,
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            (0, l.jsxs)(`div`, {
                              className: `rounded-lg border border-slate-200 bg-white p-3.5 space-y-2.5`,
                              children: [
                                (0, l.jsxs)(`div`, {
                                  className: `flex items-center justify-between`,
                                  children: [
                                    (0, l.jsx)(`label`, {
                                      className: `text-xs font-bold text-slate-700`,
                                      children: `Part 2 Text (e.g. Theme)`,
                                    }),
                                    (0, l.jsx)(`span`, {
                                      className: `text-[10px] text-slate-400`,
                                      children: `Second Word`,
                                    }),
                                  ],
                                }),
                                (0, l.jsx)(`input`, {
                                  type: `text`,
                                  value: e.logoTextSecondary ?? `Theme`,
                                  onChange: (t) => {
                                    let n = t.target.value,
                                      r = e.logoTextPrimary ?? `News`;
                                    (f(`logoTextSecondary`, n), f(`logoText`, `${r} ${n}`.trim()));
                                  },
                                  placeholder: `Theme`,
                                  className: `h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none`,
                                }),
                                (0, l.jsxs)(`div`, {
                                  children: [
                                    (0, l.jsx)(`label`, {
                                      className: `text-[11px] font-semibold text-slate-500 block mb-1`,
                                      children: `Part 2 Text Color`,
                                    }),
                                    (0, l.jsxs)(`div`, {
                                      className: `flex items-center gap-2`,
                                      children: [
                                        (0, l.jsx)(`input`, {
                                          type: `color`,
                                          value:
                                            e.logoColorSecondary &&
                                            e.logoColorSecondary.startsWith(`#`)
                                              ? e.logoColorSecondary
                                              : `#dc2626`,
                                          onChange: (e) => f(`logoColorSecondary`, e.target.value),
                                          className: `h-8 w-10 cursor-pointer rounded border border-slate-200 p-0.5`,
                                        }),
                                        (0, l.jsx)(`input`, {
                                          type: `text`,
                                          value: e.logoColorSecondary || `#dc2626`,
                                          onChange: (e) => f(`logoColorSecondary`, e.target.value),
                                          placeholder: `#dc2626`,
                                          className: `h-8 flex-1 rounded-md border border-slate-200 px-2.5 text-xs font-mono focus:border-slate-900 focus:outline-none`,
                                        }),
                                        (0, l.jsx)(`button`, {
                                          type: `button`,
                                          onClick: () => f(`logoColorSecondary`, `#dc2626`),
                                          className: `px-2 py-1 text-[10px] rounded bg-red-50 hover:bg-red-100 text-red-600 font-semibold`,
                                          title: `Set Red`,
                                          children: `Red`,
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, l.jsxs)(`div`, {
                      className: `mt-6 border-t border-slate-100 pt-6`,
                      children: [
                        (0, l.jsx)(`h3`, {
                          className: `mb-4 text-xs font-bold uppercase tracking-wider text-slate-500`,
                          children: `Logo Images & Favicon`,
                        }),
                        (0, l.jsxs)(`div`, {
                          className: `grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5`,
                          children: [
                            (0, l.jsx)(s, {
                              compact: !0,
                              label: `Site logo (Day)`,
                              value: e.logoLight,
                              usage: `site-logo`,
                              recommendedSize: `320×80 px`,
                              onChange: (e) => f(`logoLight`, e),
                            }),
                            (0, l.jsx)(s, {
                              compact: !0,
                              label: `Site logo (Night)`,
                              value: e.logoDark,
                              usage: `site-logo`,
                              dark: !0,
                              recommendedSize: `320×80 px`,
                              onChange: (e) => f(`logoDark`, e),
                            }),
                            (0, l.jsx)(s, {
                              compact: !0,
                              label: `Footer logo (Day)`,
                              value: e.footerLogoLight,
                              usage: `site-logo`,
                              recommendedSize: `320×80 px`,
                              onChange: (e) => f(`footerLogoLight`, e),
                            }),
                            (0, l.jsx)(s, {
                              compact: !0,
                              label: `Footer logo (Night)`,
                              value: e.footerLogoDark,
                              usage: `site-logo`,
                              dark: !0,
                              recommendedSize: `320×80 px`,
                              onChange: (e) => f(`footerLogoDark`, e),
                            }),
                            (0, l.jsx)(s, {
                              compact: !0,
                              label: `Favicon`,
                              value: e.favicon,
                              usage: `site-favicon`,
                              recommendedSize: `64×64 px`,
                              onChange: (e) => f(`favicon`, e),
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
            ],
          },
          t.title,
        ),
      ),
      `      `,
      (0, l.jsx)(`div`, {
        className: `sticky bottom-4 flex justify-end`,
        children: (0, l.jsxs)(`button`, {
          onClick: async () => {
            try {
              (await r(e),
                d(!0),
                o.success(`General site settings saved to MySQL!`),
                setTimeout(() => d(!1), 2e3));
            } catch (e) {
              (console.error(e),
                o.error(
                  e.message ||
                    `Failed to save settings. Payload might be too large if logos are big.`,
                ));
            }
          },
          className: `inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors ${n ? `bg-emerald-600` : `bg-slate-900 hover:bg-slate-800`}`,
          children: [
            (0, l.jsx)(a, { className: `h-4 w-4` }),
            n ? `Saved to MySQL!` : `Save General Settings`,
          ],
        }),
      }),
    ],
  });
}
export { d as GeneralSettingsForm };
