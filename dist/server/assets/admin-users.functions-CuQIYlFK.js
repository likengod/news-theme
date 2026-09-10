import { i as createServerFn } from "./esm-Dova13aH.js";
import { P as createSsrRpc } from "./site-content-DwDF0O3P.js";
import { t as requireAuth } from "./auth-middleware-DMbfTu4m.js";
//#region src/lib/admin-users.functions.ts
var listAdminUsers = createServerFn({ method: "GET" }).middleware([requireAuth]).validator((data) => data ?? {}).handler(createSsrRpc("e4f613da354b95ded8ce2081279082f37e586523eb22e7ba9403d1ead85e95f2"));
var getAllAdminUsers = createServerFn({ method: "GET" }).middleware([requireAuth]).handler(createSsrRpc("b6036d0bc738454474507449abce75eb56abbf37fec319140f402be356cf4f37"));
var importAdminUsers = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((users) => users).handler(createSsrRpc("48fe8cb020169719d3cd57f8962b6b1845ce528dab34e360f2be0bef0c3d06bc"));
var createAdminUser = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => {
	if (!data.email || !data.email.includes("@")) throw new Error("Valid email required");
	if (!data.password || data.password.length < 8) throw new Error("Password must be at least 8 characters");
	return data;
}).handler(createSsrRpc("44648476b52f75748fa9e061f78c31dfe57f35f10cdf3043e81e50dfae452846"));
var setAdminUserRole = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => data).handler(createSsrRpc("ba730ab7529c25c3f6ecd56d5e41e85a92653f22b92925befe98d3ae9a58e52c"));
var deleteAdminUser = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => data).handler(createSsrRpc("64423d826bbc714ede86951c9f1916f7f0b77d8d1a2f932f86789450e9b7f8b6"));
var toggleAdminUserBan = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => data).handler(createSsrRpc("242f7a281f1bd9c0156e0defdfa248b20daa2720f35e430daac740ec37792361"));
var bulkDeleteAdminUsers = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => data).handler(createSsrRpc("e5bfa53b8bb05306086be3399e030e1e91d57b9aade854e12065b2e1beea5725"));
var bulkToggleAdminUserBan = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => data).handler(createSsrRpc("c1d937c34a7fb32d17695c2e775aa0d34df5549df8dda2ac848c787668183790"));
var regeneratePublicUserId = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => data).handler(createSsrRpc("0f76d5daec30f22ed2b4abe100480ff9f820fe0691e971349d3d5b31af064c95"));
var setUserPoints = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => {
	if (!data.userId) throw new Error("userId required");
	if (typeof data.amount !== "number" || Number.isNaN(data.amount)) throw new Error("amount must be a number");
	return data;
}).handler(createSsrRpc("7f3705a23943e0d335f1e588bc9def784ae013d70f854e527352bbe3e91d7b6c"));
var updateAdminUserPassword = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => {
	if (!data.password || data.password.length < 8) throw new Error("Password must be at least 8 characters");
	return data;
}).handler(createSsrRpc("69521f1e7392e34389c335e12d6c56785c32af5c1bcf47157ef32029c1829db4"));
var updateAdminUserDetails = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => data).handler(createSsrRpc("d6fff43b8c882c22c23d05f462c3d8a1e8d63e06f94d1c05315b49b296cd751b"));
createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => data).handler(createSsrRpc("36d3e819f19ad290ee03e8f40f4d538efa60e4d071740ffcd196f321ea09dbac"));
//#endregion
export { getAllAdminUsers as a, regeneratePublicUserId as c, toggleAdminUserBan as d, updateAdminUserDetails as f, deleteAdminUser as i, setAdminUserRole as l, bulkToggleAdminUserBan as n, importAdminUsers as o, updateAdminUserPassword as p, createAdminUser as r, listAdminUsers as s, bulkDeleteAdminUsers as t, setUserPoints as u };
