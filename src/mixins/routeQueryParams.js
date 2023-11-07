function getCurrentQueryParams() {
	const searchParams = new URLSearchParams(window.location.search);

	const result = {};
	for (const [key, value] of searchParams.entries()) {
		// each 'entry' is a [key, value] tupple
		result[key] = value;
	}
	return result;
}

export default {
	data() {
		const searchParams = getCurrentQueryParams();

		return {
			routeQueryParams: searchParams,
		};
	},
	methods: {
		$_updateQueryFromUrl() {
			this.routeQueryParams = getCurrentQueryParams();
		},
		updateQueryParams(newParams) {
			// Get the current URL
			const currentUrl = new URL(window.location);

			// Update the search parameters
			Object.keys(newParams).forEach((key) => {
				if (newParams[key] == null) {
					currentUrl.searchParams.delete(key);
				} else {
					currentUrl.searchParams.set(key, newParams[key]);
				}
			});

			// Push the new URL to the history stack
			window.history.pushState({}, '', currentUrl);
			this.$_updateQueryFromUrl();
		},
	},
	created() {
		// Add event listeners
		window.addEventListener('popstate', this.$_updateQueryFromUrl);
	},
	unmounted() {
		// Remove event listeners
		window.removeEventListener('popstate', this.$_updateQueryFromUrl);
	},
};
