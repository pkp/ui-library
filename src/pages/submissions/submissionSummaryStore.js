import {ref} from 'vue';
import {useSubmissionsPageStore} from './submissionsPageStore';

import {defineComponentStore} from '@/utils/defineComponentStore';

export const useSubmissionSummaryStore = defineComponentStore(
	'submissionSummary',
	(initValues) => {
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
