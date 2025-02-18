<template>
	<TableCell>
		<DropdownActions
			v-if="fileManagerStore.itemActions?.length"
			:label="t('common.moreActions')"
			button-variant="ellipsis"
			:actions="fileManagerStore.itemActions"
			:action-args="{file}"
			@action="
				(actionName, actionArgs) => fileManagerStore[actionName](actionArgs)
			"
		></DropdownActions>
	</TableCell>
</template>
<script setup>
import {useFileManagerStore} from './fileManagerStore.js';

defineProps({
	file: {type: Object, required: true},
});

import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';

const fileManagerStore = useFileManagerStore();
</script>
