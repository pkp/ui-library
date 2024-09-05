<template>
	<div v-if="currentRecommendation" class="w-full border border-light">
		<div class="p-4">
			<h2 class="uppercase text-heading">
				{{ t('editor.submission.recommendation') }}
			</h2>
		</div>
		<div class="flex flex-col border-t border-light p-4">
			<p class="text-lg-normal text-default">
				{{ currentRecommendation.label }}
			</p>
			<span v-if="!showRecommendationActions" class="-ms-4 mt-2">
				<PkpButton class="" is-link @click="showActions">
					{{ t('editor.submission.workflowDecision.changeDecision') }}
				</PkpButton>
			</span>
		</div>
	</div>
	<div v-if="showRecommendationActions" class="flex flex-col gap-y-2">
		<PkpButton
			v-for="actionItem in actionItems"
			:key="actionItem.action"
			:is-secondary="true"
			@click="() => handleAction(actionItem.action)"
		>
			{{ actionItem.label }}
		</PkpButton>
	</div>
</template>
<script setup>
import PkpButton from '@/components/Button/Button.vue';
import {computed, ref} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useSubmissionSummaryStore} from '../submissionSummaryStore';

import {Actions} from '../../composables/useWorkflowActions';

const {t} = useLocalize();

const props = defineProps({
	reviewRoundId: {type: Number, required: true},
	stageId: {type: Number, required: true},
});

const showRecommendationActions = ref(false);
function showActions() {
	showRecommendationActions.value = true;
}

function getRecommendationActions() {
	const actions = [];

	actions.push({
		label: t('editor.submission.recommend.revisions'),
		action: Actions.RECOMMEND_REVISION,
	});

	actions.push({
		label: t('editor.submission.recommend.accept'),
		action: Actions.DECISION_RECOMMEND_ACCEPT,
	});

	actions.push({
		label: t('editor.submission.recommend.decline'),
		action: Actions.DECISION_RECOMMEND_DECLINE,
	});

	return actions;
}

const actionItems = computed(() => {
	return getRecommendationActions();
});

const currentRecommendation = computed(() => {
	// TODO get real value from API once available
	return {label: 'Resubmit for review'};
});

const summaryStore = useSubmissionSummaryStore();
function handleAction(actionName) {
	summaryStore.handleAction(actionName, {
		reviewRoundId: props.reviewRoundId,
		stageId: props.stageId,
	});
}
</script>
../../composables/useWorkflowActions
