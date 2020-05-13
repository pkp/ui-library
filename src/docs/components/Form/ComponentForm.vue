<script>
import Component from '@/docs/Component.vue';
import PreviewForm from './previews/PreviewForm.vue';
import PreviewFormTemplate from '!raw-loader!./previews/PreviewForm.vue';
import PreviewMultilingual from './previews/PreviewMultilingual.vue';
import PreviewMultilingualTemplate from '!raw-loader!./previews/PreviewMultilingual.vue';
import PreviewGroups from './previews/PreviewGroups.vue';
import PreviewGroupsTemplate from '!raw-loader!./previews/PreviewGroups.vue';
import PreviewPagination from './previews/PreviewPagination.vue';
import PreviewPaginationTemplate from '!raw-loader!./previews/PreviewPagination.vue';
import PreviewConditionalDisplay from './previews/PreviewConditionalDisplay.vue';
import PreviewConditionalDisplayTemplate from '!raw-loader!./previews/PreviewConditionalDisplay.vue';
import PreviewErrors from './previews/PreviewErrors.vue';
import PreviewErrorsTemplate from '!raw-loader!./previews/PreviewErrors.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewFormTemplate)
				},
				{
					component: PreviewMultilingual,
					name: 'Multilingual',
					template: this.extractTemplate(PreviewMultilingualTemplate)
				},
				{
					component: PreviewGroups,
					name: 'With Groups',
					template: this.extractTemplate(PreviewGroupsTemplate)
				},
				{
					component: PreviewPagination,
					name: 'With Pagination',
					template: this.extractTemplate(PreviewPaginationTemplate)
				},
				{
					component: PreviewConditionalDisplay,
					name: 'With Conditional Display',
					template: this.extractTemplate(PreviewConditionalDisplayTemplate)
				},
				{
					component: PreviewErrors,
					name: 'With Errors',
					template: this.extractTemplate(PreviewErrorsTemplate)
				}
			]
		};
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.component--Form .component__exampleWrapper {
	padding: 0;
}
</style>
