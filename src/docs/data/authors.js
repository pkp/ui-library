export const dbarnes = {
	affiliation: {
		en_US: 'Public Knowledge Project',
		fr_CA: ''
	},
	email: 'dbarnes@mailinator.com',
	familyName: {
		en_US: 'Barnes',
		fr_CA: ''
	},
	fullName: 'Daniel Barnes',
	givenName: {
		en_US: 'Daniel',
		fr_CA: ''
	},
	id: 20,
	includeInBrowse: true,
	orcid: '',
	preferredPublicName: {
		fr_CA: '',
		en_US: ''
	},
	publicationId: 17,
	seq: 1,
	userGroupId: 14,
	userGroupName: {
		fr_CA: '',
		en_US: 'Author'
	}
};

export const lipsum = {
	affiliation: {
		en_US: 'University of Public Knowledge',
		fr_CA: ''
	},
	email: 'lipsum@mailinator.com',
	familyName: {
		en_US: 'Ipsum',
		fr_CA: 'Ipsum'
	},
	fullName: 'Dr. L. P. Ipsum',
	givenName: {
		en_US: 'Lorem',
		fr_CA: 'French Lorem'
	},
	id: 21,
	includeInBrowse: true,
	orcid: 'https://orcid.org/0000-0001-5756-5406',
	preferredPublicName: {
		en_US: 'Dr. L. P. Ipsum',
		fr_CA: 'Dr F. L. P. Ipsum'
	},
	publicationId: 17,
	seq: 1,
	userGroupId: 14,
	userGroupName: {
		fr_CA: '',
		en_US: 'Author'
	}
};

export default [{...dbarnes}, {...lipsum}];
