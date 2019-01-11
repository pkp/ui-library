<template>
	<div class="pkpListPanel__filter pkpListPanel__filter--catalogSubmissions" :class="{'-isVisible': isVisible}" :aria-hidden="!isVisible">
		<div class="pkpListPanel__filterHeader pkpListPanel__filterHeader--catalogSubmissions" tabindex="0">
			<icon icon="filter" :inline="true" />
			{{ i18n.filter }}
		</div>
		<div class="pkpListPanel__filterOptions pkpListPanel__filterOptions--catalogSubmissions">
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
							<icon icon="times-circle-o" :inline="true" />
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
	name: 'CatalogSubmissionsListFilter',
	components: {
		Icon
	},
	props: ['isVisible', 'filters', 'i18n'],
	methods: {
		/**
		 * Add a filter
		 *
		 * Only allow a single filter to be enabled at a time, so that the ordering
		 * features can be applied to a single category or series.
		 */
		filterBy: function(type, val) {
			if (this.isFilterActive()) {
				this.clearFilters();
				return;
			}
			let filters = {};
			filters[type] = [val];
			this.filterList(filters);
		}
	}
};
</script>
