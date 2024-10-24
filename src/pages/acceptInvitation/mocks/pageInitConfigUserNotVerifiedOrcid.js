const countries = [
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
	{
		value: 'AR',
		label: 'Argentina',
	},
	{
		value: 'AM',
		label: 'Armenia',
	},
	{
		value: 'AW',
		label: 'Aruba',
	},
	{
		value: 'AU',
		label: 'Australia',
	},
	{
		value: 'AT',
		label: 'Austria',
	},
	{
		value: 'AZ',
		label: 'Azerbaijan',
	},
	{
		value: 'BS',
		label: 'Bahamas',
	},
	{
		value: 'BH',
		label: 'Bahrain',
	},
	{
		value: 'BD',
		label: 'Bangladesh',
	},
	{
		value: 'BB',
		label: 'Barbados',
	},
	{
		value: 'BY',
		label: 'Belarus',
	},
	{
		value: 'BE',
		label: 'Belgium',
	},
	{
		value: 'BZ',
		label: 'Belize',
	},
	{
		value: 'BJ',
		label: 'Benin',
	},
	{
		value: 'BM',
		label: 'Bermuda',
	},
	{
		value: 'BT',
		label: 'Bhutan',
	},
	{
		value: 'BO',
		label: 'Bolivia, Plurinational State of',
	},
	{
		value: 'BQ',
		label: 'Bonaire, Sint Eustatius and Saba',
	},
	{
		value: 'BA',
		label: 'Bosnia and Herzegovina',
	},
	{
		value: 'BW',
		label: 'Botswana',
	},
	{
		value: 'BV',
		label: 'Bouvet Island',
	},
	{
		value: 'BR',
		label: 'Brazil',
	},
	{
		value: 'IO',
		label: 'British Indian Ocean Territory',
	},
	{
		value: 'BN',
		label: 'Brunei Darussalam',
	},
	{
		value: 'BG',
		label: 'Bulgaria',
	},
	{
		value: 'BF',
		label: 'Burkina Faso',
	},
	{
		value: 'BI',
		label: 'Burundi',
	},
	{
		value: 'CV',
		label: 'Cabo Verde',
	},
	{
		value: 'KH',
		label: 'Cambodia',
	},
	{
		value: 'CM',
		label: 'Cameroon',
	},
	{
		value: 'CA',
		label: 'Canada',
	},
	{
		value: '...',
		label: '...',
	},
];

const form = {
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
			isMultilingual: true,
			description:
				'Also known as a forename or the first name, it is tha part of a personal name that identifies a preson',
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
			isRequired: true,
			isMultilingual: true,
			description:
				"A surname, family name, or last name is the mostly  hereditary portion of one's personal name that indicates one's family",
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
			name: 'affiliation',
			component: 'field-text',
			label: 'Affiliation',
			groupId: 'default',
			isRequired: true,
			isMultilingual: true,
			description: 'This is the institute you are affiliated with',
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
			options: countries,
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
};

export default {
	primaryLocale: 'en',
	invitationId: 65,
	invitationKey: '8aqc3W',
	steps: [
		{
			id: 'verifyOrcid',
			name: 'Verify ORCID iD',
			reviewName: '',
			stepLabel: '{$step} - Verify ORCID iD',
			type: 'popup',
			description:
				'You can choose to verify your ORCID iD ok skip it. If you chose to skip it now, You can verify your ORCID iD from your profile section in OJS later',
			nextButtonLabel: 'Save And Continue',
			sections: [
				{
					id: 'userVerifyOrcid',
					sectionComponent: 'AcceptInvitationVerifyOrcid',
					props: {
						validateFields: [],
					},
				},
			],
		},
		{
			id: 'userCreateReview',
			name: 'Review & create account',
			reviewName: 'Roles',
			stepLabel: '{$step} - Review & create account',
			type: 'review',
			description: 'Review details to start your new roles in OJS',
			nextButtonLabel: 'Accept And Continue to OJS',
			sections: [
				{
					id: 'userCreateRoles',
					sectionComponent: 'AcceptInvitationReview',
					type: 'table',
					description: '',
					props: {
						form: form,
						validateFields: [],
					},
				},
			],
		},
	],
};
