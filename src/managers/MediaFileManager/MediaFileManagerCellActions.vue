<template>
	<TableCell>
		<DropdownActions
			v-if="itemActions.length"
			:label="t('common.moreActions')"
			button-variant="ellipsis"
			:actions="itemActions"
			@action="
				(actionName) =>
					mediaFileManagerStore[actionName]({mediaFile: props.mediaFile})
			"
		></DropdownActions>
	</TableCell>
</template>
<script setup>
import {computed} from 'vue';
import {useMediaFileManagerStore} from './mediaFileManagerStore';

const props = defineProps({
	mediaFile: {type: Object, required: true},
});

import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';

const mediaFileManagerStore = useMediaFileManagerStore();

const itemActions = computed(() =>
	mediaFileManagerStore.getItemActions({mediaFile: props.mediaFile}),
);
</script>
