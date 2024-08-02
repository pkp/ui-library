<template>
	<div class="pb-8">
		<h1 ref="wrapper" class="mb-1 mt-8 flex text-3xl-bold">
			{{ pageTitle }}
		</h1>
		<p class="mt-1 text-lg-normal">
			{{ pageTitleDescription }}
		</p>
	</div>
</template>

<script setup>
import {defineProps} from 'vue';

defineProps({
	pageTitle: {type: String, required: true},
	pageTitleDescription: {type: String, required: true},
});
</script>
