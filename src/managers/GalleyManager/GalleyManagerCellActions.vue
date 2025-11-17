<template>
	<TableCellOrder
		v-if="galleyManagerStore.sortingEnabled"
		class="w-28"
		@up="galleyManagerStore.sortMoveUp(galley.id)"
		@down="galleyManagerStore.sortMoveDown(galley.id)"
	/>
	<TableCell v-else class="w-28">
		<DropdownActions
			v-if="itemActions.length"
			:label="t('common.moreActions')"
			button-variant="ellipsis"
			:actions="itemActions"
			@action="(actionName) => galleyManagerStore[actionName]({galley})"
		></DropdownActions>
	</TableCell>
</template>
<script setup>
import {computed} from 'vue';
import {useGalleyManagerStore} from './galleyManagerStore';
import TableCellOrder from '@/components/Table/TableCellOrder.vue';

const props = defineProps({
	galley: {type: Object, required: true},
});

import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';

const galleyManagerStore = useGalleyManagerStore();

const itemActions = computed(() =>
	galleyManagerStore.getItemActions({galley: props.galley}),
);
</script>
