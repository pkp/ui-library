export default {
	_href:
		'http://localhost:8000/publicknowledge/api/v1/emailTemplates/EDITOR_DECISION_ACCEPT',
	body: {
		en: `<p>Dear {$senderName},</p>
			<p>I am delighted to inform you that your submission, {$submissionTitle}, has been accepted for publication. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
			<p>Sincerely,</p>
			<p>{$senderName}<br>{$journalName}</p>`,
		fr_CA: `<p>Chear {$senderName},</p>
			<p>J'ai le plaisir de vous informer que votre soumission, {$submissionTitle}, a été acceptée pour publication. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
			<p>Sincèrement,</p>
			<p>{$senderName}<br>{$journalName}</p>`,
	},
	contextId: null,
	id: null,
	key: 'EDITOR_DECISION_ACCEPT',
	name: {
		en: 'Accept for Publication',
	},
	stageId: 3,
	subject: {
		en:
			'Your submission has been accepted for publication in {$journalName}',
		fr_CA:
			'Votre soumission a été acceptée pour publication dans {$journalName}',
	},
};
