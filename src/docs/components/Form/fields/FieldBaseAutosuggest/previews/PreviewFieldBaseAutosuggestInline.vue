<template>
	<example-field-user-autosuggest
		v-bind="field"
		label="To:"
		:is-label-inline="true"
		@change="change"
	/>
</template>

<script>
import PreviewFieldBaseAutosuggest from './PreviewFieldBaseAutosuggest.vue';

export default {
	extends: PreviewFieldBaseAutosuggest,
};
</script>
