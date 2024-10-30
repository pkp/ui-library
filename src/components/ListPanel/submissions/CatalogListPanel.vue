<template>
	<div>
		<ListPanel
			:is-sidebar-visible="isSidebarVisible"
			:items="items"
			class="listPanel--catalog"
			:class="{
				'-isOrdering': isOrdering,
				'-isLoading': isLoading,
			}"
		>
			<template #header>
				<PkpHeader>
					<h2>{{ title }}</h2>
					<Spinner v-if="isLoading" />
					<template #actions>
						<Search
							:search-phrase="searchPhrase"
							@search-phrase-changed="setSearchPhrase"
						/>
						<PkpButton
							:is-active="isSidebarVisible"
							@click="isSidebarVisible = !isSidebarVisible"
						>
							<Icon icon="Filter" class="h-4 w-4" :inline="true" />
							{{ t('common.filter') }}
						</PkpButton>
						<template v-if="canOrderCurrent">
							<PkpButton
								class="listPanel--catalog__orderToggle"
								icon="Sort"
								:is-active="isOrdering"
								@click="toggleOrdering"
							>
								{{ orderingLabel }}
							</PkpButton>
							<PkpButton
								v-if="isOrdering"
								class="listPanel--catalog__orderCancel"
								:is-warnable="true"
								@click="cancelOrdering"
							>
								{{ t('common.cancel') }}
							</PkpButton>
						</template>
						<PkpButton @click="openAddEntryForm">
							{{ t('submission.catalogEntry.new') }}
						</PkpButton>
					</template>
				</PkpHeader>

				<!-- A notice indicating which kind of submissions are being ordered -->
				<Notification v-if="isOrdering">
					{{ orderingDescription }}
				</Notification>

				<!-- Table-like column headers for featured/new -->
				<div
					v-if="items.length"
					class="listPanel--catalog__headings"
					aria-hidden="true"
				>
					<span class="listPanel--catalog__heading">
						{{ featuredLabel }}
					</span>
					<span class="listPanel--catalog__heading">
						{{ newReleaseLabel }}
					</span>
				</div>
			</template>

			<template #sidebar>
				<PkpHeader :is-one-line="false">
					<h3>
						<Icon icon="Filter" class="h-4 w-4" :inline="true" />
						{{ t('common.filter') }}
					</h3>
				</PkpHeader>
				<div
					v-for="(filterSet, index) in filters"
					:key="index"
					class="listPanel__block"
				>
					<PkpHeader v-if="filterSet.heading">
						<h4>{{ filterSet.heading }}</h4>
					</PkpHeader>
					<PkpFilter
						v-for="filter in filterSet.filters"
						:key="filter.param + filter.value"
						v-bind="filter"
						:is-filter-active="isFilterActive(filter.param, filter.value)"
						@add-filter="addFilter"
						@remove-filter="removeFilter"
					/>
				</div>
			</template>

			<template v-if="isLoading" #itemsEmpty>
				<Spinner />
				{{ t('common.loading') }}
			</template>

			<template #item="{item}">
				<CatalogListItem
					:key="item.id"
					:item="item"
					:filter-assoc-type="filterAssocType"
					:filter-assoc-id="filterAssocId"
					:is-ordering="isOrdering"
					:api-url="apiUrl"
					@update:item="updateItem"
					@order-up="itemOrderUp"
					@order-down="itemOrderDown"
				/>
			</template>
			<template #footer>
				<Pagination
					v-if="lastPage > 1"
					:current-page="currentPage"
					:is-loading="isLoading"
					:last-page="lastPage"
					@set-page="setPage"
				/>
			</template>
		</ListPanel>
	</div>
</template>

<script>
import Spinner from '@/components/Spinner/Spinner.vue';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';
import CatalogListItem from '@/components/ListPanel/submissions/CatalogListItem.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import Notification from '@/components/Notification/Notification.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpHeader from '@/components/Header/Header.vue';
import PkpFilter from '@/components/Filter/Filter.vue';
import CatalogEditModal from './CatalogEditModal.vue';
import Search from '@/components/Search/Search.vue';
import ajaxError from '@/mixins/ajaxError';
import fetch from '@/mixins/fetch';
import {useModal} from '@/composables/useModal';

export default {
	components: {
		Spinner,
		PkpButton,
		Icon,
		CatalogListItem,
		ListPanel,
		Notification,
		Pagination,
		PkpHeader,
		PkpFilter,
		Search,
	},
	mixins: [ajaxError, fetch],
	props: {
		/**  The [Form](../?path=/docs/forms-form--docs) to add an entry to the catalog. */
		addEntryForm: {
			type: Object,
			required: true,
		},
		/** One of the `ORDER_BY_*` constants. Default: `ORDERBY_DATE_PUBLISHED`  */
		catalogSortBy: {
			type: String,
			default() {
				return 'datePublished'; // ORDERBY_DATE_PUBLISHED
			},
		},
		/** One of the `SORT_DIRECTION_*` constants. Default: `SORT_DIRECTION_ASC` */
		catalogSortDir: {
			type: Number,
			default() {
				return 1; // SORT_DIRECTION_ASC
			},
		},
		/** The id of the press. */
		contextId: {
			type: Number,
			required: true,
		},
		/** The [Filters](../?path=/docs/components-filter-base--docs) to change the list view.  */
		filters: {
			type: Array,
			default() {
				return [];
			},
		},
		/** A unique id for this component. */
		id: {
			type: String,
			required: true,
		},
		/** An array of publishable submissions. */
		items: {
			type: Array,
			default() {
				return [];
			},
		},
		/** A count of all publishable submissions in the press.  */
		itemsMax: {
			type: Number,
			defaut() {
				return 0;
			},
		},
		/** The title of the list panel. */
		title: {
			type: String,
			default() {
				return '';
			},
		},
	},
	emits: [
		/** Emitted when a prop should be changed. Payload: `(id, newProps)` */
		'set',
	],
	data() {
		return {
			newEntries: [],
			isOrdering: false,
			isSidebarVisible: false,
		};
	},
	computed: {
		/**
		 * Can any monographs being displayed now be ordered?
		 *
		 * @return {Boolean}
		 */
		canOrderCurrent() {
			for (let item of this.items) {
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
		 * Return the appropriate label for the ordering button depending on
		 * if we're ordering or not.
		 *
		 * @return {String}
		 */
		orderingLabel() {
			return this.isOrdering
				? this.t('submission.list.saveFeatureOrder')
				: this.t('submission.list.orderFeatures');
		},

		/**
		 * Return the appropriate label for the featured column depending on
		 * if we're looking at a filtered view
		 *
		 * @return {String}
		 */
		featuredLabel() {
			if (this.filterAssocType === pkp.const.ASSOC_TYPE_CATEGORY) {
				return this.t('catalog.manage.categoryFeatured');
			} else if (this.filterAssocType === pkp.const.ASSOC_TYPE_SERIES) {
				return this.t('catalog.manage.seriesFeatured');
			}
			return this.t('catalog.manage.featured');
		},

		/**
		 * Return the appropriate label for the new release column depending on
		 * if we're looking at a filtered view
		 *
		 * @return {String}
		 */
		newReleaseLabel() {
			if (this.filterAssocType === pkp.const.ASSOC_TYPE_CATEGORY) {
				return this.t('catalog.manage.feature.categoryNewRelease');
			} else if (this.filterAssocType === pkp.const.ASSOC_TYPE_SERIES) {
				return this.t('catalog.manage.feature.seriesNewRelease');
			}
			return this.t('catalog.manage.feature.newRelease');
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
				return this.t('submission.list.orderingFeaturesSection', {
					title: filter.title,
				});
			}

			return this.t('submission.list.orderingFeatures');
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
			if (
				Object.prototype.hasOwnProperty.call(this.activeFilters, 'categoryIds')
			) {
				return pkp.const.ASSOC_TYPE_CATEGORY;
			} else if (
				Object.prototype.hasOwnProperty.call(this.activeFilters, 'seriesIds')
			) {
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
			if (
				Object.prototype.hasOwnProperty.call(this.activeFilters, 'categoryIds')
			) {
				return this.activeFilters.categoryIds;
			} else if (
				Object.prototype.hasOwnProperty.call(this.activeFilters, 'seriesIds')
			) {
				return this.activeFilters.seriesIds;
			}
			return this.contextId;
		},
	},
	created() {
		/**
		 * When a filter is set, update the sort order to match the setting of
		 * the series or catalog
		 *
		 * Set this watcher before the mounted hook so that the get params are
		 * updated before the ajax request is made in SubmissionListPanel.mounted.
		 */
		this.$watch('activeFilters', function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.updateSortOrder();
		});
	},
	methods: {
		/**
		 * When the add entry form has been successfully submitted
		 */
		addEntryFormSuccess() {
			this.closeAddEntryForm();
			this.get();
		},

		/**
		 * Open add entry form
		 */

		openAddEntryForm() {
			const {openSideModal} = useModal();

			openSideModal(CatalogEditModal, {
				activeForm: this.addEntryForm,
				onSetAddEntryForm: this.setAddEntryForm,
				onAddEntryFormSuccess: this.addEntryFormSuccess,
			});
		},
		/**
		 * When the add entry modal is closed
		 */
		closeAddEntryForm() {
			const {closeSideModal} = useModal();
			closeSideModal(CatalogEditModal);
			this.addEntryForm.fields.find(
				(f) => f.name === 'submissionIds',
			).selected = [];
		},

		/**
		 * Add a filter
		 *
		 * Only one filter can be active at a time because setting features
		 * and new releases is done on a per-category basis.
		 *
		 * @param {String} param
		 * @param {mixed} value
		 */
		addFilter(param, value) {
			let newFilters = {};
			newFilters[param] = value;
			this.activeFilters = newFilters;
		},

		/**
		 * Remove a filter
		 *
		 * Only one filter can be active at a time because setting features
		 * and new releases is done on a per-category basis.
		 *
		 * @param {String} param
		 * @param {mixed} value
		 */
		removeFilter(param, value) {
			this.activeFilters = {};
		},

		/**
		 * Is a filter currently active?
		 *
		 * @param {string} param The filter param
		 * @param {mixed} value The filter value
		 * @return {Boolean}
		 */
		isFilterActive(param, value) {
			if (!Object.keys(this.activeFilters).includes(param)) {
				return false;
			} else if (Array.isArray(this.activeFilters[param])) {
				return this.activeFilters[param].includes(value);
			} else {
				return this.activeFilters[param] === value;
			}
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
		 * Move an item down in the list
		 *
		 * @param {Object} item The item to move
		 */
		itemOrderDown(item) {
			var index = this.items.findIndex((obj) => {
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
		 * Move an item up in the list
		 *
		 * @param {Object} item The item to move
		 */
		itemOrderUp(item) {
			var index = this.items.findIndex((obj) => {
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
		 * Find a filter's configuration details by param and value
		 *
		 * @param {String} param The param of the filter to find
		 * @param {mixed} value The value of the filter to find
		 * @return {Object} The filter config object
		 */
		getFilter(param, value) {
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
		 * Update the add entry form when values change
		 *
		 * @param {String} formId
		 * @param {Object} data
		 */
		setAddEntryForm(formId, data) {
			let addEntryForm = {...this.addEntryForm};
			Object.keys(data).forEach(function (key) {
				addEntryForm[key] = data[key];
			});
			this.$emit('set', this.id, {addEntryForm});
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
		setFilter(param, value) {
			this.activeFilters = {};
			this.activeFilters[param] = value;
			this.get();
		},

		/**
		 * Update the list of items
		 *
		 * @param {Array} items
		 * @param {Number} itemsMax
		 */
		setItems(items, itemsMax) {
			this.$emit('set', this.id, {
				items,
				itemsMax,
			});
		},

		/**
		 * Update an item in the list
		 *
		 * @param {Object} updatedItem
		 */
		updateItem(updatedItem) {
			let items = this.items.map((item) => {
				return item.id === updatedItem.id ? updatedItem : item;
			});
			this.$emit('set', this.id, {items: items});
		},

		/**
		 * Set the sort order for get requests. This can change depending on
		 * whether the full catalog or a series/category is being viewed.
		 */
		updateSortOrder() {
			let getParams = {...this.getParams};
			if (
				Object.prototype.hasOwnProperty.call(this.activeFilters, 'categoryIds')
			) {
				const category = this.getFilter(
					'categoryIds',
					this.activeFilters.categoryIds,
				);
				getParams.orderBy = category.sortBy;
				getParams.orderDirection = category.sortDir || this.catalogSortDir;
			} else if (
				Object.prototype.hasOwnProperty.call(this.activeFilters, 'seriesIds')
			) {
				const series = this.getFilter(
					'seriesIds',
					this.activeFilters.seriesIds,
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
				const feature = item.featured.find((feature) => {
					return feature.assoc_type === this.filterAssocType;
				});
				if (feature) {
					feature.seq = seq;
					featured.push({
						id: item.id,
						seq: feature.seq,
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
					'X-Csrf-Token': pkp.currentUser.csrfToken,
				},
				data: {
					assocType: this.filterAssocType,
					assocId: this.filterAssocId,
					featured: featured,
				},
				error(r) {
					self.ajaxErrorCallback(r);
				},
				complete() {
					self.isLoading = false;
				},
			});
		},

		/**
		 * Toggle the ordering and save a new order
		 */
		toggleOrdering() {
			if (this.isOrdering) {
				this.setItemOrderSequence();
			}
			this.isOrdering = !this.isOrdering;
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.listPanel--catalog {
	&.-isLoading {
		// Hide the list when loading because the featured and new release
		// actions change depending on the filter used. This prevents a brief
		// period while a list is loading when a user may click on the featured/
		// new release actions on an item that isn't in the filter that's been
		// requested.
		.listPanel__content:after {
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
		.listPanel--catalog__columnLabel > span {
			opacity: 0;
		}
	}

	.listPanel__itemsList {
		padding-top: 0;
		padding-bottom: 0;
	}
}

.listPanel--catalog__headings {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin: 0.5rem -0.5rem 0 -1rem;
	padding-top: 0.5rem;
	border-top: @grid-border;
	font-size: @font-tiny;
	line-height: @line-tiny;
}

.listPanel--catalog__heading {
	width: 6rem;
	text-align: center;
}

.listPanel--catalog__columnLabels {
	position: relative;
	display: block;
	min-height: 3rem;
	background: @lift;
	border-bottom: @grid-border;
	font-size: @font-tiny;
	line-height: @line-tiny;

	.listPanel--catalog__columnLabel {
		position: absolute;
		top: 0;
		right: 8rem;
		width: 8rem;
		height: 100%;
		border-inline-start: @grid-border;
		line-height: 1rem;

		+ .listPanel--catalog__columnLabel {
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

.listPanel--catalog.-isOrdering {
	.pkpHeader__actions
		> button:not(.listPanel--catalog__orderToggle):not(
			.listPanel--catalog__orderCancel
		),
	.pkpSearch,
	.listPanel__itemActions--catalog,
	.listPanel__item--catalog:not(.-isFeatured),
	.orderer__dragDrop,
	.listPanel--catalog__headings {
		display: none;
	}

	.listPanel__itemSummary {
		margin-right: 8rem;
	}
}

[dir='rtl'] {
	.listPanel--catalog__columnLabels {
		.listPanel--catalog__columnLabel {
			right: auto;
			left: 8rem;

			+ .listPanel--catalog__columnLabel {
				right: auto;
				left: 0;
			}
		}
	}
}
</style>
