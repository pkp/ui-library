<template>
	<div class="pkpul-sidebar">
		<h2 class="pkpul-sidebar__heading">Components</h2>
		<ul class="pkpul-sidebar__list">
			<li v-for="example in examples" class="pkpul-sidebar__list-item">
				<router-link :to="example.url">{{ example.label }}</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
import ComponentExamples from './examples.js';

export default {
	name: 'Sidebar',
	data: function () {
		return {
			examples: ComponentExamples,
		};
	},
};
</script>

<style lang="less">
@import '../styles/_config';

.pkpul-sidebar {
	padding-top: 2em;
	background: #ddd;
}

.pkpul-sidebar__heading {
	margin: 0;
	padding: 0 1em;
	font-weight: @bold;
	font-size: @font-sml;
	line-height: @line-sml;
}

.pkpul-sidebar__list {
	margin: 0 0 2em;
	padding: 0;
}

.pkpul-sidebar__list-item {
	margin: 0;
	padding: 0.5em 1em;
	list-style: none;
}
</style>
