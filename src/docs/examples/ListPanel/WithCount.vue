<template>
	<div class="pkpListPanel">
		<div class="pkpListPanel__header">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
		</div>
		<ul class="pkpListPanel__items" aria-live="polite">
			<list-panel-item
				v-for="item in collection.items"
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

export default {
	name: 'ListPanelWithCount',
	components: ListPanel.components,
	computed: ListPanel.computed,
	methods: ListPanel.methods,
	mounted: ListPanel.mounted,
	data: function () {
		return {
			id: 'ListPanelWithCount',
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
				title: 'List Panel with Count',
				itemsOfTotal: '{$count} of {$total} items',
				itemCount: '{$count} items',
			},
			lazyLoad: false,
			_lastGetRequest: null,
		};
	},
};
</script>
