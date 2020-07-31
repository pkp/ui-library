<script>
import Component from '@/docs/Component.vue';
import PreviewDoiListPanelOJS from '@/docs/components/ListPanel/previews/PreviewDoiListPanelOJS';
import PreviewDoiListPanelOJSTemplate from '!raw-loader!./previews/PreviewDoiListPanelOJS.vue';

export default {
	extends: Component,
	data() {
		return {
			name: 'DoiListPanelOJS',
			examples: [
				{
					component: PreviewDoiListPanelOJS,
					name: 'Base',
					template: this.extractTemplate(PreviewDoiListPanelOJSTemplate)
				}
			]
		};
	}
};
</script>
