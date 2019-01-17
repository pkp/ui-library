<template>
	<div class="pkpListPanel">
		<div class="pkpListPanel__header -pkpClearfix">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
			<list-panel-search
				@searchPhraseChanged="setSearchPhrase"
				:searchPhrase="searchPhrase"
				:i18n="i18n"
			/>
		</div>
		<ul class="pkpListPanel__items" aria-live="polite">
			<list-panel-item
				v-for="item in items"
				:key="item.id"
				:item="item"
			/>
		</ul>
	</div>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import ListPanelSearch from '@/components/ListPanel/ListPanelSearch.vue';
import {data} from '../config';
import {search} from '../helpers/i18n';
import items from '../helpers/items';

export default {
	extends: ListPanel,
	components: {
		ListPanelSearch
	},
	data() {
		return {
			...data,
			id: 'PreviewListPanelSearch',
			items: items,
			itemsMax: 10,
			i18n: {...data.i18n, ...search}
		};
	}
};
</script>
