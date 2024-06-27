export default {
	primaryLocale: 'en',
	pageTitle: 'Invite user to take a role',
	pageTitleDescription:
		'You are inviting a user to take a role in OJS along with appearing in the journal masthead',
	invitationId: 65,
	invitationKey: '8aqc3W',
	steps: [
		{
			id: 'verifyOrcid',
			name: 'Verify ORCID iD',
			reviewName: '',
			stepName: '{$step} - Verify ORCID iD',
			type: 'popup',
			description: 'Please verify orcid iD',
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
			id: 'userCreate',
			name: 'Create OJS account',
			reviewName: 'Account details',
			stepName: '{$step} - Create OJS account',
			type: 'form',
			description:
				'To get started with OJS and accept the new role, you will need to create an account with us. For this purpose please enter a username and password.',
			stepButtonName: 'Save And Continue',
			sections: [
				{
					id: 'userCreateForm',
					sectionComponent: 'AcceptInvitationUserAccountDetails',
					props: {
						validateFields: ['username', 'password'],
					},
				},
			],
			reviewData: [],
		},
		{
			id: 'userDetails',
			name: 'Enter details',
			reviewName: 'User Details',
			stepName: '{$step} - Enter details',
			type: 'form',
			description:
				'Enter your details like email ID, affiliation ect. As per the GDPR compliance, this information can only modified by you. You can also choose if you want this information to be visible on your profile to the editor. ',
			stepButtonName: 'Accept And Continue to OJS',
			sections: [
				{
					id: 'userCreateDetailsForm',
					type: 'form',
					description:
						'<p>Please provide the following details to help us manage your submission in our system.</p>',
					props: {
						form: {
							id: 'userDetails',
							method: 'POST',
							action:
								'http://localhost/ojs/index.php/publicknowledge/api/v1/users',
							fields: [
								{
									name: 'givenName',
									component: 'field-text',
									label: 'Given Name',
									groupId: 'default',
									isRequired: true,
									isMultilingual: false,
									value: null,
									inputType: 'text',
									optIntoEdit: false,
									optIntoEditLabel: '',
									size: 'large',
									prefix: '',
								},
								{
									name: 'familyName',
									component: 'field-text',
									label: 'Family Name',
									groupId: 'default',
									isRequired: true,
									isMultilingual: false,
									value: null,
									inputType: 'text',
									optIntoEdit: false,
									optIntoEditLabel: '',
									size: 'large',
									prefix: '',
								},
								{
									name: 'affiliation',
									component: 'field-text',
									label: 'Affiliation',
									groupId: 'default',
									isRequired: true,
									isMultilingual: false,
									value: null,
									inputType: 'text',
									optIntoEdit: false,
									optIntoEditLabel: '',
									size: 'large',
									prefix: '',
								},
								{
									name: 'country',
									component: 'field-text',
									label: 'County of affiliation',
									groupId: 'default',
									isRequired: true,
									isMultilingual: false,
									value: null,
									inputType: 'text',
									optIntoEdit: false,
									optIntoEditLabel: '',
									size: 'large',
									prefix: '',
								},
							],
							groups: [
								{
									id: 'default',
									pageId: 'default',
								},
							],
							hiddenFields: {},
							pages: [
								{
									id: 'default',
									submitButton: {
										label: 'Save',
									},
								},
							],
							primaryLocale: 'en',
							visibleLocales: ['en'],
							supportedFormLocales: [
								{
									key: 'en',
									label: 'English',
								},
								{
									key: 'fr_CA',
									label: 'French',
								},
							],
							errors: {},
						},
						validateFields: [
							'affiliation',
							'givenName',
							'familyName',
							'country',
						],
					},
					sectionComponent: 'AcceptInvitationUserDetailsForms',
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
