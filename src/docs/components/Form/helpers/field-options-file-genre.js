export default {
	name: 'genreId',
	component: 'field-options',
	label: 'What kind of file is this?',
	description: 'Choose the option that best describes this file.',
	value: '',
	type: 'radio',
	options: [
		{
			value: 1,
			label: 'Book Manuscript'
		},
		{
			value: 2,
			label: 'Chapter Manuscript'
		},
		{
			value: 3,
			label: 'Preface'
		},
		{
			value: 4,
			label: 'Index'
		},
		{
			value: 5,
			label: 'Glossary'
		},
		{
			value: 7,
			label: 'Prospectus'
		},
		{
			value: 11,
			label: 'Table'
		},
		{
			value: 8,
			label: 'Figure'
		},
		{
			value: 9,
			label: 'Audio'
		},
		{
			value: 10,
			label: 'Other'
		}
	],
	groupId: 'default'
};
