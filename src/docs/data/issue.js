import submission from '@/docs/data/submission';
import doi from '@/docs/data/doi';

export default {
	_href: 'http://localhost:8000/publicknowledge/api/v1/issues/1',
	articles: [
		{
			...submission,
			id: 2,
			currentPublicationId: 22,
			publications: [
				{
					...submission.publications[0],
					id: 22,
					authorsString: 'Catherine Kwantes',
					authorsStringShort: 'Kwantes',
					fullTitle: {
						en_US:
							'Quisque vel ultrices ut vel sollicitudin vel varius suscipit phasellus'
					},
					isPublished: true
				}
			],
			stages: submission.stages.map(stage => {
				return {
					...stage,
					currentUserAssignedRoles: [pkp.const.ROLE_ID_MANAGER]
				};
			}),
			status: 3,
			urlAuthorWorkflow: submission.urlAuthorWorkflow.replace('1', '2'),
			urlEditorialWorkflow: submission.urlEditorialWorkflow.replace('1', '2'),
			urlPublished: submission.urlPublished.replace('1', '2'),
			urlWorkflow: submission.urlWorkflow.replace('1', '2')
		},
		{
			...submission
		}
	],
	coverImageAltText: {
		en_US: '',
		fr_CA: ''
	},
	coverImageUrl: {
		en_US: '',
		fr_CA: ''
	},
	dateNotified: null,
	datePublished: '2020-09-18 20:41:39',
	doiObject: {...doi},
	description: {
		en_US: '',
		fr_CA: ''
	},
	galleys: [],
	id: 1,
	identification: 'Vol 1. No 1. (2020): Issue Number 1',
	isPublished: '1',
	number: '1',
	'pub-id::doi': '10.987/iss123',
	publishedUrl: 'http://localhost:8080/publicknowledge/issue/view/1',
	title: {
		en_US: 'Issue Number 1',
		fr_CA: 'Issue Number 1'
	},
	volume: 1,
	year: 2020
};
