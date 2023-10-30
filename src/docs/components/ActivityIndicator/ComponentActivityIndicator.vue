<script>
import {markRaw} from 'vue';
import Component from '@/docs/Component.vue';
import PreviewActivityIndicator from './previews/PreviewActivityIndicator.vue';
import PreviewActivityIndicatorTemplate from './previews/PreviewActivityIndicator.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'ActivityIndicator',
			readme: readme,
			examples: [
				{
					component: markRaw(PreviewActivityIndicator),
					name: 'Base',
					template: this.extractTemplate(PreviewActivityIndicatorTemplate),
				},
			],
		};
	},
};
</script>
