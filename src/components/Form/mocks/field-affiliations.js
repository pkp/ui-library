export default {
	name: 'author-affiliations',
	component: 'author-affiliations',
	authorId: 1,
	primaryLocale: 'en',
	locales: [
		{key: 'en', label: 'English'},
		{key: 'fr_CA', label: 'French (Canada)'},
		{key: 'de', label: 'German'},
	],
	value: [
		{
			id: 12,
			authorId: 1,
			ror: 'https://ror.org/0213rcc28',
			name: {
				en: 'Simon Fraser University',
				fr_CA: 'Simon Fraser University',
				de: 'Simon Fraser University',
				tr: 'Simon Fraser Üniversitesi',
			},
		},
		{
			id: 13,
			authorId: 1,
			ror: 'https://ror.org/02e2c7k09',
			name: {
				en: 'Delft University of Technology',
				fr_CA: '',
				de: 'Technische Universität Delft',
				tr: 'Delft Teknik Üniversitesi',
			},
		},
		{
			id: 14,
			authorId: 1,
			ror: '',
			name: {
				en: 'German National Library of Science and Technology',
				fr_CA: '',
				de: 'Technische Informationsbibliothek (TIB)',
				tr: 'Teknik Bilgi Kütübanesi',
			},
		},
	],
	organizations: {
		number_of_results: 100,
		time_taken: 15,
		items: [
			{
				id: 'https://ror.org/0213rcc28',
				names: [
					{
						lang: null,
						types: ['acronym'],
						value: 'SFU',
					},
					{
						lang: 'en',
						types: ['ror_display', 'label'],
						value: 'Simon Fraser University',
					},
				],
				status: 'active',
			},
			{
				id: 'https://ror.org/02njbw696',
				names: [
					{
						lang: 'en',
						types: ['label'],
						value: 'Simón Bolívar University',
					},
					{
						lang: 'es',
						types: ['ror_display', 'label'],
						value: 'Universidad Simón Bolívar',
					},
				],
				status: 'active',
			},
			{
				id: 'https://ror.org/01ak5cj98',
				names: [
					{
						lang: 'en',
						types: ['ror_display', 'label'],
						value: 'Simón Bolívar University',
					},
					{
						lang: null,
						types: ['acronym'],
						value: 'USB',
					},
					{
						lang: 'es',
						types: ['label'],
						value: 'Universidad Simón Bolívar',
					},
				],
				status: 'active',
			},
			{
				id: 'https://ror.org/014579w63',
				names: [
					{
						lang: 'en',
						types: ['ror_display', 'label'],
						value: 'Fraser Health',
					},
				],
				status: 'active',
			},
			{
				id: 'https://ror.org/03455j977',
				names: [
					{
						lang: 'en',
						types: ['ror_display', 'label'],
						value: 'Fraser Institute',
					},
				],
				status: 'active',
			},
			{
				id: 'https://ror.org/00jtqvs23',
				names: [
					{
						lang: 'en',
						types: ['ror_display', 'label'],
						value: 'Fraser Research',
					},
				],
				status: 'active',
			},
			{
				id: 'https://ror.org/04h6w7946',
				names: [
					{
						lang: 'en',
						types: ['alias'],
						value: 'Fraser Valley College',
					},
					{
						lang: null,
						types: ['acronym'],
						value: 'UFV',
					},
					{
						lang: 'en',
						types: ['alias'],
						value: 'University College of the Fraser Valley',
					},
					{
						lang: 'en',
						types: ['ror_display', 'label'],
						value: 'University of the Fraser Valley',
					},
				],
				status: 'active',
			},
			{
				id: 'https://ror.org/03z27es23',
				names: [
					{
						lang: null,
						types: ['acronym'],
						value: 'UMSS',
					},
					{
						lang: 'es',
						types: ['label'],
						value: 'Universidad Mayor de San Simón',
					},
					{
						lang: 'en',
						types: ['ror_display', 'label'],
						value: 'University of San Simón',
					},
				],
				status: 'active',
			},
			{
				id: 'https://ror.org/00wmrqg59',
				names: [
					{
						lang: null,
						types: ['ror_display', 'label'],
						value: 'West Fraser (Canada)',
					},
				],
				status: 'active',
			},
			{
				id: 'https://ror.org/02bnf4x85',
				names: [
					{
						lang: null,
						types: ['acronym'],
						value: 'USK',
					},
					{
						lang: 'fr',
						types: ['ror_display', 'label'],
						value: 'Université Simon Kimbangu',
					},
				],
				status: 'active',
			},
			{
				id: 'https://ror.org/04m9zwa74',
				names: [
					{
						lang: 'de',
						types: ['ror_display', 'label'],
						value: 'Claussen Simon Stiftung',
					},
				],
				status: 'active',
			},
			{
				id: 'https://ror.org/03jrrzr69',
				names: [
					{
						lang: null,
						types: ['acronym'],
						value: 'UASB',
					},
					{
						lang: 'es',
						types: ['ror_display', 'label'],
						value: 'Universidad Andina Simón Bolívar',
					},
				],
				status: 'active',
			},
			{
				id: 'https://ror.org/0208tyb13',
				names: [
					{
						lang: 'es',
						types: ['ror_display', 'label'],
						value: 'Universidad Peruana Simón Bolívar',
					},
				],
				status: 'active',
			},
			{
				id: 'https://ror.org/02haar591',
				names: [
					{
						lang: null,
						types: ['acronym'],
						value: 'IPSL',
					},
					{
						lang: 'fr',
						types: ['ror_display', 'label'],
						value: 'Institut Pierre-Simon Laplace',
					},
				],
				status: 'active',
			},
			{
				id: 'https://ror.org/00g1d7b60',
				names: [
					{
						lang: 'en',
						types: ['alias'],
						value: 'IU Cancer Center',
					},
					{
						lang: 'en',
						types: ['alias'],
						value: 'IU Melvin and Bren Simon Comprehensive Cancer Center',
					},
					{
						lang: 'en',
						types: ['alias'],
						value: 'IU Simon Cancer Center',
					},
					{
						lang: 'en',
						types: ['alias'],
						value: 'IU Simon Comprehensive Cancer Center',
					},
					{
						lang: 'en',
						types: ['alias'],
						value: 'Indiana University Cancer Center',
					},
					{
						lang: 'en',
						types: ['ror_display', 'label'],
						value:
							'Indiana University Melvin and Bren Simon Comprehensive Cancer Center',
					},
					{
						lang: 'en',
						types: ['alias'],
						value: 'Melvin and Bren Simon Comprehensive Cancer Center',
					},
					{
						lang: 'en',
						types: ['alias'],
						value: 'Simon Comprehensive Cancer Center',
					},
				],
				status: 'active',
			},
			{
				id: 'https://ror.org/02anx2442',
				names: [
					{
						lang: null,
						types: ['acronym'],
						value: 'KhNUE',
					},
					{
						lang: 'en',
						types: ['alias'],
						value: 'Kharkiv National University of Economics',
					},
					{
						lang: 'en',
						types: ['ror_display', 'label'],
						value: 'Simon Kuznets Kharkiv National University of Economics',
					},
					{
						lang: null,
						types: ['acronym'],
						value: 'ХНЕУ',
					},
					{
						lang: 'uk',
						types: ['label'],
						value: 'Харківський національний економічний університет',
					},
					{
						lang: 'ru',
						types: ['label'],
						value: 'Харьковский национальный экономический университет',
					},
				],
				status: 'active',
			},
			{
				id: 'https://ror.org/00nggaz43',
				names: [
					{
						lang: 'en',
						types: ['ror_display', 'label'],
						value: 'Georg Simon Ohm University of Applied Sciences Nuremberg',
					},
					{
						lang: 'de',
						types: ['alias'],
						value: 'TH Nürnberg',
					},
					{
						lang: 'de',
						types: ['label'],
						value: 'Technische Hochschule Nürnberg Georg Simon Ohm',
					},
				],
				status: 'active',
			},
			{
				id: 'https://ror.org/03951zg45',
				names: [
					{
						lang: null,
						types: ['acronym'],
						value: 'UNESR',
					},
					{
						lang: 'es',
						types: ['ror_display', 'label'],
						value: 'Universidad Nacional Experimental Simón Rodríguez',
					},
				],
				status: 'active',
			},
			{
				id: 'https://ror.org/0407tnq23',
				names: [
					{
						lang: 'en',
						types: ['ror_display', 'label'],
						value: 'John Simon Guggenheim Memorial Foundation',
					},
				],
				status: 'active',
			},
			{
				id: 'https://ror.org/01a8ynn13',
				names: [
					{
						lang: 'en',
						types: ['alias'],
						value: 'Simon Langton Grammar School for Boys',
					},
					{
						lang: 'en',
						types: ['alias'],
						value: 'The Langton',
					},
					{
						lang: 'en',
						types: ['ror_display', 'label'],
						value: 'The Langton Grammar School for Boys',
					},
				],
				status: 'active',
			},
		],
	},
	newAffiliation: {
		id: null,
		authorId: 1,
		ror: null,
		name: {},
		rorObject: {},
	},
};
