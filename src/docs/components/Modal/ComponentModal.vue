<script>
import Component from '@/docs/Component.vue';
import PreviewModal from './previews/PreviewModal.vue';
import PreviewModalTemplate from '!raw-loader!./previews/PreviewModal.vue';
import PreviewModalForm from './previews/PreviewModalForm.vue';
import PreviewModalFormTemplate from '!raw-loader!./previews/PreviewModalForm.vue';
import PreviewModalTabs from './previews/PreviewModalTabs.vue';
import PreviewModalTabsTemplate from '!raw-loader!./previews/PreviewModalTabs.vue';
import PreviewModalActions from './previews/PreviewModalActions.vue';
import PreviewModalActionsTemplate from '!raw-loader!./previews/PreviewModalActions.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'Modal',
			readme: readme,
			examples: [
				{
					component: PreviewModal,
					name: 'Base',
					template: this.extractTemplate(PreviewModalTemplate)
				},
				{
					component: PreviewModalForm,
					name: 'With Form',
					template: this.extractTemplate(PreviewModalFormTemplate)
				},
				{
					component: PreviewModalTabs,
					name: 'With Tabs',
					template: this.extractTemplate(PreviewModalTabsTemplate)
				},
				{
					component: PreviewModalActions,
					name: 'With Custom Actions',
					template: this.extractTemplate(PreviewModalActionsTemplate)
				}
			]
		};
	}
};
</script>
