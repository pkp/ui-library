<template>
	<div class="pkpListPanel" :class="{'-isOrdering': isOrdering}">
		<div class="pkpListPanel__header -pkpClearfix">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
			<ul class="pkpListPanel__actions">
				<li class="pkpListPanel__orderToggle">
					<pkp-button
						:label="orderingLabel"
						icon="sort"
						:isActive="isOrdering"
						@click="toggleOrdering"
					/>
				</li>
				<li v-if="isOrdering" class="pkpListPanel__orderToggleCancel">
					<pkp-button
						:label="i18n.cancel"
						:isWarnable="true"
						@click="cancelOrdering"
					/>
				</li>
			</ul>
		</div>
		<ul class="pkpListPanel__items" aria-live="polite">
			<draggable v-model="items" :options="draggableOptions" @start="drag=true" @end="drag=false">
				<orderable-list-panel-item
					v-for="item in items"
					:key="item.id"
					:item="item"
					@itemOrderUp="itemOrderUp"
					@itemOrderDown="itemOrderDown"
					:isOrdering="isOrdering"
					:i18n="i18n"
				/>
			</draggable>
		</ul>
	</div>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import draggable from 'vuedraggable';
import OrderableListPanelItem from './WithOrdering_OrderableListPanelItem.vue';
import PkpButton from '@/components/Button/Button.vue';
import ListPanelData from './data.js';

export default {
	name: 'ListPanelWithOrdering',
	extends: ListPanel,
	components: {
		draggable,
		OrderableListPanelItem,
		PkpButton,
	},
	data: function () {
		return Object.assign(ListPanelData.baseData(), {
			id: 'ListPanelWithOrdering',
			i18n: {
				title: 'List Panel with Ordering',
				orderItems: 'Order',
				saveItemOrder: 'Save Order',
				cancel: 'Cancel',
				orderUp: 'Increase position of {$itemTitle}',
				orderDown: 'Decrease position of {$itemTitle}',
			},
		});
	},
	computed: {
		/**
		 * Return the appropriate label for the ordering button depending on
		 * if we're ordering or not.
		 *
		 * @return string
		 */
		orderingLabel: function () {
			return this.isOrdering ? this.i18n.saveItemOrder : this.i18n.orderItems;
		},
	},
};
</script>
