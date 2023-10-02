<script>
import {markRaw} from 'vue';

import Component from '@/docs/Component.vue';
import PreviewButton from './previews/PreviewButton.vue';
import PreviewButtonTemplate from './previews/PreviewButton.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'Button',
			readme: readme,
			examples: [
				{
					component: markRaw(PreviewButton),
					name: 'Base',
					template: this.extractTemplate(PreviewButtonTemplate),
				},
			],
		};
	},
};
</script>
