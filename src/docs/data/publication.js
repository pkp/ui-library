import authors from './authors';
import doi from '@/docs/data/doi';

export default {
	_href:
		'http://localhost:8000/publicknowledge/api/v1/submissions/17/publications/17',
	abstract: {
		en:
			'<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
		fr_CA:
			'<p>FR Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
	},
	accessStatus: 0,
	authors: [...authors],
	authorsString: 'Daniel Barnes, Dr. L. P. Ipsum',
	authorsStringShort: 'Barnes, et al',
	categoryIds: [2, 3],
	citations: {
		fr_CA: '',
		en: '',
	},
	copyrightHolder: {
		fr_CA: '',
		en: '',
	},
	copyrightYear: null,
	coverImage: {
		fr_CA: null,
		en: null,
	},
	coverage: {
		fr_CA: '',
		en: '',
	},
	datePublished: null,
	disciplines: {
		fr_CA: [],
		en: [],
	},
	doiObject: {...doi},
	fullTitle: {
		en:
			'The Lorem ipsum dolor sit amet: Excepteur sint occaecat cupidatat non proident',
		fr_CA:
			'Le Frorem ipsum dolor sit amet: Frexcepteur sint occaecat cupidatat non proident',
	},
	galleys: [
		{
			fileId: 36,
			id: 7,
			isApproved: false,
			label: 'PDF',
			locale: 'en',
			doiObject: {...doi},
			publicationId: 17,
			seq: 0,
			urlPublished: 'http://...',
			urlRemote: '',
		},
		{
			fileId: null,
			id: 8,
			isApproved: false,
			label: 'Remote',
			locale: 'en',
			doiObject: {...doi},
			publicationId: 17,
			seq: 1,
			urlPublished: 'http://...',
			urlRemote: 'http://google.com',
		},
		{
			fileId: 37,
			id: 9,
			isApproved: false,
			label: 'Supplementaru',
			locale: 'en',
			doiObject: {...doi},
			publicationId: 17,
			seq: 2,
			urlPublished: 'http://...',
			urlRemote: '',
		},
	],
	hideAuthor: null,
	id: 17,
	isPublished: false,
	issueId: null,
	keywords: {
		en: ['new keyword', 'and second keyword'],
		fr_CA: ['fr keyword one', 'fr keyword two'],
	},
	language: null,
	lastModified: '2019-06-06 15:00:37',
	licenseUrl: null,
	locale: 'en',
	pages: null,
	prefix: {
		fr_CA: 'Le',
		en: 'The',
	},
	primaryContactId: 20,
	'pub-id::publisher-id': 'lorem-ipsum',
	publicationDateType: 'pub',
	publicationSummary: {
		fr_CA: '',
		en: '',
	},
	publicationType: 'publication',
	rights: {
		fr_CA: '',
		en: '',
	},
	sectionId: 1,
	seq: 0,
	source: {
		fr_CA: '',
		en: '',
	},
	subjects: {
		fr_CA: [],
		en: [],
	},
	submissionId: 17,
	subtitle: {
		en: 'Excepteur sint occaecat cupidatat non proident',
		fr_CA: 'Frexcepteur sint occaecat cupidatat non proident',
	},
	supportingAgencies: {
		fr_CA: [],
		en: [],
	},
	title: {
		en: 'Lorem ipsum dolor sit amet',
		fr_CA: 'Frorem ipsum dolor sit amet',
	},
	type: {
		fr_CA: '',
		en: '',
	},
	urlPublished:
		'http://localhost:8000/publicknowledge/article/view/lorem-ipsum/version/17',
};
