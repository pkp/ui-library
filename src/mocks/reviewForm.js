/** A review form as the review content endpoint sends it, shaped as form fields */
export const reviewFormConfig = {
	id: 'reviewContent',
	title: 'Peer Review Form',
	description: '<p>Please answer all required questions.</p>',
	fields: [
		{
			name: '11',
			component: 'field-text',
			size: 'normal',
			label: 'Field of expertise',
		},
		{
			name: '12',
			component: 'field-text',
			size: 'large',
			label: 'Suggested title',
			description: '<p>Leave blank if no change is needed.</p>',
		},
		{
			name: '13',
			component: 'field-rich-textarea',
			plugins: ['link'],
			toolbar: 'bold italic superscript subscript | link',
			label: 'Overall comments',
			description: '<p>These are shared with the author.</p>',
			isRequired: true,
		},
		{
			name: '14',
			component: 'field-options',
			type: 'checkbox',
			label: 'Sections needing revision',
			description: '<p>Select all that apply.</p>',
			isRequired: true,
			// An option's value is the index of the question's possible responses
			options: [
				{value: 0, label: 'Abstract'},
				{value: 1, label: 'Methods'},
				{value: 2, label: 'Results'},
			],
		},
		{
			name: '15',
			component: 'field-options',
			type: 'radio',
			label: 'Is the methodology sound?',
			options: [
				{value: 0, label: 'Yes'},
				{value: 1, label: 'No'},
			],
		},
		{
			name: '16',
			component: 'field-select',
			label: 'Quality of writing',
			isRequired: true,
			options: [
				{value: 0, label: 'Good'},
				{value: 1, label: 'Adequate'},
				{value: 2, label: 'Poor'},
			],
		},
	],
};

/** The reviewer's answers, with the optional question left unanswered */
export const reviewFormResponses = {
	11: 'Molecular biology',
	13: '<p>The analysis is careful and the conclusions follow from the data. The methods section needs more detail on how the sample was selected.</p>',
	// Checkbox answers come back from the legacy form as strings
	14: ['1'],
	15: 0,
	16: 0,
};
