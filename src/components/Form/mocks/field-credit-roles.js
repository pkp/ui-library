export default {
	name: 'contributor-credit-roles',
	component: 'contributor-credit-roles',
	value: [
		{
			role: 'https://credit.niso.org/contributor-roles/data-curation/',
			degree: null,
		},
	],
	options: {
		roles: [
			{
				label: 'Conceptualization',
				value: 'https://credit.niso.org/contributor-roles/conceptualization/',
			},
			{
				label: 'Data Curation',
				value: 'https://credit.niso.org/contributor-roles/data-curation/',
			},
			{
				label: 'Formal Analysis',
				value: 'https://credit.niso.org/contributor-roles/formal-analysis/',
			},
		],
		degrees: [
			{
				label: '',
				value: null,
			},
			{
				label: 'LEAD',
				value: 'LEAD',
			},
		],
	},
};
