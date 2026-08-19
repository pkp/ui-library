/** A review form as the review content endpoint sends it, shaped as form fields */
export const reviewFormConfig = {
	id: 'reviewContent',
	title: 'Peer Review Form',
	description: '<p>Please answer all of the questions below.</p>',
	fields: [
		{
			name: '11',
			component: 'field-rich-textarea',
			label: 'What is the main contribution of this manuscript?',
			isRequired: true,
		},
		{
			name: '12',
			component: 'field-options',
			type: 'radio',
			label: 'Is the methodology sound?',
			// An option's value is the index of the question's possible responses
			options: [
				{value: 0, label: 'Yes'},
				{value: 1, label: 'Partly'},
				{value: 2, label: 'No'},
			],
		},
		{
			name: '13',
			component: 'field-options',
			type: 'checkbox',
			label: 'Which sections need revision?',
			options: [
				{value: 0, label: 'Abstract'},
				{value: 1, label: 'Methods'},
				{value: 2, label: 'Discussion'},
			],
		},
	],
};

/** The reviewer's answers */
export const reviewFormResponses = {
	11: '<p>The analysis is careful and full of insight.</p>',
	12: 0,
	13: ['0', '2'],
};
