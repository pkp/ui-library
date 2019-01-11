<template>
	<div class="pkpListPanel" :class="{'-isOrdering': isOrdering}">
		<div class="pkpListPanel__header -pkpClearfix">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
			<ul class="pkpListPanel__actions">
				<li class="pkpListPanel__orderToggle">
					<pkp-button
						:label="isOrdering ? i18n.saveItemOrder : i18n.orderItems"
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
import OrderableListPanelItem from './PreviewListPanelOrderable_ListPanelItem.vue';
import PkpButton from '@/components/Button/Button.vue';
import {data} from '../config';
import {orderable} from '../helpers/i18n';
import items from '../helpers/items';

export default {
	extends: ListPanel,
	components: {
		PkpButton,
		draggable,
		OrderableListPanelItem
	},
	data() {
		return {
			...data,
			id: 'PreviewListPanelOrderable',
			items: items,
			itemsMax: items.length,
			i18n: {...data.i18n, ...orderable}
		};
	}
};
</script>
