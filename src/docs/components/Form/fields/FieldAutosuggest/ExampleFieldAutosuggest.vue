<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import PreviewFieldAutosuggest from './PreviewFieldAutosuggest.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		PreviewFieldAutosuggest
	},
	data() {
		return {
			...config,
			component: 'preview-field-autosuggest'
		};
	}
};
</script>
