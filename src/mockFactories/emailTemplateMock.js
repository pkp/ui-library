import {deepMerge} from './mockHelpers';

const CommonDefaults = {
	_href:
		'https://mock/index.php/publicknowledge/api/v1/emailTemplates/DISCUSSION_NOTIFICATION_SUBMISSION',
	alternateTo: null,
	assignedUserGroupIds: [],
	body: {
		en: 'Please enter your message.',
		fr_CA: 'Prière de saisir votre message.',
	},
	contextId: 1,
	id: 1,
	isUnrestricted: true,
	key: 'DISCUSSION_NOTIFICATION_SUBMISSION',
	name: {
		en: 'Discussion (Submission)',
		fr_CA: 'Discussion (soumission)',
	},
	subject: {
		en: 'A message regarding {$journalName}',
		fr_CA: 'Un message à propos de la revue {$journalName}',
	},
};

const dataDescriptions = {
	authorSubmissionUrl: "The author's URL to the submission",
	authors: 'The full names of the authors',
	authorsShort:
		'The names of the authors in a short string, like "Barnes, et al"',
	contactEmail: "The email address of the journal's primary contact",
	contactName: "The name of the journal's primary contact",
	contextAcronym: "The journal's initials",
	journalName: "The journal's name",
	journalSignature: "The journal's email signature for automated emails",
	journalUrl: "The URL to the journal's homepage",
	mailingAddress: 'The mailing address of the journal',
	passwordLostUrl:
		'The URL to a page where the user can recover a lost password',
	recipientName: 'The full name of the recipient or all recipients',
	recipientUsername: 'The username of the recipient or all recipients',
	senderEmail: 'The email address of the sender',
	senderName: 'The full name of the sender',
	signature: 'The email signature of the sender',
	submissionAbstract: "The submission's abstract",
	submissionId: "The submission's unique ID number",
	submissionPublishedUrl: 'The URL to the published submission',
	submissionTitle: "The submission's title",
	submissionUrl: 'The URL to the submission in the editorial backend',
	submissionWizardUrl: 'The URL to the submission in the submission wizard',
	submissionsUrl: "The URL to view all of a user's assigned submissions",
	userProfileUrl: 'The URL for a user to view and edit their profile',
};

export const emailTemplateMock = {
	DISCUSSION_NOTIFICATION_SUBMISSION: {
		emailTemplates: [
			{...CommonDefaults},
			deepMerge(
				{...CommonDefaults},
				{
					key: 'EDITOR_ASSIGN_SUBMISSION',
					name: {
						en: 'Assign Editor',
						fr_CA: 'Assigner un-e rédacteur-trice',
					},
					body: {
						en: '<p>Dear {$recipientName},</p><p>The following submission has been assigned to you to see through the editorial process.</p><p><a href="{$submissionUrl}">{$submissionTitle}</a><br />{$authors}</p><p><b>Abstract</b></p>{$submissionAbstract}<p>If you find the submission to be relevant for {$journalName}, please forward the submission to the review stage by selecting "Send to Review" and then assign reviewers by clicking "Add Reviewer".</p><p>If the submission is not appropriate for this journal, please decline the submission.</p><p>Thank you in advance.</p><p>Kind regards,</p>{$journalSignature}',
						fr_CA:
							'<p>{$recipientName},</p><p>La soumission suivante vous a été assignée pour le suivi du processus éditorial.</p><p><a href="{$submissionUrl}">{$submissionTitle}</a><br />{$authors}</p><p><b>Résumé</b></p>{$submissionAbstract}</p><p>Si vous jugez la soumission pertinente pour la revue {$journalName}, veuillez la transmettre à l\'étape d\'évaluation en sélectionnant "Envoyer en évaluation" et en désignant des évaluateur.trice.s en cliquant sur « Ajouter un.e évaluateur.trice ».</p><p>Si la soumission n\'est pas appropriée pour cette revue, veuillez la décliner.</p><p>Je vous remercie d\'avance.</p><p>Cordialement,</p>{$journalSignature}',
					},
					subject: {
						en: 'You have been assigned as an editor on a submission to {$journalName}',
						fr_CA:
							"Vous avez été assigné.e en tant que rédacteur.trice d'une soumission de la revue {$journalName}",
					},
				},
			),
		],
		dataDescriptions,
	},
	DISCUSSION_NOTIFICATION_REVIEW: {
		emailTemplates: [
			deepMerge(
				{...CommonDefaults},
				{
					id: 3,
					key: 'DISCUSSION_NOTIFICATION_REVIEW',
					name: {
						en: 'Discussion (Review)',
						fr_CA: 'Discussion (évaluation)',
					},
					body: {
						en: 'Please enter your message.',
						fr_CA: 'Prière de saisir votre message.',
					},
					subject: {
						en: 'A message regarding {$journalName}',
						fr_CA: 'Un message à propos de la revue {$journalName}',
					},
				},
			),
			deepMerge(
				{...CommonDefaults},
				{
					id: 4,
					key: 'EDITOR_ASSIGN_REVIEW',
					name: {
						en: 'Assign Editor',
						fr_CA: 'Assigner un-e rédacteur-trice',
					},
					body: {
						en: '<p>Dear {$recipientName},</p><p>The following submission has been assigned to you to see through the peer review process.</p><p><a href="{$submissionUrl}">{$submissionTitle}</a><br />{$authors}</p><p><b>Abstract</b></p>{$submissionAbstract}<p>Please login to <a href="{$submissionUrl}">view the submission</a> and assign qualified reviewers. You can assign a reviewer by clicking "Add Reviewer".</p><p>Thank you in advance.</p><p>Kind regards,</p>{$signature}',
						fr_CA:
							'<p>{$recipientName},</p><p>La soumission suivante vous a été assignée pour le processus d\'évaluation par les pairs.</p><p><a href="{$submissionUrl}">{$submissionTitle}</a><br />{$authors}</p><p><b>Résumé</b></p>{$submissionAbstract}<p>Veuillez vous connecter pour <a href="{$submissionUrl}">voir la soumission</a> et désigner des évaluateur.trice.s qualifié.es. Vous pouvez désigner un.e évaluateur.trice en cliquant sur « Ajouter un.e évaluateur.trice ».</p><p>Je vous remercie d\'avance.</p><p>Cordialement,</p>{$signature}',
					},
					subject: {
						en: 'You have been assigned as an editor on a submission to {$journalName}',
						fr_CA:
							"Vous avez été assigné.e en tant que rédacteur.trice d'une soumission de la revue {$journalName}",
					},
				},
			),
		],
		dataDescriptions,
	},
	DISCUSSION_NOTIFICATION_COPYEDITING: {
		emailTemplates: [
			deepMerge(
				{...CommonDefaults},
				{
					id: 5,
					key: 'DISCUSSION_NOTIFICATION_COPYEDITING',
					name: {
						en: 'Discussion (Copyediting)',
						fr_CA: 'Discussion (révision)',
					},
					body: {
						en: 'Please enter your message.',
						fr_CA: 'Prière de saisir votre message.',
					},
					subject: {
						en: 'A message regarding {$journalName}',
						fr_CA: 'Un message à propos de la revue {$journalName}',
					},
				},
			),
			deepMerge(
				{...CommonDefaults},
				{
					id: 6,
					key: 'COPYEDIT_REQUEST',
					name: {
						en: 'Request Copyedit',
						fr_CA: 'Demande de révision',
					},
					body: {
						en: '<p>Dear {$recipientName},</p><p>A new submission is ready to be copyedited:</p><p><a href"{$submissionUrl}">{$submissionId} — "{$submissionTitle}"</a><br />{$journalName}</p><p>Please follow these steps to complete this task:</p><ol><li>Click on the Submission URL below.</li><li>Open any files available under Draft Files and edit the files. Use the Copyediting Discussions area if you need to contact the editor(s) or author(s).</li><li>Save the copyedited file(s) and upload them to the Copyedited panel.</li><li>Use the Copyediting Discussions to notify the editor(s) that all files have been prepared, and that the Production process may begin.</li></ol><p>If you are unable to undertake this work at this time or have any questions, please contact me. Thank you for your contribution to {$journalName}.</p><p>Kind regards,</p>{$signature}',
						fr_CA:
							"{$recipientName},<br />\n<br />\nJ'aimerais que vous effectuiez la révision du manuscrit intitulé « {$submissionTitle} » pour la revue {$journalName} à l'aide des étapes suivantes.<br />\n1. Cliquer sur l'URL de la soumission ci-dessous.<br />\n2. Ouvrir le(s) fichier(s) disponible(s) sous Fichiers des ébauches finales et effectuer votre révision, tout en ajoutant des discussions sur la révision, le cas échéant.<br />\n3. Enregistrer le(s) fichier(s) révisé(s) et le(s) téléverser dans la section Version(s) révisée(s).<br />\n4. Informer le,la rédacteur-trice que tous les fichiers ont été révisés et que l'étape de production peut débuter.<br />\n<br />\nURL de la revue {$journalName} : {$journalUrl}<br />\nURL de la soumission : {$submissionUrl}<br />\nNom d'utilisateur-trice : {$recipientUsername}",
					},
					subject: {
						en: 'Submission {$submissionId} is ready to be copyedited for {$contextAcronym}',
						fr_CA: "Demande de révision d'une soumission",
					},
				},
			),
		],
		dataDescriptions,
	},
	DISCUSSION_NOTIFICATION_PRODUCTION: {
		emailTemplates: [
			deepMerge(
				{...CommonDefaults},
				{
					id: 7,
					key: 'DISCUSSION_NOTIFICATION_PRODUCTION',
					name: {
						en: 'Discussion (Production)',
						fr_CA: 'Discussion (production)',
					},
					body: {
						en: 'Please enter your message.',
						fr_CA: 'Prière de saisir votre message.',
					},
					subject: {
						en: 'A message regarding {$journalName}',
						fr_CA: 'Un message à propos de la revue {$journalName}',
					},
				},
			),
			deepMerge(
				{...CommonDefaults},
				{
					id: 8,
					key: 'EDITOR_ASSIGN_PRODUCTION',
					name: {
						en: 'Assign Editor',
						fr_CA: 'Assigner un-e rédacteur-trice',
					},
					body: {
						en: '<p>Dear {$recipientName},</p><p>The following submission has been assigned to you to see through the production stage.</p><p><a href="{$submissionUrl}">{$submissionTitle}</a><br />{$authors}</p><p><b>Abstract</b></p>{$submissionAbstract}<p>Please login to <a href="{$submissionUrl}">view the submission</a>. Once production-ready files are available, upload them under the <strong>Publication > Galleys</strong> section. Then schedule the work for publication by clicking the <strong>Schedule for Publication</strong> button.</p><p>Thank you in advance.</p><p>Kind regards,</p>{$signature}',
						fr_CA:
							'<p>{$recipientName},</p><p>La soumission suivante vous a été assignée pour suivre le processus de production.</p><p><a href="{$submissionUrl}">{$submissionTitle}</a><br />{$authors}</p><p><b>Résumé</b></p>{$submissionAbstract}<p>Veuillez vous connecter pour <a href="{$submissionUrl}">afficher la soumission</a>. Une fois les fichiers prêts pour la production disponibles, les téléverser sous la section <strong>Publication &gt; Épreuves</strong>. Ensuite, planifier la publication en cliquant sur le bouton <strong>Planifier la publication</strong>.</p><p>Merci d\'avance.</p><p>Cordialement,</p>{$signature}',
					},
					subject: {
						en: 'You have been assigned as an editor on a submission to {$journalName}',
						fr_CA:
							"Vous avez été assigné.e en tant que rédacteur.trice d'une soumission de la revue {$journalName}",
					},
				},
			),
			deepMerge(
				{...CommonDefaults},
				{
					id: 9,
					key: 'LAYOUT_COMPLETE',
					name: {
						en: 'Galleys Complete',
						fr_CA: 'Épreuves complétées',
					},
					body: {
						en: '<p>Dear {$recipientName},</p><p>Galleys have now been prepared for the following submission and are ready for final review.</p><p><a href="{$submissionUrl}">{$submissionTitle}</a><br />{$journalName}</p><p>If you have any questions, please contact me.</p><p>Kind regards,</p><p>{$signature}</p>',
						fr_CA:
							'<p>Bonjour {$recipientName},</p><p>Les épreuves du manuscrit intitulé « <a href="{$submissionUrl}">{$submissionTitle}</a> » pour la revue {$journalName} sont maintenant prêtes pour la relecture.</p><p>Si vous avez des questions, n\'hésitez pas à communiquer avec moi.</p><p>{$signature}</p>',
					},
					subject: {
						en: 'Galleys Complete',
						fr_CA: 'Mise en page des épreuves terminée',
					},
				},
			),
			deepMerge(
				{...CommonDefaults},
				{
					id: 10,
					key: 'LAYOUT_REQUEST',
					name: {
						en: 'Ready for Production',
						fr_CA: 'Prêt pour production',
					},
					body: {
						en: '<p>Dear {$recipientName},</p><p>A new submission is ready for layout editing:</p><p><a href="{$submissionUrl}">{$submissionId} — {$submissionTitle}</a><br />{$journalName}</p><ol><li>Click on the Submission URL above.</li><li>Download the Production Ready files and use them to create the galleys according to the journal\'s standards.</li><li>Upload the galleys to the Publication section of the submission.</li><li>Use the  Production Discussions to notify the editor that the galleys are ready.</li></ol><p>If you are unable to undertake this work at this time or have any questions, please contact me. Thank you for your contribution to this journal.</p><p>Kind regards,</p>{$signature}',
						fr_CA:
							"<p>Bonjour {$recipientName},</p><p>J'aimerais que vous prépariez les épreuves du manuscrit intitulé « {$submissionTitle} » pour la revue {$journalName} à l'aide des étapes suivantes.</p>\n<ol><li>Cliquer sur l'URL de la soumission ci-dessous.</li><li>Se connecter au site Web de la revue et utiliser les fichiers disponibles sous Fichiers prêts pour la production pour créer les épreuves en fonction des normes de la revue.</li><li>Téléverser les épreuves dans la section Épreuves.</li><li>Informer le-la rédacteur-trice, via une discussion sur la production, que les épreuves ont été téléversées et qu'elles sont prêtes.</li></ol><p>URL de la revue {$journalName} : {$journalUrl}</p><p>URL du manuscrit : {$submissionUrl}</p><p>Nom d'utilisateur-trice : {$recipientUsername}</p><p>Si vous ne pouvez pas effectuer ce travail pour le moment ou si vous avez des questions, veuillez communiquer avec moi. Je vous remercie de votre collaboration.</p>{$signature}",
					},
					subject: {
						en: 'Submission {$submissionId} is ready for production at {$contextAcronym}',
						fr_CA:
							'La soumission {$submissionId} est prête pour production à la revue {$contextAcronym}',
					},
				},
			),
		],
		dataDescriptions,
	},
};
