<template>
	<div data-cy="publication-format-manager">
		<GridWrapper
			:key="`${submissionId} - ${publicationId}`"
			grid-component="grid.catalogEntry.PublicationFormatGridHandler"
			:params="params"
		></GridWrapper>
	</div>
</template>
<script setup>
import GridWrapper from '@/components/GridWrapper/GridWrapper.vue';
import {computed} from 'vue';

const props = defineProps({
	submissionId: {type: String, required: true},
	publicationId: {type: String, required: true},
});

const params = computed(() => ({
	submissionId: props.submissionId,
	publicationId: props.publicationId,
}));
</script>
