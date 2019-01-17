<script>
import Example from '@/docs/Example.vue';
import PreviewTab from './previews/PreviewTab.vue';
import fileContent from '!raw-loader!./previews/PreviewTab.vue';

export default {
	extends: Example,
	components: {
		PreviewTab
	},
	data() {
		return {
			component: 'preview-tab',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
