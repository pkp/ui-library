import {deepMerge} from './mockHelpers';

const CommonDefaults = {
	doiObject: null,
	file: {
		_href:
			'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/1/files/12',
		assocId: 1,
		assocType: 521,
		caption: null,
		copyrightOwner: null,
		createdAt: '2025-03-06 06:01:17',
		creator: {
			en: '',
			fr_CA: '',
		},
		credit: null,
		dateCreated: null,
		dependentFiles: [],
		description: {
			en: '',
			fr_CA: '',
		},
		documentType: 'pdf',
		fileId: 7,
		fileStage: 10,
		genreId: 1,
		genreIsDependent: false,
		genreIsSupplementary: false,
		genreName: {
			en: 'Article Text',
			fr_CA: "Texte de l'article",
		},
		id: 12,
		language: null,
		locale: null,
		mimetype: 'application/pdf',
		name: {
			en: 'article.pdf',
			fr_CA: '',
		},
		path: 'journals/1/articles/1/67c93a2d9840e.pdf',
		publisher: {
			en: '',
			fr_CA: '',
		},
		revisions: [],
		source: {
			en: '',
			fr_CA: '',
		},
		sourceSubmissionFileId: null,
		sponsor: {
			en: '',
			fr_CA: '',
		},
		subject: {
			en: '',
			fr_CA: '',
		},
		submissionId: 1,
		terms: null,
		updatedAt: '2025-03-06 06:01:18',
		uploaderUserId: 3,
		uploaderUserName: 'dbarnes',
		url: 'http://localhost:7002/index.php/publicknowledge/$$$call$$$/api/file/file-api/download-file?submissionFileId=12&submissionId=1&stageId=5',
		viewable: null,
	},
	id: 2,
	isApproved: false,
	label: 'PDF Version 2',
	locale: 'en',
	'pub-id::publisher-id': null,
	publicationId: 2,
	seq: 0,
	submissionFileId: 12,
	urlPublished:
		'http://localhost:7002/index.php/publicknowledge/en/article/view/mwandenga-signalling-theory/version/2/pdf',
	urlRemote: null,
};

export function getGalleyMock(overrides = {}) {
	const galley = deepMerge({...CommonDefaults}, overrides);
	return galley;
}
