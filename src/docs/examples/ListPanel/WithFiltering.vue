<template>
	<div class="pkpListPanel">
		<div class="pkpListPanel__header">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
			<ul class="pkpListPanel__actions">
				<li>
					<button @click.prevent="toggleFilter" class="pkpButton" :class="{'-isActive': isFilterVisible}">
						<span class="fa fa-filter"></span>
						{{ i18n.filter }}
					</button>
				</li>
			</ul>
		</div>
		<div class="pkpListPanel__body pkpListPanel__body--submissions">
			<list-panel-filter
				@filterList="updateFilter"
				:isVisible="isFilterVisible"
				:filters="filters"
				:i18n="i18n"
			/>
			<div class="pkpListPanel__content pkpListPanel__content--submissions">
				<ul class="pkpListPanel__items" aria-live="polite">
					<list-panel-item
						v-for="item in collection.items"
						:key="item.id"
						:item="item"
					/>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import ListPanel from './../../../components/ListPanel/ListPanel.vue';
import ListPanelFilter from './../../../components/ListPanel/ListPanelFilter.vue';
import ListPanelData from './data.js';

export default {
	name: 'ListPanelWithFiltering',
	extends: ListPanel,
	components: {
		ListPanelFilter,
	},
	data: function () {
		return Object.assign(ListPanelData.baseData(), {
			id: 'ListPanelWithFiltering',
			filters: {
				example: {
					heading: 'Colors',
					filters: [
						{
							title: 'Red',
							param: 'isRed',
							val: true,
						},
						{
							title: 'Blue',
							param: 'isBlue',
							val: true,
						},
						{
							title: 'Green',
							param: 'isGreen',
							val: true,
						},
					],
				},
			},
			i18n: {
				title: 'List Panel with Filtering',
				filter: 'Filter',
				filterRemove: 'Clear filter: {$filterTitle}',
			},
		});
	},
};
</script>
