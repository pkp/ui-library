<script>
import Component from '@/docs/Component.vue';
import PreviewProgressBar from './previews/PreviewProgressBar.vue';
import PreviewProgressBarTemplate from '!raw-loader!./previews/PreviewProgressBar.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'ProgressBar',
			readme: readme,
			examples: [
				{
					component: PreviewProgressBar,
					name: 'Base',
					template: this.extractTemplate(PreviewProgressBarTemplate)
				}
			]
		};
	}
};
</script>
