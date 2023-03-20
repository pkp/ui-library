<template>
	<field-rich-text v-bind="field" value="" @change="change" />
</template>

<script>
import FieldRichText from '@/components/Form/fields/FieldRichText.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';

export default {
	extends: PreviewFieldBase,
	components: {
		FieldRichText,
	},
	data() {
		return {
			field: {
				...fieldBase,
				name: 'title',
				component: 'field-rich-text',
				label: 'Title',
				groupId: 'default',
				isMultilingual: false,
				plugins: 'paste',
				toolbar: 'formatgroup',
				value: '',
				i18nFormattingLabel: 'Formatting',
				isMultilingual: false,
			},
		};
	},
};
</script>
