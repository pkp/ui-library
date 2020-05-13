<script>
import Component from '@/docs/Component.vue';
import PreviewFieldPubId from './previews/PreviewFieldPubId.vue';
import PreviewFieldPubIdTemplate from '!raw-loader!./previews/PreviewFieldPubId.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewFieldPubIdTemplate)
				}
			]
		};
	}
};
</script>
