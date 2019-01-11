<script>
import ExampleForm from './ExampleForm.vue';
import PreviewErrors from './previews/PreviewErrors.vue';

export default {
	extends: ExampleForm,
	components: {
		PreviewErrors
	},
	data() {
		return {
			props: PreviewErrors.data().forms.example,
			component: 'preview-errors'
		};
	}
};
</script>
