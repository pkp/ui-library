<script>
import Component from '@/docs/Component.vue';
import PreviewDateRange from './previews/PreviewDateRange.vue';
import PreviewDateRangeTemplate from './previews/PreviewDateRange.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'DateRange',
			readme: readme,
			examples: [
				{
					component: PreviewDateRange,
					name: 'Base',
					template: this.extractTemplate(PreviewDateRangeTemplate),
				},
			],
		};
	},
};
</script>
