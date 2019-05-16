export default {
	id: 1,
	_href: 'http://publicknowledgeprojects.org/journal/api/users/1',
	userName: 'exampleuser',
	fullName: 'Jane Doe',
	affiliation: {
		en_US: 'University of Nowhere'
	},
	groups: [
		{
			id: 1,
			name: {
				en_US: 'Reviewer'
			},
			abbrev: {
				en_US: 'RV'
			},
			roleId: 4096, // reviewer
			showTitle: true,
			permitSelfRegistration: true,
			recommendOnly: true
		}
	],
	interests: [
		{
			id: 123,
			interest: 'cat'
		},
		{
			id: 124,
			interest: 'dog'
		},
		{
			id: 125,
			interest: 'fish'
		},
		{
			id: 126,
			interest: 'bear'
		},
		{
			id: 127,
			interest: 'alien'
		}
	],
	reviewsActive: 2,
	reviewsCompleted: 1,
	averageReviewCompletionDays: 21,
	dateLastReviewAssignment: '2017-02-03 11:22:42',
	reviewsDeclined: 0,
	reviewsCancelled: 0,
	reviewerRating: 4,
	orcid: '',
	disabled: false,
	biography: {}
};
