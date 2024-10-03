<template>
	<div class="flex">
		<Icon class="h-6 w-6 text-primary" icon="ReviewAssignments"></Icon>
		<div class="ms-1 flex items-center">
			{{
				t('dashboard.reviewUpdateCounts', {
					reviewsCompletedCount,
					reviewsTotalCount,
				})
			}}
		</div>
	</div>
</template>
<script setup>
import {computed} from 'vue';
import Icon from '@/components/Icon/Icon.vue';
import {useSubmission} from '@/composables/useSubmission';
import {useLocalize} from '@/composables/useLocalize';
const {getActiveReviewAssignments, getCompletedReviewAssignments} =
	useSubmission();

const props = defineProps({
	reviewAssignments: {type: Array, required: true},
});

const {t} = useLocalize();

const reviewsTotalCount = computed(
	() => getActiveReviewAssignments(props.reviewAssignments).length,
);

const reviewsCompletedCount = computed(
	() => getCompletedReviewAssignments(props.reviewAssignments).length,
);
</script>
