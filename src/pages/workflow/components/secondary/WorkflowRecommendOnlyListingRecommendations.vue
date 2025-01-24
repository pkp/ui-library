<template>
	<div v-if="currentRecommendations" class="w-full border border-light">
		<div class="p-4">
			<h2 class="uppercase text-heading">
				{{ t('editor.submission.recommendation') }}
			</h2>
		</div>
		<div class="flex flex-col border-t border-light p-4">
			<p class="text-lg-normal text-default">
				{{ currentRecommendations }}
			</p>
		</div>
	</div>
</template>
<script setup>
import {computed} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';

const {t} = useLocalize();

const props = defineProps({
	submission: {type: Object, required: true},
	reviewRoundId: {type: Number, required: true},
	stageId: {type: Number, required: true},
});

const {getStageById} = useSubmission();

const currentRecommendations = computed(() => {
	const selectedStage = getStageById(props.submission, props.stageId);

	if (!selectedStage?.recommendations?.length) {
		return '';
	}

	return selectedStage.recommendations
		.map((recommendation) => recommendation.label)
		.join(t('common.commaListSeparator'));
});
</script>
