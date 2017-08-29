<template>
	<div class="pkpListPanel">
		<div class="pkpListPanel__header">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
		</div>
		<div class="pkpListPanel__body">
			<div v-if="i18n.notice" class="pkpListPanel__notice pkpListPanel__notice--info" tabindex="0">
				<span class="fa fa-info-circle pkpIcon--inline" aria-hidden="true"></span>
				{{ i18n.notice }}
			</div>
			<div class="pkpListPanel__content">
				<ul class="pkpListPanel__items" aria-live="polite">
					<list-panel-item
						v-for="item in collection.items"
						:key="item.id"
						:item="item"
					/>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import ListPanel from './../../../components/ListPanel/ListPanel.vue';
import ListPanelData from './data.js';

export default {
	name: 'ListPanelWithNotice',
	extends: ListPanel,
	data: function () {
		return Object.assign(ListPanelData.baseData(), {
			id: 'ListPanelWithNotice',
			i18n: {
				title: 'List Panel with Notice',
				notice: 'Example notice which can be used to display additional information on using the control.',
			},
		});
	},
};
</script>
