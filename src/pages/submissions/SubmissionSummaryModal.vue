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
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import StageBubble from '@/components/StageBubble/StageBubble.vue';
import Panel from '@/components/Panel/Panel.vue';
import PanelSection from '@/components/Panel/PanelSection.vue';

export default {
	components: {SideModalBody, StageBubble, Panel, PanelSection},
	props: {
		testProp: Function,
	},
	data() {
		return {pkp: window.pkp};
	},
	computed: {
		summarySubmission() {
			return this.$store.submissions.summarySubmission;
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
