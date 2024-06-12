<template>
	<TableCell>
		<span class="text-base-normal">
			<StageBubble :extended-stage="extendedStage">
				{{ stageLabel }}
			</StageBubble>
		</span>
	</TableCell>
</template>

<script setup>
import {defineProps, computed} from 'vue';

import TableCell from '@/components/TableNext/TableCell.vue';
import StageBubble from '@/components/StageBubble/StageBubble.vue';
import {useSubmission} from '@/composables/useSubmission';

const props = defineProps({item: {type: Object, required: true}});

const {getExtendedStage, getExtendedStageLabel} = useSubmission();

const extendedStage = computed(() => getExtendedStage(props.item));
const stageLabel = computed(() => getExtendedStageLabel(props.item));
</script>
