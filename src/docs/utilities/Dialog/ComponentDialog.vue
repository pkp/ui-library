<script>
import Component from '@/docs/Component.vue';
import PreviewDialog from './previews/PreviewDialog.vue';
import PreviewDialogTemplate from '!raw-loader!./previews/PreviewDialog.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'Dialog',
			readme: readme,
			examples: [
				{
					component: PreviewDialog,
					name: 'Dialog',
					template: this.extractTemplate(PreviewDialogTemplate)
				}
			]
		};
	}
};
</script>
