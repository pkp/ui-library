<template>
	<div class="pkpListPanel" :class="classStatus">
		<div class="pkpListPanel__header -pkpClearfix">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
		</div>
		<div class="pkpListPanel__body -pkpClearfix">
			<ul class="pkpListPanel__items" aria-live="polite">
				<list-panel-item
					v-for="item in collection.items"
					:key="item.id"
					:item="item"
				/>
			</ul>
		</div>
	</div>
</template>

<script>
import ListPanelItem from '@/components/ListPanel/ListPanelItem.vue';

export default {
	name: 'ListPanel',
	components: {
		ListPanelItem,
	},
	data: function () {
		return {
			id: '',
			collection: {
				items: [],
				maxItems: null,
			},
			searchPhrase: '',
			isLoading: false,
			isOrdering: false,
			isFilterVisible: false,
			count: 20,
			offset: 0,
			apiPath: '',
			getParams: {},
			activeFilters: {},
			i18n: {},
			lazyLoad: false,
			_lastGetRequest: null,
		};
	},
	computed: {
		classStatus: function () {
			return { '-isLoading': this.isLoading };
		},
		itemCount: function () {
			return this.collection.items.length;
		},
		canLoadMore: function () {
			return typeof this.collection.maxItems !== 'undefined' && this.collection.maxItems > this.itemCount;
		},

		/**
		 * Options for the draggable component
		 *
		 * @see https://github.com/SortableJS/Vue.Draggable
		 */
		draggableOptions: function () {
			return {
				disabled: !this.isOrdering,
			};
		},
	},
	methods: {

		/**
		 * Set the search phrase
		 *
		 * @param string val The new search phrase
		 */
		setSearchPhrase: function (val) {
			this.searchPhrase = val;
		},

		/**
		 * Get items for the list. This ListPanel must have a defined
		 * `get` route to execute this method.
		 *
		 * @param string handleResponse How to handle the response. `append` to
		 *  add to the collection. Default: null will replace the collection.
		 */
		get: function (handleResponse) {
			var self = this;

			this.isLoading = true;

			// Address issues with multiple async get requests. Store an ID for the
			// most recent get request. When we receive the response, we
			// can check that the response matches the most recent get request, and
			// discard responses that are outdated.
			this._latestGetRequest = $.pkp.classes.Helper.uuid();

			$.ajax({
				url: this.getApiUrl(this.apiPath),
				type: 'GET',
				data: {
					...this.getParams,
					...this.activeFilters,
					searchPhrase: this.searchPhrase,
					count: this.count,
					offset: this.offset,
				},
				_uuid: this._latestGetRequest,
				error: function (r) {

					// Only process latest request response
					if (self._latestGetRequest !== this._uuid) {
						return;
					}
					self.ajaxErrorCallback(r);
				},
				success: function (r) {

					// Only process latest request response
					if (self._latestGetRequest !== this._uuid) {
						return;
					}

					if (handleResponse === 'append') {
						var existingItemIds = self.collection.items.map(value => value.id);
						for (var item of r.items) {
							if (existingItemIds.indexOf(item.id) < 0) {
								self.collection.items.push(item);
							}
						}
						self.collection.maxItems = r.maxItems;
					} else {
						self.collection = r;
					}
				},
				complete: function (r) {

					// Only process latest request response
					if (self._latestGetRequest !== this._uuid) {
						return;
					}

					self.isLoading = false;
				},
			});
		},

		/**
		 * Load more items in the list
		 */
		loadMore: function () {
			this.offset = this.collection.items.length;
			this.get('append');
		},

		/**
		 * Toggle filter visibility
		 */
		toggleFilter: function () {
			this.isFilterVisible = !this.isFilterVisible;
			if (!this.isFilterVisible) {
				this.updateFilter({});
			}
		},

		/**
		 * Update filter parameters
		 */
		updateFilter: function (params) {
			this.activeFilters = params;
		},

		/**
		 * Toggle the ordering status
		 */
		toggleOrdering: function () {
			if (this.isOrdering) {
				this.setItemOrderSequence();
			}
			this.isOrdering = !this.isOrdering;
			if (this.isOrdering) {
				this.$nextTick(function () {
					var helpEl = this.$el.querySelector('.pkpListPanel__notice');
					if (helpEl) {
						helpEl.focus();
					}
				});
			}
		},

		/**
		 * Move an item up in the list
		 */
		itemOrderUp: function (data) {
			var index = this.collection.items.findIndex(item => {
				return item.id == data.id;
			});
			if (index === 0) {
				return;
			}
			this.collection.items.splice(index - 1, 0, this.collection.items.splice(index, 1)[0]);
			this.itemOrderResetFocus(data.id, 'up');
		},

		/**
		 * Move an item down in the list
		 */
		itemOrderDown: function (data) {
			var index = this.collection.items.findIndex(item => {
				return item.id == data.id;
			});
			if (index === this.collection.items.length - 1) {
				return;
			}
			this.collection.items.splice(index + 1, 0, this.collection.items.splice(index, 1)[0]);
			this.itemOrderResetFocus(data.id, 'down');
		},

		/**
		 * Move focus to up/down button for item that was just moved
		 *
		 * When using the up/down arrows, the focus stays on the button in
		 * the position which was clicked. This function ensures the focus
		 * travels with the item that's been moved.
		 *
		 * For the same reason, we have to do a manual look up on the child
		 * component by id. Vue.js's optimization code swaps out the items
		 * without resetting the components, so any callback is fired on the
		 * item which is in the position of the item that was just moved. In
		 * other words, under-the-hood Vue.js moves the data around but leaves
		 * the components in place, so we have to manually find the component
		 * where the moved item is and set focus there.
		 *
		 * @param itemId int The id of the item to set focus in
		 * @param direction string Set focus on the 'up' or 'down' btn
		 */
		itemOrderResetFocus: function (itemId, direction) {

			// Wait until the components have been redrawn before setting focus
			this.$nextTick(function () {
				var itemChild;
				for (var child of this.$children) {
					// If the list items are nested inside a draggable,
					// search in that component's children.
					if (child.$options._componentTag === 'draggable') {
						var listItem = child.$children.filter(item => {
							return item.id === itemId;
						});
						if (!listItem.length) {
							return false;
						} else {
							listItem = listItem[0];
						}
						for (itemChild of listItem.$children) {
							if (itemChild.$options._componentTag === 'list-panel-item-orderer') {
								itemChild.setFocus(direction);
							}
						}
						return false;
					} else if (child.id === itemId) {
						for (itemChild of child.$children) {
							if (itemChild.$options._componentTag === 'list-panel-item-orderer') {
								itemChild.setFocus(direction);
							}
						}
						return false;
					}
				}
			});
		},

		/**
		 * Update the order sequence property for items in this list based on
		 * the new order of items
		 */
		setItemOrderSequence: function (prop) {
			prop = prop || 'seq'; // default sequence property in item models

			this.collection.items.forEach((item, i) => {
				item[prop] = i;
			});
		},

		/**
		 * Cancel changes made by ordering items
		 */
		cancelOrdering: function () {
			this.isOrdering = false;
			this.offset = 0;
			this.get();
		},
	},
	mounted: function () {
		/**
		 * Perform a search whenever the searchPhrase is updated
		 */
		this.$watch('searchPhrase', function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.offset = 0;
			this.get();
		});

		/**
		 * Update list whenever a filter is applied
		 */
		this.$watch('activeFilters', function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.offset = 0;
			this.get();
			if (newVal && Object.keys(newVal).length) {
				this.isFilterVisible = true;
			}
		});

		/**
		 * Load a collection into the component once the page is loaded if a
		 * lazyLoad is requested.
		 */
		if (this.lazyLoad) {
			if (document.readyState === 'complete') {
				this.get();
			} else {
				var self = this;
				$(function () {
					self.get();
				});
			}
		}
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpListPanel {
	position: relative;
	max-width: 900px;
	box-shadow: 0 1px 1px rgba(0,0,0,0.2);
	border-radius: @radius;
}

.pkpListPanel__header {
	background: @bg-light;
	padding: 0 0.5em 0.5em 1em;
}

.pkpListPanel__title {
	position: relative;
	margin-top: 0.5em;
	font-weight: @bold;
	float: left;
	max-width: 30em;
}

.pkpListPanel__title .pkpSpinner:after {
	position: absolute;
	top: 50%;
	left: 100%;
	margin-top: -10px;
	margin-left: 1em;
}

.pkpListPanel__actions {
	float: right;
	margin: 0.5em 0 0;
	padding: 0;
	max-width: 30em;

	li {
		display: inline-block;
	}
}

.pkpListPanel__body {
	position: relative;
}

.pkpListPanel__filter.-isVisible {
	float: left;
	position: relative;
	left: auto;
	width: 25%;

	+ .pkpListPanel__content  {
		float: right;
		width: 75%;
	}

	.pkpListPanel__filterHeader,
	.pkpListPanel__filterOptions {
		position: relative;
		left: 0;
		opacity: 1;
		width: 100%;
		transition: opacity 0.2s ease-in-out 0.2s, left 0s ease-in-out 0.2s, width 0s ease-in-out 0.2s;
	}
}

.pkpListPanel__columnLabels {
	position: relative;
	display: block;
	min-height: @base * 3;
	background: @lift;
	border-bottom: @grid-border;
	font-size: @font-tiny;
	line-height: @line-tiny;
}

.pkpListPanel__items {
	margin: 0;
	padding: 0;
}

.pkpListPanel__footer {
	position: relative;
	padding: @half @base;
	font-size: @font-tiny;
	line-height: @line-base;
	border-top: @grid-border;
}

.pkpListPanel.-isOrdering {

	// Hide other items on screen
	.pkpListPanel__actions > li:not(.pkpListPanel__orderToggle):not(.pkpListPanel__orderToggleCancel),
	.pkpListPanel__search {
		display: none;
	}
}

.pkpListPanel__notice {
	padding: 1em;
	border-bottom: @grid-border;
	font-size: @font-sml;
	line-height: @line-sml;

	&:focus {
		box-shadow: -2px 0 0 @primary;
		outline: 0;
	}
}
</style>
