<template>
	<div class="pkpListPanel">
		<div class="pkpListPanel__header -pkpClearfix">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
		</div>
		<div class="pkpListPanel__body -pkpClearfix">
			<list-panel-notice
				v-if="i18n.notice"
				:notice="i18n.notice"
				:type="noticeType"
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
import ListPanelData from './data.js';

export default {
	name: 'ListPanelWithNotice',
	extends: ListPanel,
	components: {
		ListPanelNotice,
	},
	data: function () {
		return Object.assign(ListPanelData.baseData(), {
			id: 'ListPanelWithNotice',
			i18n: {
				title: 'List Panel with Notice',
				notice: 'Example notice which can be used to display additional information on using the control.',
			},
			noticeType: 'info',
		});
	},
};
</script>
