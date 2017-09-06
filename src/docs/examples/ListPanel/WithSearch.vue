<template>
	<div class="pkpListPanel">
		<div class="pkpListPanel__header">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
			<list-panel-search
				@searchPhraseChanged="setSearchPhrase"
				:searchPhrase="searchPhrase"
				:i18n="i18n"
			/>
		</div>
		<ul class="pkpListPanel__items" aria-live="polite">
			<list-panel-item
				v-for="item in collection.items"
				:key="item.id"
				:item="item"
			/>
		</ul>
	</div>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import ListPanelSearch from '@/components/ListPanel/ListPanelSearch.vue';
import ListPanelData from './data.js';

export default {
	name: 'ListPanelWithSearch',
	extends: ListPanel,
	components: {
		ListPanelSearch,
	},
	data: function () {
		return Object.assign(ListPanelData.baseData(), {
			id: 'ListPanelWithSearch',
			i18n: {
				title: 'List Panel with Search',
				search: 'Search',
				clearSearch: 'Clear search phrase',
			},
		});
	},
};
</script>
