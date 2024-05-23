<template>
	<div v-if="openReviewAssignements.length">
		<div>Reviewers assigned (t):</div>
		<div class="mt-1 flex gap-x-1">
			<div
				v-for="reviewAssignment in openReviewAssignements"
				:key="reviewAssignment.id"
			>
				<UserAvatar
					size-variant="small"
					:user-id="reviewAssignment.id"
					:user-full-name="String(reviewAssignment.id)"
				/>
			</div>
		</div>
	</div>
</template>
<script setup>
import {computed} from 'vue';
import {useReviewAssignment} from '@/composables/useReviewAssignment';
import UserAvatar from '@/components/UserAvatar/UserAvatar.vue';
const {getOpenReviewAssignments} = useReviewAssignment();

const props = defineProps({
	reviewAssignments: {type: Array, required: true},
});
const openReviewAssignements = computed(() =>
	getOpenReviewAssignments(props.reviewAssignments),
);
</script>
