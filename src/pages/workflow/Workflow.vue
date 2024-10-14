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
					v-for="(item, index) in workflowStore.headerItems"
					:key="`${index} - ${item.component} - ${item?.props?.namespace}`"
				/>
			</div>
		</template>
		<SideModalLayoutMenu2Columns>
			<template #menu>
				<nav>
					<SideMenu v-bind="workflowStore.sideMenuProps"></SideMenu>
				</nav>
			</template>
			<template #heading>
				<h2>{{ workflowStore.stageTitle }}</h2>
			</template>
			<template
				v-if="workflowStore.publicationControlsLeft?.length"
				#publication-controls-left
			>
				<div class="flex flex-col gap-y-2" data-cy="workflow-controls-left">
					<component
						:is="Components[item.component] || item.component"
						v-bind="item.props"
						v-for="(item, index) in workflowStore.publicationControlsLeft"
						:key="`${index} - ${item.component} - ${item?.props?.namespace}`"
					/>
				</div>
			</template>
			<template
				v-if="workflowStore.publicationControlsRight?.length"
				#publication-controls-right
			>
				<div class="flex gap-x-3" data-cy="workflow-controls-right">
					<component
						:is="Components[item.component] || item.component"
						v-bind="item.props"
						v-for="(item, index) in workflowStore.publicationControlsRight"
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
						v-for="(item, index) in workflowStore.primaryItems"
						:key="`${index} - ${item.component} - ${item?.props?.namespace}`"
					/>
				</div>
			</template>
			<template v-if="workflowStore.actionItems?.length" #actions>
				<div
					class="flex flex-col items-start space-y-3 p-4"
					data-cy="workflow-action-items"
				>
					<component
						:is="Components[item.component] || item.component"
						v-for="(item, index) in workflowStore.actionItems"
						v-bind="item.props"
						:key="`${index} - ${item.component} - ${item?.props?.namespace}`"
					></component>
				</div>
			</template>
			<template v-if="workflowStore.secondaryItems?.length" #secondary>
				<div
					class="flex flex-col space-y-4 p-4"
					data-cy="workflow-secondary-items"
				>
					<component
						:is="Components[item.component] || item.component"
						v-for="(item, index) in workflowStore.secondaryItems"
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
import WorkflowPrimaryBasicMetadata from './components/primary/WorkflowPrimaryBasicMetadata.vue';
import WorkflowReviewRoundStatus from './components/primary/WorkflowReviewRoundStatus.vue';
// Publications
import WorkflowNotificationDisplay from './components/primary/WorkflowNotificationDisplay.vue';
import WorkflowPaymentDropdown from './components/header/WorkflowPaymentDropdown.vue';
import WorkflowPublicationForm from './components/publication/WorkflowPublicationForm.vue';
import WorkflowPublicationJats from './components/publication/WorkflowPublicationJats.vue';
import WorkflowPublicationVersionControl from './components/publication/WorkflowPublicationVersionControl.vue';
import WorkflowChangeSubmissionLanguage from './components/publication/WorkflowChangeSubmissionLanguage.vue';

import WorkflowActionButton from './components/action/WorkflowActionButton.vue';
import WorkflowRecommendOnlyControls from './components/action/WorkflowRecommendOnlyControls.vue';
import WorkflowRecommendOnlyListingRecommendations from './components/secondary/WorkflowRecommendOnlyListingRecommendations.vue';

import WorkflowSubmissionStatus from './components/primary/WorkflowSubmissionStatus.vue';
import GalleyManager from '@/managers/GalleyManager/GalleyManager.vue';
import WorkflowPublicationEditDisabled from './components/publication/WorkflowPublicationEditDisabled.vue';
import {useWorkflowStore} from './workflowStore';
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
	WorkflowActionButton,
	WorkflowRecommendOnlyControls,
	WorkflowRecommendOnlyListingRecommendations,
	WorkflowNotificationDisplay,
	WorkflowPaymentDropdown,
	WorkflowPrimaryBasicMetadata,
	WorkflowReviewRoundStatus,
	WorkflowPublicationForm,
	WorkflowPublicationJats,
	WorkflowPublicationVersionControl,
	WorkflowChangeSubmissionLanguage,
	WorkflowSubmissionStatus,
	WorkflowPublicationEditDisabled,
};

const props = defineProps({
	submissionId: {type: Number, required: true},
	pageInitConfig: {type: Object, required: true},
});

const workflowStore = useWorkflowStore(props);

const {getExtendedStage, getExtendedStageLabel} = useSubmission();

const extendedStage = computed(
	() => submission.value && getExtendedStage(submission.value),
);
const stageLabel = computed(
	() => submission.value && getExtendedStageLabel(submission.value),
);

const {submission, selectedPublication} = storeToRefs(workflowStore);
</script>
