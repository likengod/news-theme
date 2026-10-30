import { H as useRouter, U as isRedirect } from "./vendor-tanstack-router-Bd4EQ_Hv.js";
import * as React$1 from "react";
// node_modules/@tanstack/react-start/dist/esm/useServerFn.js
function useServerFn(serverFn) {
	const router = useRouter();
	return React$1.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
export { useServerFn as t };

//# sourceMappingURL=useServerFn-B0OM9FrS.js.map