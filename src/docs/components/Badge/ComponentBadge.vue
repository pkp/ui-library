<script>
import Component from '@/docs/Component.vue';
import PreviewBadge from './previews/PreviewBadge.vue';
import PreviewBadgeTemplate from './previews/PreviewBadge.vue?raw';
import readme from './readme.md?raw';

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
					template: this.extractTemplate(PreviewBadgeTemplate),
				},
			],
		};
	},
};
</script>
