<template>
  <highlightjs
    :language="language"
    :code="code"
  />
</template>

<script>
import hljs from 'highlight.js/lib/core';
import hljsVuePlugin from '@highlightjs/vue-plugin';

// Importing the language modules
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import markdown from 'highlight.js/lib/languages/markdown';
import css from 'highlight.js/lib/languages/css';
import latex from 'highlight.js/lib/languages/latex';
// Add more languages

// A map to store language modules
const languageMap = {
    javascript,
    xml,
    markdown,
    css,
    latex,
    // Add more languages here
};

const supportedLanguages = Object.keys(languageMap);

export default {
    components: {
        highlightjs: hljsVuePlugin.component
    },
    props: {
        code: {
            type: String,
            required: true
        },

        language: {
            type: String,
            required: true,
            validator(value) {
                if (!supportedLanguages.includes(value)) {
                    console.error(`Unsupported language: ${value}. Supported languages are: ${supportedLanguages.join(', ')}`);
                    return false;
                }

                return true;
            }
        }
    },
    created() {
        this.loadLanguageModule(this.language);
    },
    methods: {
        loadLanguageModule(language) {
            const languageModule = languageMap[language];
            if (languageModule) {
                hljs.registerLanguage(language, languageModule);
            } else {
                console.error(`Language module for ${language} is not available.`);
            }
        }
    }
};
</script>

<style>
    @import 'highlight.js/styles/default.css';
</style>