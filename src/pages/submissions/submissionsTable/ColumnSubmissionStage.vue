<template>
	<TableCell>
		<span class="text-base-normal">
			<StageBubble :stage-id="submission.stageId">
				{{ submission.stageName }}
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
		</span>
	</TableCell>
</template>

<script setup>
import {defineProps} from 'vue';

import TableCell from '@/components/TableNext/TableCell.vue';
import StageBubble from '@/components/StageBubble/StageBubble.vue';

defineProps({submission: {type: Object, required: true}});

const pkp = window.pkp;
</script>
