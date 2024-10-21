<template>
	<GridWrapper
		:key="`${submissionId}`"
		grid-component="grid.catalogEntry.RepresentativesGridHandler"
		:params="params"
	></GridWrapper>
</template>
<script setup>
import GridWrapper from '@/components/GridWrapper/GridWrapper.vue';
import {computed} from 'vue';

const props = defineProps({
	submissionId: {type: String, required: true},
});

const params = computed(() => ({
	submissionId: props.submissionId,
}));
</script>
