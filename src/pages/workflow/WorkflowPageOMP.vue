<template>
	<WorkflowPage />
</template>

<script setup>
import {markRaw} from 'vue';

import WorkflowPage from './WorkflowPage.vue';
import {useWorkflowStore} from './workflowStore';
import {useWorkflowConfigOMP as useWorkflowConfig} from './composables/useWorkflowConfig/useWorkflowConfigOMP';
import {useWorkflowNavigationConfigOMP as useWorkflowNavigationConfig} from './composables/useWorkflowNavigationConfig/useWorkflowNavigationConfigOMP';

import FileManager from '@/managers/FileManager/FileManager.vue';
import ReviewerManager from '@/managers/ReviewerManager/ReviewerManager.vue';
import DiscussionManager from '@/managers/DiscussionManager/DiscussionManager.vue';
import ContributorManager from '@/managers/ContributorManager/ContributorManager.vue';
import ParticipantManager from '@/managers/ParticipantManager/ParticipantManager.vue';
import GalleyManager from '@/managers/GalleyManager/GalleyManager.vue';
import ChapterManager from '@/managers/ChapterManager/ChapterManager.vue';
import PublicationFormatManager from '@/managers/PublicationFormatManager/PublicationFormatManager.vue';
import RepresentativeManager from '@/managers/RepresentativeManager/RepresentativeManager.vue';
import WorkflowMarketingForm from './components/publication/WorkflowMarketingForm.vue';
import WorkflowWorkTypeOMP from './components/header/WorkflowWorkTypeOMP.vue';
import WorkflowActionButton from './components/action/WorkflowActionButton.vue';
import WorkflowRecommendOnlyControls from './components/action/WorkflowRecommendOnlyControls.vue';
import WorkflowRecommendOnlyListingRecommendations from './components/secondary/WorkflowRecommendOnlyListingRecommendations.vue';
import WorkflowNotificationDisplay from './components/primary/WorkflowNotificationDisplay.vue';
import WorkflowListingEmails from './components/primary/WorkflowListingEmails.vue';
import WorkflowPublicationForm from './components/publication/WorkflowPublicationForm.vue';
import WorkflowPublicationVersionControl from './components/publication/WorkflowPublicationVersionControl.vue';
import WorkflowChangeSubmissionLanguage from './components/publication/WorkflowChangeSubmissionLanguage.vue';
import WorkflowPrimaryBasicMetadata from './components/primary/WorkflowPrimaryBasicMetadata.vue';
import WorkflowSubmissionStatus from './components/primary/WorkflowSubmissionStatus.vue';
import WorkflowPublicationEditDisabled from './components/publication/WorkflowPublicationEditDisabled.vue';

const props = defineProps({
	submissionId: {type: Number, required: true},
	pageInitConfig: {type: Object, required: true},
});

const Components = markRaw({
	FileManager,
	ReviewerManager,
	DiscussionManager,
	ContributorManager,
	ParticipantManager,
	GalleyManager,
	ChapterManager,
	RepresentativeManager,
	PublicationFormatManager,
	WorkflowActionButton,
	WorkflowRecommendOnlyControls,
	WorkflowRecommendOnlyListingRecommendations,
	WorkflowNotificationDisplay,
	WorkflowListingEmails,
	WorkflowPrimaryBasicMetadata,
	WorkflowPublicationForm,
	WorkflowPublicationVersionControl,
	WorkflowChangeSubmissionLanguage,
	WorkflowSubmissionStatus,
	WorkflowPublicationEditDisabled,
	WorkflowMarketingForm,
	WorkflowWorkTypeOMP,
});

const store = useWorkflowStore({
	props,
	Components,
	useWorkflowConfig,
	useWorkflowNavigationConfig,
});

store.setExpandedKeys([
	'workflow',
	'publication',
	'marketing',
	`workflow_${pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW}`,
	`workflow_${pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW}`,
]);
</script>
