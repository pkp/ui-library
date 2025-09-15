<template>
	<TableCell>
		<DropdownActions
			v-if="itemActions.length"
			:label="t('common.moreActions')"
			button-variant="ellipsis"
			:actions="itemActions"
			@action="(actionName) => taskTemplateManagerStore[actionName]({template})"
		></DropdownActions>
	</TableCell>
</template>
<script setup>
import {computed} from 'vue';
import {useTaskTemplateManagerStore} from './taskTemplateManagerStore';

const props = defineProps({
	template: {type: Object, required: true},
});

import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';

const taskTemplateManagerStore = useTaskTemplateManagerStore();

const itemActions = computed(() =>
	taskTemplateManagerStore.getItemActions({template: props.template}),
);
</script>
