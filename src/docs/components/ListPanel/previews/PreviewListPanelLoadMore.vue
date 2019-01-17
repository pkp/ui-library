<template>
	<div class="pkpListPanel">
		<div class="pkpListPanel__header -pkpClearfix">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
		</div>
		<ul class="pkpListPanel__items" aria-live="polite">
			<list-panel-item
				v-for="item in items"
				:key="item.id"
				:item="item"
			/>
		</ul>
		<div class="pkpListPanel__footer -pkpClearfix">
			<list-panel-load-more
				v-if="canLoadMore"
				@loadMore="loadMore"
				:isLoading="isLoading"
				:i18n="i18n"
			/>
			<list-panel-count
				:count="itemCount"
				:total="this.itemsMax"
				:i18n="i18n"
			/>
		</div>
	</div>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import ListPanelCount from '@/components/ListPanel/ListPanelCount.vue';
import ListPanelLoadMore from '@/components/ListPanel/ListPanelLoadMore.vue';
import {data} from '../config';
import {count, loadMore} from '../helpers/i18n';
import items from '../helpers/items';

export default {
	extends: ListPanel,
	components: {
		ListPanelCount,
		ListPanelLoadMore
	},
	data() {
		return {
			...data,
			id: 'PreviewListPanelLoadMore',
			items: items,
			itemsMax: 10,
			i18n: {
				title: 'List Panel with Load More',
				...data.i18n,
				...count,
				...loadMore
			}
		};
	}
};
</script>
