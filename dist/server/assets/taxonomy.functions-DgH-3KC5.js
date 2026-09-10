import { i as createServerFn } from "./esm-Dova13aH.js";
import { A as createSsrRpc } from "./site-content-D1yh80Dh.js";
import { t as requireAuth } from "./auth-middleware-DMbfTu4m.js";
//#region src/lib/taxonomy.functions.ts
var getCategories = createServerFn({ method: "GET" }).validator((data) => data ?? {}).handler(createSsrRpc("03e56af06bac9556b433ca2c960715be210a02a6e76a33dd5ea6f6d79c24f055"));
var saveCategory = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => data).handler(createSsrRpc("b3095e70e29c64e8fdcdde5fbc447132d5211556bec99ac668eb0ff2de5657aa"));
var deleteCategory = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((id) => id).handler(createSsrRpc("73da229e9bba97b2e3b47fcf9f861a6b89c3ec72511b4c8964a3e5c9e092b53d"));
var importCategories = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((cats) => cats).handler(createSsrRpc("f2b55fcbc61de640bdc246a756afade094af300f815b713c633816f7f0b40536"));
var getTags = createServerFn({ method: "GET" }).handler(createSsrRpc("b51eb31b9d36ce8ad6724bbbef81a5b0b5f0ee5403bd22eeb33f98d43c91fcfb"));
var saveTag = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => data).handler(createSsrRpc("5e45b55e814da1ee45b2c220ed8509e0fc09d858adfa040131700cfd9259dc45"));
var deleteTag = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((id) => id).handler(createSsrRpc("456a04395d91d0c6af478600bc3d2d7698126db44c195a057c14f79bc2f06e8d"));
var importTags = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((tags) => tags).handler(createSsrRpc("2728870d1d2a6ca869b49740daab9a7138ab559359a7149922ab6ef7fdee087e"));
var getCategoryData = createServerFn({ method: "GET" }).validator((data) => data).handler(createSsrRpc("0da83c6ba72d428ef4d313202f748761bb822abb6fd298a5d991a8378d21bf96"));
var getTopTags = createServerFn({ method: "GET" }).handler(createSsrRpc("0d3e907d8ae66780e1453f78ed08c9c482ba98198c822ff82e6767a06b7a2599"));
//#endregion
export { getTags as a, importTags as c, getCategoryData as i, saveCategory as l, deleteTag as n, getTopTags as o, getCategories as r, importCategories as s, deleteCategory as t, saveTag as u };
