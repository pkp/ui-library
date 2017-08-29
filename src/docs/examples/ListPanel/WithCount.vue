<template>
	<div class="pkpListPanel">
		<div class="pkpListPanel__header">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
		</div>
		<ul class="pkpListPanel__items" aria-live="polite">
			<list-panel-item
				v-for="item in collection.items"
				:key="item.id"
				:item="item"
			/>
		</ul>
		<div class="pkpListPanel__footer">
			<list-panel-count
				:count="itemCount"
				:total="this.collection.maxItems"
				:i18n="i18n"
			/>
		</div>
	</div>
</template>

<script>
import ListPanel from './../../../components/ListPanel/ListPanel.vue';
import ListPanelCount from './../../../components/ListPanel/ListPanelCount.vue';
import ListPanelData from './data.js';

export default {
	name: 'ListPanelWithCount',
	extends: ListPanel,
	components: {
		ListPanelCount,
	},
	data: function () {
		return Object.assign(ListPanelData.baseData(), {
			id: 'ListPanelWithCount',
			i18n: {
				title: 'List Panel with Count',
				itemsOfTotal: '{$count} of {$total} items',
				itemCount: '{$count} items',
			},
		});
	},
};
</script>
