<template>
	<TableCell class="submissions__list__item__stage">
		<stage-bubble :stage-id="submission.stageId">
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
		</stage-bubble>
	</TableCell>
</template>

<script>
import TableCell from '@/components/TableNext/TableCell.vue';

export default {
	components: {
		TableCell,
	},
	data() {
		return {pkp: window.pkp};
	},
	props: {
		submission: Object,
	},
};
</script>
