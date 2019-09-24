<template>
	<div class="pkpListPanel__filter pkpListPanel__filter--submissions" :class="{'-isVisible': isVisible}" :aria-hidden="!isVisible">
		<div class="pkpListPanel__filterHeader pkpListPanel__filterHeader--submissions" tabindex="0">
			<icon icon="filter" :inline="true" />
			{{ i18n.filter }}
		</div>
		<div class="pkpListPanel__filterOptions pkpListPanel__filterOptions--submissions">
			<div v-for="filter in filters" class="pkpListPanel__filterSet">
				<div v-if="filter.heading" class="pkpListPanel__filterSetLabel">
					{{ filter.heading }}
				</div>
				<ul>
					<li v-for="filterItem in filter.filters">
						<a href="#"
							@click.prevent.stop="filterBy(filterItem.param, filterItem.val)"
							class="pkpListPanel__filterLabel"
							:class="{'-isActive': isFilterActive(filterItem.param, filterItem.val)}"
							:tabindex="tabIndex"
						>{{ filterItem.title }}</a>
						<button
							v-if="isFilterActive(filterItem.param, filterItem.val)"
							href="#"
							class="pkpListPanel__filterRemove"
							@click.prevent.stop="clearFilter(filterItem.param, filterItem.val)"
						>
							<icon icon="times-circle-o" />
							<span class="-screenReader">{{ __('filterRemove', {filterTitle: filterItem.title}) }}</span>
						</button>
						<ul>
							<li v-for="subFilter in filterItem.subfilters">
								<a href="#"
									@click.prevent.stop="filterBy(subFilter.param, subFilter.val)"
									class="pkpListPanel__filterLabel pkpListPanel__subFilter"
									:class="{'-isActive': isFilterActive(subFilter.param, subFilter.val)}"
									:tabindex="tabIndex"
									>{{ subFilter.title }}</a>
									<button
										v-if="isFilterActive(subFilter.param, subFilter.val)"
										href="#"
										class="pkpListPanel__filterRemove"
										@click.prevent.stop="clearFilter(subFilter.param, subFilter.val)"
									>
										<icon icon="times-circle-o" />
										<span class="-screenReader">{{ __('filterRemove', {filterTitle: subFilter.title}) }}</span>
									</button>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import ListPanelFilter from '@/components/ListPanel/ListPanelFilter.vue';
import Icon from '@/components/Icon/Icon.vue';

export default {
	extends: ListPanelFilter,
	name: 'SubmissionsListFilter',
	components: {
		Icon,
	},
	props: ['isVisible', 'filters', 'i18n'],
	methods: {
		/**
		 * Override ListPanelFilter.filterBy to handle special
		 * logic around exclusive filters.
		 */
		filterBy: function (type, val) {
			// Don't allow other filters to be active when one exclusive filter is active except daysInactive and sectionIds
			let exclusiveFilters = ['isIncomplete', 'needsAction', 'revisionsRequested', 'revisionsSubmitted', 'isOverdue'];
			let filters = Object.assign({}, this.activeFilters);

			if (exclusiveFilters.includes(type)) {
				if (this.isFilterActive(type, true)) {
					this.clearFilter(type, val);
				} else {
					// Save daysInactive and sectionIds
					let saveFilters = {};
					if (filters.daysInactive !== undefined) {
						saveFilters.daysInactive = filters.daysInactive;
					}
					if (filters.sectionIds !== undefined) {
						saveFilters.sectionIds = filters.sectionIds;
					}
					saveFilters[type] = [true];
					this.filterList(saveFilters);
				}
				return;
			}

			// Remove exclusive filters when other filters activated except daysInactive and sectionIds
			if (!(['daysInactive', 'sectionIds'].includes(type))) {
				exclusiveFilters.forEach(function (filter) {
					if (filters[filter] !== undefined) {
						filters[filter] = [];
					}
				});
			}
			if (this.isFilterActive(type, val)) {
				this.clearFilter(type, val);
			} else {
				if (filters[type] === undefined) {
					filters[type] = [];
				}
				filters[type].push(val);
				this.filterList(filters);
			}
		},
	},
};
</script>
