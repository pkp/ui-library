<template>
	<TableCell>
		<DropdownActions
			v-if="itemActions.length"
			:label="t('common.moreActions')"
			button-variant="ellipsis"
			:actions="itemActions"
			@action="
				(actionName) => taskTemplateManagerStore[actionName]({taskTemplate})
			"
		></DropdownActions>
	</TableCell>
</template>
<script setup>
import {computed} from 'vue';
import {useTaskTemplateManagerStore} from './taskTemplateManagerStore';

const props = defineProps({
	taskTemplate: {type: Object, required: true},
});

import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';

const taskTemplateManagerStore = useTaskTemplateManagerStore();

const itemActions = computed(() =>
	taskTemplateManagerStore.getItemActions({taskTemplate: props.taskTemplate}),
);
</script>
