<script>
import Example from '@/docs/Example.vue';
import PreviewList from './previews/PreviewList.vue';
import fileContent from '!raw-loader!./previews/PreviewList.vue';

export default {
	extends: Example,
	components: {
		PreviewList
	},
	data() {
		return {
			component: 'preview-list',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
