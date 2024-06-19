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
							:user-id="reviewAssignment.id"
							:user-full-name="String(reviewAssignment.reviewerFullName)"
						/>
					</template>
					<ReviewActivityIndicatorPopover
						:reviewer-name="reviewAssignment.reviewerFullName"
						:review-method-icons="
							getReviewMethodIcons(reviewAssignment.reviewMethod)
						"
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
import {useLocalize} from '@/composables/useLocalize';

const props = defineProps({
	reviewAssignments: {type: Array, required: true},
});

const {t} = useLocalize();

const openReviewAssignements = computed(() =>
	getOpenReviewAssignments(props.reviewAssignments),
);
</script>
