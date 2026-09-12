import { n as e, t } from "./createServerFn-Ciss0-sp.js";
import { t as n } from "./auth-middleware-JDjVgB0Q.js";
var r = t({ method: `GET` })
    .middleware([n])
    .handler(e(`77b55eb13ad368fb1b0873c8c532ac23b5668348efc4c34ac3c3e0915a03f702`)),
  i = t({ method: `POST` })
    .middleware([n])
    .handler(e(`7338eb5a2878ffa1f7b6e110ac13a130cb2ca3445d5a5fa61817aeaa8b5c131c`)),
  a = t({ method: `POST` })
    .middleware([n])
    .handler(e(`132f222d6e1935b3f6006155b9fd26c2f4d9a8e0a1ac6a60d42ff35bbfcc5575`)),
  o = t({ method: `GET` }).handler(
    e(`a11c92cd0221f09684c9d38d6e88a3645d06872fc73a4b7193f07e754240b401`),
  ),
  s = t({ method: `POST` }).handler(
    e(`77058d8bdc7833b6d17a992ddb7ca497890e6aa535436b00ec867be38d365b44`),
  );
export { i as a, s as i, r as n, o as r, a as t };
