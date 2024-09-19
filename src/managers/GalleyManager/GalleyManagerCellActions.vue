<template>
	<TableCell class="w-28">
		<TableRowRortControls
			v-if="galleyManagerStore.sortingEnabled"
			@up="galleyManagerStore.sortMoveUp(galley.id)"
			@down="galleyManagerStore.sortMoveDown(galley.id)"
		/>
		<DropdownActions
			v-else
			:label="t('common.moreActions')"
			:display-as-ellipsis="true"
			:actions="galleyManagerStore.itemActions"
			@action="(actionName) => galleyManagerStore[actionName]({galley})"
		></DropdownActions>
	</TableCell>
</template>
<script setup>
import {useGalleyManagerStore} from './galleyManagerStore';
import TableRowRortControls from './TableRowSortControls.vue';

defineProps({
	galley: {type: Object, required: true},
});

import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';

const galleyManagerStore = useGalleyManagerStore();
</script>
