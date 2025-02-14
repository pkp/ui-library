<template>
	<div v-if="openReviewAssignements.length">
		<div>{{ t('dashboard.reviewersAssigned') }}:</div>
		<div class="mt-1 flex gap-x-1">
			<div
				v-for="reviewAssignment in openReviewAssignements"
				:key="reviewAssignment.id"
			>
				<PkpPopover>
					<template #button>
						<UserAvatar
							size-variant="small"
							:user-id="reviewAssignment.reviewerId"
							:initials="String(reviewAssignment.reviewerDisplayInitials)"
						/>
					</template>
					<ReviewActivityIndicatorPopover
						:reviewer-name="reviewAssignment.reviewerFullName"
						:review-method="reviewAssignment.reviewMethod"
					/>
				</PkpPopover>
			</div>
		</div>
	</div>
</template>
<script setup>
import {computed} from 'vue';
import PkpPopover from '@/components/Popover/Popover.vue';
import ReviewActivityIndicatorPopover from '@/pages/dashboard/components/ReviewActivityIndicatorPopover/ReviewActivityIndicatorPopover.vue';
import {useSubmission} from '@/composables/useSubmission';
import UserAvatar from '@/components/UserAvatar/UserAvatar.vue';
const {getOpenReviewAssignments, getCompletedReviewAssignments} =
	useSubmission();
import {useLocalize} from '@/composables/useLocalize';

const props = defineProps({
	reviewAssignments: {type: Array, required: true},
});

const {t} = useLocalize();

const openReviewAssignements = computed(() => {
	return getOpenReviewAssignments(
		getCompletedReviewAssignments(props.reviewAssignments),
	);
});
</script>
