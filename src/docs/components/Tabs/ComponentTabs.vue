<script>
import Component from '@/docs/Component.vue';
import PreviewTabs from './previews/PreviewTabs.vue';
import PreviewTabsTemplate from './previews/PreviewTabs.vue?raw';
import PreviewNested from './previews/PreviewNested.vue';
import PreviewNestedTemplate from './previews/PreviewNested.vue?raw';
import PreviewSide from './previews/PreviewSide.vue';
import PreviewSideTemplate from './previews/PreviewSide.vue?raw';
import PreviewIcon from './previews/PreviewIcon.vue';
import PreviewIconTemplate from './previews/PreviewIcon.vue?raw';
import PreviewBadge from './previews/PreviewBadge.vue';
import PreviewBadgeTemplate from './previews/PreviewBadge.vue?raw';
import PreviewDefault from './previews/PreviewDefault.vue';
import PreviewDefaultTemplate from './previews/PreviewDefault.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'Tabs',
			readme: readme,
			examples: [
				{
					component: PreviewTabs,
					name: 'Base',
					template: this.extractTemplate(PreviewTabsTemplate),
				},
				{
					component: PreviewNested,
					name: 'Nested Tabs',
					template: this.extractTemplate(PreviewNestedTemplate),
				},
				{
					component: PreviewSide,
					name: 'Side Tabs',
					template: this.extractTemplate(PreviewSideTemplate),
				},
				{
					component: PreviewIcon,
					name: 'With Icon',
					template: this.extractTemplate(PreviewIconTemplate),
				},
				{
					component: PreviewBadge,
					name: 'With Badge',
					template: this.extractTemplate(PreviewBadgeTemplate),
				},
				{
					component: PreviewDefault,
					name: 'With Default Tab',
					template: this.extractTemplate(PreviewDefaultTemplate),
				},
			],
		};
	},
};
</script>
