import {deepMerge} from './mockHelpers';

const CommonDefaults = {
	id: 285,
	publicationId: 20,
	seq: 1,
	title:
		'Open science practices and transparency indicators in scholarly journals',
	identifierType: 'doi',
	identifier: 'https://doi.org/10.5281/zenodo.12345678',
	relationshipType: 'analyzed',
	repository: 'Zenodo',
	year: '2022',
	authors: [
		{
			givenName: 'Emily',
			familyName: 'Carter',
			orcid: 'https://orcid.org/0000-0002-1234-5678',
		},
		{
			givenName: 'Daniel',
			familyName: 'Thompson',
			orcid: 'https://orcid.org/0000-0003-2345-6789',
		},
	],
	url: null,
};

export function getDataCitationMock(overrides = {}) {
	return deepMerge({...CommonDefaults}, overrides);
}

export function getDataCitationsMock(overrides = []) {
	const dataCitations = [
		getDataCitationMock(),
		getDataCitationMock({
			id: 286,
			seq: 2,
			title:
				'Adoption of open science policies in publicly funded research organisations',
			identifier: 'https://doi.org/10.6084/m9.figshare.87654321',
			repository: 'Figshare',
			year: '2023',
			authors: [
				{
					givenName: 'Laura',
					familyName: 'Mitchell',
					orcid: 'https://orcid.org/0000-0001-3456-7890',
				},
				{
					givenName: 'Andrew',
					familyName: 'Wilson',
					orcid: 'https://orcid.org/0000-0002-4567-8901',
				},
			],
		}),
	];

	return dataCitations.map((dataCitation, i) =>
		overrides[i] ? deepMerge(dataCitation, overrides[i]) : dataCitation,
	);
}
