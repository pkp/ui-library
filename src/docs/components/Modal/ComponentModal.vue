<script>
import Component from '@/docs/Component.vue';
import PreviewModal from './previews/PreviewModal.vue';
import PreviewModalTemplate from './previews/PreviewModal.vue?raw';
import PreviewModalForm from './previews/PreviewModalForm.vue';
import PreviewModalFormTemplate from './previews/PreviewModalForm.vue?raw';
import PreviewModalTabs from './previews/PreviewModalTabs.vue';
import PreviewModalTabsTemplate from './previews/PreviewModalTabs.vue?raw';
import PreviewModalActions from './previews/PreviewModalActions.vue';
import PreviewModalActionsTemplate from './previews/PreviewModalActions.vue?raw';
import PreviewModalSide from './previews/PreviewModalSide.vue';
import PreviewModalSideTemplate from './previews/PreviewModalSide.vue?raw';
import readme from './readme.md?raw';

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
					template: this.extractTemplate(PreviewModalTemplate),
				},
				{
					component: PreviewModalForm,
					name: 'With Form',
					template: this.extractTemplate(PreviewModalFormTemplate),
				},
				{
					component: PreviewModalTabs,
					name: 'With Tabs',
					template: this.extractTemplate(PreviewModalTabsTemplate),
				},
				{
					component: PreviewModalActions,
					name: 'With Custom Actions',
					template: this.extractTemplate(PreviewModalActionsTemplate),
				},
				{
					component: PreviewModalSide,
					name: 'Side Panel',
					template: this.extractTemplate(PreviewModalSideTemplate),
				},
			],
		};
	},
};
</script>
