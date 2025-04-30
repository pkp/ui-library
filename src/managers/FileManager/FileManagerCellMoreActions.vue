<template>
	<TableCell>
		<DropdownActions
			v-if="itemActions?.length"
			:label="t('common.moreActions')"
			button-variant="ellipsis"
			:actions="itemActions"
			:action-args="{file}"
			@action="
				(actionName, actionArgs) => fileManagerStore[actionName](actionArgs)
			"
		></DropdownActions>
	</TableCell>
</template>
<script setup>
import {computed} from 'vue';
import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';

import {useFileManagerStore} from './fileManagerStore.js';

const props = defineProps({
	file: {type: Object, required: true},
});

const fileManagerStore = useFileManagerStore();

const itemActions = computed(() =>
	fileManagerStore.getItemActions({file: props.file}),
);
</script>
