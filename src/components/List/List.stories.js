import List from './List.vue';
import ListItem from './ListItem.vue';

export default {
	title: 'Components/List',
	component: List,
};

export const Default = {
	render: (args) => ({
		components: {List, ListItem},
		setup() {
			return {args};
		},
		template: `
			<List>
				<ListItem>
					<template #value>
						<Icon icon="Comment" class="h-4 w-4 me-2" :inline="true" />
						32
					</template>
					Number of active discussions in this journal.
				</ListItem>
				<ListItem>
					<template #value>
						<Icon icon="Clock" class="h-4 w-4 me-2" :inline="true" />
						67
					</template>
					Days until next issue is published.
				</ListItem>
				<ListItem>
					<Icon icon="Error" class="h-5 w-5 me-1" :inline="true" />
					This journal is not currently available for the public to view. Would you
					like to
					<a href="#">make it public</a>
					?
				</ListItem>
			</List>

		`,
	}),
	args: {},
};
