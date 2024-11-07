<template>
	<div>
		<PkpButton v-if="!isActionsShowed" class="" is-link @click="showActions">
			{{ t('editor.submission.workflowDecision.changeDecision') }}
		</PkpButton>
		<div v-else class="flex flex-col space-y-3">
			<WorkflowActionButton
				v-for="(actionProps, index) in actionButtonsProps"
				v-bind="actionProps"
				:key="`${index}`"
			/>
		</div>
	</div>
</template>

<script setup>
import {ref} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import WorkflowActionButton from '@/pages/workflow/components/action/WorkflowActionButton.vue';

defineProps({actionButtonsProps: {type: Array, required: true}});

const isActionsShowed = ref(false);

function showActions() {
	isActionsShowed.value = true;
}
</script>
