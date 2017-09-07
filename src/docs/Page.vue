<template>
	<div class="pkpul-page" v-html="content"></div>
</template>

<script>
import marked from 'marked';

export default {
	name: 'app',
	props: ['page'],
	computed: {
		content: function () {
			var page = this.page || 'index';
			return marked(require('./pages/' + page + '.md'));
		},
	},
};
</script>

<style lang="less">
@import '../styles/_import';

.pkpul-page {
	padding: 2em;
	max-width: 45em;
	line-height: 1.8em;

	h1:first-child {
		margin-top: 0;
	}

	h2 {
		margin-top: 3em;
		padding-bottom: 0.5em;
		border-bottom: 1px solid #333;
	}

	h3 {
		margin-top: 3em;
	}

	code {
		display: inline-block;
		background: #eee;
		border-radius: 0.15em;
		padding: 0 0.5em;
		margin: 0 0.25em;
		font-size: 12px;
		font-family: monospace;
	}
}

.pkpul-element {
	margin: 2rem 0;

	code {
		margin: 0;
		font-family: monospace;
		font-size: 12px;
		line-height: 1.2rem;
		padding: 2rem;
		width: 100%;
		background: @primary;
		color: #fff;
		white-space: pre;
		-moz-tab-size: 2;
		-o-tab-size: 2;
		tab-size: 2;
	}
}

.pkpul-element__preview {
	padding: 2rem;
	border: 1px solid #ddd;
	border-bottom: none;
}

.pkpul-accessible-search {
    border: 1px solid #ddd;
    padding: 0.25em 0.5em;
    border-radius: 0.25em;
    display: inline-block;

	input {
		border: none;
		margin-left: 0.5em;
	}
}

.pkpul-accessible-icon-only-button {

	button {
		background: transparent;
		border: none;
		color: red;
		cursor: pointer;
	}
}
</style>
