<template>
	<div class="pkpListPanel">
		<div class="pkpListPanel__header">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
			<ul class="pkpListPanel__actions">
				<li>
					<a :href="addUrl">{{ i18n.add }}</a>
				</li>
			</ul>
		</div>
		<ul class="pkpListPanel__items" aria-live="polite">
			<li>One</li>
			<li>One</li>
			<li>One</li>
		</ul>
	</div>
</template>

<script>
import ListPanel from './../../../components/ListPanel.vue';

export default {
	name: 'ListPanelWithSearch',
	props: ['one', 'two'],
	components: ListPanel.components,
	computed: ListPanel.computed,
	methods: ListPanel.methods,
	mounted: ListPanel.mounted,
	data: function () {
		return {
			id: 'ListPanelWithSearch',
			collection: {
				items: [],
				maxItems: null,
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
				add: 'Add Item',
			},
			lazyLoad: false,
			_lastGetRequest: null,
		};
	},
};
</script>
