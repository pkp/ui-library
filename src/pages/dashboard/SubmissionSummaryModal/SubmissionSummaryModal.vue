<template>
	<SideModalBody>
		<template #pre-title>
			{{ submissionId }}
		</template>
		<template #title>
			<span v-if="selectedPublication" class="underline">
				{{ selectedPublication.authorsStringShort }}
			</span>
		</template>
		<template v-if="selectedPublication" #description>
			{{
				localizeSubmission(
					selectedPublication.fullTitle,
					selectedPublication.locale,
				)
			}}
		</template>
		<template v-if="submission" #post-description>
			<StageBubble :extended-stage="extendedStage">
				<span class="text-lg-normal">
					{{ stageLabel }}
				</span>
			</StageBubble>
		</template>
		<template v-if="submission" #actions>
			<div class="flex gap-x-4">
				<component
					:is="Components[item.component] || item.component"
					v-bind="item.props"
					v-for="(item, index) in summaryStore.headerItems"
					:key="`${index} - ${item.component} - ${item?.props?.namespace}`"
				/>
			</div>
		</template>
		<SideModalLayoutMenu2Columns>
			<template #menu>
				<nav>
					<SideMenu v-bind="summaryStore.sideMenuProps"></SideMenu>
				</nav>
			</template>
			<template #heading>
				<h2>{{ summaryStore.stageTitle }}</h2>
			</template>
			<template
				v-if="summaryStore.publicationControlsLeft?.length"
				#publication-controls-left
			>
				<div class="flex flex-col gap-y-2" data-cy="workflow-controls-left">
					<component
						:is="Components[item.component] || item.component"
						v-bind="item.props"
						v-for="(item, index) in summaryStore.publicationControlsLeft"
						:key="`${index} - ${item.component} - ${item?.props?.namespace}`"
					/>
				</div>
			</template>
			<template
				v-if="summaryStore.publicationControlsRight?.length"
				#publication-controls-right
			>
				<div class="flex gap-x-3" data-cy="workflow-controls-right">
					<component
						:is="Components[item.component] || item.component"
						v-bind="item.props"
						v-for="(item, index) in summaryStore.publicationControlsRight"
						:key="`${index} - ${item.component} - ${item?.props?.namespace}`"
					/>
				</div>
			</template>

			<template #primary>
				<div
					class="flex flex-col gap-y-5 bg-secondary p-5"
					data-cy="workflow-primary-items"
				>
					<component
						:is="Components[item.component] || item.component"
						v-bind="item.props"
						v-for="(item, index) in summaryStore.primaryItems"
						:key="`${index} - ${item.component} - ${item?.props?.namespace}`"
					/>
				</div>
			</template>
			<template v-if="summaryStore.actionItems?.length" #actions>
				<div
					class="flex flex-col items-start space-y-3 p-4"
					data-cy="workflow-action-items"
				>
					<component
						:is="Components[item.component] || item.component"
						v-for="(item, index) in summaryStore.actionItems"
						v-bind="item.props"
						:key="`${index} - ${item.component} - ${item?.props?.namespace}`"
					></component>
				</div>
			</template>
			<template v-if="summaryStore.secondaryItems?.length" #secondary>
				<div
					class="flex flex-col space-y-4 p-4"
					data-cy="workflow-secondary-items"
				>
					<component
						:is="Components[item.component] || item.component"
						v-for="(item, index) in summaryStore.secondaryItems"
						v-bind="item.props"
						:key="`${index} - ${item.component} - ${item?.props?.namespace}`"
					></component>
				</div>
			</template>
		</SideModalLayoutMenu2Columns>
	</SideModalBody>
</template>

<script setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import SideMenu from '@/components/SideMenu/SideMenu.vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import StageBubble from '@/components/StageBubble/StageBubble.vue';
import FileManager from '@/managers/FileManager/FileManager.vue';
import DiscussionManager from '@/managers/DiscussionManager/DiscussionManager.vue';
import ParticipantManager from '@/managers/ParticipantManager/ParticipantManager.vue';

import ReviewerManager from '@/managers/ReviewerManager/ReviewerManager.vue';
import ContributorManager from '@/managers/ContributorManager/ContributorManager.vue';
import PrimaryBasicMetadata from './primaryItems/PrimaryBasicMetadata.vue';
import ReviewRoundStatus from './primaryItems/ReviewRoundStatus.vue';
// Publications
import WorkflowNotificationDisplay from './primaryItems/WorkflowNotificationDisplay.vue';
import WorkflowPaymentDropdown from './actionItems/WorkflowPaymentDropdown.vue';
import PublicationForm from './primaryItems/PublicationForm.vue';
import PublicationJats from './primaryItems/PublicationJats.vue';
import PublicationVersionControl from './publicationControls/PublicationVersionControl.vue';
import WorkflowChangeSubmissionLanguage from './publicationControls/WorkflowChangeSubmissionLanguage.vue';

import ActionButton from './actionItems/ActionButton.vue';
import WorkflowRecommendOnlyControls from './actionItems/WorkflowRecommendOnlyControls.vue';
import WorkflowRecommendOnlyListingRecommendations from './components/WorkflowRecommendOnlyListingRecommendations.vue';

import BasicMetadata from './metaItems/BasicMetadata.vue';
import SubmissionStatus from './primaryItems/SubmissionStatus.vue';
import GalleyManager from '@/managers/GalleyManager/GalleyManager.vue';
import PublicationEditDisabled from './primaryItems/PublicationEditDisabled.vue';
import IssueAssigned from './metaItems/IssueAssigned.vue';
import {useSubmissionSummaryStore} from './submissionSummaryStore';
import SideModalLayoutMenu2Columns from '@/components/Modal/SideModalLayoutMenu2Columns.vue';

import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';
const {localizeSubmission} = useLocalize();

const Components = {
	FileManager,
	ReviewerManager,
	DiscussionManager,
	ContributorManager,
	ParticipantManager,
	GalleyManager,
	ActionButton,
	WorkflowRecommendOnlyControls,
	WorkflowRecommendOnlyListingRecommendations,
	WorkflowNotificationDisplay,
	BasicMetadata,
	WorkflowPaymentDropdown,
	PrimaryBasicMetadata,
	IssueAssigned,
	ReviewRoundStatus,
	PublicationForm,
	PublicationJats,
	PublicationVersionControl,
	WorkflowChangeSubmissionLanguage,
	SubmissionStatus,
	PublicationEditDisabled,
};

const props = defineProps({
	submissionId: {type: Number, required: true},
	pageInitConfig: {type: Object, required: true},
});

const summaryStore = useSubmissionSummaryStore(props);

const {getExtendedStage, getExtendedStageLabel} = useSubmission();

const extendedStage = computed(
	() => submission.value && getExtendedStage(submission.value),
);
const stageLabel = computed(
	() => submission.value && getExtendedStageLabel(submission.value),
);

const {submission, selectedPublication} = storeToRefs(summaryStore);
</script>
