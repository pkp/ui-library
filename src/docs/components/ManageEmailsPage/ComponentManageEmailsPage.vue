<script>
import Component from '@/docs/Component.vue';
import PreviewManageEmailsPage from './previews/PreviewManageEmailsPage.vue';
import PreviewManageEmailsPageTemplate from './previews/PreviewManageEmailsPage.vue?raw';
import readme from './readme.md?raw';

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
