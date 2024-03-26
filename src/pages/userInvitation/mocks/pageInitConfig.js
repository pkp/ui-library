import InsertContentMock from '@/mocks/insertContent';

export default {
	searchUserApiUrl: 'https://mock/index.php/publicknowledge/api/v1/_user',
	emailTemplatesApiUrl:
		'https://mock/index.php/publicknowledge/api/v1/EmailTemplateMocks',
	inviteUserApiUrl:
		'https://mock/index.php/publicknowledge/api/v1/user/_invite',
	userInvitationSavedUrl: window.location.href,
	pageTitle: 'Invite user to take a role',
	pageTitleDescription:
		'You are inviting a user to take a role in OJS along with appearing in the journal masthead',
	primaryLocale: 'en',
	steps: [
		{
			id: 'searchUser',
			name: 'Search User',
			reviewName: '{$step} - Search User',
			type: 'form',
			description:
				'Search for the user using their email address, username or ORCID ID. Enter at least one details to get started. If user does not exist, ypu can invite them to take up roles and be a part of your journal. If the user already exist in the system, you can view user information and invite to take a additional roles.',
			sections: [
				{
					id: 'searchUserForm',
					sectionComponent: 'UserInvitationSearchFormStep',
				},
			],
			reviewTemplate: '/management/invitation/userSearch.tpl',
		},
		{
			id: 'userDetails',
			name: 'Enter details',
			reviewName: '{$step} - Enter details and invite for roles',
			type: 'form',
			description: 'You can invite them to take up a role in OJS',
			sections: [
				{
					id: 'userDetailsForm',
					type: 'form',
					description:
						'<p>Please provide the following details to help us manage your submission in our system.</p>',
					sectionComponent: 'UserInvitationDetailsFormStep',
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
								value: 'null',
								inputType: 'text',
								optIntoEdit: false,
								optIntoEditLabel: '',
								size: 'large',
								prefix: '',
							},
							{
								name: 'orcid',
								component: 'field-text',
								label: 'ORCID iD',
								groupId: 'default',
								isRequired: false,
								isMultilingual: false,
								value: null,
								inputType: 'text',
								optIntoEdit: false,
								optIntoEditLabel: '',
								size: 'large',
								prefix: '',
							},
							{
								name: 'givenName',
								component: 'field-text',
								label: 'Given Name',
								groupId: 'default',
								isRequired: false,
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
								isRequired: false,
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
				},
			],
			reviewTemplate: '/management/invitation/userDetails.tpl',
		},
		{
			id: 'userInvitedEmail',
			name: 'Review & invite for roles',
			reviewName: '{$step} - Modify email shared with the user',
			type: 'email',
			description:
				'Send the user an email to let them know about the invitation, next steps, journal GDPR polices and ORCiD verification',
			sections: [
				{
					id: 'userInvited',
					type: 'email',
					description:
						'<p>Please provide the following details to help us manage your submission in our system.</p></p>',
					sectionComponent: 'UserInvitationEmailComposerStep',
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
						emailTemplates: [
							{
								_href:
									'http://localhost:8000/pu/api/v1/emailTemplates/DISCUSSION_NOTIFICATION_COPYEDITING',
								alternateTo: null,
								body: {
									fr_CA: 'Prière de saisir votre message.',
									en: 'Please enter your message.',
								},
								contextId: null,
								id: null,
								key: 'DISCUSSION_NOTIFICATION_COPYEDITING',
								name: {
									fr_CA: '',
									en: 'Discussion (Copyediting)',
								},
								subject: {
									fr_CA: 'Un message à propos de la revue {$journalName}',
									en: 'A message regarding {$journalName}',
								},
							},
							{
								_href:
									'http://localhost:8000/pu/api/v1/emailTemplates/COPYEDIT_REQUEST',
								alternateTo: 'DISCUSSION_NOTIFICATION_COPYEDITING',
								body: {
									en: '<p>Dear {$recipientName},</p><p>A new submission is ready to be copyedited:</p><p><a href"{$submissionUrl}">{$submissionId} {$submissionTitle}</a><br />{$journalName}</p><p>Please follow these steps to complete this task:</p><ol><li>1. Click on the Submission URL below.</li><li>2. Open any files available under Draft Files and edit the files. Use the Copyediting Discussions area if you need to contact the editor(s) or author(s).</li><li>3. Save the copyedited file(s) and upload them to the Copyedited panel.</li><li>4. Use the Copyediting Discussions to notify the editor(s) that all files have been prepared, and that the Production process may begin.</li></ol><p>If you are unable to undertake this work at this time or have any questions, please contact me. Thank you for your contribution to this journal.</p><p>Kind regards,</p>{$signature}',
									fr_CA:
										"{$recipientName},<br />\n<br />\nJ'aimerais que vous effectuiez la révision du manuscrit intitulé « {$submissionTitle} » pour la revue {$journalName} à l'aide des étapes suivantes.<br />\n1. Cliquer sur l'URL de la soumission ci-dessous.<br />\n2. Ouvrir le(s) fichier(s) disponible(s) sous Fichiers des ébauches finales et effectuer votre révision, tout en ajoutant des discussions sur la révision, le cas échéant.<br />\n3. Enregistrer le(s) fichier(s) révisé(s) et le(s) téléverser dans la section Version(s) révisée(s).<br />\n4. Informer le,la rédacteur-trice que tous les fichiers ont été révisés et que l'étape de production peut débuter.<br />\n<br />\nURL de la revue {$journalName} : {$journalUrl}<br />\nURL de la soumission : {$submissionUrl}<br />\nNom d'utilisateur-trice : {$recipientUsername}",
								},
								contextId: 1,
								id: 1,
								key: 'COPYEDIT_REQUEST',
								name: {
									en: 'Request Copyedit',
									fr_CA: '',
								},
								subject: {
									en: 'Submission {$submissionId} is ready to be copyedited for {$contextAcronym}',
									fr_CA: "Demande de révision d'une soumission",
								},
							},
						],
						defaultEmailTemplateMockKey: 'EDITOR_DECISION_ACCEPT',
						EmailTemplateMocksApiUrl: 'http://example.org',
						variables: {
							en: [...InsertContentMock],
							fr_CA: [...InsertContentMock],
						},
					},
				},
			],
			reviewTemplate: '/management/invitation/userInvitation.tpl',
		},
	],
};
