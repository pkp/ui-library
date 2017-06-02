<template>
	<div>
		<p>Test component</p>
		<p>{{ name }} / {{ words }}</p>
	</div>
</template>

<script>
export default {
	name: 'test-component',
	data: function () {
		return {
			name: 'default',
			words: 'defaultWords',
		};
	},
};
</script>
