<template>
	<TableCellTreeExpand
		:is-displayed="
			citationStore.citationsMetadataLookup && citation.isStructured
		"
		:is-expanded="citationStore.isExpanded(citation)"
		@toggle="citationStore.toggleItemExpansion(citation)"
	></TableCellTreeExpand>
</template>

<script setup>
import {computed} from 'vue';
import {useCitationManagerStore} from '.§citationManagerStore';
import TableCellTreeExpand from '@/components/Table/TableCellTreeExpand.vue';

const props = defineProps({
	citation: {type: Object, required: true},
});

const citation = computed(() => props.citation);

const citationStore = useCitationManagerStore();
</script>
