<template>
	<div class="pkpListPanel pkpListPanel--select">
		<div class="pkpListPanel__header -pkpClearfix">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
		</div>
		<div class="pkpListPanel__body -pkpClearfix">
			<div v-if="i18n.notice" class="pkpListPanel__notice pkpListPanel__notice--info" tabindex="0">
				{{ i18n.notice }}
			</div>
			<div class="pkpListPanel__content">
				<ul class="pkpListPanel__items" aria-live="polite">
					<select-list-panel-item
						v-for="item in collection.items"
						:key="item.id"
						:item="item"
						:inputName="inputName"
						:inputType="inputType"
					/>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import SelectListPanelItem from '@/components/SelectListPanel/SelectListPanelItem.vue';

export default {
	extends: ListPanel,
	name: 'SelectListPanel',
	components: {
		SelectListPanelItem,
	},
	data: function () {
		return {
			inputName: '',
			inputType: 'checkbox',
		};
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

/* Override form base font size */
.pkp_form .pkpListPanel__title {
	font-size: @font-base;
	line-height: @double;
}

/* Override form styles on labels */
.pkp_form label.pkpListPanelItem__item {
	font-size: @font-sml;
}
</style>
