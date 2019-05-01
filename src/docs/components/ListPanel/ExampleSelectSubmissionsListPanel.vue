<script>
import Example from '@/docs/Example.vue';
import SelectSubmissionsListPanel from './previews/PreviewSelectSubmissionsListPanel.vue';
import fileContent from '!raw-loader!./previews/PreviewSelectSubmissionsListPanel.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		SelectSubmissionsListPanel
	},
	data() {
		return {
			...config,
			component: 'select-submissions-list-panel',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
