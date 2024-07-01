import {computed} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useReviewAssignment} from '@/composables/useReviewAssignment';

export const useReviewerManagerStore = defineComponentStore(
	'reviewerManagerStore',
	(props) => {
		const {getReviewMethodIcons, getOpenReviewAssignments} =
			useReviewAssignment();

		// todo get only review assignment for current round

		const reviewAssignments = computed(() => {
			if (props.redactedForAuthors) {
				return getOpenReviewAssignments(props.submission?.reviewAssignments);
			}

			return props.submission?.reviewAssignments;
		});

		return {
			getReviewMethodIcons,
			reviewAssignments,
		};
	},
);
