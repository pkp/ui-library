<template>
	<div>
		This example is using minInputLength = 2 and a function to map the API
		response.
		<field-mapped-autosuggest
			v-bind="field"
			@change="change"
			:minInputLength="2"
		/>
	</div>
</template>

<script>
import FieldMappedAutosuggest from '@/components/Form/fields/FieldMappedAutosuggest.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import FieldBaseAutosuggest from '../../../helpers/field-autosuggest';

export default {
	extends: PreviewFieldBase,
	components: {
		FieldMappedAutosuggest
	},
	data() {
		return {
			field: {
				...fieldBase,
				...FieldBaseAutosuggest,
				label: 'Sections',
				apiUrl: '/usernames.json',
				count: 20,
				dataMapper(item) {
					return new Option(item.fullName, item.id);
				}
			}
		};
	}
};
</script>
