<template>
	<div class="page" v-html="content"></div>
</template>

<script>
// import Examples from './examples.js';
import marked from 'marked';

export default {
	name: 'app',
	props: ['page'],
	computed: {
		content: function () {
			// var page = this.page || 'index';
			return marked('# PKP UI Library');
		},
	},
};
</script>
