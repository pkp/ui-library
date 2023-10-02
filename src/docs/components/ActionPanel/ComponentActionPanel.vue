<script>
import {markRaw} from 'vue';
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewActionPanel.vue';
import PreviewTemplate from './previews/PreviewActionPanel.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'ActionPanel',
			readme: readme,
			examples: [
				{
					component: markRaw(Preview),
					name: 'Base',
					template: this.extractTemplate(PreviewTemplate),
				},
			],
		};
	},
};
</script>
