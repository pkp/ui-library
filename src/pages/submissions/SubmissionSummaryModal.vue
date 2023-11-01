<template>
	<SideModalBody>
		<template #header>
			<StageBubble :stage-id="submissionsStore.summarySubmission.stageId">
				{{ submissionsStore.summarySubmission.stageName }}
				<template
					v-if="
						(submissionsStore.summarySubmission.stageId ===
							pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW ||
							submissionsStore.summarySubmission.stageId ===
								pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) &&
						submissionsStore.summarySubmission.reviewRounds.length
					"
				>
					{{
						t('common.inParenthesis', {
							text: t('common.reviewRoundNumber', {
								round:
									submissionsStore.summarySubmission.reviewRounds[
										submissionsStore.summarySubmission.reviewRounds.length - 1
									].round,
							}),
						})
					}}
				</template>
			</StageBubble>
			<span class="summary__id">
				{{ submissionsStore.summarySubmission.id }}
			</span>
		</template>
		<h2 class="summary__authors">
			{{
				submissionsStore.summarySubmission.publications[0].authorsStringShort
			}}
		</h2>
		<div class="summary__title">
			{{ submissionsStore.summarySubmission.publications[0].fullTitle.en }}
		</div>
		<panel>
			<panel-section>
				<p>{{ t('editor.submission.daysInStage') }}: XX</p>
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
	</SideModalBody>
</template>

<script>
import {mapStores} from 'pinia';

import SideModalBody from '@/components/Modal/SideModalBody.vue';
import StageBubble from '@/components/StageBubble/StageBubble.vue';
import Panel from '@/components/Panel/Panel.vue';
import PanelSection from '@/components/Panel/PanelSection.vue';

import {useSubmissionsStore} from '@/pages/submissions/submissionsStore';

export default {
	components: {SideModalBody, StageBubble, Panel, PanelSection},
	props: {
		testProp: Function,
	},
	data() {
		return {pkp: window.pkp};
	},
	computed: {...mapStores(useSubmissionsStore)},
	mounted() {
		console.log('submission summary mounted');
	},
	unmounted() {
		console.log('submission summary unmounted');
	},
};
</script>
