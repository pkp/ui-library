<template>
	<div class="pkpListPanel" :class="classStatus">
		<div class="pkpListPanel__header -pkpClearfix">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
		</div>
		<div class="pkpListPanel__body -pkpClearfix">
			<ul class="pkpListPanel__items" aria-live="polite">
				<list-panel-item
					v-for="item in items"
					:key="item.id"
					:item="item"
					:i18n="i18n"
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
		ListPanelItem
	},
	data: function() {
		return {
			id: '',
			items: [],
			itemsMax: null,
			searchPhrase: '',
			isLoading: false,
			isOrdering: false,
			isFilterVisible: false,
			count: 20,
			offset: 0,
			apiPath: '',
			getParams: {},
			activeFilters: {},
			noticeType: '',
			i18n: {},
			lazyLoad: false,
			latestGetRequest: null
		};
	},
	computed: {
		classStatus: function() {
			return {'-isLoading': this.isLoading};
		},
		itemCount: function() {
			return this.items.length;
		},
		canLoadMore: function() {
			return (
				typeof this.itemsMax !== 'undefined' && this.itemsMax > this.itemCount
			);
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
		}
	},
	methods: {
		/**
		 * Set the search phrase
		 *
		 * @param string val The new search phrase
		 */
		setSearchPhrase: function(val) {
			this.searchPhrase = val;
		},

		/**
		 * Get items for the list. This ListPanel must have a defined
		 * `get` route to execute this method.
		 *
		 * @param string handleResponse How to handle the response. `append` to
		 *  add to the items. Default: null will replace the items.
		 */
		get: function(handleResponse) {
			var self = this;

			this.isLoading = true;

			// Address issues with multiple async get requests. Store an ID for the
			// most recent get request. When we receive the response, we
			// can check that the response matches the most recent get request, and
			// discard responses that are outdated.
			this.latestGetRequest = $.pkp.classes.Helper.uuid();

			$.ajax({
				url: this.getApiUrl(this.apiPath),
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

					if (handleResponse === 'append') {
						var existingItemIds = self.items.map(value => value.id);
						for (var item of r.items) {
							if (existingItemIds.indexOf(item.id) < 0) {
								self.items.push(item);
							}
						}
						self.itemsMax = r.itemsMax;
					} else {
						self.items = r.items;
						self.itemsMax = r.itemsMax;
					}
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
		 * Load more items in the list
		 */
		loadMore: function() {
			this.offset = this.items.length;
			this.get('append');
		},

		/**
		 * Toggle filter visibility
		 */
		toggleFilter: function() {
			this.isFilterVisible = !this.isFilterVisible;
			if (!this.isFilterVisible) {
				this.updateFilter({});
			}
		},

		/**
		 * Update filter parameters
		 */
		updateFilter: function(params) {
			this.activeFilters = params;
		},

		/**
		 * Toggle the ordering status
		 */
		toggleOrdering: function() {
			if (this.isOrdering) {
				this.setItemOrderSequence();
			}
			this.isOrdering = !this.isOrdering;
			if (this.isOrdering) {
				this.$nextTick(function() {
					var helpEl = this.$el.querySelector('.pkpListPanel__notice');
					if (helpEl) {
						helpEl.focus();
					}
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
			this.items.splice(index - 1, 0, this.items.splice(index, 1)[0]);
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
			this.items.splice(index + 1, 0, this.items.splice(index, 1)[0]);
		},

		/**
		 * Update the order sequence property for items in this list based on
		 * the new order of items
		 */
		setItemOrderSequence: function(prop) {
			prop = prop || 'seq'; // default sequence property in item models

			this.items.forEach((item, i) => {
				item[prop] = i;
			});
		},

		/**
		 * Cancel changes made by ordering items
		 */
		cancelOrdering: function() {
			this.isOrdering = false;
			this.offset = 0;
			this.get();
		}
	},
	watch: {
		/**
		 * Perform a search whenever the searchPhrase is updated
		 */
		searchPhrase: function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.offset = 0;
			this.get();
		},

		/**
		 * Update list whenever a filter is applied
		 */
		activeFilters: function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.offset = 0;
			this.get();
			if (newVal && Object.keys(newVal).length) {
				this.isFilterVisible = true;
			}
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

		+ li {
			margin-left: 0.5em;
		}
	}
}

.pkpListPanel__body {
	position: relative;
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
	.pkpListPanel__actions
		> li:not(.pkpListPanel__orderToggle):not(.pkpListPanel__orderToggleCancel),
	.pkpListPanel__search {
		display: none;
	}
}
</style>
