<script>
import Component from '@/docs/Component.vue';
import PreviewDropdown from './previews/PreviewDropdown.vue';
import PreviewDropdownTemplate from '!raw-loader!./previews/PreviewDropdown.vue';
import PreviewDropdownSections from './previews/PreviewDropdownSections.vue';
import PreviewDropdownSectionsTemplate from '!raw-loader!./previews/PreviewDropdownSections.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'Dropdown',
			readme: readme,
			examples: [
				{
					component: PreviewDropdown,
					name: 'Base',
					template: this.extractTemplate(PreviewDropdownTemplate)
				},
				{
					component: PreviewDropdownSections,
					name: 'With Sections',
					template: this.extractTemplate(PreviewDropdownSectionsTemplate)
				}
			]
		};
	}
};
</script>
