import ListingFilesListPanel from './ListingFilesListPanel.vue';
import SubmissionFilesMock from '@/mocks/submissionFiles';

export default {
	title: 'ListPanel/ListingFilesListPanel',
	component: ListingFilesListPanel,
};

export const Base = {
	render: (args) => ({
		components: {ListingFilesListPanel},
		setup() {
			return {args};
		},
		template: `
				<ListingFilesListPanel
					v-bind="args"
				/>
		`,
	}),

	args: {
		title: 'Attachments',
		description: 'These files were sent to you for review',
		items: [...SubmissionFilesMock],
	},
};
