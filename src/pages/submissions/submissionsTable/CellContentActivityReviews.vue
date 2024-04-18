<template>
	<span class="space-x-1">
		<PkpPopover
			v-for="reviewAssignment in reviewAssignments"
			:key="reviewAssignment.id"
		>
			<template #button>
				<ReviewActivityIndicator
					v-bind="getReviewActivityIndicatorProps(reviewAssignment)"
				></ReviewActivityIndicator>
			</template>

			<ReviewActivityIndicatorPopover
				v-bind="getReviewActivityIndicatorPopoverProps(reviewAssignment)"
				@action="
					(actionName) =>
						emit('action', actionName, {
							reviewAssignmentId: reviewAssignment.id,
						})
				"
			/>
		</PkpPopover>
	</span>
</template>

<script setup>
import ReviewActivityIndicator from '@/components/ReviewActivityIndicatorPopover/ReviewActivityIndicator.vue';
import ReviewActivityIndicatorPopover from '@/components/ReviewActivityIndicatorPopover/ReviewActivityIndicatorPopover.vue';
import PkpPopover from '@/components/Popover/Popover.vue';

import {useReviewActivityIndicatorLogic} from '@/components/ReviewActivityIndicatorPopover/useReviewActivityIndicator';

const {
	getReviewActivityIndicatorProps,
	getReviewActivityIndicatorPopoverProps,
} = useReviewActivityIndicatorLogic();

const emit = defineEmits('action');

defineProps({
	reviewAssignments: {type: Array, required: true},
});
</script>
