<template>
	<TableCell class="submissions__list__item__stage">
		<StageBubble :stage-id="submission.stageId">
			{{ submission.stageName }}
			<template
				v-if="
					(submission.stageId === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW ||
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
	</TableCell>
</template>

<script>
import TableCell from '@/components/TableNext/TableCell.vue';
import StageBubble from '@/components/StageBubble/StageBubble.vue';

export default {
	components: {
		TableCell,
		StageBubble,
	},
	props: {
		submission: Object,
	},
	data() {
		return {pkp: window.pkp};
	},
};
</script>
