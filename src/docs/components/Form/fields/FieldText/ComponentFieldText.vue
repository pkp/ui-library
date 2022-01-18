<script>
import Component from '@/docs/Component.vue';
import PreviewFieldText from './previews/PreviewFieldText.vue';
import PreviewFieldTextTemplate from '!raw-loader!./previews/PreviewFieldText.vue';
import PreviewFieldTextSmall from './previews/PreviewFieldTextSmall.vue';
import PreviewFieldTextSmallTemplate from '!raw-loader!./previews/PreviewFieldTextSmall.vue';
import PreviewFieldTextInline from './previews/PreviewFieldTextInline.vue';
import PreviewFieldTextInlineTemplate from '!raw-loader!./previews/PreviewFieldTextInline.vue';
import PreviewFieldTextLarge from './previews/PreviewFieldTextLarge.vue';
import PreviewFieldTextLargeTemplate from '!raw-loader!./previews/PreviewFieldTextLarge.vue';
import PreviewFieldTextPrefix from './previews/PreviewFieldTextPrefix.vue';
import PreviewFieldTextPrefixTemplate from '!raw-loader!./previews/PreviewFieldTextPrefix.vue';
import PreviewFieldTextOptIntoEdit from './previews/PreviewFieldTextOptIntoEdit.vue';
import PreviewFieldTextOptIntoEditTemplate from '!raw-loader!./previews/PreviewFieldTextOptIntoEdit.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldText',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldText,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldTextTemplate)
				},
				{
					component: PreviewFieldTextSmall,
					name: 'Small',
					template: this.extractTemplate(PreviewFieldTextSmallTemplate)
				},
				{
					component: PreviewFieldTextLarge,
					name: 'Large',
					template: this.extractTemplate(PreviewFieldTextLargeTemplate)
				},
				{
					component: PreviewFieldTextPrefix,
					name: 'With Prefix',
					template: this.extractTemplate(PreviewFieldTextPrefixTemplate)
				},
				{
					component: PreviewFieldTextOptIntoEdit,
					name: 'Editing Opt-in',
					template: this.extractTemplate(PreviewFieldTextOptIntoEditTemplate)
				},
				{
					component: PreviewFieldTextInline,
					name: 'Inline Label',
					template: this.extractTemplate(PreviewFieldTextInlineTemplate)
				}
			]
		};
	}
};
</script>
