import Panel from './Panel.vue';
import PanelSection from './PanelSection.vue';

import List from '@/components/List/List.vue';
import ListItem from '@/components/List/ListItem.vue';

export default {
	title: 'Components/Panel',
	component: Panel,
};

export const Default = {
	render: (args) => ({
		components: {Panel, PanelSection, List, ListItem},
		setup() {
			return {args};
		},
		template: `
			<Panel v-bind="args">
				<PanelSection>
					<template #header>
						<h2>Journal Overview</h2>
						<p>
							The following details about your journal are provided for your review.
							Please review them carefully before proceeding.
						</p>
					</template>
					<List>
						<ListItem>
							<template #value>
								<Icon icon="Comment" class="h-4 w-4 me-1" :inline="true" />
								32
							</template>
							Number of active discussions in this journal.
						</ListItem>
						<ListItem>
							<template #value>
								<Icon icon="Clock" class="h-4 w-4 me-1" :inline="true" />
								67
							</template>
							Days until next issue is published.
						</ListItem>
						<ListItem>
							<Icon icon="Error" class="h-5 w-5 me-1" :inline="true" />
							<span class="align-middle">
								This journal is not currently available for the public to view. Would
								you like to
								<a href="#">make it public</a>
								?
							</span>
						</ListItem>
					</List>
		</PanelSection>
	</Panel>
		`,
	}),
	args: {},
};

export const ManySections = {
	render: (args) => ({
		components: {Panel, PanelSection, List, ListItem},
		setup() {
			return {args};
		},
		template: `
			<Panel v-bind="args">
				<PanelSection>
					<template #header>
						<h2>Journal Overview</h2>
						<p>
							The following details about your journal are provided for your review.
							Please review them carefully before proceeding.
						</p>
					</template>
					<List>
						<ListItem>
							<template #value>
								<Icon icon="Comment" class="h-4 w-4 me-1" :inline="true" />
								32
							</template>
							Number of active discussions in this journal.
						</ListItem>
						<ListItem>
							<template #value>
								<Icon icon="Clock" class="h-4 w-4 me-1" :inline="true" />
								67
							</template>
							Days until next issue is published.
						</ListItem>
						<ListItem>
							<Icon icon="Error" class="h-5 w-5 me-1" :inline="true" />
							<span class="align-middle">
								This journal is not currently available for the public to view. Would
								you like to
								<a href="#">make it public</a>
								?
							</span>
						</ListItem>
					</List>
				</PanelSection>
				<PanelSection>
					<template #header>
						<h2>Journal Overview</h2>
						<p>
							The following details about your journal are provided for your review.
							Please review them carefully before proceeding.
						</p>
					</template>
					<List>
						<ListItem>
							<template #value>
								<Icon icon="Comment" class="h-4 w-4 me-1" :inline="true" />
								32
							</template>
							Number of active discussions in this journal.
						</ListItem>
						<ListItem>
							<template #value>
								<Icon icon="Clock" class="h-4 w-4 me-1" :inline="true" />
								67
							</template>
							Days until next issue is published.
						</ListItem>
						<ListItem>
							<Icon icon="Error" class="h-5 w-5 me-1" :inline="true" />
							<span class="align-middle">
								This journal is not currently available for the public to view. Would
								you like to
								<a href="#">make it public</a>
								?
							</span>
						</ListItem>
					</List>
				</PanelSection>
			</Panel>
		`,
	}),
	args: {},
};

export const StackHeader = {
	render: (args) => ({
		components: {Panel, PanelSection, List, ListItem},
		setup() {
			return {args};
		},
		template: `
			<Panel v-bind="args">
				<PanelSection>
					<template #header>
						<h2>Journal Overview</h2>
						<p>
							The following details about your journal are provided for your review.
							Please review them carefully before proceeding.
						</p>
					</template>
					<List>
						<ListItem>
							<template #value>
								<Icon icon="Comment" class="h-4 w-4 me-1" :inline="true" />
								32
							</template>
							Number of active discussions in this journal.
						</ListItem>
						<ListItem>
							<template #value>
								<Icon icon="Clock" class="h-4 w-4 me-1" :inline="true" />
								67
							</template>
							Days until next issue is published.
						</ListItem>
						<ListItem>
							<Icon icon="Error" class="h-5 w-5 me-1" :inline="true" />
							<span class="align-middle">
								This journal is not currently available for the public to view. Would
								you like to
								<a href="#">make it public</a>
								?
							</span>
						</ListItem>
					</List>
				</PanelSection>
				<PanelSection>
					<template #header>
						<h2>Journal Overview</h2>
						<p>
							The following details about your journal are provided for your review.
							Please review them carefully before proceeding.
						</p>
					</template>
					<List>
						<ListItem>
							<template #value>
								<Icon icon="Comment" class="h-4 w-4 me-1" :inline="true" />
								32
							</template>
							Number of active discussions in this journal.
						</ListItem>
						<ListItem>
							<template #value>
								<Icon icon="Clock" class="h-4 w-4 me-1" :inline="true" />
								67
							</template>
							Days until next issue is published.
						</ListItem>
						<ListItem>
							<Icon icon="Error" class="h-5 w-5 me-1" :inline="true" />
							<span class="align-middle">
								This journal is not currently available for the public to view. Would
								you like to
								<a href="#">make it public</a>
								?
							</span>
						</ListItem>
					</List>
				</PanelSection>
			</Panel>
		`,
	}),
	args: {stack: true},
};
