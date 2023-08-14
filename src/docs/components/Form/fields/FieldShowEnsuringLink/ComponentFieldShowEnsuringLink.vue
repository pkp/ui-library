<script>
import Component from '@/docs/Component.vue';
import PreviewFieldShowEnsuringLink from './previews/PreviewFieldShowEnsuringLink.vue';
import PreviewFieldShowEnsuringLinkTemplate from './previews/PreviewFieldShowEnsuringLink.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldShowEnsuringLink',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldShowEnsuringLink,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldShowEnsuringLinkTemplate),
				},
			],
		};
	},
};
</script>
