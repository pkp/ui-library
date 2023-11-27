<template>
	<SideModalBody>
		<template #header>
			<div class="flex">
				<div class="flex-grow">
					<div class="text-xl-medium">{{ submission.id }}</div>
					<h2 class="mt-1 text-4xl-bold underline">
						{{ submission.publications[0].authorsStringShort }}
					</h2>
					<div class="mt-1 text-3xl-normal">
						{{ submission.publications[0].fullTitle.en }}
					</div>
					<div class="mt-1">
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
												submission.reviewRounds[
													submission.reviewRounds.length - 1
												].round,
										}),
									})
								}}
							</template>
						</StageBubble>
					</div>
				</div>
				<div class="flex items-center">
					<PkpButton element="a" :href="submission.urlWorkflow">
						View submission in detail
					</PkpButton>
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
				<div class="p-4">
					<div class="text-lg-bold">Editors assigned:</div>
					<div>
						<PkpButton is-link="true" @click="store.openAssignParticipantModal">
							Assign Editors
						</PkpButton>
					</div>
				</div>
			</div>
		</div>
		<SideModal
			close-label="Close"
			:open="store.isModalOpenedAssignParticipantSecondary"
			@close="store.closeAssignParticipantModal"
		>
			<AssignEditorsModal />
		</SideModal>
	</SideModalBody>
</template>

<script setup>
import PkpButton from '@/components/Button/Button.vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import StageBubble from '@/components/StageBubble/StageBubble.vue';
import SideModal from '@/components/Modal/SideModal.vue';

import AssignEditorsModal from '@/pages/submissions/AssignEditorsModal.vue';

import {useSubmissionsPageStore} from '@/pages/submissions/submissionsPageStore';

const pkp = window.pkp;

const store = useSubmissionsPageStore();

const {selectedSubmission: submission} = store;
</script>
