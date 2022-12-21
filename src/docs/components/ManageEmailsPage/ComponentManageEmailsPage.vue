<script>
import Component from '@/docs/Component.vue';
import PreviewManageEmailsPage from './previews/PreviewManageEmailsPage.vue';
import PreviewManageEmailsPageTemplate from '!raw-loader!./previews/PreviewManageEmailsPage.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'ManageEmailsPage',
			readme: readme,
			examples: [
				{
					component: PreviewManageEmailsPage,
					name: 'Base',
					template: this.extractTemplate(PreviewManageEmailsPageTemplate),
				},
			],
		};
	},
};
</script>
