<template>
	<DropdownActions
		:label="label"
		:actions="actions"
		@action="handleAction"
	></DropdownActions>
</template>

<script setup>
import {computed} from 'vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useWorkflowStore} from '@/pages/workflow/workflowStore';

const {t} = useLocalize();

const props = defineProps({submission: {type: Object, required: true}});

const label = computed(() => {
	if (props.submission.workType === pkp.const['WORK_TYPE_EDITED_VOLUME']) {
		return t('submission.workflowType.editedVolume.label');
	}
	return t('common.publication');
});

const actions = computed(() => {
	return [
		{
			label: t('submission.workflowType.editedVolume.label'),
			name: 'setAsEditedVolume',
		},
		{
			label: t('common.publication'),
			name: 'setAsAuthoredWork',
		},
	];
});

const workflowStore = useWorkflowStore();

function handleAction(actionName) {
	if (actionName === 'setAsEditedVolume') {
		workflowStore.workflowChangeWorktype({
			workType: pkp.const.WORK_TYPE_EDITED_VOLUME,
		});
	} else if (actionName === 'setAsAuthoredWork') {
		workflowStore.workflowChangeWorktype({
			workType: pkp.const.WORK_TYPE_AUTHORED_WORK,
		});
	}
}
</script>
