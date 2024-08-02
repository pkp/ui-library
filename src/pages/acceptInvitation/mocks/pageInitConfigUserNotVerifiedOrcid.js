export default {
	primaryLocale: 'en',
	invitationId: 65,
	invitationKey: '8aqc3W',
	steps: [
		{
			id: 'verifyOrcid',
			name: 'Verify ORCID iD',
			reviewName: '',
			stepName: '{$step} - Verify ORCID iD',
			type: 'popup',
			description:
				'You can choose to verify your ORCID iD ok skip it. If you chose to skip it now, You can verify your ORCID iD from your profile section in OJS later',
			stepButtonName: 'Save And Continue',
			sections: [
				{
					id: 'userVerifyOrcid',
					sectionComponent: 'AcceptInvitationVerifyOrcid',
					props: {},
				},
			],
		},
		{
			id: 'userCreateReview',
			name: 'Review & create account',
			reviewName: 'Roles',
			stepName: '{$step} - Review & create account',
			type: 'review',
			description: 'Review details to start your new roles in OJS',
			stepButtonName: 'Accept And Continue to OJS',
			sections: [
				{
					id: 'userCreateRoles',
					sectionComponent: 'AcceptInvitationReview',
					type: 'table',
					description: '',
					props: {},
				},
			],
		},
	],
};
