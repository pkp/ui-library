<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldRichTextarea from '@/components/Form/fields/FieldRichTextarea.vue';
import config from './config';

config.props = {
	...config.props,
	toolbar: FieldRichTextarea.props.toolbar.default(),
	plugins: FieldRichTextarea.props.plugins.default(),
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
