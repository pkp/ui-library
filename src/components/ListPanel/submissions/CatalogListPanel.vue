<template>
	<div class="pkpListPanel--submissions pkpListPanel--catalog" :class="classes">
		<!-- Header -->
		<pkp-header>
			{{ title }}
			<spinner v-if="isLoading" />
			<template slot="actions">
				<search
					:searchPhrase="searchPhrase"
					:searchLabel="i18n.search"
					:clearSearchLabel="i18n.clearSearch"
					@search-phrase-changed="setSearchPhrase"
				/>
				<pkp-button
					:isActive="isSidebarVisible"
					icon="filter"
					:label="i18n.filter"
					@click="toggleSidebar"
				/>
				<template v-if="canOrderCurrent">
					<pkp-button
						class="pkpListPanel--catalog__orderToggle"
						:label="orderingLabel"
						icon="sort"
						:isActive="isOrdering"
						@click="toggleOrdering"
					/>
					<pkp-button
						v-if="isOrdering"
						class="pkpListPanel--catalog__orderCancel"
						:label="i18n.cancel"
						:isWarnable="true"
						@click="cancelOrdering"
					/>
				</template>
				<pkp-button
					ref="addEntryButton"
					:label="i18n.add"
					@click="openNewEntryModal"
				/>
			</template>
		</pkp-header>

		<!-- A notice indicating which kind of submissions are being ordered -->
		<notification v-if="isOrdering" type="info">
			{{ orderingDescription }}
		</notification>

		<!-- Body of the panel, including items and sidebar -->
		<div class="pkpListPanel__body -pkpClearfix">
			<!-- Filters in the sidebar -->
			<div
				v-if="filters.length"
				ref="sidebar"
				class="pkpListPanel__sidebar"
				:class="{'-isVisible': isSidebarVisible}"
			>
				<pkp-header
					class="pkpListPanel__sidebarHeader"
					:tabindex="isSidebarVisible ? 0 : -1"
				>
					<icon icon="filter" :inline="true" />
					{{ i18n.filter }}
				</pkp-header>
				<div
					v-for="(filterSet, index) in filters"
					:key="index"
					class="pkpListPanel__filterSet"
				>
					<pkp-header v-if="filterSet.heading">
						{{ filterSet.heading }}
					</pkp-header>
					<pkp-filter
						v-for="filter in filterSet.filters"
						:key="filter.param + filter.value"
						v-bind="filter"
						:isFilterActive="isFilterActive(filter.param, filter.value)"
						:i18n="i18n"
						@add-filter="setFilter"
						@remove-filter="removeParamFilters"
					/>
				</div>
			</div>

			<!-- Content -->
			<div class="pkpListPanel__content" aria-live="polite">
				<!-- Items -->
				<template v-if="items.length">
					<div class="pkpListPanel--catalog__columnLabels">
						<span class="pkpListPanel--catalog__columnLabel">
							<span>{{ featuredLabel }}</span>
						</span>
						<span class="pkpListPanel--catalog__columnLabel">
							<span>{{ newReleaseLabel }}</span>
						</span>
					</div>

					<draggable
						v-model="localItems"
						:options="draggableOptions"
						@start="drag = true"
						@end="drag = false"
					>
						<catalog-list-item
							v-for="item in localItems"
							:key="item.id"
							:item="item"
							:catalogEntryUrl="catalogEntryUrl"
							:csrfToken="csrfToken"
							:filterAssocType="filterAssocType"
							:filterAssocId="filterAssocId"
							:isOrdering="isOrdering"
							:apiUrl="apiUrl"
							:i18n="i18n"
							@update:item="updateItem"
							@order-up="itemOrderUp"
							@order-down="itemOrderDown"
						/>
					</draggable>
				</template>

				<!-- Loading indicator when loading and no items exist -->
				<div v-else-if="isLoading" class="pkpListPanel__empty">
					<spinner />
					{{ i18n.loading }}
				</div>

				<!-- Indicator when no items exist -->
				<div v-else class="pkpListPanel__empty">
					{{ i18n.empty }}
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div v-if="lastPage > 1" class="pkpListPanel__footer">
			<pagination
				:currentPage="currentPage"
				:isLoading="isLoading"
				:lastPage="lastPage"
				:i18n="i18n"
				@set-page="setPage"
			/>
		</div>
	</div>
</template>

<script>
import CatalogListItem from '@/components/ListPanel/submissions/CatalogListItem.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import Notification from '@/components/Notification/Notification.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpButton from '@/components/Button/Button.vue';
import Search from '@/components/Search/Search.vue';
import SubmissionsListListeners from '@/mixins/ListPanel/submissions/listeners';

export default {
	extends: ListPanel,
	mixins: [SubmissionsListListeners],
	components: {
		CatalogListItem,
		Notification,
		Pagination,
		PkpButton,
		Search
	},
	props: {
		addUrl: {
			type: String,
			required: true
		},
		catalogEntryUrl: {
			type: String,
			required: true
		},
		catalogSortBy: {
			type: String,
			default() {
				return 'datePublished'; // ORDERBY_DATE_PUBLISHED
			}
		},
		catalogSortDir: {
			type: Number,
			default() {
				return 1; // SORT_DIRECTION_ASC
			}
		},
		contextId: {
			type: Number,
			default() {
				return 0;
			}
		},
		csrfToken: {
			type: String,
			required: true
		}
	},
	computed: {
		/**
		 * Can any monographs being displayed now be ordered?
		 *
		 * @return {Boolean}
		 */
		canOrderCurrent() {
			for (let item of this.localItems) {
				for (let feature of item.featured) {
					if (
						feature.assoc_type === this.filterAssocType &&
						feature.assoc_id === this.filterAssocId
					) {
						return true;
					}
				}
			}
			return false;
		},

		/**
		 * Always sort featured items at the top, according to
		 * their sequence
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
		 * Return the appropriate label for the ordering button depending on
		 * if we're ordering or not.
		 *
		 * @return {String}
		 */
		orderingLabel() {
			return this.isOrdering
				? this.i18n.saveFeatureOrder
				: this.i18n.orderFeatures;
		},

		/**
		 * Return the appropriate label for the featured column depending on
		 * if we're looking at a filtered view
		 *
		 * @return {String}
		 */
		featuredLabel() {
			if (this.filterAssocType === pkp.const.ASSOC_TYPE_CATEGORY) {
				return this.i18n.featuredCategory;
			} else if (this.filterAssocType === pkp.const.ASSOC_TYPE_SERIES) {
				return this.i18n.featuredSeries;
			}
			return this.i18n.featured;
		},

		/**
		 * Return the appropriate label for the new release column depending on
		 * if we're looking at a filtered view
		 *
		 * @return {String}
		 */
		newReleaseLabel() {
			if (this.filterAssocType === pkp.const.ASSOC_TYPE_CATEGORY) {
				return this.i18n.newReleaseCategory;
			} else if (this.filterAssocType === pkp.const.ASSOC_TYPE_SERIES) {
				return this.i18n.newReleaseSeries;
			}
			return this.i18n.newRelease;
		},

		/**
		 * Return a description of which items are currently being ordered
		 * based on the filters that are set
		 *
		 * @return {String}
		 */
		orderingDescription() {
			let filter = null;
			if (this.filterAssocType === pkp.const.ASSOC_TYPE_CATEGORY) {
				filter = this.getFilter('categoryIds', this.filterAssocId);
			} else if (this.filterAssocType === pkp.const.ASSOC_TYPE_SERIES) {
				filter = this.getFilter('seriesIds', this.filterAssocId);
			}

			if (filter) {
				return this.__('orderingFeaturesSection', {title: filter.title});
			}

			return this.i18n.orderingFeatures;
		},

		/**
		 * The assoc_type value which matches the current filter
		 *
		 * The assoc_type will match constants indicating a press, category or
		 * series
		 *
		 * @return {Number}
		 */
		filterAssocType() {
			if (this.activeFilters.hasOwnProperty('categoryIds')) {
				return pkp.const.ASSOC_TYPE_CATEGORY;
			} else if (this.activeFilters.hasOwnProperty('seriesIds')) {
				return pkp.const.ASSOC_TYPE_SERIES;
			}
			return pkp.const.ASSOC_TYPE_PRESS;
		},

		/**
		 * The assoc_id value which matches the current filter
		 *
		 * The assoc_id will match the pressId, categoryId or seriesId
		 *
		 * @return {Number}
		 */
		filterAssocId() {
			if (this.activeFilters.hasOwnProperty('categoryIds')) {
				return this.activeFilters.categoryIds;
			} else if (this.activeFilters.hasOwnProperty('seriesIds')) {
				return this.activeFilters.seriesIds;
			}
			console.log("Here: " + this.contextId);
			return this.contextId;
		}
	},
	methods: {
		/**
		 * Find a filter's configuration details by param and value
		 *
		 * @param {String} param The param of the filter to find
		 * @param {mixed} value The value of the filter to find
		 * @return {Object} The filter config object
		 */
		getFilter: function(param, value) {
			for (let filterSet of this.filters) {
				for (let filter of filterSet.filters) {
					if (filter.param === param && filter.value === value) {
						return filter;
					}
				}
			}
			return {};
		},

		/**
		 * Override ListPanel::setFilter() so that only one filter param
		 * can be set any time. This is necessary to ensure only a single
		 * category or series is being viewed at one time, so that sorting
		 * is applied appropriately.
		 *
		 * @param {String} param
		 * @param {mixed} value
		 */
		setFilter: function(param, value) {
			this.activeFilters = {};
			this.activeFilters[param] = value;
			this.get();
		},

		/**
		 * Update an item in the list
		 *
		 * @param {Object} updatedItem
		 */
		updateItem: function(updatedItem) {
			let items = this.localItems.map(item => {
				return item.id === updatedItem.id ? updatedItem : item;
			});
			this.$emit('set', this.id, {items: items});
		},

		/**
		 * Open the new catalog entry modal
		 */
		openNewEntryModal() {
			if (!this.addUrl) {
				return;
			}

			const opts = {
				title: this.i18n.add,
				url: this.addUrl,
				closeCallback: () => this.$refs.addEntryButton.$el.focus()
			};

			$(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>'
			).pkpHandler('$.pkp.controllers.modal.AjaxModalHandler', opts);
		},

		/**
		 * Set the sort order for get requests. This can change depending on
		 * whether the full catalog or a series/category is being viewed.
		 */
		updateSortOrder() {
			let getParams = {...this.getParams};
			if (this.activeFilters.hasOwnProperty('categoryIds')) {
				const category = this.getFilter(
					'categoryIds',
					this.activeFilters.categoryIds
				);
				getParams.orderBy = category.sortBy;
				getParams.orderDirection = category.sortDir || this.catalogSortDir;
			} else if (this.activeFilters.hasOwnProperty('seriesIds')) {
				const series = this.getFilter(
					'seriesIds',
					this.activeFilters.seriesIds
				);
				getParams.orderBy = series.sortBy || this.catalogSortBy;
				getParams.orderDirection = series.sortDir || this.catalogSortDir;
			} else {
				getParams.orderBy = this.catalogSortBy;
				getParams.orderDirection = this.catalogSortDir;
			}
			this.$emit('set', this.id, {getParams: getParams});
		},

		/**
		 * Update the order sequence property for items in this list based on
		 * the new order of items
		 */
		setItemOrderSequence() {
			const featured = [];
			let seq = 0;
			for (const item of this.items) {
				const feature = item.featured.find(feature => {
					return feature.assoc_type === this.filterAssocType;
				});
				if (feature) {
					feature.seq = seq;
					featured.push({
						id: item.id,
						seq: feature.seq
					});
					seq++;
				}
			}

			this.isLoading = true;

			let self = this;
			$.ajax({
				url: this.apiUrl + '/saveFeaturedOrder',
				type: 'POST',
				headers: {
					'X-Csrf-Token': this.csrfToken
				},
				data: {
					assocType: this.filterAssocType,
					assocId: this.filterAssocId,
					featured: featured
				},
				error: function(r) {
					self.ajaxErrorCallback(r);
				},
				complete() {
					self.isLoading = false;
				}
			});
		}
	},
	created() {
		/**
		 * When a filter is set, update the sort order to match the setting of
		 * the series or catalog
		 *
		 * Set this watcher before the mounted hook so that the get params are
		 * updated before the ajax request is made in SubmissionListPanel.mounted.
		 */
		this.$watch('activeFilters', function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.updateSortOrder();
		});
	},
	mounted() {
		/**
		 * Update when a new entry has been added to the catalog
		 */
		var self = this;
		pkp.eventBus.$on('catalogEntryAdded', function() {
			self.get();
		});
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpListPanel--catalog {
	&.-isLoading {
		// Hide the list when loading because the featured and new release
		// actions change depending on the filter used. This prevents a brief
		// period while a list is loading when a user may click on the featured/
		// new release actions on an item that isn't in the filter that's been
		// requested.
		.pkpListPanel__content:after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: #fff;
			opacity: 0.5;
		}

		// Hide column labels while loading. See above.
		.pkpListPanel--catalog__columnLabel > span {
			opacity: 0;
		}
	}
}

.pkpListPanel--catalog__columnLabels {
	position: relative;
	display: block;
	min-height: 3rem;
	background: @lift;
	border-bottom: @grid-border;
	font-size: @font-tiny;
	line-height: @line-tiny;

	.pkpListPanel--catalog__columnLabel {
		position: absolute;
		top: 0;
		right: 8rem;
		width: 8rem;
		height: 100%;
		border-left: @grid-border;
		line-height: 1rem;

		+ .pkpListPanel--catalog__columnLabel {
			right: 0;
		}

		span {
			position: absolute;
			top: 50%;
			left: 50%;
			width: 90%;
			transform: translate(-50%, -50%);
			text-align: center;
		}
	}
}

.pkpListPanel--catalog.-isOrdering {
	.pkpHeader__actions
		> button:not(.pkpListPanel--catalog__orderToggle):not(.pkpListPanel--catalog__orderCancel),
	.pkpSearch,
	.pkpListPanelItem--catalog__select,
	.pkpListPanelItem__actions,
	.pkpListPanel--catalog__columnLabels {
		display: none;
	}

	.pkpListPanelItem--submission__item {
		padding-right: 1rem;
	}

	.pkpListPanelItem:not(.-isFeatured) {
		display: none;
	}
}
</style>
