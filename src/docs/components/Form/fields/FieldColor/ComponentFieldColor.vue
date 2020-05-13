<script>
import Component from '@/docs/Component.vue';
import PreviewFieldColor from './previews/PreviewFieldColor.vue';
import PreviewFieldColorTemplate from '!raw-loader!./previews/PreviewFieldColor.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldColor',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldColor,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldColorTemplate)
				}
			]
		};
	}
};
</script>
