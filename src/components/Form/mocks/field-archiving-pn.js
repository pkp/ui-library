export default {
	name: 'archiving-pn',
	component: 'field-archiving-pn',
	label: 'PKP Preservation Network',
	description:
		'The PKP Preservation Network (PN) provides free preservation services for any OJS journal that meets a few basic criteria.',
	value: false,
	options: [
		{
			value: true,
			label: 'Enable PKP PN plugin',
		},
	],
	terms:
		'View the <button>plugin settings</button> to accept the terms of use for the PKP PN.',
	enablePluginSuccess: 'The PKP PN plugin was successfully enabled.',
	enablePluginUrl: 'https://example.com',
	disablePluginSuccess: 'The PKP PN plugin has been disabled.',
	disablePluginUrl: 'https://example.com',
	settingsUrl: 'https://example.com',
	groupId: 'test',
};
