<template>
	<div>
		<PkpButton
			v-if="!isActionsShowed && showChangeDecision"
			class=""
			is-link
			@click="showActions"
		>
			{{ t('editor.submission.workflowDecision.changeDecision') }}
		</PkpButton>
		<div v-else class="flex flex-col space-y-3">
			<component
				:is="workflowStore.Components[item.component] || item.component"
				v-for="(item, index) in items"
				v-bind="item.props"
				:key="`${index}`"
			/>
		</div>
	</div>
</template>

<script setup>
import {ref} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import {useWorkflowStore} from '../../workflowStore';
defineProps({
	showChangeDecision: {type: Boolean, required: true, default: false},
	items: {type: Array, required: true},
});

const isActionsShowed = ref(false);

const workflowStore = useWorkflowStore();

function showActions() {
	isActionsShowed.value = true;
}
</script>
