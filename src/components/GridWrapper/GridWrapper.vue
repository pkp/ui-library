<template><div ref="contentDiv"></div></template>

<script setup>
import {ref, onMounted} from 'vue';
import {useFetch} from '@/composables/useFetch';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';

const props = defineProps({
	gridComponent: {type: String, required: true},
	params: {type: Object, required: true},
});

const {url} = useLegacyGridUrl({
	component: props.gridComponent,
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
