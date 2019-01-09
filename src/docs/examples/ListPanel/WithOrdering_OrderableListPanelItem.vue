<template>
	<li class="pkpListPanelItem" :class="{'-isOrdering': isOrdering}">
		<orderer
			v-if="isOrdering"
			@up="itemOrderUp"
			@down="itemOrderDown"
			:itemId="item.id"
			:itemTitle="item.title"
			:i18n="i18n"
		/>
		<div class="pkpListPanelItem__item">
			{{ item.title }}
		</div>
	</li>
</template>

<script>
import ListPanelItem from '@/components/ListPanel/ListPanelItem.vue';
import Orderer from '@/components/Orderer/Orderer.vue';

export default {
	extends: ListPanelItem,
	name: 'WithOrdering_OrderableListPanelItem',
	props: ['item', 'i18n', 'isOrdering'],
	components: {
		Orderer,
	},
};
</script>
