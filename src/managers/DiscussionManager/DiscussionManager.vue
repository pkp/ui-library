<template>
	<GridWrapper
		:key="`${submissionId} - ${stageId}`"
		grid-component="grid.queries.QueriesGridHandler"
		:params="params"
	></GridWrapper>
</template>
<script setup>
import GridWrapper from '@/components/GridWrapper/GridWrapper.vue';
import {computed} from 'vue';

const props = defineProps({
	submissionId: {type: String, required: true},
	stageId: {type: String, required: true},
});

const params = computed(() => ({
	submissionId: props.submissionId,
	stageId: props.stageId,
}));
</script>
