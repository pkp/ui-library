<template>
	<div class="pkpListPanel" :class="{'-isOrdering': isOrdering}">
		<div class="pkpListPanel__header -pkpClearfix">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
			<ul class="pkpListPanel__actions">
				<li class="pkpListPanel__orderToggle">
					<button @click.prevent="toggleOrdering" class="pkpButton" :class="{'-isActive': isOrdering}">
						<span class="fa fa-sort" aria-hidden="true"></span>
						<template v-if="isOrdering">
							{{ i18n.saveItemOrder }}
						</template>
						<template v-else>
							{{ i18n.orderItems }}
						</template>
					</button>
				</li>
				<li v-if="isOrdering" class="pkpListPanel__orderToggleCancel">
					<button @click.prevent="cancelOrdering" class="pkpButton -isWarnable">
						{{ i18n.cancel }}
					</button>
				</li>
			</ul>
		</div>
		<ul class="pkpListPanel__items" aria-live="polite">
			<draggable v-model="collection.items" :options="draggableOptions" @start="drag=true" @end="drag=false">
				<orderable-list-panel-item
					v-for="item in collection.items"
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
import ListPanelData from './data.js';

export default {
	name: 'ListPanelWithOrdering',
	extends: ListPanel,
	components: {
		draggable,
		OrderableListPanelItem,
	},
	data: function () {
		return Object.assign(ListPanelData.baseData(), {
			id: 'ListPanelWithOrdering',
			i18n: {
				title: 'List Panel with Ordering',
				orderItems: 'Order',
				saveItemOrder: 'Save Order',
				cancel: 'Cancel',
				itemOrdererUp: 'Increase position of {$itemTitle}',
				itemOrdererDown: 'Decrease position of {$itemTitle}',
			},
		});
	},
};
</script>
