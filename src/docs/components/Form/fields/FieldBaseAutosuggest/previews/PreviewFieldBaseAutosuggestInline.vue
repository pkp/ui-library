<template>
	<example-field-user-autosuggest
		v-bind="field"
		label="To:"
		:isLabelInline="true"
		@change="change"
	/>
</template>

<script>
import PreviewFieldBaseAutosuggest from './PreviewFieldBaseAutosuggest.vue';

export default {
	extends: PreviewFieldBaseAutosuggest
};
</script>
