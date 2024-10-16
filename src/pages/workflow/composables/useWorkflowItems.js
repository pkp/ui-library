import {computed} from 'vue';

export function useWorkflowItems(_workflowConfigFns, getArgsFn) {
	const headerItems = computed(() => {
		return _workflowConfigFns.getHeaderItems(getArgsFn());
	});

	const primaryItems = computed(() => {
		return _workflowConfigFns.getPrimaryItems(getArgsFn());
	});

	const secondaryItems = computed(() => {
		return _workflowConfigFns.getSecondaryItems(getArgsFn());
	});

	const actionItems = computed(() => {
		return _workflowConfigFns.getActionItems(getArgsFn());
	});

	const publicationControlsLeft = computed(() => {
		return _workflowConfigFns.getPublicationControlsLeft(getArgsFn());
	});

	const publicationControlsRight = computed(() => {
		return _workflowConfigFns.getPublicationControlsRight(getArgsFn());
	});

	return {
		headerItems,
		primaryItems,
		secondaryItems,
		actionItems,
		publicationControlsLeft,
		publicationControlsRight,
	};
}
