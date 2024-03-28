<template>
	<h2>Submissions</h2>
	<span v-if="store.isLoading">Is loading</span>
	<ul v-else class="border p-4">
		<li v-for="submission in store.submissions" :key="submission.id">
			<span class="bg-tertiary text-lg-normal">
				{{ submission.publications[0].fullTitle.en }}
			</span>
		</li>
	</ul>
</template>

<script setup>
import {useExamplePageStore} from './examplePageStore';

/** Connect with store, to be able use any state/computed/methods from it */
const store = useExamplePageStore();
</script>
