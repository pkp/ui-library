<template>
	<component
		:is="canSelect ? 'fieldset' : 'div'"
		:class="classes"
	>

		<!-- Header -->
		<slot name="header">
			<pkp-header>
				<legend v-if="canSelect">{{ title }}</legend>
				<template v-else>{{ title }}</template>
			</pkp-header>
		</slot>

		<!-- Optional description -->
		<notification v-if="description" type="info">
			{{ description }}
		</notification>

		<!-- Body of the panel, including items and sidebar -->
		<div class="pkpListPanel__body -pkpClearfix">

			<!-- Filters in the sidebar -->
			<div v-if="filters.length" ref="sidebar" class="pkpListPanel__sidebar" :class="{'-isVisible': isSidebarVisible}">
				<pkp-header class="pkpListPanel__sidebarHeader" :tabindex="isSidebarVisible ? 1 : 0">
					<icon icon="filter" :inline="true" />
					{{ i18n.filter }}
				</pkp-header>
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

			<!-- Content -->
			<div class="pkpListPanel__content" aria-live="polite">

				<!-- Optional selectAll button -->
				<label
					v-if="canSelectAll"
					class="pkpListPanel__selectAll"
					@click="toggleSelectAll"
				>
					<input type="checkbox" v-model="isSelectAllOn" />
					<span class="pkpListPanel__selectAllLabel">
						{{ i18n.selectAllLabel }}
					</span>
				</label>

				<!-- Items -->
				<template v-if="items.length">
					<draggable
						v-if="canOrder"
						v-model="localItems"
						:options="draggableOptions"
						@start="drag=true"
						@end="drag=false"
					>
						<list-panel-item
							v-for="item in items"
							:key="item.id"
							:item="item"
							:canOrder="canOrder"
							:canSelect="canSelect"
							:isOrdering="isOrdering"
							:selected="selected"
							:selectorName="selectorName"
							:selectorType="selectorType"
							:i18n="i18n"
							@update:selected="updateSelected"
							@order-up="itemOrderUp"
							@order-down="itemOrderDown"
						/>
					</draggable>
					<template v-else>
						<list-panel-item
							v-for="item in items"
							:key="item.id"
							:item="item"
							:canSelect="canSelect"
							:selected="selected"
							:selectorName="selectorName"
							:selectorType="selectorType"
							:i18n="i18n"
							@update:selected="updateSelected"
						/>
					</template>
				</template>

				<!-- Indicator when no items exist -->
				<div v-else class="pkpListPanel__empty">
					{{ i18n.empty }}
				</div>
			</div>
		</div>

		<!-- Optional footer -->
		<div v-if="hasFooter" class="pkpListPanel__footer">
			<slot name="footer" />
		</div>
	</component>
</template>

<script>
import draggable from 'vuedraggable';
import Icon from '@/components/Icon/Icon.vue';
import ListPanelItem from '@/components/ListPanel/ListPanelItem.vue';
import Notification from '@/components/Notification/Notification.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpFilter from '@/components/Filter/Filter.vue';
import PkpHeader from '@/components/Header/Header.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

export default {
	name: 'ListPanel',
	components: {
		draggable,
		Icon,
		ListPanelItem,
		Notification,
		Pagination,
		PkpFilter,
		PkpHeader,
		Spinner
	},
	props: {
		apiUrl: {
			type: String,
			default() {
				return '';
			}
		},
		canOrder: {
			type: Boolean,
			default() {
				return false;
			}
		},
		canSelect: {
			type: Boolean,
			default() {
				return false;
			}
		},
		canSelectAll: {
			type: Boolean,
			default() {
				return false;
			}
		},
		count: {
			type: Number,
			required: true
		},
		description: {
			type: String,
			default() {
				return '';
			}
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
		selected: {
			type: [Number, String, Array],
			default() {
				if (this.selectorType === 'checkbox') {
					return [];
				} else {
					return '';
				}
			}
		},
		selectorName: {
			type: String,
			default() {
				return '';
			}
		},
		selectorType: {
			type: String,
			default() {
				return 'checkbox';
			},
			validator(value) {
				return ['checkbox', 'radio'].includes(value);
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
			isOrdering: this.canOrder,
			latestGetRequest: null,
			isSelectAllOn: false
		};
	},
	computed: {
		/**
		 * Classes used on the root element
		 *
		 * @return {Array}
		 */
		classes() {
			let classes = ['pkpListPanel'];
			if (this.isOrdering) {
				classes.push('-isOrdering');
			}
			if (this.isLoading) {
				classes.push('-isLoading');
			}
			return classes;
		},

		/**
		 * Options for the draggable component
		 *
		 * @see https://github.com/SortableJS/Vue.Draggable
		 */
		draggableOptions() {
			return {
				disabled: !this.isOrdering
			};
		},

		/**
		 * Does this ListPanel have anything in the footer slot?
		 *
		 * @return {Boolean}
		 */
		hasFooter() {
			return this.$slots.footer;
		},

		/**
		 * Getters and setters for mutating the items array
		 */
		localItems: {
			get() {
				return this.items;
			},
			set(newVal, oldVal) {
				if (newVal === oldVal) {
					return;
				}
				this.$emit('set', this.id, {items: newVal});
			}
		},

		/**
		 * Get the number of the page of results showing in the list
		 *
		 * @return {Number}
		 */
		currentPage() {
			return Math.floor(this.offset / this.count) + 1;
		},

		/**
		 * Get the number of the last page of results available for the list
		 *
		 * @return {Number}
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
		 * @param {String} handleResponse How to handle the response. `append` to
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
		 * Set the search phrase
		 *
		 * @param {String} value
		 */
		setSearchPhrase: function(value) {
			this.$emit('set', this.id, {
				searchPhrase: value
			});
		},

		/**
		 * Toggle sidebar visibility
		 */
		toggleSidebar() {
			this.activeFilters = {};
			this.$emit('set', this.id, {
				isSidebarVisible: !this.isSidebarVisible
			});
			if (this.isSidebarVisible) {
				this.get();
			}
		},

		/**
		 * Check if a filter is currently active
		 *
		 * @param {String} param
		 * @param {mixed} value
		 * @return {Boolean}
		 */
		isFilterActive: function(param, value) {
			if (!Object.keys(this.activeFilters).includes(param)) {
				return false;
			}
			if (Array.isArray(this.activeFilters[param])) {
				return this.activeFilters[param].includes(value);
			}
			return this.activeFilters[param] === value;
		},

		/**
		 * Add a filter
		 *
		 * Adds the value to the array of existing values for
		 * this param. Use this method for filters which accept
		 * more than one value for the param. For example, a
		 * list of valid stageIds.
		 *
		 * @param {String} param
		 * @param {mixed} value
		 */
		addFilter: function(param, value) {
			if (this.isFilterActive(param, value)) {
				return;
			}
			let filters = {...this.activeFilters};
			if (filters[param] === undefined) {
				filters[param] = [];
			}
			filters[param].push(value);
			this.activeFilters = filters;
			this.get();
		},

		/**
		 * Set a filter
		 *
		 * Overrides the existing value for the param and
		 * replaces it with the new value. Use this method
		 * for filters which only support a single value
		 * for the param. For example, whether to show enabled
		 * or disabled objects.
		 *
		 * @param {String} param
		 * @param {mixed} value
		 */
		setFilter: function(param, value) {
			let activeFilters = {...this.activeFilters};
			activeFilters[param] = value;
			this.activeFilters = activeFilters;
			this.get();
		},

		/**
		 * Remove a filter
		 *
		 * Removes one value from the array of values for this
		 * param. Use this method for filters that use addFilter.
		 *
		 * @param {String} param
		 * @param {mixed} value
		 */
		removeFilter: function(param, value) {
			if (this.activeFilters[param] === undefined) {
				return;
			}
			let filters = {...this.activeFilters};
			filters[param] = filters[param].filter(filterVal => filterVal !== value);
			this.activeFilters = filters;
			this.get();
		},

		/**
		 * Remove all filters for a param
		 *
		 * Removes all filters related to a param. Use this method
		 * with filters that use setFilter.
		 *
		 * @param {String} param
		 */
		removeParamFilters: function(param) {
			if (!Object.keys(this.activeFilters).includes(param)) {
				return;
			}
			let filters = {...this.activeFilters};
			delete filters[param];
			this.activeFilters = filters;
			this.get();
		},

		/**
		 * Update the selected value
		 *
		 * @param {mixed} newVal
		 */
		updateSelected: function(newVal) {
			this.$emit('set', this.id, {selected: newVal});
		},

		/**
		 * Select or de-select all options
		 */
		toggleSelectAll() {
			let selected;
			if (this.selected.length < this.items.length) {
				this.isSelectAllOn = true;
				selected = this.items.map(item => item.id);
			} else {
				this.isSelectAllOn = false;
				selected = [];
			}
			this.$emit('set', this.id, {selected: selected});
		},

		/**
		 * Toggle the ordering status
		 */
		toggleOrdering() {
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
		 * @param {Object} item The item to move
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
		 * @param {Object} item The item to move
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
		cancelOrdering() {
			this.isOrdering = false;
			this.$emit('set', this.id, {offset: 0});
			this.$nextTick(() => this.get());
		},

		/**
		 * View a different page of the results in this list
		 *
		 * Calculates the offset value and emits an event to update it
		 *
		 * @param {Number} page
		 */
		setPage: function(page) {
			this.$emit('set', this.id, {offset: page * this.count - this.count});
			this.$nextTick(() => this.get());
		},

		/**
		 * Set the tabindex on items in the sidebar to allow/prevent
		 * them from accepting focus
		 *
		 * @param {Boolean} enable
		 */
		toggleSidebarFocus: function(enable) {
			if (!Object.keys(this.$refs).includes('sidebar')) {
				return;
			}
			const tabIndex = enable ? 0 : -1;
			this.$refs.sidebar
				.querySelectorAll(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
				)
				.forEach(el => (el.tabIndex = tabIndex));
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
		 * Update list whenever the count is modified
		 */
		count: function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.get();
		},

		/**
		 * Prevent focus in the sidebar whenever it is not visible
		 */
		isSidebarVisible: function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.toggleSidebarFocus(newVal);

			// move focus into the sidebar when it is made visible
			this.$nextTick(() => {
				if (newVal && Object.keys(this.$refs).includes('sidebar')) {
					this.setFocusIn(this.$refs.sidebar);
				}
			});
		},

		/**
		 * Perform a search whenever the searchPhrase is updated
		 */
		searchPhrase: function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.$emit('set', this.id, {offset: 0});
			this.$nextTick(() => this.get());
		},

		/**
		 * Toggle the select all button when selected is updated
		 */
		selected: function(newVal, oldVal) {
			this.isSelectAllOn = newVal.length === this.items.length;
		}
	},
	mounted() {
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

		/**
		 * Set the initial tabindex attributes in the sidebar
		 */
		this.toggleSidebarFocus(this.isSidebarVisible);
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

		> .pkpSpinner {
			margin-left: 0.25rem;
		}
	}

	> .pkpNotification {
		border: none;
		box-shadow: none;
		background: @bg-light;
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

.pkpListPanel__sidebar .pkpHeader__title {
	font-size: @font-sml;
}

.pkpListPanel__sidebarHeader {
	margin-top: 1rem;
	padding: 0 1rem;

	&:focus {
		box-shadow: inset 2px 0 0 @primary;
		outline: 0;
	}
}

.pkpListPanel__filterSet {
	margin: 1rem 0;

	.pkpHeader {
		padding: 0 1rem;
		line-height: 1.2em;
		color: @text-light;

		&:focus {
			outline: 0;
		}
	}

	.pkpHeader__title {
		font-size: @font-tiny;
	}
}

.pkpListPanel__empty {
	font-size: @font-sml;
	padding: 2rem;
	color: @text-light;
	text-align: center;

	> .pkpSpinner {
		margin-right: 0.25rem;
	}
}

// Override fieldset defaults when used with canSelect
fieldset.pkpListPanel {
	padding: 0;
	border: none;

	legend {
		display: inline-block;
	}
}

.pkpListPanel__selectAll {
	position: relative;
	display: block;
	background: @bg-light;
	padding: 0.5rem 0.75rem 0.5rem 2.5rem;
	font-size: @font-tiny;

	> input {
		position: absolute;
		top: 50%;
		left: 1.5rem;
		transform: translate(-50%, -50%);

		&:focus {
			outline: @primary dotted 1px;
			outline-offset: 0.25rem;
		}
	}
}

/** Override label style when used in a .pkp_form */
.pkp_form label.pkpListPanel__selectAll {
	min-height: auto;
	font-size: @font-tiny;
	font-weight: @normal;
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
