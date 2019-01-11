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
import ExpandableListPanelItem from './PreviewListPanelExpandable_ListPanelItem.vue';
import {data} from '../config';
import {expandable} from '../helpers/i18n';
import items from '../helpers/items';

export default {
	extends: ListPanel,
	components: {
		ExpandableListPanelItem
	},
	data() {
		return {
			...data,
			id: 'PreviewListPanelExpandable',
			items: items,
			itemsMax: 10,
			i18n: {...data.i18n, ...expandable}
		};
	}
};
</script>
