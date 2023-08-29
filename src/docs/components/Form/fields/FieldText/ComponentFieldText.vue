<script>
import {markRaw} from 'vue';
import Component from '@/docs/Component.vue';
import PreviewFieldText from './previews/PreviewFieldText.vue';
import PreviewFieldTextTemplate from './previews/PreviewFieldText.vue?raw';
import PreviewFieldTextSmall from './previews/PreviewFieldTextSmall.vue';
import PreviewFieldTextSmallTemplate from './previews/PreviewFieldTextSmall.vue?raw';
import PreviewFieldTextLarge from './previews/PreviewFieldTextLarge.vue';
import PreviewFieldTextLargeTemplate from './previews/PreviewFieldTextLarge.vue?raw';
import PreviewFieldTextPrefix from './previews/PreviewFieldTextPrefix.vue';
import PreviewFieldTextPrefixTemplate from './previews/PreviewFieldTextPrefix.vue?raw';
import PreviewFieldTextOptIntoEdit from './previews/PreviewFieldTextOptIntoEdit.vue';
import PreviewFieldTextOptIntoEditTemplate from './previews/PreviewFieldTextOptIntoEdit.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldText',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: markRaw(PreviewFieldText),
					name: 'Base',
					template: this.extractTemplate(PreviewFieldTextTemplate),
				},
				{
					component: markRaw(PreviewFieldTextSmall),
					name: 'Small',
					template: this.extractTemplate(PreviewFieldTextSmallTemplate),
				},
				{
					component: markRaw(PreviewFieldTextLarge),
					name: 'Large',
					template: this.extractTemplate(PreviewFieldTextLargeTemplate),
				},
				{
					component: markRaw(PreviewFieldTextPrefix),
					name: 'With Prefix',
					template: this.extractTemplate(PreviewFieldTextPrefixTemplate),
				},
				{
					component: markRaw(PreviewFieldTextOptIntoEdit),
					name: 'Editing Opt-in',
					template: this.extractTemplate(PreviewFieldTextOptIntoEditTemplate),
				},
			],
		};
	},
};
</script>
