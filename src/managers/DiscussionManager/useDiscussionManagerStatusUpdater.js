import {useFetch} from '../../composables/useFetch';
import {useUrl} from '../../composables/useUrl';

export const statusUpdates = {
	start: 'start',
	close: 'close',
	open: 'open',
};

export function useDiscussionManagerStatusUpdater(submissionId) {
	async function updateStatus(workItemId, status) {
		const {apiUrl: updateTaskStatusUrl} = useUrl(
			`submissions/${submissionId}/tasks/${workItemId}/${status}`,
		);

		const {
			fetch,
			data: updateTaskStatusData,
			isSuccess,
		} = useFetch(updateTaskStatusUrl, {
			method: 'PUT',
		});

		await fetch();

		return {
			data: updateTaskStatusData.value,
			isSuccess: isSuccess.value,
		};
	}

	async function startWorkItem(workItemId) {
		return await updateStatus(workItemId, statusUpdates.start);
	}

	async function closeWorkItem(workItemId) {
		return await updateStatus(workItemId, statusUpdates.close);
	}

	async function openWorkItem(workItemId) {
		return await updateStatus(workItemId, statusUpdates.open);
	}

	return {
		updateStatus,
		startWorkItem,
		closeWorkItem,
		openWorkItem,
	};
}
