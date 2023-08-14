<script>
import Component from '@/docs/Component.vue';
import PreviewFieldPubId from './previews/PreviewFieldPubId.vue';
import PreviewFieldPubIdTemplate from './previews/PreviewFieldPubId.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldPubId',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldPubId,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldPubIdTemplate),
				},
			],
		};
	},
};
</script>
