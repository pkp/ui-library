<template>
	<h1 class="text-default">Example page</h1>
	<ExampleCounter />
	<ExampleSubmissions />
</template>

<script setup>
import {defineProps} from 'vue';

/** Just by importing component, they become available in the template */
import ExampleCounter from './ExampleCounter.vue';
import ExampleSubmissions from './ExampleSubmissions.vue';

import {useExamplePageStore} from './examplePageStore';

// Define Page Props
const props = defineProps({
	/** URL to fetch submissions from API */
	submissionsApiUrl: {type: String, required: true},
});

// Initialise store
useExamplePageStore(props);
</script>
