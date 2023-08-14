<script>
import Component from '@/docs/Component.vue';
import PreviewHelpButton from './previews/PreviewHelpButton.vue';
import PreviewHelpButtonTemplate from './previews/PreviewHelpButton.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'HelpButton',
			readme: readme,
			examples: [
				{
					component: PreviewHelpButton,
					name: 'Base',
					template: this.extractTemplate(PreviewHelpButtonTemplate),
				},
			],
		};
	},
};
</script>
