import InsertContentMock from '@/mocks/insertContent';
import emailTemplate from '@/mocks/emailTemplate';

const recipientOptions = [
	{
		value: 2,
		label: {
			en: 'Carlo Corino',
			fr_CA: 'Carlo Fr Corino',
		},
	},
	{
		value: 3,
		label: {
			en: 'Daniel Barnes',
			fr_CA: 'Daniel Fr Barnes',
		},
	},
	{
		value: 4,
		label: {
			en: 'Stephanie Minoue',
			fr_CA: 'Stephanie Fr Minoue',
		},
	},
	{
		value: 5,
		label: {
			en: 'Paul Hudson',
			fr_CA: 'Paul Fr Hudson',
		},
	},
];

export default {
	emailTemplatesApiUrl:
		'https://mock/index.php/publicknowledge/api/v1/EmailTemplateMocks',
	pageTitle: 'Invite user to take a role',
	pageTitleDescription:
		'You are inviting a user to take a role in OJS along with appearing in the journal masthead',
	primaryLocale: 'en',
	invitationType: 'userRoleAssignment',
	invitationMode: 'create',
	invitationPayload: {
		userId: null,
		inviteeEmail: '',
		orcid: '',
		givenName: '',
		familyName: '',
		orcidValidation: false,
		disabled: false,
		userGroupsToAdd: [{userGroupId: null, dateStart: null, masthead: null}],
		currentUserGroups: [],
		userGroupsToRemove: [],
		emailComposer: {
			body: '',
			subject: '',
		},
	},
	steps: [
		{
			id: 'searchUser',
			name: 'Search User',
			stepLabel: '{$step} - Search User',
			description:
				'If the user does not exist, you can invite them to take on roles and become part of your journal. If the user already exists in the system, you can view their information and invite them to take on additional roles.',
			nextButtonLabel: 'Search user (t)',
			skipInvitationUpdate: true,
			sections: [
				{
					id: 'searchUserForm',
					sectionComponent: 'UserInvitationSearchFormStep',
					props: {
						validateFields: [],
					},
				},
			],
		},
		{
			id: 'userDetails',
			name: 'Enter details',
			stepLabel: '{$step} - Enter details and invite for roles',
			type: 'form',
			description: 'You can invite them to take up a role in OJS',
			nextButtonLabel: 'Save And Continue (t)',
			skipInvitationUpdate: false,
			sections: [
				{
					id: 'userDetailsForm',
					type: 'form',
					description:
						'<p>Please provide the following details to help us manage your submission in our system.</p>',
					sectionComponent: 'UserInvitationDetailsFormStep',
					props: {
						userGroups: [
							{
								value: 2,
								label: 'Journal manager',
								disabled: false,
							},
							{
								value: 3,
								label: 'Journal editor',
								disabled: false,
							},
							{
								value: 4,
								label: 'Production editor',
								disabled: false,
							},
							{
								value: 5,
								label: 'Section editor',
								disabled: false,
							},
							{
								value: 6,
								label: 'Guest editor',
								disabled: false,
							},
							{
								value: 7,
								label: 'Copyeditor',
								disabled: false,
							},
							{
								value: 8,
								label: 'Designer',
								disabled: false,
							},
							{
								value: 9,
								label: 'Funding coordinator',
								disabled: false,
							},
							{
								value: 10,
								label: 'Indexer',
								disabled: false,
							},
							{
								value: 11,
								label: 'Layout Editor',
								disabled: false,
							},
							{
								value: 12,
								label: 'Marketing and sales coordinator',
								disabled: false,
							},
							{
								value: 13,
								label: 'Proofreader',
								disabled: false,
							},
							{
								value: 14,
								label: 'Author',
								disabled: false,
							},
							{
								value: 15,
								label: 'Translator',
								disabled: false,
							},
							{
								value: 16,
								label: 'Reviewer',
								disabled: false,
							},
							{
								value: 17,
								label: 'Reader',
								disabled: false,
							},
							{
								value: 18,
								label: 'Subscription Manager',
								disabled: false,
							},
						],
						form: {
							id: 'userDetails',
							method: 'POST',
							action:
								'http://localhost/ojs/index.php/publicknowledge/api/v1/users',
							fields: [
								{
									name: 'email',
									component: 'field-text',
									label: 'Email address',
									groupId: 'default',
									isRequired: true,
									isMultilingual: false,
									description: 'e.g. aeinstein@example.com',
									value: 'null',
									inputType: 'text',
									optIntoEdit: false,
									optIntoEditLabel: '',
									size: 'large',
									prefix: '',
								},
								{
									component: 'field-html',
									description:
										'On accepting the invite, the user will be redirected to ORCID to verify their account, if they wish to.',
									groupId: 'default',
									isInert: true,
									isMultilingual: false,
									isRequired: false,
									label: 'ORCID iD',
									name: 'orcid',
									value: null,
								},
								{
									name: 'givenName',
									component: 'field-text',
									label: 'Given Name',
									groupId: 'default',
									isRequired: false,
									isMultilingual: true,
									description:
										'If you know the given name of the user, you can enter the information. However, this information can be changed by the user',
									value: {
										en: '',
										fr_CA: '',
									},
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
									isRequired: false,
									isMultilingual: true,
									description:
										'If you know the family name of the user, you can enter the information. However, this information can be changed by the user',
									value: {
										en: '',
										fr_CA: '',
									},
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
							pages: [{id: 'default', submitButton: null}],
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
							'inviteeEmail',
							'givenName',
							'familyName',
							'userGroupsToAdd',
						],
					},
				},
			],
		},
		{
			id: 'userInvitedEmail',
			name: 'Review & invite for roles',
			stepLabel: '{$step} - Modify email shared with the user',
			type: 'email',
			description:
				'Send the user an email to let them know about the invitation, next steps, journal GDPR polices and ORCiD verification',
			nextButtonLabel: 'Invite user to the role (t)',
			sections: [
				{
					id: 'userInvited',
					type: 'email',
					description:
						'<p>Please provide the following details to help us manage your submission in our system.</p></p>',
					sectionComponent: 'UserInvitationEmailComposerStep',
					props: {
						email: {
							id: 'userInvited',
							type: 'email',
							name: 'Invite Users',
							attachers: [],
							canChangeRecipients: false,
							canSkip: true,
							description:
								'Send an email to the authors to let them know that this submission will be sent for peer review. If possible, give the authors some indication of how long the peer review process might take and when they should expect to hear from the editors again. This email will not be sent until the decision is recorded.',
							errors: {},
							initialTemplateKey: 'EDITOR_DECISION_ACCEPT',
							anonymousRecipients: false,
							locale: 'en',
							body: "{$recipientName}<br />\\n\n<br />\\n\nYou have now been registered as a user with Journal of Public Knowledge. We have included your username and password in this email, which are needed for all work with this journal through its website. At any point, you can ask to be removed from the journal's list of users by contacting me.<br />\\n\n<br />\\n\naccept url: {$acceptUrl}<br />\\n\ndecline url: {$declineUrl}<br />\\n\n<br />\\n\nThank you,<br />\\n\n<p>admin admin</p>\n",
							subject: 'User invited',
							emailTemplates: [emailTemplate],
							emailTemplatesApiUrl:
								'https://httbin.org/publicknowledge/api/v1/emailTemplates',
							locales: [
								{
									locale: 'en',
									name: 'English',
								},
								{
									locale: 'fr_CA',
									name: 'French',
								},
							],
							to: [2, 3],
							recipientOptions: recipientOptions,
							recipients: recipientOptions.map((r) => r.value),
							variables: {
								en: [...InsertContentMock],
								fr_CA: [...InsertContentMock],
							},
						},
						validateFields: ['emailComposer'],
					},
				},
			],
		},
	],
};
