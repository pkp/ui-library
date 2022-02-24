<template>
	<field-autosuggest-preset v-bind="field" @change="change" />
</template>

<script>
import FieldAutosuggestPreset from '@/components/Form/fields/FieldAutosuggestPreset.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import FieldBaseAutosuggest from '../../../helpers/field-autosuggest';

export default {
	extends: PreviewFieldBase,
	components: {
		FieldAutosuggestPreset
	},
	data() {
		return {
			field: {
				...fieldBase,
				...FieldBaseAutosuggest,
				label: 'Sections',
				options: [
					{
						value: 1,
						label: 'Articles'
					},
					{
						value: 2,
						label: 'Editorials'
					},
					{
						value: 3,
						label: 'Reviews'
					},
					{
						value: 4,
						label: 'Field Notes'
					},
					{
						value: 5,
						label: 'Roundtables'
					},
					{
						value: 6,
						label: 'Research Reviews'
					},
					{
						value: 7,
						label: 'Conference Proceedings'
					}
				],
				value: [1],
				selected: [
					{
						value: 1,
						label: 'Articles'
					}
				]
			}
		};
	}
};
</script>
