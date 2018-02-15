<template>
	<div class="pkpListPanel">
		<div class="pkpListPanel__header -pkpClearfix">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
		</div>
		<ul class="pkpListPanel__items" aria-live="polite">
			<expandable-list-panel-item
				v-for="item in items"
				:key="item.id"
				:item="item"
				:i18n="i18n"
			/>
		</ul>
	</div>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import ExpandableListPanelItem from './WithExpander_ExpandableListPanelItem.vue';
import ListPanelData from './data.js';

export default {
	name: 'ListPanelWithExpander',
	extends: ListPanel,
	components: {
		ExpandableListPanelItem,
	},
	data: function () {
		return Object.assign(ListPanelData.baseData(), {
			id: 'ListPanelWithExpander',
			i18n: {
				title: 'List Panel with Expander',
				viewMore: 'Show more details about {$name}',
				viewLess: 'Hide expanded details about {$name}',
			},
		});
	},
};
</script>
