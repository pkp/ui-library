<script>
import Example from '@/docs/Example.vue';
import SelectReviewerListPanel from './previews/PreviewSelectReviewerListPanel.vue';
import fileContent from '!raw-loader!./previews/PreviewSelectReviewerListPanel.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		SelectReviewerListPanel
	},
	data() {
		return {
			...config,
			component: 'select-reviewer-list-panel',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
