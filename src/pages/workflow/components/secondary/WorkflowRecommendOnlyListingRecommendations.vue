<template>
	<div
		v-if="!isLoading && currentRecommendations"
		class="w-full border border-light"
	>
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
import {computed, watch} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useSubmission} from '@/composables/useSubmission';

const {t} = useLocalize();

const props = defineProps({
	submission: {type: Object, required: true},
	reviewRoundId: {type: Number, required: true},
	stageId: {type: Number, required: true},
});

const RecommendOnlyDecisions = [
	// EXTERNAL REVIEW
	pkp.const.DECISION_RECOMMEND_ACCEPT,
	pkp.const.DECISION_RECOMMEND_DECLINE,
	pkp.const.DECISION_RECOMMEND_PENDING_REVISIONS,
	pkp.const.DECISION_RECOMMEND_RESUBMIT,

	// INTERNAL REVIEW
	pkp.const.DECISION_RECOMMEND_ACCEPT_INTERNAL,
	pkp.const.DECISION_RECOMMEND_PENDING_REVISIONS_INTERNAL,
	pkp.const.RECOMMEND_RESUBMIT_INTERNAL,
	pkp.const.RECOMMEND_DECLINE_INTERNAL,
	pkp.const.RECOMMEND_EXTERNAL_REVIEW,
];

const {apiUrl: recommendationApiUrl} = useUrl(
	// TODO improve url when the query params are available
	`submissions/${props.submission.id}/decisions`,
);

const {
	data: recommendations,
	fetch: fetchRecommendations,
	isLoading,
} = useFetch(recommendationApiUrl);

fetchRecommendations();
watch(props, () => fetchRecommendations());

const currentRecommendations = computed(() => {
	if (!recommendations.value) {
		return '';
	}

	let recommendationsFromLatest = [...recommendations.value].reverse();

	const {getRecommendOnlyUserIdsForStage} = useSubmission(
		props.submission,
		props.stageId,
	);

	const recommendOnlyEditorIds = getRecommendOnlyUserIdsForStage(
		props.submission,
		props.stageId,
	);

	const recommendationLabels = recommendOnlyEditorIds
		.map((editorId) => {
			return recommendationsFromLatest.find(
				(recommendation) =>
					recommendation.editorId === editorId &&
					recommendation.reviewRoundId === props.reviewRoundId &&
					RecommendOnlyDecisions.includes(recommendation.decision),
			);
		})
		.filter((recommendation) => !!recommendation)
		.map((recommendation) => recommendation.label);

	if (recommendationLabels.length === 0) {
		return '';
	}
	return recommendationLabels.join(t('common.commaListSeparator'));
});
</script>
