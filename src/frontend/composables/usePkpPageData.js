/**
 * Provides read access to data passed from the server to frontend stores
 *
 * The data comes from pkp._piniaData, which PHP populates via
 * TemplateManager::setPiniaPageData() and ::setPiniaStoreData(). It is static,
 * so stores read it once, when they are first used.
 *
 * pkp._piniaData is read on each call rather than when the frontend bundle is
 * evaluated, because the inline script defining it runs after the bundle.
 */
export function usePkpPageData() {
	function getData() {
		return window.pkp?._piniaData ?? {};
	}

	return {
		/**
		 * Get the shared page context, available to any store or component
		 * @returns {Object}
		 */
		getPageData() {
			return getData().page ?? {};
		},

		/**
		 * Get the init data targeted at a single store
		 * @param {string} storeId - Pinia store id, e.g. 'pkpComments'
		 * @returns {Object}
		 */
		getStoreData(storeId) {
			return getData().stores?.[storeId] ?? {};
		},
	};
}
