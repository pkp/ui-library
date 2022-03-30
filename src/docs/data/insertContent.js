/**
 * Sample data that can be inserted into the content of a rich text editor
 *
 * @see InsertContent|FieldPreparedContent
 */
export default [
	{
		key: 'contactName',
		value: 'Daniel Barnes',
		description: 'The name of the primary journal contact'
	},
	{
		key: 'contactEmail',
		value: 'dbarnes@example.org',
		description: 'The email of the primary journal contact'
	},
	{
		key: 'journalName',
		value: 'Journal of Public Knowledge',
		description: 'The name of the journal'
	},
	{
		key: 'journalUrl',
		value: 'http://example.org/publicknowledge',
		description: 'The URL of the journal'
	},
	{
		key: 'principleContactSignature',
		value: '<p>Daniel Barnes<br>Editor, Public Knowledge Project</p>',
		description: "The journal's contact signature"
	},
	{
		key: 'recipientName',
		value: 'Carlo Corino',
		description: 'The name of the recipient'
	},
	{
		key: 'reviewerComments',
		value:
			'<p><strong>Reviewer 1:</strong><br>Recommendation: Accept<br></p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
		description: 'The comments and recommendations from reviewers'
	},
	{
		key: 'revisionsDueDate',
		value: '2021-03-21',
		description: 'The date the revisions are due'
	},
	{
		key: 'signature',
		value: '<p>Daniel Barnes<br>Editor, Public Knowledge Project</p>',
		description: 'The name of the sender'
	},
	{
		key: 'submissionTitle',
		value:
			'The influence of lactation on the quantity and quality of cashmere production',
		description: 'The title of the submission'
	},
	{
		key: 'submissionUrl',
		value: 'http://example.org/publicknowledge/workflow/access/21',
		description: "The URL to the submission's editorial workflow"
	}
];
