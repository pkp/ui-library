<template>
	<div class="pkpListPanel">
		<div class="pkpListPanel__header -pkpClearfix">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
		</div>
		<div class="pkpListPanel__body -pkpClearfix">
			<list-panel-notice
				v-if="i18n.notice"
				type="info"
				:notice="i18n.notice"
			/>
			<div class="pkpListPanel__content">
				<ul class="pkpListPanel__items" aria-live="polite">
					<list-panel-item
						v-for="item in items"
						:key="item.id"
						:item="item"
					/>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import ListPanelNotice from '@/components/ListPanel/ListPanelNotice.vue';
import {data} from '../config';
import {notice} from '../helpers/i18n';
import items from '../helpers/items';

export default {
	extends: ListPanel,
	components: {
		ListPanelNotice
	},
	data() {
		return {
			...data,
			id: 'PreviewListPanelCount',
			items: items,
			itemsMax: 10,
			i18n: {...data.i18n, ...notice}
		};
	}
};
</script>
