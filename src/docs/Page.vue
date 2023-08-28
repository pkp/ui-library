<template>
	<div class="page bodyText" v-html="output" />
</template>

<script>
import {marked} from 'marked';
import highlightjs from 'highlight.js';

export default {
	data() {
		return {output: ''};
	},
	watch: {
		'$route.params.page'(oldPage, newPage) {
			this.loadCurrentPage();
		},
	},
	methods: {
		async loadCurrentPage() {
			let markdown;

			let page = this.$route.name;
			if (page === 'page') {
				page = this.$route.params.page || 'index';
			}
			if (page) {
				try {
					markdown = await import('./pages/' + page + '.md?raw');
				} catch (e) {
					markdown = '';
				}
				if (markdown) {
					marked.setOptions({
						highlight(code) {
							return highlightjs.highlightAuto(code).value;
						},
					});
					this.output = marked.parse(markdown.default);
					return;
				}
			}
		},
	},
	mounted() {
		this.loadCurrentPage();
	},
};
</script>

<style lang="less">
@import '../styles/_import';

.page {
	margin-top: 4rem;
}

.inlinePreview {
	border: @bg-border-light;
	border-bottom: none;
	padding: 1rem;
	font-size: @font-sml;
	line-height: 1.8em;

	+ pre {
		margin-top: 0;
	}
}

.inlinePreview--accessibleSearch {
	input {
		margin-left: 0.5em;
		border: @bg-border;
		border-radius: @radius;
		padding: 0.25em 0.5em;
	}
}

.inlinePreview--accessibleButton {
	button {
		background: transparent;
		border: none;
		color: red;
	}
}
</style>
