<script>
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
					component: PreviewForm,
					name: 'Base',
					template: this.extractTemplate(PreviewFormTemplate),
				},
				{
					component: PreviewMultilingual,
					name: 'Multilingual',
					template: this.extractTemplate(PreviewMultilingualTemplate),
				},
				{
					component: PreviewGroups,
					name: 'With Groups',
					template: this.extractTemplate(PreviewGroupsTemplate),
				},
				{
					component: PreviewPagination,
					name: 'With Pagination',
					template: this.extractTemplate(PreviewPaginationTemplate),
				},
				{
					component: PreviewConditionalDisplay,
					name: 'With Conditional Display',
					template: this.extractTemplate(PreviewConditionalDisplayTemplate),
				},
				{
					component: PreviewErrors,
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
