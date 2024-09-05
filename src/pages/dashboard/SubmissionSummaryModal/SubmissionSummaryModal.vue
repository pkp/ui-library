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
			<PkpButton element="a" :href="submission.urlWorkflow">
				{{ t('dashboard.summary.viewSubmissionInDetail') }}
			</PkpButton>
		</template>
		<SideModalLayoutMenu2Columns>
			<template #menu>
				<SideMenu v-bind="summaryStore.sideMenuProps"></SideMenu>
			</template>
			<template #heading>{{ summaryStore.stageTitle }}</template>
			<template
				v-if="summaryStore.publicationControlsLeft?.length"
				#publication-controls-left
			>
				<div class="flex gap-x-3">
					<component
						:is="Components[item.component] || item.component"
						v-bind="item.props"
						v-for="(item, index) in summaryStore.publicationControlsLeft"
						:key="`${index} - ${Object.values(item.props).join('-')}`"
					/>
				</div>
			</template>
			<template
				v-if="summaryStore.publicationControlsRight?.length"
				#publication-controls-right
			>
				<div class="flex gap-x-3">
					<component
						:is="Components[item.component] || item.component"
						v-bind="item.props"
						v-for="(item, index) in summaryStore.publicationControlsRight"
						:key="`${index} - ${Object.values(item.props).join('-')}`"
					/>
				</div>
			</template>

			<template #primary>
				<div class="flex flex-col gap-y-5 bg-secondary p-5">
					<component
						:is="Components[item.component] || item.component"
						v-bind="item.props"
						v-for="(item, index) in summaryStore.primaryItems"
						:key="`${index} - ${Object.values(item.props).join('-')}`"
					/>
				</div>
			</template>
			<template v-if="summaryStore.actionItems?.length" #actions>
				<div class="flex flex-col items-start space-y-3 p-4">
					<component
						:is="Components[item.component] || item.component"
						v-for="(item, index) in summaryStore.actionItems"
						v-bind="item.props"
						:key="`${index} - ${Object.values(item.props).join('-')}`"
					></component>
				</div>
			</template>
			<template v-if="summaryStore.secondaryItems?.length" #secondary>
				<div class="flex flex-col space-y-4 p-4">
					<component
						:is="Components[item.component] || item.component"
						v-for="(item, index) in summaryStore.secondaryItems"
						v-bind="item.props"
						:key="`${index} - ${Object.values(item.props).join('-')}`"
					></component>
				</div>
			</template>
		</SideModalLayoutMenu2Columns>
	</SideModalBody>
</template>

<script setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import PkpButton from '@/components/Button/Button.vue';
import SideMenu from '@/components/SideMenu/SideMenu.vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import StageBubble from '@/components/StageBubble/StageBubble.vue';
import FileManager from '@/managers/FileManager/FileManager.vue';
import DiscussionManager from '@/managers/DiscussionManager/DiscussionManager.vue';
import ParticipantManager from '@/managers/ParticipantManager/ParticipantManager.vue';

import ReviewerManager from '@/managers/ReviewerManager/ReviewerManager.vue';
import ContributorManager from '@/managers/ContributorManager/ContributorManager.vue';
import LastActivity from './primaryItems/LastActivity.vue';
import PrimaryBasicMetadata from './primaryItems/PrimaryBasicMetadata.vue';
import ReviewRoundStatus from './primaryItems/ReviewRoundStatus.vue';
// Publications
import PublicationTitleAbstractForm from './primaryItems/PublicationTitleAbstractForm.vue';
import PublicationVersionControl from './publicationControls/PublicationVersionControl.vue';
import ActionButton from './actionItems/ActionButton.vue';
import WorkflowRecommendationControls from './actionItems/WorkflowRecommendationControls.vue';
import EditorsAssigned from './metaItems/EditorsAssigned.vue';
import BasicMetadata from './metaItems/BasicMetadata.vue';
import SubmissionStatus from './primaryItems/SubmissionStatus.vue';
import PublicationEditDisabled from './primaryItems/PublicationEditDisabled.vue';
import IssueAssigned from './metaItems/IssueAssigned.vue';
import {useSubmissionSummaryStore} from './submissionSummaryStore';
import SideModalLayoutMenu2Columns from '@/components/Modal/SideModalLayoutMenu2Columns.vue';

import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';
const {t, localizeSubmission} = useLocalize();

const Components = {
	FileManager,
	ReviewerManager,
	DiscussionManager,
	ContributorManager,
	ParticipantManager,
	LastActivity,
	ActionButton,
	WorkflowRecommendationControls,
	EditorsAssigned,
	BasicMetadata,
	PrimaryBasicMetadata,
	IssueAssigned,
	ReviewRoundStatus,
	PublicationTitleAbstractForm,
	PublicationVersionControl,
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
