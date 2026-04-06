import '@/styles/frontend-theme.css';
import PkpTabRoot from '../PkpTabRoot.vue';
import PkpTabList from '../PkpTabList.vue';
import PkpTabTrigger from '../PkpTabTrigger.vue';
import PkpTabContent from '../PkpTabContent.vue';

// Story-specific styles using BEM classes
const storyStyles = `
	.PkpTabList {
		display: flex;
		gap: 0.5rem;
		border-bottom: 1px solid #ddd;
		margin-bottom: 1rem;
	}
	.PkpTabTrigger {
		padding: 0.5rem 1rem;
		border: none;
		background: transparent;
		cursor: pointer;
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
	}
	.PkpTabTrigger[data-state="active"] {
		border-bottom-color: #006798;
		font-weight: 600;
	}
`;

export default {
	title: 'Frontend/PkpTab',
	component: PkpTabRoot,
};

export const Primary = {
	render: (args) => ({
		components: {PkpTabRoot, PkpTabList, PkpTabTrigger, PkpTabContent},
		setup() {
			return {args, storyStyles};
		},
		template: `
			<component is="style">{{ storyStyles }}</component>
			<PkpTabRoot v-bind="args">
				<PkpTabList>
					<PkpTabTrigger value="abstract">Abstract</PkpTabTrigger>
					<PkpTabTrigger value="details">Details</PkpTabTrigger>
				</PkpTabList>
				<PkpTabContent value="abstract">
					<p>This is the abstract content panel. It displays the article summary.</p>
				</PkpTabContent>
				<PkpTabContent value="details">
					<p>This is the details content panel. It shows additional information about the article.</p>
				</PkpTabContent>
			</PkpTabRoot>
		`,
	}),
	args: {
		defaultValue: 'abstract',
	},
};

export const WithUrlSync = {
	name: 'With URL Sync',
	render: (args) => ({
		components: {PkpTabRoot, PkpTabList, PkpTabTrigger, PkpTabContent},
		setup() {
			return {args, storyStyles};
		},
		template: `
			<component is="style">{{ storyStyles }}</component>
			<PkpTabRoot v-bind="args">
				<PkpTabList>
					<PkpTabTrigger value="overview">Overview</PkpTabTrigger>
					<PkpTabTrigger value="files">Files</PkpTabTrigger>
					<PkpTabTrigger value="citations">Citations</PkpTabTrigger>
				</PkpTabList>
				<PkpTabContent value="overview">
					<p>Overview content. The URL will update to ?articleTab=overview when this tab is active.</p>
				</PkpTabContent>
				<PkpTabContent value="files">
					<p>Files content. Check the URL - it should show ?articleTab=files.</p>
				</PkpTabContent>
				<PkpTabContent value="citations">
					<p>Citations content. The URL enables deep-linking to specific tabs.</p>
				</PkpTabContent>
			</PkpTabRoot>
		`,
	}),
	args: {
		name: 'articleTab',
		defaultValue: 'overview',
	},
};

export const ManyTabs = {
	name: 'Many Tabs',
	render: (args) => ({
		components: {PkpTabRoot, PkpTabList, PkpTabTrigger, PkpTabContent},
		setup() {
			return {args, storyStyles};
		},
		template: `
			<component is="style">{{ storyStyles }}</component>
			<PkpTabRoot v-bind="args">
				<PkpTabList>
					<PkpTabTrigger value="abstract">Abstract</PkpTabTrigger>
					<PkpTabTrigger value="pdf">PDF</PkpTabTrigger>
					<PkpTabTrigger value="html">HTML</PkpTabTrigger>
					<PkpTabTrigger value="xml">XML</PkpTabTrigger>
					<PkpTabTrigger value="metrics">Metrics</PkpTabTrigger>
				</PkpTabList>
				<PkpTabContent value="abstract">
					<p>Abstract content panel.</p>
				</PkpTabContent>
				<PkpTabContent value="pdf">
					<p>PDF viewer or download links.</p>
				</PkpTabContent>
				<PkpTabContent value="html">
					<p>HTML full-text content.</p>
				</PkpTabContent>
				<PkpTabContent value="xml">
					<p>XML/JATS structured content.</p>
				</PkpTabContent>
				<PkpTabContent value="metrics">
					<p>Article views, downloads, and citation metrics.</p>
				</PkpTabContent>
			</PkpTabRoot>
		`,
	}),
	args: {
		defaultValue: 'abstract',
	},
};
