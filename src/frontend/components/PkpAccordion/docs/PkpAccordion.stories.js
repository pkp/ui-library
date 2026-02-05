import '@/styles/frontend-theme.css';
import PkpAccordionRoot from '../PkpAccordionRoot.vue';
import PkpAccordionItem from '../PkpAccordionItem.vue';
import PkpAccordionHeader from '../PkpAccordionHeader.vue';
import PkpAccordionContent from '../PkpAccordionContent.vue';

export default {
	title: 'Frontend/PkpAccordion',
	component: PkpAccordionRoot,
};

export const Primary = {
	render: (args) => ({
		components: {
			PkpAccordionRoot,
			PkpAccordionItem,
			PkpAccordionHeader,
			PkpAccordionContent,
		},
		setup() {
			return {args};
		},
		template: `
			<PkpAccordionRoot v-bind="args">
				<PkpAccordionItem value="item-1">
					<PkpAccordionHeader>Section 1: Introduction</PkpAccordionHeader>
					<PkpAccordionContent>
						<p>This is the content of the first section. Only one section can be open at a time in single mode.</p>
					</PkpAccordionContent>
				</PkpAccordionItem>
				<PkpAccordionItem value="item-2">
					<PkpAccordionHeader>Section 2: Methods</PkpAccordionHeader>
					<PkpAccordionContent>
						<p>This is the content of the second section. Click to expand and collapse.</p>
					</PkpAccordionContent>
				</PkpAccordionItem>
				<PkpAccordionItem value="item-3">
					<PkpAccordionHeader>Section 3: Results</PkpAccordionHeader>
					<PkpAccordionContent>
						<p>This is the content of the third section with research results.</p>
					</PkpAccordionContent>
				</PkpAccordionItem>
			</PkpAccordionRoot>
		`,
	}),
	args: {
		type: 'single',
		collapsible: true,
		defaultValue: 'item-1',
	},
};

export const Multiple = {
	name: 'Multiple Items Open',
	render: (args) => ({
		components: {
			PkpAccordionRoot,
			PkpAccordionItem,
			PkpAccordionHeader,
			PkpAccordionContent,
		},
		setup() {
			return {args};
		},
		template: `
			<PkpAccordionRoot v-bind="args">
				<PkpAccordionItem value="item-1">
					<PkpAccordionHeader>Author Information</PkpAccordionHeader>
					<PkpAccordionContent>
						<p>Author details and biographical information can be displayed here.</p>
					</PkpAccordionContent>
				</PkpAccordionItem>
				<PkpAccordionItem value="item-2">
					<PkpAccordionHeader>Article Metadata</PkpAccordionHeader>
					<PkpAccordionContent>
						<p>Keywords, DOI, submission dates, and other metadata.</p>
					</PkpAccordionContent>
				</PkpAccordionItem>
				<PkpAccordionItem value="item-3">
					<PkpAccordionHeader>References</PkpAccordionHeader>
					<PkpAccordionContent>
						<p>Bibliography and citation information for the article.</p>
					</PkpAccordionContent>
				</PkpAccordionItem>
			</PkpAccordionRoot>
		`,
	}),
	args: {
		type: 'multiple',
		defaultValue: ['item-1', 'item-2'],
	},
};

export const WithoutChevron = {
	name: 'Without Chevron Icon',
	render: (args) => ({
		components: {
			PkpAccordionRoot,
			PkpAccordionItem,
			PkpAccordionHeader,
			PkpAccordionContent,
		},
		setup() {
			return {args};
		},
		template: `
			<PkpAccordionRoot v-bind="args">
				<PkpAccordionItem value="item-1">
					<PkpAccordionHeader indicator="none">Click to Expand</PkpAccordionHeader>
					<PkpAccordionContent>
						<p>This accordion header has no chevron icon - useful for custom styled headers.</p>
					</PkpAccordionContent>
				</PkpAccordionItem>
				<PkpAccordionItem value="item-2">
					<PkpAccordionHeader indicator="none">Another Section</PkpAccordionHeader>
					<PkpAccordionContent>
						<p>Content for the second section without chevron indicators.</p>
					</PkpAccordionContent>
				</PkpAccordionItem>
			</PkpAccordionRoot>
		`,
	}),
	args: {
		type: 'single',
		collapsible: true,
	},
};

export const StaticIndicator = {
	render: (args) => ({
		components: {
			PkpAccordionRoot,
			PkpAccordionItem,
			PkpAccordionHeader,
			PkpAccordionContent,
		},
		setup() {
			return {args};
		},
		template: `
			<PkpAccordionRoot v-bind="args">
				<PkpAccordionItem value="item-1">
					<PkpAccordionHeader indicator="static">
						Author Response
						<template #indicator="{ open }">
							<span>{{ open ? 'Hide Response' : 'Read Response' }}</span>
						</template>
					</PkpAccordionHeader>
					<PkpAccordionContent>
						<p>This accordion uses a static indicator that does not rotate. The indicator text changes based on the open state.</p>
					</PkpAccordionContent>
				</PkpAccordionItem>
				<PkpAccordionItem value="item-2">
					<PkpAccordionHeader indicator="static">
						Review Details
						<template #indicator="{ open }">
							<span>{{ open ? 'Collapse' : 'Expand' }}</span>
						</template>
					</PkpAccordionHeader>
					<PkpAccordionContent>
						<p>Another section with a static text indicator.</p>
					</PkpAccordionContent>
				</PkpAccordionItem>
			</PkpAccordionRoot>
		`,
	}),
	args: {
		type: 'single',
		collapsible: true,
	},
};
