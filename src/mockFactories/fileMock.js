import {isObject} from './mockHelpers';

const CommonDefaults = {
	_href:
		'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/1/files/11',
	assocId: 1,
	assocType: 523,
	caption: null,
	copyrightOwner: null,
	createdAt: '2025-03-06 05:59:08',
	creator: {
		en: '',
		fr_CA: '',
	},
	credit: null,
	dateCreated: null,
	description: {
		en: '',
		fr_CA: '',
	},
	documentType: 'pdf',
	fileId: 1,
	fileStage: 4,
	genreId: 1,
	genreIsDependent: false,
	genreIsSupplementary: false,
	genreName: {
		en: 'Article Text',
		fr_CA: "Texte de l'article",
	},
	id: 11,
	language: null,
	locale: null,
	mimetype: 'application/pdf',
	name: {
		en: 'Signalling Theory Dividends: A Review Of The Literature And Empirical Evidence.pdf',
		fr_CA: '',
	},
	path: 'journals/1/articles/1/67c9397dd587f.pdf',
	publisher: {
		en: '',
		fr_CA: '',
	},
	source: {
		en: '',
		fr_CA: '',
	},
	sourceSubmissionFileId: 1,
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
	updatedAt: '2025-03-06 05:59:08',
	uploaderUserId: 17,
	uploaderUserName: 'amwandenga',
	url: 'http://localhost:7002/index.php/publicknowledge/$$$call$$$/api/file/file-api/download-file?submissionFileId=11&submissionId=1&stageId=3',
	viewable: null,
};

export function getFileMock(overrides = {}) {
	let file = {...CommonDefaults};

	Object.keys(overrides).forEach((key) => {
		// detect multilingual field to simplify mocking
		if (!isObject(overrides[key]) && isObject(file[key]) && file[key].en) {
			file[key] = {fr_CA: '', en: overrides[key]};
		} else {
			file[key] = overrides[key];
		}
	});

	return file;
}
