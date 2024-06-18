import {computed} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useReviewAssignment} from '@/composables/useReviewAssignment';

export const useReviewerManagerStore = defineComponentStore(
	'reviewerManagerStore',
	(props) => {
		const {getReviewMethodIcons, getOpenReviewAssignments} =
			useReviewAssignment();

		const reviewAssignments = computed(() => {
			if (props.redactedForAuthors) {
				return getOpenReviewAssignments(props.reviewAssignments);
			}

			return props.reviewAssignments;
		});

		return {
			getReviewMethodIcons,
			reviewAssignments,
		};
	},
);
