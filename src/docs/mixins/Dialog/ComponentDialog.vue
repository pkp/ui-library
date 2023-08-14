<script>
import Component from '@/docs/Component.vue';
import PreviewDialog from './previews/PreviewDialog.vue';
import PreviewDialogTemplate from './previews/PreviewDialog.vue?raw';
import readme from './readme.md?raw';

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
					template: this.extractTemplate(PreviewDialogTemplate),
				},
			],
		};
	},
};
</script>
