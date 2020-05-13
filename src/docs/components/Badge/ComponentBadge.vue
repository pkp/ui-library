<script>
import Component from '@/docs/Component.vue';
import PreviewBadge from './previews/PreviewBadge.vue';
import PreviewBadgeTemplate from '!raw-loader!./previews/PreviewBadge.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'Badge',
			readme: readme,
			examples: [
				{
					component: PreviewBadge,
					name: 'Base',
					template: this.extractTemplate(PreviewBadgeTemplate)
				}
			]
		};
	}
};
</script>
