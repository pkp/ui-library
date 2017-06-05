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
@import '../styles/_config';

.pkpul-page {
	padding: 2em;
	max-width: 45em;
	line-height: 1.8em;

	h1 {
		margin-top: 0;
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
</style>
