<template>
	<div class="pkpListPanel">
		<div class="pkpListPanel__header">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
			<ul class="pkpListPanel__actions">
				<li>
					<button @click.prevent="openModal" class="pkpButton">{{ i18n.openModal }}</button>
				</li>
				<li>
					<a href="http://example.org" class="pkpButton">{{ i18n.goToUrl }}</a>
				</li>
			</ul>
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
import ListPanelData from './data.js';

export default {
	name: 'ListPanelWithActions',
	extends: ListPanel,
	data: function () {
		return Object.assign(ListPanelData.baseData(), {
			id: 'ListPanelWithActions',
			i18n: {
				title: 'List Panel with Actions',
				openModal: 'Open Modal',
				goToUrl: 'Go to URL',
			},
		});
	},
};
</script>
