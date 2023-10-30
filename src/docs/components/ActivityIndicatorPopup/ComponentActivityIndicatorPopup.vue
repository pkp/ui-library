<script>
import {markRaw} from 'vue';
import Component from '@/docs/Component.vue';
import PreviewActivityIndicatorPopup from './previews/PreviewActivityIndicatorPopup.vue';
import PreviewActivityIndicatorPopupTemplate from './previews/PreviewActivityIndicatorPopup.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'ActivityIndicator',
			readme: readme,
			examples: [
				{
					component: markRaw(PreviewActivityIndicatorPopup),
					name: 'Base',
					template: this.extractTemplate(PreviewActivityIndicatorPopupTemplate),
				},
			],
		};
	},
};
</script>
