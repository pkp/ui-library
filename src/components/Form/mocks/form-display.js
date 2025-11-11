export default {
	form: {
		id: 'userDetails',
		method: 'POST',
		action: 'http://localhost/ojs/index.php/publicknowledge/api/v1/users',
		fields: [
			{
				name: 'givenName',
				component: 'field-text',
				label: 'Given Name',
				groupId: 'default',
				isRequired: true,
				isMultilingual: false,
				description:
					'Also known as a forename or the first name, it is tha part of a personal name that identifies a preson',
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
				description:
					"A surname, family name, or last name is the mostly  hereditary portion of one's personal name that indicates one's family",
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
				description: 'This is the institute you are affiliated with',
				value: null,
				inputType: 'text',
				optIntoEdit: false,
				optIntoEditLabel: '',
				size: 'large',
				prefix: '',
			},
			{
				name: 'country',
				component: 'field-select',
				label: 'County of affiliation',
				groupId: 'default',
				isRequired: true,
				isMultilingual: false,
				description:
					'This is a country in which the institute you are affiliated with is situated',
				value: null,
				inputType: 'text',
				optIntoEdit: false,
				optIntoEditLabel: '',
				options: [
					{
						value: '',
						label: 'Select a country',
						disabled: true,
					},
					{
						value: 'AF',
						label: 'Afghanistan',
					},
					{
						value: 'AL',
						label: 'Albania',
					},
					{
						value: 'DZ',
						label: 'Algeria',
					},
					{
						value: 'AS',
						label: 'American Samoa',
					},
					{
						value: 'AD',
						label: 'Andorra',
					},
					{
						value: 'AO',
						label: 'Angola',
					},
					{
						value: 'AI',
						label: 'Anguilla',
					},
					{
						value: 'AQ',
						label: 'Antarctica',
					},
					{
						value: 'AG',
						label: 'Antigua and Barbuda',
					},
				],
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
};
