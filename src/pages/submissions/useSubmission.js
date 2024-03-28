import {computed} from 'vue';
import {useUser} from '@/composables/useUser';
import {useActiveStage} from './useActiveStage.js';

export function useSubmission(submission) {
	const user = useUser();

	const activeStage = useActiveStage(submission);

	const canUserAssignEditor = computed(() => {
		return (
			(user.isSiteAdmin.value || user.isManager.value) &&
			activeStage.isStatusSubmissionUnassigned.value
		);
	});

	return {canUserAssignEditor};
}
