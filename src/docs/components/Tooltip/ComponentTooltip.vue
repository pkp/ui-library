<script>
import Component from '@/docs/Component.vue';
import PreviewTooltip from './previews/PreviewTooltip.vue';
import PreviewTooltipTemplate from '!raw-loader!./previews/PreviewTooltip.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewTooltipTemplate)
				}
			]
		};
	}
};
</script>
