import exampleText from '../../../data/exampleText';

export default {
	name: 'options-copyright',
	component: 'field-options',
	label: 'Copyright',
	description: `
        Please read and understand the copyright terms for submissions to this journal.
        <blockquote>${exampleText[0]}</blockquote>
    `,
	type: 'checkbox',
	value: false,
	options: [
		{
			value: true,
			label: 'Yes, I agree to the copyright statement.',
		},
	],
	groupId: 'default',
};
