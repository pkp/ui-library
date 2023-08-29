<script>
import {markRaw} from 'vue';
import Component from '@/docs/Component.vue';
import PreviewForm from './previews/PreviewForm.vue';
import PreviewFormTemplate from './previews/PreviewForm.vue?raw';
import PreviewMultilingual from './previews/PreviewMultilingual.vue';
import PreviewMultilingualTemplate from './previews/PreviewMultilingual.vue?raw';
import PreviewGroups from './previews/PreviewGroups.vue';
import PreviewGroupsTemplate from './previews/PreviewGroups.vue?raw';
import PreviewPagination from './previews/PreviewPagination.vue';
import PreviewPaginationTemplate from './previews/PreviewPagination.vue?raw';
import PreviewConditionalDisplay from './previews/PreviewConditionalDisplay.vue';
import PreviewConditionalDisplayTemplate from './previews/PreviewConditionalDisplay.vue?raw';
import PreviewErrors from './previews/PreviewErrors.vue';
import PreviewErrorsTemplate from './previews/PreviewErrors.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'Form',
			readme: readme,
			examples: [
				{
					component: markRaw(PreviewForm),
					name: 'Base',
					template: this.extractTemplate(PreviewFormTemplate),
				},
				{
					component: markRaw(PreviewMultilingual),
					name: 'Multilingual',
					template: this.extractTemplate(PreviewMultilingualTemplate),
				},
				{
					component: markRaw(PreviewGroups),
					name: 'With Groups',
					template: this.extractTemplate(PreviewGroupsTemplate),
				},
				{
					component: markRaw(PreviewPagination),
					name: 'With Pagination',
					template: this.extractTemplate(PreviewPaginationTemplate),
				},
				{
					component: markRaw(PreviewConditionalDisplay),
					name: 'With Conditional Display',
					template: this.extractTemplate(PreviewConditionalDisplayTemplate),
				},
				{
					component: markRaw(PreviewErrors),
					name: 'With Errors',
					template: this.extractTemplate(PreviewErrorsTemplate),
				},
			],
		};
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.component--Form .component__exampleWrapper {
	padding: 0;
}
</style>
