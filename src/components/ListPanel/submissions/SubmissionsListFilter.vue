<template>
	<div class="pkpListPanel__filter pkpListPanel__filter--submissions" :class="{'-isVisible': isVisible}" :aria-hidden="!isVisible">
		<div class="pkpListPanel__filterHeader pkpListPanel__filterHeader--submissions" tabindex="0">
			<icon icon="filter" :inline="true" />
			{{ i18n.filter }}
		</div>
		<div class="pkpListPanel__filterOptions pkpListPanel__filterOptions--submissions">
			<div v-for="(filter, index) in filters" :key="index" class="pkpListPanel__filterSet">
				<div v-if="filter.heading" class="pkpListPanel__filterSetLabel">
					{{ filter.heading }}
				</div>
				<ul>
					<li v-for="filterItem in filter.filters" :key="filterItem.param + filterItem.val">
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
		Icon
	},
	props: ['isVisible', 'filters', 'i18n'],
	methods: {
		/**
		 * Override ListPanelFilter.filterBy to handle special
		 * logic around the `isIncomplete` filter.
		 */
		filterBy: function(type, val) {
			// Don't allow other filters to be active when isIncomplete is active
			if (type === 'isIncomplete') {
				if (this.isFilterActive('isIncomplete', true)) {
					this.filterList({});
				} else {
					this.filterList({isIncomplete: [true]});
				}
				return;
			}
			let filters = Object.assign({}, this.activeFilters);
			// Remove isIncomplete filter when other filters activated
			if (filters.isIncomplete !== undefined) {
				filters.isIncomplete = [];
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
		}
	}
};
</script>
