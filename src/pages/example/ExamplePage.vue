<template>
	<h1 class="text-dark">Example page</h1>
	<ExampleCounter />
	<ExampleSubmissions />
</template>

<script setup>
import {defineProps, onUnmounted} from 'vue';

/** Just by importing component, they become available in the template */
import ExampleCounter from './ExampleCounter.vue';
import ExampleSubmissions from './ExampleSubmissions.vue';

import {
	disposeExamplePageStore,
	initExamplePageStore,
	useExamplePageStore,
} from './examplePageStore';

// Define Page Props
const props = defineProps({
	/** URL to fetch submissions from API */
	submissionsApiUrl: {type: String, required: true},
});

// Expose the page server configuration to the store, before its created so it can use is during initialisation
initExamplePageStore(props);

// Initialise store
useExamplePageStore();

onUnmounted(() => {
	// Clean up the store if the page is closed
	disposeExamplePageStore();
});
</script>
