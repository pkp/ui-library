<script>
import {markRaw} from 'vue';
import Component from '@/docs/Component.vue';
import PreviewFieldMetadataSetting from './previews/PreviewFieldMetadataSetting.vue';
import PreviewFieldMetadataSettingTemplate from './previews/PreviewFieldMetadataSetting.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldMetadataSetting',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: markRaw(PreviewFieldMetadataSetting),
					name: 'Base',
					template: this.extractTemplate(PreviewFieldMetadataSettingTemplate),
				},
			],
		};
	},
};
</script>
