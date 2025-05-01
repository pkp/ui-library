<template>
	<TableCell class="w-28">
		<TableRowSortControls
			v-if="galleyManagerStore.sortingEnabled"
			@up="galleyManagerStore.sortMoveUp(galley.id)"
			@down="galleyManagerStore.sortMoveDown(galley.id)"
		/>
		<DropdownActions
			v-if="!galleyManagerStore.sortingEnabled && itemActions.length"
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
import TableRowSortControls from './TableRowSortControls.vue';

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
