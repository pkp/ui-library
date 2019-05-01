<script>
import ExampleForm from './ExampleForm.vue';
import PreviewPagination from './previews/PreviewPagination.vue';

export default {
	extends: ExampleForm,
	components: {
		PreviewPagination
	},
	data() {
		return {
			props: PreviewPagination.data().components.example,
			component: 'preview-pagination'
		};
	}
};
</script>
