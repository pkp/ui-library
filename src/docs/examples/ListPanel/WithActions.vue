<template>
	<div class="pkpListPanel">
		<div class="pkpListPanel__header">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
			<ul class="pkpListPanel__actions">
				<li>
					<button @click.prevent="openModal">{{ i18n.openModal }}</button>
				</li>
				<li>
					<a href="http://example.org">{{ i18n.goToUrl }}</a>
				</li>
			</ul>
		</div>
		<ul class="pkpListPanel__items" aria-live="polite">
			<list-panel-item
				v-for="item in collection.items"
				:item="item"
			/>
		</ul>
	</div>
</template>

<script>
import ListPanel from './../../../components/ListPanel/ListPanel.vue';

export default {
	name: 'ListPanelWithActions',
	components: ListPanel.components,
	computed: ListPanel.computed,
	methods: ListPanel.methods,
	mounted: ListPanel.mounted,
	data: function () {
		return {
			id: 'ListPanelWithActions',
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
				title: 'List Panel with Actions',
				openModal: 'Open Modal',
				goToUrl: 'Go to URL',
			},
			lazyLoad: false,
			_lastGetRequest: null,
		};
	},
};
</script>
