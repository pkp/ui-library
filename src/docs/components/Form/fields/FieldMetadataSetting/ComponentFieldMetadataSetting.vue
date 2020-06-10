<script>
import Component from '@/docs/Component.vue';
import PreviewFieldMetadataSetting from './previews/PreviewFieldMetadataSetting.vue';
import PreviewFieldMetadataSettingTemplate from '!raw-loader!./previews/PreviewFieldMetadataSetting.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldMetadataSetting',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldMetadataSetting,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldMetadataSettingTemplate)
				}
			]
		};
	}
};
</script>
