<template>
	<highlightjs :language="language" :code="code" />
</template>

<script setup>
import {defineProps, onBeforeMount} from 'vue';
import hljs from 'highlight.js/lib/core';
import hljsVuePlugin from '@highlightjs/vue-plugin';

// Importing the language modules
import xml from 'highlight.js/lib/languages/xml';
// Add more languages

// A map to store language modules
const languageMap = {
	xml,
	// Add more language modules imported above
};

const supportedLanguages = Object.keys(languageMap);

const props = defineProps({
	code: {
		type: String,
		required: true,
	},
	language: {
		type: String,
		required: true,
	},
});

function loadLanguageModule(language) {
	const languageModule = languageMap[language];
	if (languageModule) {
		hljs.registerLanguage(language, languageModule);
	} else {
		console.error(`Language module for ${language} is not available.`);
	}
}

// Validate the language prop
function validateLanguage(language) {
	if (!supportedLanguages.includes(language)) {
		console.error(
			`Unsupported language: ${language}. Supported languages are: ${supportedLanguages.join(', ')}`,
		);
	}
}

validateLanguage(props.language);

onBeforeMount(() => {
	loadLanguageModule(props.language);
});

const highlightjs = hljsVuePlugin.component;
</script>

<style>
@import 'highlight.js/styles/github.css';
</style>
