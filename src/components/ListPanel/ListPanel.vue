<template>
	<div class="pkpListPanel" :class="classes">
		<slot name="header">
			<pkp-header>{{ title }}</pkp-header>
		</slot>
		<div class="pkpListPanel__body -pkpClearfix">
			<div v-if="filters.length" class="pkpListPanel__sidebar" :class="{'-isVisible': isSidebarVisible}">
				<div v-for="(filterSet, index) in filters" :key="index" class="pkpListPanel__filterSet">
					<pkp-header v-if="filterSet.heading">
						{{ filterSet.heading }}
					</pkp-header>
					<pkp-filter
						v-for="filter in filterSet.filters"
						:key="filter.param + filter.value"
						v-bind="filter"
						:isFilterActive="isFilterActive(filter.param, filter.value)"
						:i18n="i18n"
						@add-filter="addFilter"
						@remove-filter="removeFilter"
					/>
				</div>
			</div>
			<div class="pkpListPanel__content" aria-live="polite">
				<template v-if="items.length">
					<list-panel-item
						v-for="item in items"
						:key="item.id"
						:item="item"
						:i18n="i18n"
					/>
				</template>
				<div v-else class="pkpListPanel__empty">
					{{ i18n.empty }}
				</div>
			</div>
		</div>
		<div v-if="hasFooter" class="pkpListPanel__footer">
			<slot name="footer" />
		</div>
	</div>
</template>

<script>
import PkpFilter from '@/components/Filter/Filter.vue';
import ListPanelItem from '@/components/ListPanel/ListPanelItem.vue';
import PkpHeader from '@/components/Header/Header.vue';

export default {
	name: 'ListPanel',
	components: {
		PkpFilter,
		ListPanelItem,
		PkpHeader
	},
	props: {
		apiUrl: {
			type: String,
			default() {
				return '';
			}
		},
		count: {
			type: Number,
			required: true
		},
		getParams: {
			type: Object,
			default() {
				return {};
			}
		},
		filters: {
			type: Array,
			default() {
				return [];
			}
		},
		i18n: {
			type: Object,
			default() {
				return {};
			}
		},
		id: {
			type: String,
			required: true
		},
		isSidebarVisible: {
			type: Boolean,
			default() {
				return false;
			}
		},
		items: {
			type: Array,
			required: true
		},
		itemsMax: {
			type: Number,
			required: true
		},
		lazyLoad: {
			type: Boolean,
			default() {
				return false;
			}
		},
		offset: {
			type: Number,
			required: true
		},
		searchPhrase: {
			type: String,
			default() {
				return '';
			}
		},
		title: {
			type: String,
			default() {
				return '';
			}
		}
	},
	data() {
		return {
			activeFilters: {},
			isLoading: false,
			isOrdering: false,
			latestGetRequest: null
		};
	},
	computed: {
		/**
		 * Classes used on the root element
		 *
		 * @return Array
		 */
		classes: function() {
			return {
				'-isOrdering': this.isOrdering,
				'-isLoading': this.isLoading
			};
		},

		/**
		 * Options for the draggable component
		 *
		 * @see https://github.com/SortableJS/Vue.Draggable
		 */
		draggableOptions: function() {
			return {
				disabled: !this.isOrdering
			};
		},

		/**
		 * Does this ListPanel have anything in the footer slot?
		 *
		 * @return Boolean
		 */
		hasFooter: function() {
			return this.$slots.footer;
		},

		/**
		 * Get the number of the page of results showing in the list
		 *
		 * @return Number
		 */
		currentPage() {
			return Math.floor(this.offset / this.count) + 1;
		},

		/**
		 * Get the number of the last page of results available for the list
		 *
		 * @return Number
		 */
		lastPage() {
			return Math.ceil(this.itemsMax / this.count);
		}
	},
	methods: {
		/**
		 * Get items for the list. This ListPanel must have a defined
		 * `get` route to execute this method.
		 *
		 * @param string handleResponse How to handle the response. `append` to
		 *  add to the items. Default: null will replace the items.
		 */
		get: function(handleResponse) {
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

					let items;
					if (handleResponse === 'append') {
						const existingItemIds = self.items.map(value => value.id);
						items = [...self.items];
						for (let item of r.items) {
							if (existingItemIds.indexOf(item.id) < 0) {
								items.push(item);
							}
						}
					} else {
						items = r.items;
					}

					self.$emit('set', self.id, {
						items: items,
						itemsMax: r.itemsMax
					});
				},
				complete: function() {
					// Only process latest request response
					if (self.latestGetRequest !== this._uuid) {
						return;
					}

					self.isLoading = false;
				}
			});
		},

		/**
		 * Set the search phrase
		 *
		 * @param string value
		 */
		setSearchPhrase: function(value) {
			this.$emit('set', this.id, {
				searchPhrase: value
			});
			this.$nextTick(() => {
				if (!this.isSidebarVisible) {
					this.updateFilter({});
				}
			});
		},

		/**
		 * Toggle sidebar visibility
		 */
		toggleSidebar: function() {
			this.$emit('set', this.id, {
				isSidebarVisible: !this.isSidebarVisible
			});
			this.$nextTick(() => {
				if (!this.isSidebarVisible) {
					this.updateFilter({});
				}
			});
		},

		/**
		 * Check if a filter is currently active
		 *
		 * @param String param
		 * @param mixed value
		 * @return Boolean
		 */
		isFilterActive: function(param, value) {
			return (
				typeof this.activeFilters[param] !== 'undefined' &&
				this.activeFilters[param].includes(value)
			);
		},

		/**
		 * Add a filter
		 *
		 * @param String param
		 * @param mixed value
		 */
		addFilter: function(param, value) {
			if (this.isFilterActive(param, value)) {
				this.removeFilter(param, value);
			} else {
				let filters = {...this.activeFilters};
				if (filters[param] === undefined) {
					filters[param] = [];
				}
				filters[param].push(value);
				this.activeFilters = filters;
			}
			this.get();
		},

		/**
		 * Remove a filter
		 *
		 * @param String param
		 * @param mixed value
		 */
		removeFilter: function(param, value) {
			if (this.activeFilters[param] === undefined) {
				return;
			}
			let filters = {...this.activeFilters};
			filters[param] = filters[param].filter(filterVal => {
				return filterVal !== value;
			});
			this.activeFilters = filters;
			this.get();
		},

		/**
		 * Toggle the ordering status
		 */
		toggleOrdering: function() {
			if (this.isOrdering) {
				this.setItemOrderSequence();
			}
			this.isOrdering = !this.isOrdering;
			// Reset focus because it is dropped when the ordering button is closed
			if (this.isOrdering) {
				this.$nextTick(function() {
					this.setFocusIn(this.$el);
				});
			}
		},

		/**
		 * Move an item up in the list
		 *
		 * @param item object The item to move
		 */
		itemOrderUp: function(item) {
			var index = this.items.findIndex(obj => {
				return item.id == obj.id;
			});
			if (index === 0) {
				return;
			}
			let items = [...this.items];
			items.splice(index - 1, 0, items.splice(index, 1)[0]);
			this.$emit('set', this.id, {items: items});
		},

		/**
		 * Move an item down in the list
		 *
		 * @param item object The item to move
		 */
		itemOrderDown: function(item) {
			var index = this.items.findIndex(obj => {
				return item.id == obj.id;
			});
			if (index === this.items.length - 1) {
				return;
			}
			let items = [...this.items];
			items.splice(index + 1, 0, items.splice(index, 1)[0]);
			this.$emit('set', this.id, {items: items});
		},

		/**
		 * Update the order sequence property for items in this list based on
		 * the new order of items
		 */
		setItemOrderSequence: function(prop) {
			prop = prop || 'seq'; // default sequence property in item models

			let items = [...this.items];
			items.forEach((item, i) => {
				item[prop] = i;
			});
			this.$emit('set', this.id, {items: items});
		},

		/**
		 * Cancel changes made by ordering items
		 */
		cancelOrdering: function() {
			this.isOrdering = false;
			this.$emit('set', this.id, {offset: this.items.length});
			this.get();
		},

		/**
		 * View a different page of the results in this list
		 *
		 * Calculates the offset value and emits an event to update it
		 *
		 * @param Number page
		 */
		changePage: function(page) {
			this.$emit('set', this.id, {offset: page * this.count - this.count});
			this.get();
		}
	},
	watch: {
		/**
		 * Update list whenever a filter is applied
		 */
		activeFilters: function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.$emit('set', this.id, {offset: 0});
			if (newVal && Object.keys(newVal).length) {
				this.isSidebarVisible = true;
			}
		},

		/**
		 * Perform a search whenever the searchPhrase is updated
		 */
		searchPhrase: function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.$emit('set', this.id, {offset: 0});
			this.get();
		},

		/**
		 * Update list whenever the count is modified
		 */
		count: function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.get();
		}
	},
	mounted: function() {
		/**
		 * Load items into the component once the page is loaded if a lazyLoad is
		 * requested.
		 */
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
</script>

<style lang="less">
@import '../../styles/_import';

.pkpListPanel {
	position: relative;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
	border-radius: @radius;

	> .pkpHeader {
		background: @bg-light;
		padding: 0.5rem 0.75rem;
		font-weight: @bold;
	}
}

.pkpListPanel__body {
	position: relative;
}

.pkpListPanel__sidebar {
	position: absolute;
	left: -9999px;
	opacity: 0;
	width: 0;
}

.pkpListPanel__content {
	position: relative;
}

.pkpListPanel__sidebar + .pkpListPanel__content {
	float: right;
	width: 100%;
	transition: width 0.2s;
}

.pkpListPanel__sidebar.-isVisible {
	float: left;
	position: relative;
	left: 0;
	width: 25%;
	opacity: 1;
	transition: opacity 0.2s ease-in-out 0.2s, left 0s ease-in-out 0.1s,
		width 0.2s ease-in-out 0s;

	+ .pkpListPanel__content {
		width: 75%;

		&:before {
			content: '';
			position: absolute;
			top: 0;
			bottom: 0;
			right: 0;
			left: -1px;
			border-left: @grid-border;
		}
	}
}

.pkpListPanel__filterSet {
	margin: 1rem 0;
	font-size: @font-sml;

	.pkpHeader {
		margin: 0 0 0.25rem;
		padding: 0 1rem;
		font-size: @font-tiny;
		line-height: 1.2em;
		font-weight: @bold;
		color: @text-light;

		&:focus {
			outline: 0;
		}
	}
}

.pkpListPanel__empty {
	font-size: @font-sml;
	padding: 2rem;
	color: @text-light;
	text-align: center;
}

.pkpListPanel__footer {
	position: relative;
	padding: 0.5rem;
	font-size: @font-tiny;
	line-height: @line-base;
	border-top: @grid-border;
}

.pkpListPanel.-isOrdering {
	// Hide other items on screen
	.pkpListPanel__actions
		> li:not(.pkpListPanel__orderToggle):not(.pkpListPanel__orderToggleCancel),
	.pkpListPanel__search {
		display: none;
	}
}
</style>
