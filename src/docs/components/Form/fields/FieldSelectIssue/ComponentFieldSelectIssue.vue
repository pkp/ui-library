<script>
import {markRaw} from 'vue';
import Component from '@/docs/Component.vue';
import PreviewFieldSelectIssue from './previews/PreviewFieldSelectIssue.vue';
import PreviewFieldSelectIssueTemplate from './previews/PreviewFieldSelectIssue.vue?raw';
import PreviewFieldSelectIssuePublished from './previews/PreviewFieldSelectIssuePublished.vue';
import PreviewFieldSelectIssuePublishedTemplate from './previews/PreviewFieldSelectIssuePublished.vue?raw';
import PreviewFieldSelectIssueScheduled from './previews/PreviewFieldSelectIssueScheduled.vue';
import PreviewFieldSelectIssueScheduledTemplate from './previews/PreviewFieldSelectIssueScheduled.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldSelectIssue',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: markRaw(PreviewFieldSelectIssue),
					name: 'Base',
					template: this.extractTemplate(PreviewFieldSelectIssueTemplate),
				},
				{
					component: markRaw(PreviewFieldSelectIssuePublished),
					name: 'Published',
					template: this.extractTemplate(
						PreviewFieldSelectIssuePublishedTemplate,
					),
				},
				{
					component: markRaw(PreviewFieldSelectIssueScheduled),
					name: 'Scheduled',
					template: this.extractTemplate(
						PreviewFieldSelectIssueScheduledTemplate,
					),
				},
			],
		};
	},
};
</script>
