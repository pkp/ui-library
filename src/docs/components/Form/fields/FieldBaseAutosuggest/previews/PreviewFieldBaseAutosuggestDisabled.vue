<template>
	<example-field-user-autosuggest
		v-bind="field"
		:isDisabled="true"
		:selected="[
			{
				value: 1,
				label: 'Daniel Barnes'
			}
		]"
		:value="[1]"
		@change="change"
	/>
</template>

<script>
import PreviewFieldBaseAutosuggest from './PreviewFieldBaseAutosuggest.vue';

export default {
	extends: PreviewFieldBaseAutosuggest
};
</script>
