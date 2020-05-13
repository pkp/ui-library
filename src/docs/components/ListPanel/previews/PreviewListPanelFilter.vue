<template>
	<list-panel :items="items" :isSidebarVisible="isSidebarVisible">
		<pkp-header slot="header">
			<h2>List Panel with Filter</h2>
			<template slot="actions">
				<pkp-button :isActive="isSidebarVisible" @click="toggleFilters">
					<icon icon="filter" :inline="true" />
					Filters
				</pkp-button>
			</template>
		</pkp-header>
		<template slot="sidebar">
			<pkp-header :isOneLine="false">
				<h3>
					<icon icon="filter" :inline="true" />
					Filters
				</h3>
			</pkp-header>
			<pkp-filter
				v-for="filter in colorFilters"
				:key="filter.value"
				:param="filter.param"
				:title="filter.title"
				:value="filter.value"
				:isFilterActive="isFilterActive(filter.param, filter.value)"
				@add-filter="addFilter"
				@remove-filter="removeFilter"
			/>
		</template>
	</list-panel>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import PkpFilter from '@/components/Filter/Filter.vue';
import PkpHeader from '@/components/Header/Header.vue';
import items from '../helpers/items';

export default {
	components: {
		ListPanel,
		PkpFilter,
		PkpHeader
	},
	data() {
		return {
			activeFilters: {},
			colorFilters: [
				{
					param: 'color',
					title: 'Red',
					value: 'red'
				},
				{
					param: 'color',
					title: 'Green',
					value: 'green'
				},
				{
					param: 'color',
					title: 'Blue',
					value: 'blue'
				}
			],
			isSidebarVisible: false,
			items: [...items]
		};
	},
	methods: {
		toggleFilters() {
			this.isSidebarVisible = !this.isSidebarVisible;
		},
		addFilter(param, value) {
			let activeFilters = {...this.activeFilters};
			activeFilters[param] = value;
			this.activeFilters = activeFilters;
		},
		removeFilter(param, value) {
			let activeFilters = {...this.activeFilters};
			delete activeFilters[param];
			this.activeFilters = activeFilters;
		},
		isFilterActive: function(param, value) {
			if (!Object.keys(this.activeFilters).includes(param)) {
				return false;
			}
			if (Array.isArray(this.activeFilters[param])) {
				return this.activeFilters[param].includes(value);
			}
			return this.activeFilters[param] === value;
		}
	}
};
</script>
