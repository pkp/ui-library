import {ref} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';

export const useReviewerSubmissionPageStore = defineComponentStore(
	'reviewerSubmissionPage',
	(pageInitConfig) => {
		const isRoundHistoryModalOpened = ref(false);
		const roundHistoryModalProps = ref(null);
		function openRoundHistoryModal({submissionId, reviewRoundId, reviewRoundNumber}) {
			roundHistoryModalProps.value = {submissionId, reviewRoundId, reviewRoundNumber};
			isRoundHistoryModalOpened.value = true;
		}
		function closeRoundHistoryModal() {
			isRoundHistoryModalOpened.value = false;
			roundHistoryModalProps.value = null;
		}

		return {
			isRoundHistoryModalOpened,
			openRoundHistoryModal,
			closeRoundHistoryModal,
			roundHistoryModalProps,
			reviewRoundHistories: pageInitConfig.reviewRoundHistories,
		};
	},
);
