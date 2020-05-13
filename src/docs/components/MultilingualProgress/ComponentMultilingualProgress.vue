<script>
import Component from '@/docs/Component.vue';
import PreviewMultilingualProgress from './previews/PreviewMultilingualProgress.vue';
import PreviewMultilingualProgressTemplate from '!raw-loader!./previews/PreviewMultilingualProgress.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'Multilingual Progress',
			readme: readme,
			examples: [
				{
					component: PreviewMultilingualProgress,
					name: 'Base',
					template: this.extractTemplate(PreviewMultilingualProgressTemplate)
				}
			]
		};
	}
};
</script>
