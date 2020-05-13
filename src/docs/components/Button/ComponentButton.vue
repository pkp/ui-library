<script>
import Component from '@/docs/Component.vue';
import PreviewButton from './previews/PreviewButton.vue';
import PreviewButtonTemplate from '!raw-loader!./previews/PreviewButton.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'Button',
			readme: readme,
			examples: [
				{
					component: PreviewButton,
					name: 'Base',
					template: this.extractTemplate(PreviewButtonTemplate)
				}
			]
		};
	}
};
</script>
