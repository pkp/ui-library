<template>
	<WorkflowPage />
</template>

<script setup>
import {markRaw} from 'vue';

import WorkflowPage from './WorkflowPage.vue';
import {useWorkflowStore} from './workflowStore';

import FileManager from '@/managers/FileManager/FileManager.vue';
import ReviewerManager from '@/managers/ReviewerManager/ReviewerManager.vue';
import DiscussionManagerLegacy from '@/managers/DiscussionManagerLegacy/DiscussionManagerLegacy.vue';
import ContributorManager from '@/managers/ContributorManager/ContributorManager.vue';
import ParticipantManager from '@/managers/ParticipantManager/ParticipantManager.vue';
import ReviewerSuggestionManager from '@/managers/ReviewerSuggestionManager/ReviewerSuggestionManager.vue';
import DiscussionManager from '@/managers/DiscussionManager/DiscussionManager.vue';
import GalleyManager from '@/managers/GalleyManager/GalleyManager.vue';
import WorkflowActionButton from './components/action/WorkflowActionButton.vue';
import WorkflowRecommendOnlyControls from './components/action/WorkflowRecommendOnlyControls.vue';
import WorkflowRecommendOnlyListingRecommendations from './components/secondary/WorkflowRecommendOnlyListingRecommendations.vue';
import WorkflowNotificationDisplay from './components/primary/WorkflowNotificationDisplay.vue';
import WorkflowListingEmails from './components/primary/WorkflowListingEmails.vue';
import WorkflowPaymentDropdown from './components/header/WorkflowPaymentDropdown.vue';
import WorkflowPublicationForm from './components/publication/WorkflowPublicationForm.vue';
import WorkflowPublicationJats from './components/publication/WorkflowPublicationJats.vue';
import WorkflowPublicationEditor from './components/publication/WorkflowPublicationEditor.vue';
import WorkflowPublicationVersionControl from './components/publication/WorkflowPublicationVersionControl.vue';
import WorkflowChangeSubmissionLanguage from './components/publication/WorkflowChangeSubmissionLanguage.vue';
import WorkflowPrimaryBasicMetadata from './components/primary/WorkflowPrimaryBasicMetadata.vue';
import WorkflowSubmissionStatus from './components/primary/WorkflowSubmissionStatus.vue';
import WorkflowPublicationEditDisabled from './components/publication/WorkflowPublicationEditDisabled.vue';

import {useWorkflowConfigOJS as useWorkflowConfig} from './composables/useWorkflowConfig/useWorkflowConfigOJS';
import {useWorkflowNavigationConfigOJS as useWorkflowNavigationConfig} from './composables/useWorkflowNavigationConfig/useWorkflowNavigationConfigOJS';

const props = defineProps({
	submissionId: {type: Number, required: true},
	pageInitConfig: {type: Object, required: true},
});

const Components = markRaw({
	FileManager,
	ReviewerManager,
	DiscussionManagerLegacy,
	ContributorManager,
	ParticipantManager,
	ReviewerSuggestionManager,
	DiscussionManager,
	GalleyManager,
	WorkflowActionButton,
	WorkflowRecommendOnlyControls,
	WorkflowRecommendOnlyListingRecommendations,
	WorkflowNotificationDisplay,
	WorkflowListingEmails,
	WorkflowPaymentDropdown,
	WorkflowPrimaryBasicMetadata,
	WorkflowPublicationForm,
	WorkflowPublicationJats,
	WorkflowPublicationEditor,
	WorkflowPublicationVersionControl,
	WorkflowChangeSubmissionLanguage,
	WorkflowSubmissionStatus,
	WorkflowPublicationEditDisabled,
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
]);
</script>
