<template>
	<div class="pkpListPanel">
		<div class="pkpListPanel__header">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
		</div>
		<ul class="pkpListPanel__items" aria-live="polite">
			<list-panel-item-select
				v-for="item in collection.items"
				:key="item.id"
				:item="item"
				:inputName="inputName"
			/>
		</ul>
	</div>
</template>

<script>
import ListPanel from './../../../components/ListPanel/ListPanel.vue';
import ListPanelItemSelect from './../../../components/ListPanel/ListPanelItemSelect.vue';

export default {
	extends: ListPanel,
	name: 'ListPanelWithSelection',
	components: {
		ListPanelItemSelect,
	},
	data: function () {
		return {
			id: 'ListPanelWithSelection',
			collection: {
				items: [
					{id: 0, title: 'Item one'},
					{id: 1, title: 'Item two'},
					{id: 2, title: 'Item three'},
				],
				maxItems: 10,
			},
			inputName: 'example-field-name',
			i18n: {
				title: 'List Panel with Selection',
			},
		};
	},
};
</script>
