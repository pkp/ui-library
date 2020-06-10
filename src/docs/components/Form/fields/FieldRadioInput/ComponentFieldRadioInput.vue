<script>
import Component from '@/docs/Component.vue';
import PreviewFieldRadioInput from './previews/PreviewFieldRadioInput.vue';
import PreviewFieldRadioInputTemplate from '!raw-loader!./previews/PreviewFieldRadioInput.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldRadioInput',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldRadioInput,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldRadioInputTemplate)
				}
			]
		};
	}
};
</script>
