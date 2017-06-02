<template>
	<div class="pkpListPanel">
		<div class="pkpListPanel__header">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
		</div>
		<ul class="pkpListPanel__items" aria-live="polite">
			<li>Two</li>
			<li>Two</li>
			<li>Two</li>
		</ul>
	</div>
</template>

<script>
import ListPanel from './../../../components/ListPanel.vue';

export default _.extend({}, ListPanel, {
	// name: 'ExampleListPanel',
	components: ListPanel.components,
	computed: ListPanel.computed,
	methods: ListPanel.methods,
	mounted: ListPanel.mounted,
	data: function () {
		return {
			id: 'ExampleListPanel',
			collection: {
				items: [],
				maxItems: null,
			},
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
				title: 'Example List Panel',
			},
			lazyLoad: false,
			_lastGetRequest: null,
		};
	},
});
</script>

<style lang="less">
.pkpListPanel__title {
	background: blue;
}
</style>
