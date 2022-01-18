<script>
import Component from '@/docs/Component.vue';
import PreviewSteps from './previews/PreviewSteps.vue';
import PreviewStepsTemplate from '!raw-loader!./previews/PreviewSteps.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'Steps',
			readme: readme,
			examples: [
				{
					component: PreviewSteps,
					name: 'Base',
					template: this.extractTemplate(PreviewStepsTemplate)
				}
			]
		};
	}
};
</script>
