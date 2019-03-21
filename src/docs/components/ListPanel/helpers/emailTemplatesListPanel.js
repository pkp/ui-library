let items = [
	{
		_href: '/api/v1/emailTemplates/EDITOR_DECISION_INITIAL_DECLINE',
		body: {
			en_US:
				'\n\t\t\t{$authorName}:<br />\n<br />\nWe have reached a decision regarding your submission to {$contextName}, &quot;{$submissionTitle}&quot;.<br />\n<br />\nOur decision is to: Decline Submission<br />\n<br />\n{$editorialContactSignature}<br />'
		},
		canDisable: false,
		canEdit: true,
		contextId: null,
		description: {
			en_US:
				'This email is sent to the author if the editor declines his submission initially, before the review stage'
		},
		enabled: null,
		fromRoleId: 16,
		id: null,
		key: 'EDITOR_DECISION_INITIAL_DECLINE',
		subject: {
			en_US: 'Editor Decision'
		},
		toRoleId: 65536
	},
	{
		_href: '/api/v1/emailTemplates/EDITOR_DECISION_RESUBMIT',
		body: {
			en_US:
				'{$authorName}:<br />\n<br />\nWe have reached a decision regarding your submission to {$contextName}, &quot;{$submissionTitle}&quot;.<br />\n<br />\nOur decision is to: Resubmit for Review<br />\n<br />\n{$editorialContactSignature}<br />\n'
		},
		canDisable: false,
		canEdit: true,
		contextId: null,
		description: {
			en_US:
				'This email from the Editor or Section Editor to an Author notifies them of a final "resubmit" decision regarding their submission.'
		},
		enabled: null,
		fromRoleId: 16,
		id: null,
		key: 'EDITOR_DECISION_RESUBMIT',
		subject: {
			en_US: 'Editor Decision'
		},
		toRoleId: 65536
	},
	{
		_href: '/api/v1/emailTemplates/EDITOR_DECISION_REVISIONS',
		body: {
			en_US:
				'{$authorName}:<br />\n<br />\nWe have reached a decision regarding your submission to {$contextName}, &quot;{$submissionTitle}&quot;.<br />\n<br />\nOur decision is: Revisions Required<br />\n<br />\n{$editorialContactSignature}<br />\n'
		},
		canDisable: false,
		canEdit: true,
		contextId: null,
		description: {
			en_US:
				'This email from the Editor or Section Editor to an Author notifies them of a final "revisions required" decision regarding their submission.'
		},
		enabled: null,
		fromRoleId: 16,
		id: null,
		key: 'EDITOR_DECISION_REVISIONS',
		subject: {
			en_US: 'Editor Decision'
		},
		toRoleId: 65536
	},
	{
		_href: '/api/v1/emailTemplates/CITATION_EDITOR_AUTHOR_QUERY',
		body: {
			en_US:
				'<p>Ut sem viverra aliquet eget sit amet tellus. Lacus vel facilisis volutpat est. Arcu non odio euismod lacinia at quis risus sed vulputate. Nunc mi ipsum faucibus vitae. Maecenas sed enim ut sem viverra aliquet eget sit. Sed felis eget velit aliquet sagittis id consectetur purus ut. Sollicitudin tempor id eu nisl nunc mi ipsum faucibus. Imperdiet sed euismod nisi porta. Tellus id interdum velit laoreet. Scelerisque fermentum dui faucibus in ornare quam. Mattis vulputate enim nulla aliquet porttitor. Egestas egestas fringilla phasellus faucibus scelerisque.</p>'
		},
		canDisable: false,
		canEdit: true,
		contextId: 1,
		description: {
			en_US:
				'This email allows copyeditors to request additional information about references from authors.'
		},
		enabled: true,
		fromRoleId: null,
		id: 5,
		key: 'CITATION_EDITOR_AUTHOR_QUERY',
		subject: {
			en_US: 'EDITED Citation editor author query'
		},
		toRoleId: null
	},
	{
		_href: '/api/v1/emailTemplates/EXAMPLE_FAKE_KEY',
		body: {
			en_US:
				'<p>Eget velit aliquet sagittis id consectetur. Sed faucibus turpis in eu mi bibendum neque egestas. Egestas purus viverra accumsan in nisl nisi. Eu volutpat odio facilisis mauris sit amet massa vitae. Fermentum iaculis eu non diam phasellus vestibulum. Tortor at risus viverra adipiscing at in tellus integer. Feugiat nisl pretium fusce id velit ut tortor. Faucibus a pellentesque sit amet porttitor eget. Porttitor lacus luctus accumsan tortor posuere ac ut consequat semper. Enim nec dui nunc mattis enim ut tellus. Augue neque gravida in fermentum et sollicitudin ac orci. In iaculis nunc sed augue lacus viverra vitae.</p>'
		},
		canDisable: null,
		canEdit: null,
		contextId: 1,
		description: {
			en_US: ''
		},
		enabled: true,
		fromRoleId: null,
		id: 20,
		key: 'EXAMPLE_FAKE_KEY',
		subject: {
			en_US: 'A new email created not based on a default template.'
		},
		toRoleId: null
	},
	{
		_href:
			'http://localhost:8000/publicknowledge/api/v1/emailTemplates/REVIEW_ACK',
		body: {
			en_US:
				'{$reviewerName}:<br />\n<br />\nThank you for completing the review of the submission, &quot;{$submissionTitle},&quot; for {$contextName}. We appreciate your contribution to the quality of the work that we publish.<br />\n<br />\n{$editorialContactSignature}'
		},
		canDisable: true,
		canEdit: true,
		contextId: null,
		description: {
			en_US:
				'This email is sent by a Section Editor to confirm receipt of a completed review and thank the reviewer for their contributions.'
		},
		enabled: false,
		fromRoleId: 16,
		id: null,
		key: 'REVIEW_ACK',
		subject: {
			en_US: 'Article Review Acknowledgement'
		},
		toRoleId: 4096
	}
];

let roles = {
	1: 'Site Admin',
	16: 'Journal Editor',
	17: 'Section Editor',
	4096: 'Reviewer',
	4097: 'Assistant',
	65536: 'Author',
	1048576: 'Reader',
	2097152: 'Subscription Manager'
};

let filters = [
	{
		filters: [
			{
				param: 'isEnabled',
				title: 'Enabled',
				value: 1
			},
			{
				param: 'isEnabled',
				title: 'Disabled',
				value: 0
			}
		]
	},
	{
		heading: 'Sent from',
		filters: [
			{
				param: 'fromRoleIds',
				title: 'Section Editor',
				value: 17
			},
			{
				param: 'fromRoleIds',
				title: 'Reviewer',
				value: 4096
			},
			{
				param: 'fromRoleIds',
				title: 'Assistant',
				value: 4097
			}
		]
	},
	{
		heading: 'Sent to',
		filters: [
			{
				param: 'toRoleIds',
				title: 'Journal Editor',
				value: 16
			},
			{
				param: 'toRoleIds',
				title: 'Section Editor',
				value: 17
			},
			{
				param: 'toRoleIds',
				title: 'Reviewer',
				value: 4096
			},
			{
				param: 'toRoleIds',
				title: 'Assistant',
				value: 4097
			},
			{
				param: 'toRoleIds',
				title: 'Author',
				value: 655436
			},
			{
				param: 'toRoleIds',
				title: 'Reader',
				value: 1048576
			},
			{
				param: 'fromRoleIds',
				title: 'Subscription Manager',
				value: 2097152
			}
		]
	}
];

export default {
	csrfToken: '12345',
	filters: filters,
	items: items,
	itemsMax: 10,
	roles: roles,
	title: 'Email Templates'
};
