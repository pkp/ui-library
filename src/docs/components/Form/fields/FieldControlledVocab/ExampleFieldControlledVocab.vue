<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import PreviewFieldControlledVocab from './PreviewFieldControlledVocab.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		PreviewFieldControlledVocab
	},
	data() {
		return {
			...config,
			component: 'preview-field-controlled-vocab'
		};
	}
};
</script>
