<template>
	<SideModalBody>
		<template #pre-title>
			{{ submissionId }}
		</template>
		<template #title>
			<span v-if="submission" class="underline">
				{{ submission.publications[0].authorsStringShort }}
			</span>
		</template>
		<template v-if="submission" #description>
			{{ submission.publications[0].fullTitle.en }}
		</template>
		<template v-if="submission" #post-description>
			<StageBubble :stage-id="submission.stageId">
				<span class="text-lg-normal">
					{{ submission.stageName }}
				</span>
				<template
					v-if="
						(submission.stageId ===
							pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW ||
							submission.stageId ===
								pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) &&
						submission.reviewRounds.length
					"
				>
					{{
						t('common.inParenthesis', {
							text: t('common.reviewRoundNumber', {
								round:
									submission.reviewRounds[submission.reviewRounds.length - 1]
										.round,
							}),
						})
					}}
				</template>
			</StageBubble>
		</template>
		<template v-if="submission" #actions>
			<PkpButton element="a" :href="submission.urlWorkflow">
				View submission in detail
			</PkpButton>
		</template>
		<SideModalLayout2Columns>
			<template #left>
				<div class="flex flex-col gap-y-3 bg-secondary p-5">
					<component
						:is="Components[item.component] || item.component"
						v-bind="item.props"
						v-for="(item, index) in primaryItems"
						:key="index"
					/>
				</div>
			</template>
			<template #right1>
				<div class="flex flex-col items-start space-y-4 p-4">
					<component
						:is="Components[item.component] || item.component"
						v-for="(item, index) in actionItems"
						v-bind="item.props"
						:key="index"
					></component>
				</div>
			</template>
			<template #right2>
				<div class="flex flex-col space-y-4 p-4">
					<component
						:is="Components[item.component] || item.component"
						v-for="(item, index) in metaItems"
						v-bind="item.props"
						:key="index"
					></component>
				</div>
			</template>
		</SideModalLayout2Columns>
	</SideModalBody>
</template>

<script setup>
import {computed, provide} from 'vue';
import {storeToRefs} from 'pinia';
import PkpButton from '@/components/Button/Button.vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import StageBubble from '@/components/StageBubble/StageBubble.vue';
import FileManager from '@/managers/FileManager/FileManager.vue';
import ReviewerManager from '@/managers/ReviewerManager/ReviewerManager.vue';
import ContributorManager from '@/managers/ContributorManager/ContributorManager.vue';
import LastActivity from './primaryItems/LastActivity.vue';
import PrimaryBasicMetadata from './primaryItems/PrimaryBasicMetadata.vue';

import ActionButton from './actionItems/ActionButton.vue';
import EditorsAssigned from './metaItems/EditorsAssigned.vue';
import BasicMetadata from './metaItems/BasicMetadata.vue';

import IssueAssigned from './metaItems/IssueAssigned.vue';
import {useSubmissionSummaryStore} from './submissionSummaryStore';
import SideModalLayout2Columns from '@/components/Modal/SideModalLayout2Columns.vue';

const Components = {
	FileManager,
	ReviewerManager,
	ContributorManager,
	LastActivity,
	ActionButton,
	EditorsAssigned,
	BasicMetadata,
	PrimaryBasicMetadata,
	IssueAssigned,
};

const pkp = window.pkp;

const props = defineProps({
	submissionId: {type: Number, required: true},
	reviewAssignmentId: {type: Number, required: false, default: null},
	pageInitConfig: {type: Object, required: true},
});

const summaryStore = useSubmissionSummaryStore(props);

const primaryItems = computed(() => {
	if (!summaryStore.submission || !summaryStore.currentPublication) {
		return [];
	}

	return summaryStore.filterItemsBasedOnContext(
		summaryStore.getPrimaryItems(
			summaryStore.submission,
			summaryStore.currentPublication,
		),
		summaryStore.dashboardPage,
		summaryStore.submission,
		summaryStore.selectedReviewAssignment,
	);
});

const actionItems = computed(() => {
	if (!summaryStore.submission || !summaryStore.currentPublication) {
		return [];
	}

	return summaryStore.filterItemsBasedOnContext(
		summaryStore.getActionItems(
			summaryStore.submission,
			summaryStore.currentPublication,
		),
		summaryStore.dashboardPage,
		summaryStore.submission,
		summaryStore.selectedReviewAssignment,
	);
});

const metaItems = computed(() => {
	if (!summaryStore.submission || !summaryStore.currentPublication) {
		return [];
	}

	return summaryStore.filterItemsBasedOnContext(
		summaryStore.getMetaItems(
			summaryStore.submission,
			summaryStore.currentPublication,
		),
		summaryStore.dashboardPage,
		summaryStore.submission,
		summaryStore.selectedReviewAssignment,
	);
});

const {submission} = storeToRefs(summaryStore);

provide('registerDataChangeCallback', summaryStore.registerDataChangeCallback);
</script>
