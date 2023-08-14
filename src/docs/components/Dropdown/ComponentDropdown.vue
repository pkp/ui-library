<script>
import Component from '@/docs/Component.vue';
import PreviewDropdown from './previews/PreviewDropdown.vue';
import PreviewDropdownTemplate from './previews/PreviewDropdown.vue?raw';
import PreviewDropdownSections from './previews/PreviewDropdownSections.vue';
import PreviewDropdownSectionsTemplate from './previews/PreviewDropdownSections.vue?raw';
import readme from './readme.md?raw';

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
					template: this.extractTemplate(PreviewDropdownTemplate),
				},
				{
					component: PreviewDropdownSections,
					name: 'With Sections',
					template: this.extractTemplate(PreviewDropdownSectionsTemplate),
				},
			],
		};
	},
};
</script>
