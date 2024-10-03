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
						reviewAssignment: reviewAssignment,
					})
			"
		/>
	</PkpPopover>
</template>
<script setup>
import {computed} from 'vue';
import PkpPopover from '@/components/Popover/Popover.vue';
import ReviewActivityIndicator from '@/pages/dashboard/components/ReviewActivityIndicatorPopover/ReviewActivityIndicator.vue';
import ReviewActivityIndicatorPopover from '@/pages/dashboard/components/ReviewActivityIndicatorPopover/ReviewActivityIndicatorPopover.vue';

import {useDashboardPageStore} from '@/pages/dashboard/dashboardPageStore';

const props = defineProps({reviewAssignment: {type: Object, required: true}});

const {
	getReviewActivityIndicatorProps,
	getReviewActivityIndicatorPopoverProps,
} = useDashboardPageStore();

const emit = defineEmits('action');

const reviewActivityIndicatorProps = computed(() =>
	getReviewActivityIndicatorProps(props.reviewAssignment),
);

const reviewActivityIndicatorPopoverProps = computed(() =>
	getReviewActivityIndicatorPopoverProps(props.reviewAssignment),
);
</script>
