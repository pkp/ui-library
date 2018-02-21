<template>
	<div class="pkpListPanel">
		<div class="pkpListPanel__header -pkpClearfix">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
			<ul class="pkpListPanel__actions">
				<li>
					<pkp-button
						:label="i18n.openModal"
						@click="openModal"
					/>
				</li>
				<li>
					<pkp-button
						element="a"
						:href="url"
						:label="i18n.goToUrl"
					/>
				</li>
			</ul>
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
import ListPanelData from './data.js';
import PkpButton from '@/components/Button/Button.vue';

export default {
	name: 'ListPanelWithActions',
	extends: ListPanel,
	components: {
		PkpButton,
	},
	data: function () {
		return Object.assign(ListPanelData.baseData(), {
			id: 'ListPanelWithActions',
			url: 'http://example.org',
			i18n: {
				title: 'List Panel with Actions',
				openModal: 'Open Modal',
				goToUrl: 'Go to URL',
			},
		});
	},
};
</script>
