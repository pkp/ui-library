<script>
import Component from '@/docs/Component.vue';
import PreviewFieldBase from './previews/PreviewFieldBase.vue';
import PreviewFieldBaseTemplate from '!raw-loader!./previews/PreviewFieldBase.vue';
import PreviewFieldBaseDescription from './previews/PreviewFieldBaseDescription.vue';
import PreviewFieldBaseDescriptionTemplate from '!raw-loader!./previews/PreviewFieldBaseDescription.vue';
import PreviewFieldBaseTooltip from './previews/PreviewFieldBaseTooltip.vue';
import PreviewFieldBaseTooltipTemplate from '!raw-loader!./previews/PreviewFieldBaseTooltip.vue';
import PreviewFieldBaseError from './previews/PreviewFieldBaseError.vue';
import PreviewFieldBaseErrorTemplate from '!raw-loader!./previews/PreviewFieldBaseError.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewFieldBaseTemplate)
				},
				{
					component: PreviewFieldBaseDescription,
					name: 'With Description',
					template: this.extractTemplate(PreviewFieldBaseDescriptionTemplate)
				},
				{
					component: PreviewFieldBaseTooltip,
					name: 'With Tooltip',
					template: this.extractTemplate(PreviewFieldBaseTooltipTemplate)
				},
				{
					component: PreviewFieldBaseError,
					name: 'With Error',
					template: this.extractTemplate(PreviewFieldBaseErrorTemplate)
				}
			]
		};
	}
};
</script>
