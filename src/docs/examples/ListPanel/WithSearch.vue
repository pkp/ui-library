<template>
	<div class="pkpListPanel">
		<div class="pkpListPanel__header">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
			<list-panel-search
				@searchPhraseChanged="setSearchPhrase"
				:isSearching="isSearching"
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
import ListPanel from './../../../components/ListPanel/ListPanel.vue';
import ListPanelSearch from './../../../components/ListPanel/ListPanelSearch.vue';

export default {
	name: 'ListPanelWithSearch',
	components: {
		...ListPanel.components,
		ListPanelSearch,
	},
	computed: ListPanel.computed,
	methods: ListPanel.methods,
	mounted: ListPanel.mounted,
	data: function () {
		return {
			id: 'ListPanelWithSearch',
			collection: {
				items: [
					{title: 'Item one'},
					{title: 'Item two'},
					{title: 'Item three'},
				],
				maxItems: 10,
			},
			addUrl: 'http://example.org',
			filterParams: {},
			searchPhrase: '',
			isLoading: false,
			isSearching: false,
			isOrdering: false,
			isFilterVisible: false,
			count: 20,
			offset: 0,
			apiPath: '',
			getParams: {},
			i18n: {
				title: 'List Panel with Search',
				search: 'Search',
				clearSearch: 'Clear search phrase',
			},
			lazyLoad: false,
			_lastGetRequest: null,
		};
	},
};
</script>
