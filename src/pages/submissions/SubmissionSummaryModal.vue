<template>
	<SideModalBody>
		<template #header>
			<div class="flex">
				<div class="flex-grow">
					<div class="text-xl-medium">{{ summarySubmission.id }}</div>
					<h2 class="mt-1 text-4xl-bold underline">
						{{ summarySubmission.publications[0].authorsStringShort }}
					</h2>
					<div class="mt-1 text-3xl-normal">
						{{ summarySubmission.publications[0].fullTitle.en }}
					</div>
					<div class="mt-1">
						<StageBubble :stage-id="summarySubmission.stageId">
							<span class="text-lg-normal">
								{{ summarySubmission.stageName }}
							</span>
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
					</div>
				</div>
				<div class="flex items-center">
					<PkpButton>View submission in detail</PkpButton>
				</div>
			</div>
		</template>
		<div class="border-ligh flex w-full border-r border-t border-light">
			<div class="w-3/5 border-r border-light p-4">
				<div class="bg-lightest p-5">
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat.
					</p>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat.
					</p>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat.
					</p>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat.
					</p>
				</div>
			</div>
			<div class="w-2/5">
				<div class="flex flex-col space-y-2 border-b border-light p-4">
					<div>
						<PkpButton :is-primary="true" class="inline-flex">
							Send submission for review
						</PkpButton>
					</div>
					<div>
						<PkpButton class="inline-flex">Accept and skip review</PkpButton>
					</div>
					<div>
						<PkpButton :is-warnable="true" class="inline-flex">
							Decline submission
						</PkpButton>
					</div>
				</div>
				<div class="p-4">Editors assigned</div>
			</div>
		</div>
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
import SideModal from '@/components/Modal/SideModal.vue';
import PkpDialog from '@/components/Modal/Dialog.vue';

import AssignEditorsModal from '@/pages/submissions/AssignEditorsModal.vue';

import {useSubmissionsPageStore} from '@/pages/submissions/submissionsPageStore';
export default {
	components: {
		SideModal,
		SideModalBody,
		StageBubble,
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
		...mapStores(useSubmissionsPageStore),
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
