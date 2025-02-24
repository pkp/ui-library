import {computed} from 'vue';

export function useWorkflowItems(workflowConfig, getArgsFn) {
	const headerItems = computed(() => {
		return workflowConfig.getHeaderItems(getArgsFn());
	});

	const primaryItems = computed(() => {
		return workflowConfig.getPrimaryItems(getArgsFn());
	});

	const secondaryItems = computed(() => {
		return workflowConfig.getSecondaryItems(getArgsFn());
	});

	const actionItems = computed(() => {
		return workflowConfig.getActionItems(getArgsFn());
	});

	const primaryControlsLeft = computed(() => {
		return workflowConfig.getPrimaryControlsLeft(getArgsFn());
	});

	const primaryControlsRight = computed(() => {
		return workflowConfig.getPrimaryControlsRight(getArgsFn());
	});

	return {
		headerItems,
		primaryItems,
		secondaryItems,
		actionItems,
		primaryControlsLeft,
		primaryControlsRight,
	};
}
