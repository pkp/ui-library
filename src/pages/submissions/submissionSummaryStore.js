import {ref} from 'vue';
import {defineStore, getActivePinia} from 'pinia';
import {useSubmissionsPageStore} from './submissionsPageStore';

export function disposeSubmissionSummaryStore() {
	const store = useSubmissionSummaryStore();
	store.$dispose();
	console.log('disposing: ', store.$id);
	delete getActivePinia().state.value[store.$id];
}

export const useSubmissionSummaryStore = defineStore(
	'submissionSummary',
	() => {
		const submissionsPageStore = useSubmissionsPageStore();

		const {selectedSubmission: submission} = submissionsPageStore;

		/**
		 * Assign Participant Modal
		 */
		const isModalOpenedAssignParticipant = ref(false);

		function openAssignParticipantModal() {
			isModalOpenedAssignParticipant.value = true;
		}
		function closeAssignParticipantModal() {
			isModalOpenedAssignParticipant.value = false;
		}

		// TODO add additional logic for submission summary &
		// fetch additional data specific for submission

		return {
			submission,

			/**
			 * Assign Participant Modal
			 * */
			isModalOpenedAssignParticipant,
			openAssignParticipantModal,
			closeAssignParticipantModal,
		};
	},
);
