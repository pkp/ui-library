function isObject(variable) {
	return (
		typeof variable === 'object' &&
		variable !== null &&
		!Array.isArray(variable)
	);
}

const CommonDefaults = {
	_href:
		'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/19/publications/20',
	authorsString: 'Zita Woods (Author)',
	authorsStringIncludeInBrowse: 'Zita Woods (Author)',
	authorsStringShort: 'Woods',
	categoryIds: [],
	coverImage: {
		en: null,
		fr_CA: null,
	},
	datePublished: null,
	doiObject: null,
	fullTitle: {
		en: 'Finocchiaro: Arguments About Arguments',
		fr_CA: '',
	},
	galleys: [],
	id: 20,
	locale: 'en',
	pages: null,
	prefix: {
		en: '',
		fr_CA: '',
	},
	primaryContactId: 28,
	'pub-id::publisher-id': null,
	sectionId: 2,
	status: 1,
	submissionId: 19,
	subtitle: {
		en: '',
		fr_CA: '',
	},
	title: {
		en: 'Finocchiaro: Arguments About Arguments',
		fr_CA: '',
	},
	urlPublished:
		'http://localhost:7002/index.php/publicknowledge/article/view/19/version/20',
	version: 1,
};

export function getPublicationMock(overrides = {}) {
	let publication = {...CommonDefaults};

	Object.keys(overrides).forEach((key) => {
		// detect multilingual field to simplify mocking
		if (
			!isObject(overrides[key]) &&
			isObject(publication[key]) &&
			publication[key].en
		) {
			publication[key] = {fr_CA: '', en: overrides[key]};
		} else {
			publication[key] = overrides[key];
		}
	});

	return publication;
}
