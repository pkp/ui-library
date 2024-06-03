<template>
	<div v-if="openReviewAssignements.length">
		<div>Reviewers assigned (t):</div>
		<div class="mt-1 flex gap-x-1">
			<div
				v-for="reviewAssignment in openReviewAssignements"
				:key="reviewAssignment.id"
			>
				<PkpPopover>
					<!-- TODO once the reviewer name and method are in the response, use it-->
					<template #button>
						<UserAvatar
							size-variant="small"
							:user-id="reviewAssignment.id"
							:user-full-name="String(reviewAssignment.id)"
						/>
					</template>
					<ReviewActivityIndicatorPopover
						:reviewer-name="String(reviewAssignment.id)"
						:review-method-icons="getReviewMethodIcons(1)"
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
import {useReviewAssignment} from '@/composables/useReviewAssignment';
import UserAvatar from '@/components/UserAvatar/UserAvatar.vue';
const {getOpenReviewAssignments, getReviewMethodIcons} = useReviewAssignment();

const props = defineProps({
	reviewAssignments: {type: Array, required: true},
});
const openReviewAssignements = computed(() =>
	getOpenReviewAssignments(props.reviewAssignments),
);
</script>
