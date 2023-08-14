<script>
import Component from '@/docs/Component.vue';
import PreviewFieldOptions from './previews/PreviewFieldOptions.vue';
import PreviewFieldOptionsTemplate from './previews/PreviewFieldOptions.vue?raw';
import PreviewFieldOptionsRadio from './previews/PreviewFieldOptionsRadio.vue';
import PreviewFieldOptionsRadioTemplate from './previews/PreviewFieldOptionsRadio.vue?raw';
import PreviewFieldOptionsConfirm from './previews/PreviewFieldOptionsConfirm.vue';
import PreviewFieldOptionsConfirmTemplate from './previews/PreviewFieldOptionsConfirm.vue?raw';
import PreviewFieldOptionsOrderable from './previews/PreviewFieldOptionsOrderable.vue';
import PreviewFieldOptionsOrderableTemplate from './previews/PreviewFieldOptionsOrderable.vue?raw';
import readme from './readme.md?raw';

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
					template: this.extractTemplate(PreviewFieldOptionsTemplate),
				},
				{
					component: PreviewFieldOptionsRadio,
					name: 'Radio',
					template: this.extractTemplate(PreviewFieldOptionsRadioTemplate),
				},
				{
					component: PreviewFieldOptionsConfirm,
					name: 'Confirm',
					template: this.extractTemplate(PreviewFieldOptionsConfirmTemplate),
				},
				{
					component: PreviewFieldOptionsOrderable,
					name: 'Orderable',
					template: this.extractTemplate(PreviewFieldOptionsOrderableTemplate),
				},
			],
		};
	},
};
</script>
