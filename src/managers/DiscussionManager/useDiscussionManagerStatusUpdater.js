import {useFetch} from '../../composables/useFetch';
import {useUrl} from '../../composables/useUrl';

export function useDiscussionManagerStatusUpdater(submissionId) {
	async function updateStatus(workItemId, status) {
		const {apiUrl: updateTaskStatusUrl} = useUrl(
			`submissions/${submissionId}/tasks/${workItemId}/${status}`,
		);

		const {
			fetch,
			data: updateTaskStatusData,
			isSuccess,
			validationError,
		} = useFetch(updateTaskStatusUrl, {
			method: 'PUT',
			expectValidationError: true,
		});

		await fetch();

		return {
			data: updateTaskStatusData.value,
			validationError: validationError.value,
			isSuccess: isSuccess.value,
		};
	}

	return {
		updateStatus,
	};
}
