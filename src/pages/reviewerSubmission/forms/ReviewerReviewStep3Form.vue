<template>
	<div>
		<!-- Form: Review Files, Guidelines, Comments/Form, Attachments, Discussions, Recommendation -->
		<PkpForm
			v-bind="form"
			@set="set"
			@cancel="goBack"
			@save-for-later="saveForLater"
		/>
	</div>
</template>

<script setup>
import {useDataChangedProvider} from '@/composables/useDataChangedProvider';
import {useReviewerReviewStep3Form} from './useReviewerReviewStep3Form';

useDataChangedProvider();

const props = defineProps({
	reviewAssignment: {
		type: Object,
		required: true,
	},
	reviewForm: {
		type: Object,
		required: false,
		default: null,
	},
	reviewFormElements: {
		type: Array,
		required: false,
		default: null,
	},
	reviewFormResponses: {
		type: Object,
		required: false,
		default: null,
	},
	reviewerRecommendationOptions: {
		type: Array,
		required: false,
		default: () => [],
	},
	comments: {
		type: String,
		required: false,
		default: '',
	},
	commentsPrivate: {
		type: String,
		required: false,
		default: '',
	},
	reviewGuidelines: {
		type: String,
		required: false,
		default: null,
	},
});

const {form, set, saveForLater, goBack} = useReviewerReviewStep3Form(props);
</script>
