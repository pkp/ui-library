<script>
import Component from '@/docs/Component.vue';
import PreviewTooltip from './previews/PreviewTooltip.vue';
import PreviewTooltipTemplate from './previews/PreviewTooltip.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'Tooltip',
			readme: readme,
			examples: [
				{
					component: PreviewTooltip,
					name: 'Base',
					template: this.extractTemplate(PreviewTooltipTemplate),
				},
			],
		};
	},
};
</script>
