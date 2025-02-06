export default {
	selectRevisionDecisionForm: {
		id: 'selectRevisionDecision',
		method: '',
		action: 'emit',
		fields: [
			{
				name: 'decision',
				component: 'field-options',
				label: 'Require New Review Round',
				groupId: 'default',
				isRequired: false,
				isMultilingual: false,
				isInert: false,
				value: 4,
				type: 'radio',
				isOrderable: false,
				allowOnlySorting: false,
				options: [
					{
						value: 4,
						label:
							'Revisions will not be subject to a new round of peer reviews.',
					},
					{
						value: 5,
						label: 'Revisions will be subject to a new round of peer reviews.',
					},
				],
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
					label: 'Next',
				},
			},
		],
		primaryLocale: 'en',
		visibleLocales: ['en'],
		supportedFormLocales: [],
		errors: {},
	},
	selectRevisionRecommendationForm: {
		id: 'selectRevisionRecommendation',
		method: '',
		action: 'emit',
		fields: [
			{
				name: 'decision',
				component: 'field-options',
				label: 'Require New Review Round',
				groupId: 'default',
				isRequired: false,
				isMultilingual: false,
				isInert: false,
				value: 10,
				type: 'radio',
				isOrderable: false,
				allowOnlySorting: false,
				options: [
					{
						value: 10,
						label:
							'Revisions should not be subject to a new round of peer reviews.',
					},
					{
						value: 11,
						label:
							'Revisions should be subject to a new round of peer reviews.',
					},
				],
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
					label: 'Next',
				},
			},
		],
		primaryLocale: 'en',
		visibleLocales: ['en'],
		supportedFormLocales: [],
		errors: {},
	},
	dashboardPage: 'myReviewAssignments',
	countPerPage: 30,
	filtersForm: {
		id: 'submissionFilters',
		method: '',
		action: 'emit',
		fields: [
			{
				name: 'sectionIds',
				component: 'field-options',
				label: 'Section',
				groupId: 'default',
				isRequired: false,
				isMultilingual: false,
				isInert: false,
				value: [],
				type: 'checkbox',
				isOrderable: false,
				allowOnlySorting: false,
				options: [
					{
						value: 1,
						label: 'Articles',
					},
					{
						value: 2,
						label: 'Reviews',
					},
				],
			},
			{
				name: 'issueIds',
				component: 'field-select-issues',
				label: 'Issues',
				groupId: 'default',
				isRequired: false,
				isMultilingual: false,
				isInert: false,
				value: [],
				apiUrl: 'http://localhost:7003/index.php/publicknowledge/api/v1/issues',
				deselectLabel: 'Remove {$item}',
				getParams: {},
				selectedLabel: 'Selected:',
				selected: [],
			},
			{
				name: 'categoryIds',
				component: 'field-options',
				label: 'Categories',
				groupId: 'default',
				isRequired: false,
				isMultilingual: false,
				isInert: false,
				value: [],
				type: 'checkbox',
				isOrderable: false,
				allowOnlySorting: false,
				options: [
					{
						value: 1,
						label: 'Applied Science',
					},
					{
						value: 2,
						label: 'Applied Science > Computer Science',
					},
					{
						value: 3,
						label: 'Applied Science > Engineering',
					},
					{
						value: 4,
						label: 'Social Sciences',
					},
					{
						value: 5,
						label: 'Social Sciences > Sociology',
					},
					{
						value: 6,
						label: 'Social Sciences > Anthropology',
					},
				],
			},
			{
				name: 'daysInactive',
				component: 'field-slider',
				label: 'Days since last activity',
				groupId: 'default',
				isRequired: false,
				isMultilingual: false,
				isInert: false,
				value: 0,
				min: 0,
				max: 180,
				step: 1,
				minLabel: null,
				maxLabel: null,
				valueLabel: null,
				valueLabelMin: null,
				valueLabelMax: null,
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
				submitButton: null,
			},
		],
		primaryLocale: 'en',
		visibleLocales: ['en'],
		supportedFormLocales: [],
		errors: {},
	},
	views: [
		{
			id: 'reviewer-assignments-all',
			name: 'All assignments',
			count: 0,
			op: 'reviewerAssignments',
		},
		{
			id: 'reviewer-assignments-pending',
			name: 'Pending',
			count: 0,
			op: 'reviewerAssignments',
			queryParams: {
				pending: true,
			},
		},
		{
			id: 'reviewer-assignments-archived',
			name: 'Completed / Declined',
			count: 0,
			op: 'reviewerAssignments',
			queryParams: {
				archived: true,
			},
		},
	],
	columns: [
		{
			id: 'id',
			header: 'ID',
			componentName: 'CellReviewAssignmentId',
			sortable: true,
		},
		{
			id: 'title',
			header: 'Submissions',
			componentName: 'CellReviewAssignmentTitle',
			sortable: false,
		},
		{
			id: 'activity',
			header: 'Editorial Activity',
			componentName: 'CellReviewAssignmentActivity',
			sortable: false,
		},
		{
			id: 'actions',
			header: 'Actions',
			componentName: 'CellReviewAssignmentActions',
			sortable: false,
		},
	],
	publicationSettings: {
		supportsCitations: true,
		identifiersEnabled: true,
		submissionPaymentsEnabled: true,
	},
	componentForms: {
		contributorForm: {
			id: 'contributor',
			method: 'POST',
			action: 'emit',
			fields: [
				{
					name: 'givenName',
					component: 'field-text',
					label: 'Given Name',
					groupId: 'default',
					isRequired: true,
					isMultilingual: true,
					isInert: false,
					value: [],
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					size: 'normal',
					prefix: '',
				},
				{
					name: 'familyName',
					component: 'field-text',
					label: 'Family Name',
					groupId: 'default',
					isRequired: false,
					isMultilingual: true,
					isInert: false,
					value: [],
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					size: 'normal',
					prefix: '',
				},
				{
					name: 'preferredPublicName',
					component: 'field-text',
					label: 'Preferred Public Name',
					description:
						'Please provide the full name as the author should be identified on the published work. Example: Dr. Alan P. Mwandenga',
					groupId: 'default',
					isRequired: false,
					isMultilingual: true,
					isInert: false,
					value: [],
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					size: 'normal',
					prefix: '',
				},
				{
					name: 'email',
					component: 'field-text',
					label: 'Email',
					groupId: 'default',
					isRequired: true,
					isMultilingual: false,
					isInert: false,
					value: null,
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					size: 'normal',
					prefix: '',
				},
				{
					name: 'country',
					component: 'field-select',
					label: 'Country',
					groupId: 'default',
					isRequired: true,
					isMultilingual: false,
					isInert: false,
					value: null,
					options: [
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
							value: 'KY',
							label: 'Cayman Islands',
						},
						{
							value: 'CF',
							label: 'Central African Republic',
						},
						{
							value: 'TD',
							label: 'Chad',
						},
						{
							value: 'CL',
							label: 'Chile',
						},
						{
							value: 'CN',
							label: 'China',
						},
						{
							value: 'CX',
							label: 'Christmas Island',
						},
						{
							value: 'CC',
							label: 'Cocos (Keeling) Islands',
						},
						{
							value: 'CO',
							label: 'Colombia',
						},
						{
							value: 'KM',
							label: 'Comoros',
						},
						{
							value: 'CG',
							label: 'Congo',
						},
						{
							value: 'CD',
							label: 'Congo, The Democratic Republic of the',
						},
						{
							value: 'CK',
							label: 'Cook Islands',
						},
						{
							value: 'CR',
							label: 'Costa Rica',
						},
						{
							value: 'HR',
							label: 'Croatia',
						},
						{
							value: 'CU',
							label: 'Cuba',
						},
						{
							value: 'CW',
							label: 'Cura\u00e7ao',
						},
						{
							value: 'CY',
							label: 'Cyprus',
						},
						{
							value: 'CZ',
							label: 'Czechia',
						},
						{
							value: 'CI',
							label: "C\u00f4te d'Ivoire",
						},
						{
							value: 'DK',
							label: 'Denmark',
						},
						{
							value: 'DJ',
							label: 'Djibouti',
						},
						{
							value: 'DM',
							label: 'Dominica',
						},
						{
							value: 'DO',
							label: 'Dominican Republic',
						},
						{
							value: 'EC',
							label: 'Ecuador',
						},
						{
							value: 'EG',
							label: 'Egypt',
						},
						{
							value: 'SV',
							label: 'El Salvador',
						},
						{
							value: 'GQ',
							label: 'Equatorial Guinea',
						},
						{
							value: 'ER',
							label: 'Eritrea',
						},
						{
							value: 'EE',
							label: 'Estonia',
						},
						{
							value: 'SZ',
							label: 'Eswatini',
						},
						{
							value: 'ET',
							label: 'Ethiopia',
						},
						{
							value: 'FK',
							label: 'Falkland Islands (Malvinas)',
						},
						{
							value: 'FO',
							label: 'Faroe Islands',
						},
						{
							value: 'FJ',
							label: 'Fiji',
						},
						{
							value: 'FI',
							label: 'Finland',
						},
						{
							value: 'FR',
							label: 'France',
						},
						{
							value: 'GF',
							label: 'French Guiana',
						},
						{
							value: 'PF',
							label: 'French Polynesia',
						},
						{
							value: 'TF',
							label: 'French Southern Territories',
						},
						{
							value: 'GA',
							label: 'Gabon',
						},
						{
							value: 'GM',
							label: 'Gambia',
						},
						{
							value: 'GE',
							label: 'Georgia',
						},
						{
							value: 'DE',
							label: 'Germany',
						},
						{
							value: 'GH',
							label: 'Ghana',
						},
						{
							value: 'GI',
							label: 'Gibraltar',
						},
						{
							value: 'GR',
							label: 'Greece',
						},
						{
							value: 'GL',
							label: 'Greenland',
						},
						{
							value: 'GD',
							label: 'Grenada',
						},
						{
							value: 'GP',
							label: 'Guadeloupe',
						},
						{
							value: 'GU',
							label: 'Guam',
						},
						{
							value: 'GT',
							label: 'Guatemala',
						},
						{
							value: 'GG',
							label: 'Guernsey',
						},
						{
							value: 'GN',
							label: 'Guinea',
						},
						{
							value: 'GW',
							label: 'Guinea-Bissau',
						},
						{
							value: 'GY',
							label: 'Guyana',
						},
						{
							value: 'HT',
							label: 'Haiti',
						},
						{
							value: 'HM',
							label: 'Heard Island and McDonald Islands',
						},
						{
							value: 'VA',
							label: 'Holy See (Vatican City State)',
						},
						{
							value: 'HN',
							label: 'Honduras',
						},
						{
							value: 'HK',
							label: 'Hong Kong',
						},
						{
							value: 'HU',
							label: 'Hungary',
						},
						{
							value: 'IS',
							label: 'Iceland',
						},
						{
							value: 'IN',
							label: 'India',
						},
						{
							value: 'ID',
							label: 'Indonesia',
						},
						{
							value: 'IR',
							label: 'Iran, Islamic Republic of',
						},
						{
							value: 'IQ',
							label: 'Iraq',
						},
						{
							value: 'IE',
							label: 'Ireland',
						},
						{
							value: 'IM',
							label: 'Isle of Man',
						},
						{
							value: 'IL',
							label: 'Israel',
						},
						{
							value: 'IT',
							label: 'Italy',
						},
						{
							value: 'JM',
							label: 'Jamaica',
						},
						{
							value: 'JP',
							label: 'Japan',
						},
						{
							value: 'JE',
							label: 'Jersey',
						},
						{
							value: 'JO',
							label: 'Jordan',
						},
						{
							value: 'KZ',
							label: 'Kazakhstan',
						},
						{
							value: 'KE',
							label: 'Kenya',
						},
						{
							value: 'KI',
							label: 'Kiribati',
						},
						{
							value: 'KP',
							label: "Korea, Democratic People's Republic of",
						},
						{
							value: 'KR',
							label: 'Korea, Republic of',
						},
						{
							value: 'KW',
							label: 'Kuwait',
						},
						{
							value: 'KG',
							label: 'Kyrgyzstan',
						},
						{
							value: 'LA',
							label: "Lao People's Democratic Republic",
						},
						{
							value: 'LV',
							label: 'Latvia',
						},
						{
							value: 'LB',
							label: 'Lebanon',
						},
						{
							value: 'LS',
							label: 'Lesotho',
						},
						{
							value: 'LR',
							label: 'Liberia',
						},
						{
							value: 'LY',
							label: 'Libya',
						},
						{
							value: 'LI',
							label: 'Liechtenstein',
						},
						{
							value: 'LT',
							label: 'Lithuania',
						},
						{
							value: 'LU',
							label: 'Luxembourg',
						},
						{
							value: 'MO',
							label: 'Macao',
						},
						{
							value: 'MG',
							label: 'Madagascar',
						},
						{
							value: 'MW',
							label: 'Malawi',
						},
						{
							value: 'MY',
							label: 'Malaysia',
						},
						{
							value: 'MV',
							label: 'Maldives',
						},
						{
							value: 'ML',
							label: 'Mali',
						},
						{
							value: 'MT',
							label: 'Malta',
						},
						{
							value: 'MH',
							label: 'Marshall Islands',
						},
						{
							value: 'MQ',
							label: 'Martinique',
						},
						{
							value: 'MR',
							label: 'Mauritania',
						},
						{
							value: 'MU',
							label: 'Mauritius',
						},
						{
							value: 'YT',
							label: 'Mayotte',
						},
						{
							value: 'MX',
							label: 'Mexico',
						},
						{
							value: 'FM',
							label: 'Micronesia, Federated States of',
						},
						{
							value: 'MD',
							label: 'Moldova, Republic of',
						},
						{
							value: 'MC',
							label: 'Monaco',
						},
						{
							value: 'MN',
							label: 'Mongolia',
						},
						{
							value: 'ME',
							label: 'Montenegro',
						},
						{
							value: 'MS',
							label: 'Montserrat',
						},
						{
							value: 'MA',
							label: 'Morocco',
						},
						{
							value: 'MZ',
							label: 'Mozambique',
						},
						{
							value: 'MM',
							label: 'Myanmar',
						},
						{
							value: 'NA',
							label: 'Namibia',
						},
						{
							value: 'NR',
							label: 'Nauru',
						},
						{
							value: 'NP',
							label: 'Nepal',
						},
						{
							value: 'NL',
							label: 'Netherlands',
						},
						{
							value: 'NC',
							label: 'New Caledonia',
						},
						{
							value: 'NZ',
							label: 'New Zealand',
						},
						{
							value: 'NI',
							label: 'Nicaragua',
						},
						{
							value: 'NE',
							label: 'Niger',
						},
						{
							value: 'NG',
							label: 'Nigeria',
						},
						{
							value: 'NU',
							label: 'Niue',
						},
						{
							value: 'NF',
							label: 'Norfolk Island',
						},
						{
							value: 'MK',
							label: 'North Macedonia',
						},
						{
							value: 'MP',
							label: 'Northern Mariana Islands',
						},
						{
							value: 'NO',
							label: 'Norway',
						},
						{
							value: 'OM',
							label: 'Oman',
						},
						{
							value: 'PK',
							label: 'Pakistan',
						},
						{
							value: 'PW',
							label: 'Palau',
						},
						{
							value: 'PS',
							label: 'Palestine, State of',
						},
						{
							value: 'PA',
							label: 'Panama',
						},
						{
							value: 'PG',
							label: 'Papua New Guinea',
						},
						{
							value: 'PY',
							label: 'Paraguay',
						},
						{
							value: 'PE',
							label: 'Peru',
						},
						{
							value: 'PH',
							label: 'Philippines',
						},
						{
							value: 'PN',
							label: 'Pitcairn',
						},
						{
							value: 'PL',
							label: 'Poland',
						},
						{
							value: 'PT',
							label: 'Portugal',
						},
						{
							value: 'PR',
							label: 'Puerto Rico',
						},
						{
							value: 'QA',
							label: 'Qatar',
						},
						{
							value: 'RO',
							label: 'Romania',
						},
						{
							value: 'RU',
							label: 'Russian Federation',
						},
						{
							value: 'RW',
							label: 'Rwanda',
						},
						{
							value: 'RE',
							label: 'R\u00e9union',
						},
						{
							value: 'BL',
							label: 'Saint Barth\u00e9lemy',
						},
						{
							value: 'SH',
							label: 'Saint Helena, Ascension and Tristan da Cunha',
						},
						{
							value: 'KN',
							label: 'Saint Kitts and Nevis',
						},
						{
							value: 'LC',
							label: 'Saint Lucia',
						},
						{
							value: 'MF',
							label: 'Saint Martin (French part)',
						},
						{
							value: 'PM',
							label: 'Saint Pierre and Miquelon',
						},
						{
							value: 'VC',
							label: 'Saint Vincent and the Grenadines',
						},
						{
							value: 'WS',
							label: 'Samoa',
						},
						{
							value: 'SM',
							label: 'San Marino',
						},
						{
							value: 'ST',
							label: 'Sao Tome and Principe',
						},
						{
							value: 'SA',
							label: 'Saudi Arabia',
						},
						{
							value: 'SN',
							label: 'Senegal',
						},
						{
							value: 'RS',
							label: 'Serbia',
						},
						{
							value: 'SC',
							label: 'Seychelles',
						},
						{
							value: 'SL',
							label: 'Sierra Leone',
						},
						{
							value: 'SG',
							label: 'Singapore',
						},
						{
							value: 'SX',
							label: 'Sint Maarten (Dutch part)',
						},
						{
							value: 'SK',
							label: 'Slovakia',
						},
						{
							value: 'SI',
							label: 'Slovenia',
						},
						{
							value: 'SB',
							label: 'Solomon Islands',
						},
						{
							value: 'SO',
							label: 'Somalia',
						},
						{
							value: 'ZA',
							label: 'South Africa',
						},
						{
							value: 'GS',
							label: 'South Georgia and the South Sandwich Islands',
						},
						{
							value: 'SS',
							label: 'South Sudan',
						},
						{
							value: 'ES',
							label: 'Spain',
						},
						{
							value: 'LK',
							label: 'Sri Lanka',
						},
						{
							value: 'SD',
							label: 'Sudan',
						},
						{
							value: 'SR',
							label: 'Suriname',
						},
						{
							value: 'SJ',
							label: 'Svalbard and Jan Mayen',
						},
						{
							value: 'SE',
							label: 'Sweden',
						},
						{
							value: 'CH',
							label: 'Switzerland',
						},
						{
							value: 'SY',
							label: 'Syrian Arab Republic',
						},
						{
							value: 'TW',
							label: 'Taiwan, Province of China',
						},
						{
							value: 'TJ',
							label: 'Tajikistan',
						},
						{
							value: 'TZ',
							label: 'Tanzania, United Republic of',
						},
						{
							value: 'TH',
							label: 'Thailand',
						},
						{
							value: 'TL',
							label: 'Timor-Leste',
						},
						{
							value: 'TG',
							label: 'Togo',
						},
						{
							value: 'TK',
							label: 'Tokelau',
						},
						{
							value: 'TO',
							label: 'Tonga',
						},
						{
							value: 'TT',
							label: 'Trinidad and Tobago',
						},
						{
							value: 'TN',
							label: 'Tunisia',
						},
						{
							value: 'TM',
							label: 'Turkmenistan',
						},
						{
							value: 'TC',
							label: 'Turks and Caicos Islands',
						},
						{
							value: 'TV',
							label: 'Tuvalu',
						},
						{
							value: 'TR',
							label: 'T\u00fcrkiye',
						},
						{
							value: 'UG',
							label: 'Uganda',
						},
						{
							value: 'UA',
							label: 'Ukraine',
						},
						{
							value: 'AE',
							label: 'United Arab Emirates',
						},
						{
							value: 'GB',
							label: 'United Kingdom',
						},
						{
							value: 'US',
							label: 'United States',
						},
						{
							value: 'UM',
							label: 'United States Minor Outlying Islands',
						},
						{
							value: 'UY',
							label: 'Uruguay',
						},
						{
							value: 'UZ',
							label: 'Uzbekistan',
						},
						{
							value: 'VU',
							label: 'Vanuatu',
						},
						{
							value: 'VE',
							label: 'Venezuela, Bolivarian Republic of',
						},
						{
							value: 'VN',
							label: 'Viet Nam',
						},
						{
							value: 'VG',
							label: 'Virgin Islands, British',
						},
						{
							value: 'VI',
							label: 'Virgin Islands, U.S.',
						},
						{
							value: 'WF',
							label: 'Wallis and Futuna',
						},
						{
							value: 'EH',
							label: 'Western Sahara',
						},
						{
							value: 'YE',
							label: 'Yemen',
						},
						{
							value: 'ZM',
							label: 'Zambia',
						},
						{
							value: 'ZW',
							label: 'Zimbabwe',
						},
						{
							value: 'AX',
							label: '\u00c5land Islands',
						},
					],
					size: 'normal',
				},
				{
					name: 'url',
					component: 'field-text',
					label: 'Homepage URL',
					groupId: 'default',
					isRequired: false,
					isMultilingual: false,
					isInert: false,
					value: null,
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					size: 'normal',
					prefix: '',
				},
				{
					name: 'biography',
					component: 'field-rich-textarea',
					label: 'Bio Statement (e.g., department and rank)',
					groupId: 'default',
					isRequired: false,
					isMultilingual: true,
					isInert: false,
					value: [],
					plugins: ['link'],
					toolbar: 'bold italic superscript subscript | link',
				},
				{
					name: 'affiliation',
					component: 'field-text',
					label: 'Affiliation',
					groupId: 'default',
					isRequired: false,
					isMultilingual: true,
					isInert: false,
					value: [],
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					size: 'large',
					prefix: '',
				},
				{
					name: 'userGroupId',
					component: 'field-options',
					label: "Contributor's role",
					groupId: 'default',
					isRequired: false,
					isMultilingual: false,
					isInert: false,
					value: 14,
					type: 'radio',
					isOrderable: false,
					allowOnlySorting: false,
					options: [
						{
							value: 14,
							label: 'Author',
						},
						{
							value: 15,
							label: 'Translator',
						},
					],
				},
				{
					name: 'includeInBrowse',
					component: 'field-options',
					label: 'Publication Lists',
					groupId: 'default',
					isRequired: false,
					isMultilingual: false,
					isInert: false,
					value: true,
					type: 'checkbox',
					isOrderable: false,
					allowOnlySorting: false,
					options: [
						{
							value: true,
							label:
								'Include this contributor when identifying authors in lists of publications.',
						},
					],
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
			supportedFormLocales: [],
			errors: {},
		},
		logResponseForm: {
			id: 'logReviewerResponse',
			method: 'PUT',
			action: 'emit',
			fields: [
				{
					name: 'decision',
					component: 'field-radio-input',
					label: 'Record the response on behalf of the reviewer',
					description:
						'If the reviewer contacts you through email or any other means, you can record their response for them',
					groupId: 'default',
					isRequired: true,
					isMultilingual: false,
					isInert: false,
					value: '',
					options: [
						{
							value: 'accept',
							label: 'Reviewer has accepted the invitation to review',
						},
						{
							value: 'decline',
							label: 'Reviewer has declined the invitation to review',
						},
					],
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
						label: 'Log Response',
					},
				},
			],
			primaryLocale: 'en',
			visibleLocales: ['en'],
			supportedFormLocales: ['en', 'fr_CA'],
			errors: {},
		},
	},
};
