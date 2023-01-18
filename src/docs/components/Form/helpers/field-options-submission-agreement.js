import exampleText from '../../../data/exampleText';

const $li = exampleText.map(
	(paragraph) => `<li>${paragraph.substring(0, 100)}</li>`
);

export default {
	name: 'options-submission-agreement',
	component: 'field-options',
	label: 'Submission Agreement',
	description:
		'By submitting to this journal, you agree to the following terms.<ul>' +
		$li.join('') +
		'</ul>',
	type: 'checkbox',
	value: false,
	options: [
		{
			value: true,
			label: 'Yes, I agree to these terms.',
		},
	],
	groupId: 'default',
};
