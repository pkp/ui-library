<script>
import Example from '@/docs/Example.vue';
import PreviewSubmissionsListPanelOJS from './previews/PreviewSubmissionsListPanelOJS.vue';
import fileContent from '!raw-loader!./previews/PreviewSubmissionsListPanelOJS.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewSubmissionsListPanelOJS
	},
	data() {
		return {
			...config,
			component: 'preview-submissions-list-panel-o-j-s',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
