<script>
import Component from '@/docs/Component.vue';
import PreviewDateRange from './previews/PreviewDateRange.vue';
import PreviewDateRangeTemplate from '!raw-loader!./previews/PreviewDateRange.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewDateRangeTemplate)
				}
			]
		};
	}
};
</script>
