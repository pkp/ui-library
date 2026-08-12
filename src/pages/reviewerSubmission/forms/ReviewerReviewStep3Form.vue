<template>
	<div>
		<div v-if="isLoading" class="flex justify-center p-8">
			<Spinner />
		</div>
		<PkpForm
			v-else-if="form.id"
			v-bind="form"
			@set="set"
			@cancel="goBack"
			@save-for-later="saveForLater"
		/>
	</div>
</template>

<script setup>
import Spinner from '@/components/Spinner/Spinner.vue';
import {useDataChangedProvider} from '@/composables/useDataChangedProvider';
import {useReviewerReviewStep3Form} from './useReviewerReviewStep3Form';

const props = defineProps({
	submissionId: {
		type: [Number, String],
		required: true,
	},
});

useDataChangedProvider();

const {form, set, saveForLater, goBack, isLoading} = useReviewerReviewStep3Form(
	{submissionId: props.submissionId},
);
</script>
