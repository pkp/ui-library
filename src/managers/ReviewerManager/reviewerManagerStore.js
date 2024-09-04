import {computed} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useReviewAssignment} from '@/composables/useReviewAssignment';
import {useSubmission} from '@/composables/useSubmission';
export const useReviewerManagerStore = defineComponentStore(
	'reviewerManagerStore',
	(props) => {
		const {getReviewMethodIcons, getOpenReviewAssignments} =
			useReviewAssignment();

		const {getReviewAssignmentsForRound} = useSubmission();

		const reviewAssignments = computed(() => {
			const reviewAssignmentsForSelectedRound = getReviewAssignmentsForRound(
				props.submission,
				props.reviewRoundId,
			);

			if (props.redactedForAuthors) {
				return getOpenReviewAssignments(reviewAssignmentsForSelectedRound);
			}

			return reviewAssignmentsForSelectedRound;
		});

		return {
			getReviewMethodIcons,
			reviewAssignments,
		};
	},
);
