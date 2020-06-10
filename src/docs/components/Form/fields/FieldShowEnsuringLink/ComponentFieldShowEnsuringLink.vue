<script>
import Component from '@/docs/Component.vue';
import PreviewFieldShowEnsuringLink from './previews/PreviewFieldShowEnsuringLink.vue';
import PreviewFieldShowEnsuringLinkTemplate from '!raw-loader!./previews/PreviewFieldShowEnsuringLink.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewFieldShowEnsuringLinkTemplate)
				}
			]
		};
	}
};
</script>
