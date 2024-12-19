<template>
	<WorkflowPage />
</template>

<script setup>
import {markRaw} from 'vue';

import WorkflowPage from './WorkflowPage.vue';
import {useWorkflowStore} from './workflowStore';

import {useWorkflowConfigOPS as useWorkflowConfig} from './composables/useWorkflowConfig/useWorkflowConfigOPS';
import {useWorkflowNavigationConfigOPS as useWorkflowNavigationConfig} from './composables/useWorkflowNavigationConfig/useWorkflowNavigationConfigOPS';

import FileManager from '@/managers/FileManager/FileManager.vue';
import ReviewerManager from '@/managers/ReviewerManager/ReviewerManager.vue';
import DiscussionManager from '@/managers/DiscussionManager/DiscussionManager.vue';
import ContributorManager from '@/managers/ContributorManager/ContributorManager.vue';
import ParticipantManager from '@/managers/ParticipantManager/ParticipantManager.vue';
import GalleyManager from '@/managers/GalleyManager/GalleyManager.vue';
import WorkflowActionButton from './components/action/WorkflowActionButton.vue';
import WorkflowActionChangeDecision from './components/action/WorkflowActionChangeDecision.vue';
import WorkflowNotificationDisplay from './components/primary/WorkflowNotificationDisplay.vue';
import WorkflowPublicationForm from './components/publication/WorkflowPublicationForm.vue';
import WorkflowPublicationVersionControl from './components/publication/WorkflowPublicationVersionControl.vue';
import WorkflowChangeSubmissionLanguage from './components/publication/WorkflowChangeSubmissionLanguage.vue';
import WorkflowPrimaryBasicMetadata from './components/primary/WorkflowPrimaryBasicMetadata.vue';
import WorkflowPublicationRelationDropdownOPS from './components/publication/WorkflowPublicationRelationDropdownOPS.vue';
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
	WorkflowActionButton,
	WorkflowActionChangeDecision,
	WorkflowNotificationDisplay,
	WorkflowPrimaryBasicMetadata,
	WorkflowPublicationForm,
	WorkflowPublicationRelationDropdownOPS,
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

store.setExpandedKeys(['workflow', 'publication']);
</script>
