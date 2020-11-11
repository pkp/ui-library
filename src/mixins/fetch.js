/**
 * A mixin to fetch from an API endpoint with support for
 * filters, search, and pagination.
 *
 * This mixin compiles query parameters, sends the request
 * to the `apiUrl`, and passes the results to a method to
 * be handled in the component.
 *
 * To use this, you must define a `setItems` method in your
 * component that overrides this one.
 *
 */
import ajaxError from '@/mixins/ajaxError';

export default {
	mixins: [ajaxError],
	props: {
		apiUrl: {
			type: String,
			required: true
		},
		count: {
			type: Number,
			default() {
				return 30;
			}
		},
		getParams: {
			type: Object,
			default() {
				return {};
			}
		},
		lazyLoad: {
			type: Boolean,
			default() {
				return false;
			}
		}
	},
	data() {
		return {
			activeFilters: {},
			isLoading: false,
			latestGetRequest: '',
			offset: 0,
			searchPhrase: ''
		};
	},
	computed: {
		/**
		 * The current page of results being viewed
		 *
		 * @return {Number}
		 */
		currentPage() {
			return Math.floor(this.offset / this.count) + 1;
		},

		/**
		 * The number of pages available
		 *
		 * @return {Number}
		 */
		lastPage() {
			return Math.ceil(this.itemsMax / this.count);
		}
	},
	methods: {
		/**
		 * Get the items for this list
		 *
		 * Call this method whenever you want to fetch items
		 * for the list. Typically, this should occur when
		 * the filters, search phrase, or current page has
		 * changed.
		 */
		get() {
			if (!this.apiUrl) {
				return;
			}

			var self = this;

			this.isLoading = true;

			// Address issues with multiple async get requests. Store an ID for the
			// most recent get request. When we receive the response, we
			// can check that the response matches the most recent get request, and
			// discard responses that are outdated.
			this.latestGetRequest = $.pkp.classes.Helper.uuid();

			$.ajax({
				url: this.apiUrl,
				type: 'GET',
				data: {
					...this.getParams,
					...this.activeFilters,
					searchPhrase: this.searchPhrase,
					count: this.count,
					offset: this.offset
				},
				_uuid: this.latestGetRequest,
				error: function(r) {
					// Only process latest request response
					if (self.latestGetRequest !== this._uuid) {
						return;
					}
					self.ajaxErrorCallback(r);
				},
				success: function(r) {
					// Only process latest request response
					if (self.latestGetRequest !== this._uuid) {
						return;
					}
					self.setItems(r.items, r.itemsMax);
				},
				complete() {
					// Only process latest request response
					if (self.latestGetRequest !== this._uuid) {
						return;
					}
					self.isLoading = false;
				}
			});
		},

		/**
		 * Update the list of items
		 *
		 * Implement this method in your component to update the
		 * items with the result of the request.
		 *
		 * @param {Array} items
		 * @param {Number} itemsMax
		 */
		setItems(items, itemsMax) {
			throw new Error(
				'Missing function to set items after get request. This mixin requires that the component implements a `setItems` method which handles the items received from the get request.'
			);
		},

		/**
		 * Set the current page
		 *
		 * @param {Number} page
		 */
		setPage(page) {
			this.offset = page * this.count - this.count;
		},

		/**
		 * Set the search phrase when it changes
		 *
		 * @param {String} searchPhrase
		 */
		setSearchPhrase(searchPhrase) {
			this.searchPhrase = searchPhrase;
		}
	},
	watch: {
		/**
		 * Perform a search whenever the activeFilters are updated
		 */
		activeFilters(newVal, oldVal) {
			if (this.offset) {
				this.offset = 0; // will fire this.get()
			} else {
				this.$nextTick(() => this.get());
			}
		},

		/**
		 * Fetch items from the API when the page is changed
		 */
		offset(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.$nextTick(() => this.get());
		},

		/**
		 * Perform a search whenever the searchPhrase is updated
		 */
		searchPhrase(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			if (this.offset) {
				this.offset = 0; // will fire this.get()
			} else {
				this.$nextTick(() => this.get());
			}
		}
	},
	mounted() {
		if (this.lazyLoad) {
			if (document.readyState === 'complete') {
				this.get();
			} else {
				var self = this;
				$(function() {
					self.get();
				});
			}
		}
	}
};
