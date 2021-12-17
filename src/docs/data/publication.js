import authors from './authors';
import doi from '@/docs/data/doi';

export default {
	_href:
		'http://localhost:8000/publicknowledge/api/v1/submissions/17/publications/17',
	abstract: {
		en_US:
			'<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
		fr_CA:
			'<p>FR Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>'
	},
	accessStatus: 0,
	authors: [...authors],
	authorsString: 'Daniel Barnes, Dr. L. P. Ipsum',
	authorsStringShort: 'Barnes, et al',
	citations: {
		fr_CA: '',
		en_US: ''
	},
	copyrightHolder: {
		fr_CA: '',
		en_US: ''
	},
	copyrightYear: null,
	coverImage: {
		fr_CA: null,
		en_US: null
	},
	coverage: {
		fr_CA: '',
		en_US: ''
	},
	datePublished: null,
	disciplines: {
		fr_CA: [],
		en_US: []
	},
	doiObject: {...doi},
	fullTitle: {
		en_US:
			'The Lorem ipsum dolor sit amet: Excepteur sint occaecat cupidatat non proident',
		fr_CA:
			'Le Frorem ipsum dolor sit amet: Frexcepteur sint occaecat cupidatat non proident'
	},
	galleys: [
		{
			fileId: 36,
			id: 7,
			isApproved: false,
			label: 'PDF',
			locale: 'en_US',
			doiObject: {...doi},
			publicationId: 17,
			seq: 0,
			urlPublished: 'http://...',
			urlRemote: ''
		},
		{
			fileId: null,
			id: 8,
			isApproved: false,
			label: 'Remote',
			locale: 'en_US',
			doiObject: {...doi},
			publicationId: 17,
			seq: 1,
			urlPublished: 'http://...',
			urlRemote: 'http://google.com'
		},
		{
			fileId: 37,
			id: 9,
			isApproved: false,
			label: 'Supplementaru',
			locale: 'en_US',
			doiObject: {...doi},
			publicationId: 17,
			seq: 2,
			urlPublished: 'http://...',
			urlRemote: ''
		}
	],
	hideAuthor: null,
	id: 17,
	isPublished: false,
	issueId: null,
	keywords: {
		en_US: ['new keyword', 'and second keyword'],
		fr_CA: ['fr keyword one', 'fr keyword two']
	},
	language: null,
	lastModified: '2019-06-06 15:00:37',
	licenseUrl: null,
	locale: 'en_US',
	pages: null,
	prefix: {
		fr_CA: 'Le',
		en_US: 'The'
	},
	primaryContactId: 20,
	'pub-id::publisher-id': 'lorem-ipsum',
	publicationDateType: 'pub',
	publicationSummary: {
		fr_CA: '',
		en_US: ''
	},
	publicationType: 'publication',
	rights: {
		fr_CA: '',
		en_US: ''
	},
	sectionId: 1,
	seq: 0,
	source: {
		fr_CA: '',
		en_US: ''
	},
	subjects: {
		fr_CA: [],
		en_US: []
	},
	submissionId: 17,
	subtitle: {
		en_US: 'Excepteur sint occaecat cupidatat non proident',
		fr_CA: 'Frexcepteur sint occaecat cupidatat non proident'
	},
	supportingAgencies: {
		fr_CA: [],
		en_US: []
	},
	title: {
		en_US: 'Lorem ipsum dolor sit amet',
		fr_CA: 'Frorem ipsum dolor sit amet'
	},
	type: {
		fr_CA: '',
		en_US: ''
	},
	urlPublished:
		'http://localhost:8000/publicknowledge/article/view/lorem-ipsum/version/17'
};
