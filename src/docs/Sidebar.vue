<template>
	<div class="sidebar">
		<ul>
			<li v-for="example in examples">
				<router-link :to="example.url">{{ example.label }}</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
import ComponentExamples from './examples.js';

export default {
	name: 'app',
	data: function () {
		return {
			examples: ComponentExamples,
		};
	},
};
</script>
