<script>
import Component from '@/docs/Component.vue';
import PreviewFieldSelectIssue from './previews/PreviewFieldSelectIssue.vue';
import PreviewFieldSelectIssueTemplate from '!raw-loader!./previews/PreviewFieldSelectIssue.vue';
import PreviewFieldSelectIssuePublished from './previews/PreviewFieldSelectIssuePublished.vue';
import PreviewFieldSelectIssuePublishedTemplate from '!raw-loader!./previews/PreviewFieldSelectIssuePublished.vue';
import PreviewFieldSelectIssueScheduled from './previews/PreviewFieldSelectIssueScheduled.vue';
import PreviewFieldSelectIssueScheduledTemplate from '!raw-loader!./previews/PreviewFieldSelectIssueScheduled.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldSelectIssue',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldSelectIssue,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldSelectIssueTemplate)
				},
				{
					component: PreviewFieldSelectIssuePublished,
					name: 'Published',
					template: this.extractTemplate(
						PreviewFieldSelectIssuePublishedTemplate
					)
				},
				{
					component: PreviewFieldSelectIssueScheduled,
					name: 'Scheduled',
					template: this.extractTemplate(
						PreviewFieldSelectIssueScheduledTemplate
					)
				}
			]
		};
	}
};
</script>
