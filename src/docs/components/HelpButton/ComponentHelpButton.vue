<script>
import Component from '@/docs/Component.vue';
import PreviewHelpButton from './previews/PreviewHelpButton.vue';
import PreviewHelpButtonTemplate from '!raw-loader!./previews/PreviewHelpButton.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewHelpButtonTemplate)
				}
			]
		};
	}
};
</script>
