<template>
	<h1 class="text-dark">Submissions</h1>
	<span v-if="store.isLoading">Is loading</span>

	<ul class="border p-4">
		<li v-for="submission in store.submissions" :key="submission.id">
			<span class="bg-medium text-lg-normal">
				{{ submission.publications[0].fullTitle.en }}
			</span>
		</li>
	</ul>
</template>

<script setup>
import {defineProps, onUnmounted} from 'vue';
import {
	useExamplePageStore,
	disposeExamplePageStore,
	initExamplePageStore,
} from './examplePageStore';

// Define Page Props
const props = defineProps({pageServerConfig: {required: true, type: Object}});

// Connect with store
initExamplePageStore(props.pageServerConfig);
const store = useExamplePageStore();
onUnmounted(() => {
	disposeExamplePageStore();
});
</script>
