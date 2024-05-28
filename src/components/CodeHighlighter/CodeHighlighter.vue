<template>
	<highlightjs :language="language" :code="code" />
</template>

<script>
import xml from 'highlight.js/lib/languages/xml';
import hljs from 'highlight.js/lib/core';
import hljsVuePlugin from '@highlightjs/vue-plugin';

hljs.registerLanguage('xml', xml);

// A map to store language modules
const languageMap = {
	xml,
	// Add more language modules imported above
};

const supportedLanguages = Object.keys(languageMap);
</script>

<script setup>
defineProps({
	code: {
		type: String,
		required: true,
	},
	language: {
		type: String,
		required: true,
		validator: (value) => {
			if (!supportedLanguages.includes(value)) {
				console.warn(`Invalid language prop: ${value}`);
				return false;
			}

			return true;
		},
	},
});

const highlightjs = hljsVuePlugin.component;
</script>

<style>
@import 'highlight.js/styles/github.css';
</style>
