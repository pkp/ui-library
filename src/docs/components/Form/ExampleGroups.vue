<script>
import ExampleForm from './ExampleForm.vue';
import PreviewGroups from './previews/PreviewGroups.vue';

export default {
	extends: ExampleForm,
	components: {
		PreviewGroups
	},
	data() {
		return {
			props: PreviewGroups.data().components.example,
			component: 'preview-groups'
		};
	}
};
</script>
