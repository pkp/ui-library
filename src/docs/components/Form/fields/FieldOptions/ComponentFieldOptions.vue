<script>
import Component from '@/docs/Component.vue';
import PreviewFieldOptions from './previews/PreviewFieldOptions.vue';
import PreviewFieldOptionsTemplate from '!raw-loader!./previews/PreviewFieldOptions.vue';
import PreviewFieldOptionsRadio from './previews/PreviewFieldOptionsRadio.vue';
import PreviewFieldOptionsRadioTemplate from '!raw-loader!./previews/PreviewFieldOptionsRadio.vue';
import PreviewFieldOptionsConfirm from './previews/PreviewFieldOptionsConfirm.vue';
import PreviewFieldOptionsConfirmTemplate from '!raw-loader!./previews/PreviewFieldOptionsConfirm.vue';
import PreviewFieldOptionsOrderable from './previews/PreviewFieldOptionsOrderable.vue';
import PreviewFieldOptionsOrderableTemplate from '!raw-loader!./previews/PreviewFieldOptionsOrderable.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldOptions',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldOptions,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldOptionsTemplate)
				},
				{
					component: PreviewFieldOptionsRadio,
					name: 'Radio',
					template: this.extractTemplate(PreviewFieldOptionsRadioTemplate)
				},
				{
					component: PreviewFieldOptionsConfirm,
					name: 'Confirm',
					template: this.extractTemplate(PreviewFieldOptionsConfirmTemplate)
				},
				{
					component: PreviewFieldOptionsOrderable,
					name: 'Orderable',
					template: this.extractTemplate(PreviewFieldOptionsOrderableTemplate)
				}
			]
		};
	}
};
</script>
