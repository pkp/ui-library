import {within, userEvent} from 'storybook/test';

import ReviewerSubmissionDetailsModal from './ReviewerSubmissionDetailsModal.vue';
import {useModal} from '@/composables/useModal';

async function openModal({canvasElement}) {
	const canvas = within(canvasElement);
	const user = userEvent.setup();

	await user.click(canvas.getByText('View All Submission Details'));
}

export default {
	title: 'Pages/ReviewerSubmissionDetailsModal',
	component: ReviewerSubmissionDetailsModal,
	render: (args) => ({
		setup() {
			const {openSideModal} = useModal();

			function open() {
				openSideModal(ReviewerSubmissionDetailsModal, args);
			}

			return {open};
		},
		template: '<button @click="open">View All Submission Details</button>',
	}),
	args: {
		title: 'Traditions and Trends in the Study of the Commons',
		abstract:
			'<p>The study of the commons has experienced substantial growth and development over the past decades. Distinguished scholars in many disciplines had long studied how specific resources were managed or mismanaged at particular times and places, but researchers who studied specific commons before the mid-1980s were, however, less likely than their contemporary colleagues to be well informed about the work of scholars in other disciplines, about other sectors in their own region of interest, or in other regions of the world.</p>',
		keywords: [
			'Common pool resource',
			'common property',
			'intellectual developments',
		],
		subjects: ['Common pool resources', 'Institutional analysis'],
		disciplines: ['Political Science', 'Economics'],
		authors: 'Elinor Ostrom (Author); Frank van Laerhoven (Author)',
		dataAvailability:
			'<p>The data that support the findings of this study are openly available in the repositories cited below.</p>',
		fundingStatement:
			'<p>This work was supported by the National Science Foundation.</p>',
		dataCitations: [
			{
				id: 1,
				title: 'Data from: Traditions and Trends in the Study of the Commons',
				identifierType: 'DOI',
				url: 'https://doi.org/10.5061/dryad.example1',
			},
			{
				id: 2,
				title: 'Common-pool resource case studies database, 1985-2005',
				identifierType: 'DOI',
				url: 'https://doi.org/10.5281/zenodo.1234567',
			},
			{
				id: 3,
				title:
					'Replication data for: institutional analysis of irrigation systems',
				identifierType: 'Handle',
				url: 'https://hdl.handle.net/20.500.12345/example3',
			},
			{
				id: 4,
				title: 'Codebook and coding manual',
				identifierType: 'URI',
				url: 'https://example.org/datasets/coding-manual',
			},
		],
	},
	decorators: [
		() => ({
			template: '<div style="height: 1600px"><story/></div>',
		}),
	],
};

export const Base = {
	play: openModal,
};

export const DoubleAnonymous = {
	args: {
		authors: null,
		dataAvailability: null,
		fundingStatement: null,
		dataCitations: [],
	},
	play: openModal,
};

export const NoDataCitations = {
	args: {
		dataCitations: [],
	},
	play: openModal,
};
