import {within, userEvent} from 'storybook/test';
import {http, HttpResponse} from 'msw';

import ReviewerSubmissionDetailsModal from './ReviewerSubmissionDetailsModal.vue';
import {getPublicationMock} from '@/mockFactories/publicationMock';
import {
	getDataCitationsMock,
	getDataCitationEditFormMock,
} from '@/mockFactories/dataCitationMock';
import {useModal} from '@/composables/useModal';

const SUBMISSION_ID = 19;
const PUBLICATION_ID = 20;

const publication = getPublicationMock({
	id: PUBLICATION_ID,
	submissionId: SUBMISSION_ID,
	abstract: {
		en: '<p>The study of the commons has experienced substantial growth over the past decades. Scholars in many disciplines had long studied how specific resources were managed at particular times and places, but researchers who studied specific commons before the mid-1980s were less likely to be well informed about the work of scholars in other disciplines.</p>',
		fr_CA: '',
	},
	// The schema stores controlled vocabulary entries as objects keyed by name
	keywords: {
		en: [
			{name: 'Common pool resource'},
			{name: 'common property'},
			{name: 'intellectual developments'},
		],
		fr_CA: [],
	},
	subjects: {
		en: [{name: 'Common pool resources'}, {name: 'Institutional analysis'}],
		fr_CA: [],
	},
	disciplines: {
		en: [{name: 'Political Science'}, {name: 'Economics'}],
		fr_CA: [],
	},
	supportingAgencies: {
		en: [{name: 'National Science Foundation'}],
		fr_CA: [],
	},
	dataAvailability: {
		en: '<p>The data that support the findings of this study are openly available in the repositories cited below.</p>',
		fr_CA: '',
	},
	fundingStatement: {
		en: '<p>This work was supported by the <em>National Science Foundation</em>.</p>',
		fr_CA: '',
	},
	dataCitations: getDataCitationsMock(),
});

// What the API returns for a double-anonymous review
const anonymizedPublication = getPublicationMock({
	...publication,
	authorsString: '',
	dataAvailability: [],
	fundingStatement: [],
	dataCitations: [],
});

function mockPublication(body) {
	return {
		msw: {
			handlers: [
				http.get(
					`https://mock/index.php/publicknowledge/api/v1/submissions/${SUBMISSION_ID}/publications/${PUBLICATION_ID}`,
					async () => HttpResponse.json(body),
				),
			],
		},
	};
}

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
		submissionId: SUBMISSION_ID,
		publicationId: PUBLICATION_ID,
		dataCitationEditForm: getDataCitationEditFormMock(),
	},
	decorators: [
		() => ({
			template: '<div style="height: 1600px"><story/></div>',
		}),
	],
};

export const Base = {
	parameters: mockPublication(publication),
	play: openModal,
};

export const DoubleAnonymous = {
	parameters: mockPublication(anonymizedPublication),
	play: openModal,
};

export const NoDataCitations = {
	parameters: mockPublication({...publication, dataCitations: []}),
	play: openModal,
};
