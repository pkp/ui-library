<template>
	<div
		v-if="!isDecidingEditorAssigned || (!isLoading && currentRecommendation)"
		class="w-full border border-light"
	>
		<div class="p-4">
			<h2 class="uppercase text-heading">
				{{ t('editor.submission.recommendation') }}
			</h2>
		</div>
		<div
			v-if="isDecidingEditorAssigned"
			class="flex flex-col border-t border-light p-4"
		>
			<p class="text-lg-normal text-default">
				{{ currentRecommendation }}
			</p>
			<span v-if="!showRecommendationActions" class="-ms-4 mt-2">
				<PkpButton class="" is-link @click="showActions">
					{{ t('editor.submission.workflowDecision.changeDecision') }}
				</PkpButton>
			</span>
		</div>
		<div v-else class="p-4">
			<p class="text-lg-normal text-default">
				{{ t('editor.submission.recommendation.noDecidingEditors') }}
			</p>
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
import {useWorkflowStore} from '@/pages/workflow/workflowStore';
import {useSubmission} from '@/composables/useSubmission';

import {Actions as DecisionActions} from '../../composables/useWorkflowDecisions';
import {Actions as WorkflowActions} from '../../composables/useWorkflowActions';

const {t} = useLocalize();

const props = defineProps({
	submission: {type: Object, required: true},
	reviewRoundId: {type: Number, required: true},
	stageId: {type: Number, required: true},
	userId: {type: Number, required: true},
});

const explicitelyShowRecommendationActions = ref(false);

const isDecidingEditorAssigned = computed(() => {
	return props.submission?.editorAssigned;
});

const showRecommendationActions = computed(() => {
	if (!isDecidingEditorAssigned.value) {
		return false;
	}

	if (explicitelyShowRecommendationActions.value) {
		return true;
	}

	if (!currentRecommendation.value) {
		return true;
	}

	return false;
});
function showActions() {
	explicitelyShowRecommendationActions.value = true;
}

function getRecommendationActions() {
	const actions = [];

	if (props.stageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) {
		actions.push({
			label: t('editor.submission.recommend.revisions'),
			action: WorkflowActions.WORKFLOW_RECOMMEND_REVISION,
		});

		actions.push({
			label: t('editor.submission.recommend.accept'),
			action: DecisionActions.DECISION_RECOMMEND_ACCEPT,
		});

		actions.push({
			label: t('editor.submission.recommend.decline'),
			action: DecisionActions.DECISION_RECOMMEND_DECLINE,
		});
	} else if (props.stageId === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW) {
		actions.push({
			label: t('editor.submission.recommend.revisions'),
			action: DecisionActions.DECISION_RECOMMEND_PENDING_REVISIONS_INTERNAL,
		});

		actions.push({
			label: t('editor.submission.recommend.accept'),
			action: DecisionActions.DECISION_RECOMMEND_ACCEPT_INTERNAL,
		});

		actions.push({
			label: t('editor.submission.recommend.decline'),
			action: DecisionActions.DECISION_RECOMMEND_DECLINE_INTERNAL,
		});

		actions.push({
			label: t('editor.submission.recommend.sendExternalReview'),
			action: DecisionActions.DECISION_RECOMMEND_EXTERNAL_REVIEW,
		});
	}

	return actions;
}

const actionItems = computed(() => {
	return getRecommendationActions();
});

const {getStageById} = useSubmission();

const currentRecommendation = computed(() => {
	const selectedStage = getStageById(props.submission, props.stageId);

	if (!selectedStage?.currentUserRecommendation) {
		return null;
	}

	return selectedStage.currentUserRecommendation.label;
});

const workflowStore = useWorkflowStore();
function handleAction(actionName) {
	workflowStore[actionName]({
		reviewRoundId: props.reviewRoundId,
		stageId: props.stageId,
	});
}
</script>
