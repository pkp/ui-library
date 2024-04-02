<template>
	<TableCell>
		<span class="text-base-normal">
			<StageBubble :stage-id="item.stageId">
				{{ item.stageName }}
				<template
					v-if="
						(item.stageId === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW ||
							item.stageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) &&
						item.reviewRounds.length
					"
				>
					{{
						t('common.inParenthesis', {
							text: t('common.reviewRoundNumber', {
								round: item.reviewRounds[item.reviewRounds.length - 1].round,
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

defineProps({item: {type: Object, required: true}});

const pkp = window.pkp;
</script>
