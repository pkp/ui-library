<script>
import Example from '@/docs/Example.vue';
import PreviewSubmissionsListPanel from './previews/PreviewSubmissionsListPanel.vue';
import fileContent from '!raw-loader!./previews/PreviewSubmissionsListPanel.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewSubmissionsListPanel
	},
	data() {
		return {
			...config,
			component: 'preview-submissions-list-panel',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
