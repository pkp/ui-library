<script>
import Component from '@/docs/Component.vue';
import PreviewSteps from './previews/PreviewSteps.vue';
import PreviewStepsTemplate from './previews/PreviewSteps.vue?raw';
import readme from './readme.md?raw';

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
					template: this.extractTemplate(PreviewStepsTemplate),
				},
			],
		};
	},
};
</script>
