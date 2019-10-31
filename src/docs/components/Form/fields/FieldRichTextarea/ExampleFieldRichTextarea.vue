<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldRichTextarea from '@/components/Form/fields/FieldRichTextarea.vue';
import config from './config';

config.props = {
	...config.props,
	toolbar: 'bold italic superscript subscript | link',
	plugins: 'paste,link',
	init: FieldRichTextarea.props.init.default()
};

export default {
	extends: ExampleFieldBase,
	components: {
		FieldRichTextarea
	},
	data() {
		return {
			...config,
			component: 'field-rich-textarea'
		};
	}
};
</script>
