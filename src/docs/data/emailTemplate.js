export default {
	_href:
		'http://localhost:8000/publicknowledge/api/v1/emailTemplates/EDITOR_DECISION_ACCEPT',
	body: {
		en_US: `<p>Dear {$senderName},</p>
			<p>I am delighted to inform you that your submission, {$submissionTitle}, has been accepted for publication. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
			<p>Sincerely,</p>
			<p>{$senderName}<br>{$journalName}</p>`,
		fr_CA: `<p>Chear {$senderName},</p>
			<p>J'ai le plaisir de vous informer que votre soumission, {$submissionTitle}, a été acceptée pour publication. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
			<p>Sincèrement,</p>
			<p>{$senderName}<br>{$journalName}</p>`
	},
	canDisable: false,
	canEdit: true,
	contextId: null,
	description: {
		en_US:
			'This email from the Editor or Section Editor to an Author notifies them of a final "accept submission" decision regarding their submission.',
		fr_CA:
			"Ce courriel du,de la rédacteur-trice ou du,de la rédacteur-trice de rubrique à un-e auteur-e le,la notifie de la décision finale concernant sa soumission, soit d'accepter sa soumission."
	},
	enabled: true,
	fromRoleId: 16,
	id: null,
	key: 'EDITOR_DECISION_ACCEPT',
	stageId: 3,
	subject: {
		en_US:
			'Your submission has been accepted for publication in {$journalName}',
		fr_CA:
			'Votre soumission a été acceptée pour publication dans {$journalName}'
	},
	toRoleId: 65536
};
