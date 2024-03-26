<template>
	<h1 ref="wrapper" class="app__pageHeading">
		{{ pageTitle }}
	</h1>
	<p>
		{{ pageTitleDescription }}
	</p>
</template>

<script setup>
import {defineProps} from 'vue';

defineProps({
	pageTitle: {type: String, required: true},
	pageTitleDescription: {type: String, required: true},
});
</script>
