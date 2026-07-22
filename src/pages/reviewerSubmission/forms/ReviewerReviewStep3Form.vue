<template>
	<div>
		<div v-if="isLoadingReviewData" class="flex justify-center p-8">
			<Spinner />
		</div>
		<ReviewerReviewStep3FormFields v-else-if="reviewData" v-bind="reviewData" />
	</div>
</template>

<script setup>
import Spinner from '@/components/Spinner/Spinner.vue';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import ReviewerReviewStep3FormFields from './ReviewerReviewStep3FormFields.vue';

const props = defineProps({
	submissionId: {
		type: [Number, String],
		required: true,
	},
});

const {apiUrl} = useUrl(`reviews/${props.submissionId}/reviewerReview`);
const {
	data: reviewData,
	isLoading: isLoadingReviewData,
	fetch: fetchReviewData,
} = useFetch(apiUrl);

fetchReviewData();
</script>
