<template>
	<example-field-user-autosuggest v-bind="field" @change="change" />
</template>

<script>
import ExampleFieldUserAutosuggest from './ExampleFieldUserAutosuggest.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import FieldBaseAutosuggest from '../../../helpers/field-autosuggest-users';

export default {
	extends: PreviewFieldBase,
	components: {
		ExampleFieldUserAutosuggest
	},
	data() {
		return {
			field: {
				...fieldBase,
				...FieldBaseAutosuggest,
				apiUrl: '/usernames.json'
			}
		};
	}
};
</script>
