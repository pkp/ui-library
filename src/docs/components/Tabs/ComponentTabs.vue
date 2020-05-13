<script>
import Component from '@/docs/Component.vue';
import PreviewTabs from './previews/PreviewTabs.vue';
import PreviewTabsTemplate from '!raw-loader!./previews/PreviewTabs.vue';
import PreviewNested from './previews/PreviewNested.vue';
import PreviewNestedTemplate from '!raw-loader!./previews/PreviewNested.vue';
import PreviewSide from './previews/PreviewSide.vue';
import PreviewSideTemplate from '!raw-loader!./previews/PreviewSide.vue';
import PreviewIcon from './previews/PreviewIcon.vue';
import PreviewIconTemplate from '!raw-loader!./previews/PreviewIcon.vue';
import PreviewBadge from './previews/PreviewBadge.vue';
import PreviewBadgeTemplate from '!raw-loader!./previews/PreviewBadge.vue';
import PreviewDefault from './previews/PreviewDefault.vue';
import PreviewDefaultTemplate from '!raw-loader!./previews/PreviewDefault.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewTabsTemplate)
				},
				{
					component: PreviewNested,
					name: 'Nested Tabs',
					template: this.extractTemplate(PreviewNestedTemplate)
				},
				{
					component: PreviewSide,
					name: 'Side Tabs',
					template: this.extractTemplate(PreviewSideTemplate)
				},
				{
					component: PreviewIcon,
					name: 'With Icon',
					template: this.extractTemplate(PreviewIconTemplate)
				},
				{
					component: PreviewBadge,
					name: 'With Badge',
					template: this.extractTemplate(PreviewBadgeTemplate)
				},
				{
					component: PreviewDefault,
					name: 'With Default Tab',
					template: this.extractTemplate(PreviewDefaultTemplate)
				}
			]
		};
	}
};
</script>
