const CommonDefaults = {
	_href: 'http://localhost:7002/index.php/publicknowledge/api/v1/users/3',
	affiliation: {
		en: 'University of Melbourne',
		fr_CA: 'Australia',
	},
	averageReviewCompletionDays: null,
	biography: {
		en: '',
		fr_CA: '',
	},
	canLoginAs: true,
	canMergeUsers: true,
	dateLastReviewAssignment: null,
	disabled: false,
	displayInitials: 'DB',
	email: 'dbarnes@mailinator.com',
	familyName: {
		en: 'Barnes',
		fr_CA: 'Barnes',
	},
	fullName: 'Daniel Barnes',
	givenName: {
		en: 'Daniel',
		fr_CA: 'Daniel',
	},
	groups: [
		{
			id: 3,
			name: 'Journal editor',
			abbrev: 'JE',
			roleId: 16,
			showTitle: true,
			permitSelfRegistration: false,
			permitMetadataEdit: true,
			recommendOnly: false,
			dateStart: '2025-03-06T00:00:00.000000Z',
			dateEnd: null,
		},
	],
	id: 3,
	interests: [],
	orcid: null,
	orcidAccessDenied: null,
	orcidAccessExpiresOn: null,
	orcidAccessScope: null,
	orcidAccessToken: null,
	orcidDisplayValue: null,
	orcidEmailToken: null,
	orcidIsVerified: null,
	orcidRefreshToken: null,
	orcidReviewPutCode: null,
	preferredPublicName: {
		en: '',
		fr_CA: '',
	},
	reviewerRating: null,
	reviewsActive: null,
	reviewsCancelled: null,
	reviewsCompleted: null,
	reviewsDeclined: null,
	stageAssignments: [
		{
			stageAssignmentId: 2,
			stageAssignmentUserGroup: {
				id: 3,
				name: 'Journal editor',
				abbrev: 'JE',
				roleId: 16,
				showTitle: true,
				permitSelfRegistration: false,
				permitMetadataEdit: true,
				recommendOnly: false,
			},
			stageAssignmentStageId: 5,
			recommendOnly: false,
			canChangeMetadata: true,
			stageAssignmentStage: {
				id: 5,
				label: 'Production',
			},
		},
	],
	userName: 'dbarnes',
};

export function getParticipantMock(_overrides = {}) {
	const {stageAssignments: overrideStageAssignments, ...overrides} = _overrides;

	const stageAssignments = CommonDefaults.stageAssignments.map(
		(stageAssignment) => {
			const overrideStageAssignment =
				overrideStageAssignments?.find(
					(os) =>
						os.stageAssignmentStageId ===
						stageAssignment.stageAssignmentStageId,
				) || {};
			return {...stageAssignment, ...overrideStageAssignment};
		},
	);
	return {...CommonDefaults, stageAssignments, ...overrides};
}
