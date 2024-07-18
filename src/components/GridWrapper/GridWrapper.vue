<template><div ref="contentDiv"></div></template>

<script setup>
import {ref, onMounted} from 'vue';
import {useFetch} from '@/composables/useFetch';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';

/**
 * 	{load_url_in_div id="queriesGrid" url=$queriesGridUrl}
 */

const props = defineProps({
	gridComponent: {type: String, required: true},
	params: {type: Object, required: true},
});

// http://localhost:7003/index.php/publicknowledge/$$$call$$$/grid/queries/query-notes-grid/fetch-grid?submissionId=24&stageId=1
// http://localhost:7003/index.php/publicknowledge/$$$call$$$/grid/queries/queries-grid/fetch-grid?submissionId=24&stageId=1&_=1721118709241

const {url} = useLegacyGridUrl({
	component: props.gridComponent, // 'grid.queries.QueryNotesGridHandler',
	op: 'fetchGrid',
	params: props.params,
});

// Fetches grid content from legacy endpoints
const {data: gridData, fetch: fetchGridData} = useFetch(url);

const contentDiv = ref(null);

onMounted(async () => {
	await fetchGridData();
	if (gridData.value) {
		$(contentDiv.value).html(gridData.value.content);
	}
});
</script>
