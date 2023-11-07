<template>
	<SideModalBody>
		<template #header>
			<StageBubble :stage-id="summarySubmission.stageId">
				{{ summarySubmission.stageName }}
				<template
					v-if="
						(summarySubmission.stageId ===
							pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW ||
							summarySubmission.stageId ===
								pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) &&
						summarySubmission.reviewRounds.length
					"
				>
					{{
						t('common.inParenthesis', {
							text: t('common.reviewRoundNumber', {
								round:
									summarySubmission.reviewRounds[
										summarySubmission.reviewRounds.length - 1
									].round,
							}),
						})
					}}
				</template>
			</StageBubble>
			<span class="summary__id">
				{{ summarySubmission.id }}
			</span>
		</template>
		<h2 class="summary__authors">
			{{ summarySubmission.publications[0].authorsStringShort }}
		</h2>
		<div class="summary__title">
			{{ summarySubmission.publications[0].fullTitle.en }}
		</div>
		<panel>
			<panel-section>
				<pkp-button @click="submissionsStore.openAssignEditorsModal()">
					Assign Editors
				</pkp-button>
				<p>{{ t('editor.submission.daysInStage') }}: XX</p>
				<PkpButton @click="openTestDialog()">open test dialog</PkpButton>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
					eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
					minim veniam, quis nostrud exercitation ullamco laboris nisi ut
					aliquip ex ea commodo consequat.
				</p>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
					eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
					minim veniam, quis nostrud exercitation ullamco laboris nisi ut
					aliquip ex ea commodo consequat.
				</p>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
					eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
					minim veniam, quis nostrud exercitation ullamco laboris nisi ut
					aliquip ex ea commodo consequat.
				</p>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
					eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
					minim veniam, quis nostrud exercitation ullamco laboris nisi ut
					aliquip ex ea commodo consequat.
				</p>
			</panel-section>
		</panel>
		<PkpDialog
			:open="testDialogOpened"
			v-bind="testDialogProps"
			@close="closeTestDialog()"
		/>
		<SideModal
			close-label="Close"
			:open="isModalOpenedAssignEditors"
			@close="closeAssignEditorsModal"
		>
			<AssignEditorsModal />
		</SideModal>
	</SideModalBody>
</template>

<script>
import {mapStores} from 'pinia';

import SideModalBody from '@/components/Modal/SideModalBody.vue';
import StageBubble from '@/components/StageBubble/StageBubble.vue';
import Panel from '@/components/Panel/Panel.vue';
import PanelSection from '@/components/Panel/PanelSection.vue';
import SideModal from '@/components/Modal/SideModal.vue';
import PkpDialog from '@/components/Modal/Dialog.vue';

import AssignEditorsModal from '@/pages/submissions/AssignEditorsModal.vue';

import {useSubmissionsStore} from '@/pages/submissions/submissionsStore';
export default {
	components: {
		SideModal,
		SideModalBody,
		StageBubble,
		Panel,
		PanelSection,
		AssignEditorsModal,
		PkpDialog,
	},
	props: {
		summarySubmission: Object,
	},
	data() {
		return {
			pkp: window.pkp,
			testDialogOpened: false,
			isModalOpenedAssignEditors: false,
		};
	},
	methods: {
		openTestDialog() {
			this.testDialogOpened = true;
		},
		closeTestDialog() {
			this.testDialogOpened = false;
		},
	},
	computed: {
		...mapStores(useSubmissionsStore),
		testDialogProps() {
			return {
				name: 'cancel',
				title: 'title',
				message: 'message',
				actions: [
					{
						label: 'Action1',
						isWarnable: true,
						callback: () => {
							window.location = this.submissionUrl;
						},
					},
					{
						label: 'Close',
						callback: (close) => close(),
					},
				],
			};
		},
	},
	mounted() {
		console.log('submission summary mounted');
	},
	unmounted() {
		console.log('submission summary unmounted');
	},
};
</script>
