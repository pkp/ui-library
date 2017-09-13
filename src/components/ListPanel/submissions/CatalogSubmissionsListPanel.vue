<template>
	<div class="pkpListPanel pkpListPanel--submissions pkpListPanel--catalogSubmissions" :class="classStatus">
		<div class="pkpListPanel__header -pkpClearfix">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
			<ul class="pkpListPanel__actions">
				<li>
					<button @click.prevent="toggleFilter" class="pkpButton" :class="{'-isActive': isFilterVisible}">
						<span class="fa fa-filter"></span>
						{{ i18n.filter }}
					</button>
				</li>
				<li class="pkpListPanel__orderToggle" v-if="canOrder">
					<button @click.prevent="toggleOrdering" class="pkpButton" :class="{'-isActive': isOrdering}">
						<span class="fa fa-sort"></span>
						<template v-if="isOrdering">
							{{ i18n.saveFeatureOrder }}
						</template>
						<template v-else>
							{{ i18n.orderFeatures }}
						</template>
					</button>
				</li>
				<li v-if="isOrdering" class="pkpListPanel__orderToggleCancel">
					<button @click.prevent="cancelOrdering" class="pkpButton -isWarnable">
						{{ i18n.cancel }}
					</button>
				</li>
				<li>
					<button @click.prevent="openNewEntryModal" class="pkpButton">
						{{ i18n.add }}
					</button>
				</li>
			</ul>
			<list-panel-search
				@searchPhraseChanged="setSearchPhrase"
				:searchPhrase="searchPhrase"
				:i18n="i18n"
			/>
		</div>
		<div class="pkpListPanel__body -pkpClearfix pkpListPanel__body--catalogSubmissions">
			<div v-if="isOrdering" class="pkpListPanel__notice pkpListPanel__notice--info" tabindex="0">
				<span class="fa fa-info-circle"></span>
				{{ featuredNotice }}
			</div>
			<catalog-submissions-list-filter
				@filterList="updateFilter"
				:isVisible="isFilterVisible"
				:filters="filters"
				:i18n="i18n"
			/>
			<div class="pkpListPanel__content pkpListPanel__content--catalogSubmissions">
				<div v-if="collection.items.length" class="pkpListPanel__columnLabels pkpListPanel__columnLabels--catalogSubmissions">
					<span class="pkpListPanel__columnLabel">
						<span>{{ featuredLabel }}</span>
					</span>
					<span class="pkpListPanel__columnLabel">
						<span>{{ newReleaseLabel }}</span>
					</span>
				</div>
				<ul class="pkpListPanel__items" aria-live="polite">
					<draggable v-model="collection.items" :options="draggableOptions" @start="drag=true" @end="drag=false">
						<catalog-submissions-list-item
							v-for="item in collection.items"
							@catalogFeatureUpdated="sortByFeaturedSequence"
							@itemOrderUp="itemOrderUp"
							@itemOrderDown="itemOrderDown"
							:key="item.id"
							:item="item"
							:catalogEntryUrl="catalogEntryUrl"
							:filterAssocType="filterAssocType"
							:filterAssocId="filterAssocId"
							:isOrdering="isOrdering"
							:apiPath="apiPath"
							:i18n="i18n"
						/>
					</draggable>
				</ul>
			</div>
		</div>
		<div class="pkpListPanel__footer -pkpClearfix">
			<list-panel-load-more
				v-if="canLoadMore"
				@loadMore="loadMore"
				:isLoading="isLoading"
				:i18n="i18n"
			/>
			<list-panel-count
				:count="itemCount"
				:total="this.collection.maxItems"
				:i18n="i18n"
			/>
		</div>
	</div>
</template>

<script>
import SubmissionsListPanel from '@/components/ListPanel/submissions/SubmissionsListPanel.vue';
import CatalogSubmissionsListItem from '@/components/ListPanel/submissions/CatalogSubmissionsListItem.vue';
import CatalogSubmissionsListFilter from '@/components/ListPanel/submissions/CatalogSubmissionsListFilter.vue';
import draggable from 'vuedraggable';

export default {
	extends: SubmissionsListPanel,
	name: 'CatalogSubmissionsListPanel',
	components: {
		CatalogSubmissionsListItem,
		CatalogSubmissionsListFilter,
		draggable,
	},
	data: function () {
		return {
			catalogSortBy: '',
			catalogSortDir: '',
		};
	},
	computed: {
		/**
		 * Can any monographs be ordered?
		 */
		canOrder: function () {
			for (const item of this.collection.items) {
				for (const feature of item.featured) {
					if (feature.assoc_type === this.filterAssocType) {
						return true;
					}
				}
			}
			return false;
		},

		/**
		 * Set status on the component
		 */
		classStatus: function () {
			return { '-isLoading': this.isLoading, '-isOrdering': this.isOrdering };
		},

		/**
		 * Return the appropriate label for the featured column depending on
		 * if we're looking at a filtered view
		 */
		featuredLabel: function () {
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
		 */
		newReleaseLabel: function () {
			if (this.filterAssocType === pkp.const.ASSOC_TYPE_CATEGORY) {
				return this.i18n.newReleaseCategory;
			} else if (this.filterAssocType === pkp.const.ASSOC_TYPE_SERIES) {
				return this.i18n.newReleaseSeries;
			}
			return this.i18n.newRelease;
		},

		/**
		 * Return the appropriate label for the featured column depending on
		 * if we're looking at a filtered view
		 */
		featuredNotice: function () {
			const getFilter = (filter) => {
				return filter.val === this.filterAssocId;
			};

			let filter = null;
			if (this.filterAssocType === pkp.const.ASSOC_TYPE_CATEGORY) {
				filter = this.filters.categoryIds.filters.find(getFilter);
			} else if (this.filterAssocType === pkp.const.ASSOC_TYPE_SERIES) {
				filter = this.filters.seriesIds.filters.find(getFilter);
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
		 * @return int
		 */
		filterAssocType: function () {
			if (this.filterParams.hasOwnProperty('categoryIds')) {
				return pkp.const.ASSOC_TYPE_CATEGORY;
			} else if (this.filterParams.hasOwnProperty('seriesIds')) {
				return pkp.const.ASSOC_TYPE_SERIES;
			}
			return pkp.const.ASSOC_TYPE_PRESS;
		},

		/**
		 * The assoc_id value which matches the current filter
		 *
		 * The assoc_id will match the pressId, categoryId or seriesId
		 *
		 * @return int
		 */
		filterAssocId: function () {
			if (this.filterParams.hasOwnProperty('categoryIds')) {
				return this.filterParams.categoryIds[0];
			} else if (this.filterParams.hasOwnProperty('seriesIds')) {
				return this.filterParams.seriesIds[0];
			}
			// in OMP, there's only one press context and it's always 1
			return 1;
		},
	},
	methods: {
		/**
		 * Open the new catalog entry modal
		 */
		openNewEntryModal: function () {

			var opts = {
				title: this.i18n.add,
				url: this.addUrl,
			};

			$('<div id="' + $.pkp.classes.Helper.uuid() + '" ' +
					'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>')
				.pkpHandler('$.pkp.controllers.modal.AjaxModalHandler', opts);
		},

		/**
		 * Sort submissions by featured sequence
		 */
		sortByFeaturedSequence: function () {
			this.collection.items.sort((a, b) => {
				const getFeatured = (feature) => {
					return feature.assoc_type === this.filterAssocType;
				};
				const featuredA = a.featured.find(getFeatured);
				const seqA = featuredA && featuredA.hasOwnProperty('seq') ? featuredA.seq : 99999999;
				const featuredB = a.featured.find(getFeatured);
				const seqB = featuredB && featuredB.hasOwnProperty('seq') ? featuredB.seq : 99999999;
				if (seqA < seqB) {
					return -1;
				}
				if (seqA > seqB) {
					return 1;
				}
				return 0;
			});
		},

		/**
		 * Set the sort order for get requests. This can change depending on
		 * whether the full catalog or a series/category is being viewed.
		 */
		updateSortOrder: function () {
			if (this.filterParams.hasOwnProperty('categoryIds')) {
				const cat = this.filters.categoryIds.filters.find((filter) => {
					return filter.val === this.filterParams.categoryIds[0];
				});
				this.getParams.orderBy = cat.sortBy;
				this.getParams.orderDirection = cat.sortDir || this.catalogSortDir;
			} else if (this.filterParams.hasOwnProperty('seriesIds')) {
				var series = this.filters.seriesIds.filters.find((filter) => {
					return filter.val === this.filterParams.seriesIds[0];
				});
				this.getParams.orderBy = series.sortBy || this.catalogSortBy;
				this.getParams.orderDirection = series.sortDir || this.catalogSortDir;
			} else {
				this.getParams.orderBy = this.catalogSortBy;
				this.getParams.orderDirection = this.catalogSortDir;
			}
		},

		/**
		 * Update the order sequence property for items in this list based on
		 * the new order of items
		 */
		setItemOrderSequence: function () {
			const featured = [];
			let seq = 0;
			for (const item of this.collection.items) {
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

			const self = this;
			$.ajax({
				url: this.getApiUrl(this.apiPath + '/' + 'saveFeaturedOrder'),
				type: 'POST',
				data: {
					assocType: this.filterAssocType,
					assocId: this.filterAssocId,
					featured: featured,
					csrfToken: $.pkp.currentUser.csrfToken,
				},
				error: function (r) {
					self.ajaxErrorCallback(r);
				},
				complete: function (r) {
					self.isLoading = false;
				},
			});
		},

		/**
		 * Override the ListPanel method to only handle featured items
		 */
		itemOrderDown: function (data) {
			const featuredItems = this.collection.items.filter((item) => {
				return item.featured.find((feature) => {
					return feature.assoc_type === this.filterAssocType;
				});
			});
			const index = this.collection.items.findIndex((item) => {
				return item.id == data.id;
			});
			if (index === featuredItems.length - 1) {
				return;
			}
			this.collection.items.splice(index + 1, 0, this.collection.items.splice(index, 1)[0]);
			this.itemOrderResetFocus(data.id, 'down');
		},
	},
	created: function () {
		/**
		 * When a filter is set, update the sort order to match the setting of
		 * the series or catalog
		 *
		 * Set this watcher before the mounted hook so that the get params are
		 * updated before the ajax request is made in SubmissionListPanel.mounted.
		 */
		this.$watch('filterParams', function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.updateSortOrder();
		});

	},
	mounted: function () {
		/**
		 * Resort featured items to the top of the collection whenever it
		 * changes
		 */
		this.sortByFeaturedSequence();
		this.$watch('collection', function (newVal, oldVal) {
			if (oldVal === newVal) {
				return;
			}
			this.sortByFeaturedSequence();
		});

		/**
		 * Update when a new entry has been added to the catalog
		 */
		var self = this;
		pkp.eventBus.$on('catalogEntryAdded', function (data) {
			self.get();
		});
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpListPanel--catalogSubmissions {

  // Make room in a crowded header
  .pkpListPanel__search input {
    width: 20em;
  }

  &.-isLoading {

    // Hide the list when loading because the featured and new release
    // actions change depending on the filter used. This prevents a brief
    // period while a list is loading when a user may click on the featured/
    // new release actions on an item that isn't in the filter that's been
    // requested.
    .pkpListPanel__content--catalogSubmissions:after {
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
		.pkpListPanel__columnLabel > span {
			opacity: 0;
		}
  }
}

.pkpListPanel__columnLabels--catalogSubmissions {

  .pkpListPanel__columnLabel {
    position: absolute;
    top: 0;
    right: @base * 8;
    width: @base * 8;
    height: 100%;
    border-left: @grid-border;
    line-height: @base;

    + .pkpListPanel__columnLabel {
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

.pkpListPanel--catalogSubmissions.-isOrdering {

  .pkpListPanel__actions > li:not(.pkpListPanel__orderToggle):not(.pkpListPanel__orderToggleCancel),
  .pkpListPanel__search,
  .pkpListPanelItem__selectItem,
  .pkpListPanelItem__actions,
  .pkpListPanel__columnLabels {
    display: none;
  }

  .pkpListPanelItem--submission__item {
    padding-right: 0;
  }

  .pkpListPanelItem:not(.-isFeatured) {
    display: none;
  }
}
</style>
