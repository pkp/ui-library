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

		<div
			v-if="summaryStore.summaryConfig"
			class="border-ligh flex w-full border-r border-t border-light"
		>
			<div class="w-3/5 border-r border-light p-4">
				<div class="bg-secondary p-5">
					<FileManager />
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
				<div
					class="flex flex-col items-start space-y-2 border-b border-light p-4"
				>
					<PkpButton
						v-for="editorialAction in summaryStore.summaryConfig
							.editorialActions"
						:key="editorialAction.action"
						:is-primary="editorialAction.type === 'primary'"
						:is-secondary="editorialAction.type === 'secondary'"
						:is-warnable="editorialAction.type === 'negative'"
						@click="
							() =>
								dashboardStore.handleItemAction(editorialAction.action, {
									submissionId: submission.id,
								})
						"
					>
						{{ editorialAction.label }}
					</PkpButton>
				</div>
				<div class="p-4">
					<div>
						<h3 class="text-lg-bold">Editors assigned: (todo t)</h3>
						<div>
							<PkpButton
								is-link="true"
								@click="
									() =>
										dashboardStore.openAssignParticipantModal(
											props.selectedSubmission,
										)
								"
							>
								Assign Editors
							</PkpButton>
						</div>
					</div>
					<div class="mt-4">
						<h3 class="text-lg-bold">Issue No (todo t):</h3>
						<p>Not assigned</p>
					</div>
				</div>
			</div>
		</div>
	</SideModalBody>
</template>

<script setup>
import {storeToRefs} from 'pinia';
import PkpButton from '@/components/Button/Button.vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import StageBubble from '@/components/StageBubble/StageBubble.vue';
import FileManager from './FileManager.vue';
import {useSubmissionsPageStore} from './submissionsPageStore';

import {useSubmissionSummaryStore} from '@/pages/submissions/submissionSummaryStore';

const pkp = window.pkp;

const props = defineProps({submissionId: {type: String, required: true}});

const summaryStore = useSubmissionSummaryStore(props);
const dashboardStore = useSubmissionsPageStore(props);

const {submission} = storeToRefs(summaryStore);
</script>
