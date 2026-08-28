export default {
	name: 'contrastColorPicker',
	component: 'field-contrast-color-picker',
	label: 'Choose Color Combination',
	description:
		'Select two colors with good contrast for accessibility. The contrast ratio should meet WCAG guidelines for text readability. Use keyboard navigation or mouse to adjust colors.',
	value: JSON.stringify({
		color1: '#1E6292',
		color2: '#FFFFFF',
	}),
};
