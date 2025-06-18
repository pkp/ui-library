<template>
	<TableCell>
		<DropdownActions
			v-if="itemActions.length"
			:label="t('common.moreActions')"
			button-variant="ellipsis"
			:actions="itemActions"
			@action="(actionName) => tasksAndDiscussionsStore[actionName]({task})"
		></DropdownActions>
	</TableCell>
</template>
<script setup>
import {computed} from 'vue';
import {useTasksAndDiscussionsManagerStore} from './tasksAndDiscussionsManagerStore';

const props = defineProps({
	workItem: {type: Object, required: true},
});

import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';

const tasksAndDiscussionsStore = useTasksAndDiscussionsManagerStore();

const itemActions = computed(() =>
	tasksAndDiscussionsStore.getItemActions({workItem: props.workItem}),
);
</script>
