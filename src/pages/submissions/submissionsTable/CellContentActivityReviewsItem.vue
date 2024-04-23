<template>
	<PkpPopover>
		<template #button>
			<ReviewActivityIndicator
				v-bind="reviewActivityIndicatorProps"
			></ReviewActivityIndicator>
		</template>

		<ReviewActivityIndicatorPopover
			v-bind="reviewActivityIndicatorPopoverProps"
			@action="
				(actionName) =>
					emit('action', actionName, {
						reviewAssignmentId: reviewAssignment.id,
					})
			"
		/>
	</PkpPopover>
</template>
<script setup>
import {computed} from 'vue';
import PkpPopover from '@/components/Popover/Popover.vue';
import ReviewActivityIndicator from '@/components/ReviewActivityIndicatorPopover/ReviewActivityIndicator.vue';
import ReviewActivityIndicatorPopover from '@/components/ReviewActivityIndicatorPopover/ReviewActivityIndicatorPopover.vue';
import {useReviewActivityIndicatorLogic} from '@/components/ReviewActivityIndicatorPopover/useReviewActivityIndicator';

const {
	getReviewActivityIndicatorProps,
	getReviewActivityIndicatorPopoverProps,
} = useReviewActivityIndicatorLogic();

const props = defineProps({reviewAssignment: {type: Object, required: true}});
const emit = defineEmits('action');

const reviewActivityIndicatorProps = computed(() =>
	getReviewActivityIndicatorProps(props.reviewAssignment),
);

const reviewActivityIndicatorPopoverProps = computed(() =>
	getReviewActivityIndicatorPopoverProps(props.reviewAssignment),
);
</script>
