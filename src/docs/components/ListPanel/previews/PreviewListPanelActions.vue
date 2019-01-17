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
						href="https://example.org"
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
import PkpButton from '@/components/Button/Button.vue';
import {data} from '../config';
import items from '../helpers/items';

export default {
	extends: ListPanel,
	components: {
		PkpButton
	},
	data() {
		return {
			...data,
			id: 'PreviewListPanelCount',
			items: items,
			itemsMax: 10,
			i18n: {
				...data.i18n,
				title: 'List Panel with Actions',
				openModal: 'Open Modal',
				goToUrl: 'Go to URL'
			}
		};
	},
	methods: {
		openModal() {
			alert('You opened this modal.');
		}
	}
};
</script>
