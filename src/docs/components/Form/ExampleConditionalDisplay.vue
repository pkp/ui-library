<script>
import ExampleForm from './ExampleForm.vue';
import PreviewConditionalDisplay from './previews/PreviewConditionalDisplay.vue';

export default {
	extends: ExampleForm,
	components: {
		PreviewConditionalDisplay
	},
	data() {
		return {
			props: PreviewConditionalDisplay.data().components.example,
			component: 'preview-conditional-display'
		};
	}
};
</script>
