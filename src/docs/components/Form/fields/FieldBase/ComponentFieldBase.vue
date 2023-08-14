<script>
import Component from '@/docs/Component.vue';
import PreviewFieldBase from './previews/PreviewFieldBase.vue';
import PreviewFieldBaseTemplate from './previews/PreviewFieldBase.vue?raw';
import PreviewFieldBaseDescription from './previews/PreviewFieldBaseDescription.vue';
import PreviewFieldBaseDescriptionTemplate from './previews/PreviewFieldBaseDescription.vue?raw';
import PreviewFieldBaseTooltip from './previews/PreviewFieldBaseTooltip.vue';
import PreviewFieldBaseTooltipTemplate from './previews/PreviewFieldBaseTooltip.vue?raw';
import PreviewFieldBaseError from './previews/PreviewFieldBaseError.vue';
import PreviewFieldBaseErrorTemplate from './previews/PreviewFieldBaseError.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldBase',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldBase,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldBaseTemplate),
				},
				{
					component: PreviewFieldBaseDescription,
					name: 'With Description',
					template: this.extractTemplate(PreviewFieldBaseDescriptionTemplate),
				},
				{
					component: PreviewFieldBaseTooltip,
					name: 'With Tooltip',
					template: this.extractTemplate(PreviewFieldBaseTooltipTemplate),
				},
				{
					component: PreviewFieldBaseError,
					name: 'With Error',
					template: this.extractTemplate(PreviewFieldBaseErrorTemplate),
				},
			],
		};
	},
};
</script>
