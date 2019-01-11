export default {
	name: 'metadata',
	component: 'field-metadata-setting',
	label: 'Keywords',
	description:
		'Keywords are typically one- to three-word phrases that are used to indicate the main topics of a submission.',
	value: 0,
	disabledValue: 0,
	enabledOnlyValue: 'enable',
	options: [
		{
			value: 'enable',
			label: 'Enable keyword metadata'
		}
	],
	submissionOptions: [
		{
			value: 'enable',
			label: 'Do not request keywords from the author during submission.'
		},
		{
			value: 'request',
			label: 'Ask the author to suggest keywords during submission.'
		},
		{
			value: 'require',
			label:
				'Require the author to suggest keywords before accepting their submission.'
		}
	]
};
