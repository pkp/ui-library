import ColorsDisplay from './ColorsDisplay.vue';
import TailwindConfig from '../../../../tailwind.config.js';
export default {
	title: 'DocsHelpers/ColorsDisplay',
	component: ColorsDisplay,
	render: (args) => ({
		components: {ColorsDisplay},
		setup() {
			return {args};
		},
		template: `
			<ColorsDisplay v-bind="args" />
		`,
	}),
};

const ColorUsedIn = {
	primary: `
		OJS Primary Color.
		  Used for buttons and icon
		  Main and secondary Menu for selected states and texts.
	`,
	hover: 'Hover state',
	success: `
		Success State
		Positive State
	`,
	attention: `
		Warning or triggering alertness that something is not right and needs something to be done.
	`,
	negative: `
		Actions in that are negative (Buttons or CTAs) or when something is performed that is not okay
	`,
	'stage-desk-review': `
		Desk Review
	`,
	'stage-in-review': `
		In Review
	`,
	'stage-copyediting': `
		Copyediting
	`,
	'stage-production': `
		Production
	`,
	'stage-scheduled-for-publishing': `
		Scheduled for Publishing
	`,
	'stage-incomplete-submission': `
		Incomplete Submission
	`,
	'stage-published': `
		Published
	`,
	'stage-declined': `
		Declined
	`,
	'profile-1': 'User Profile Color 1',
	'profile-2': 'User Profile Color 2',
	'profile-3': 'User Profile Color 3',
	'profile-4': 'User Profile Color 4',
	'profile-5': 'User Profile Color 5',
	'profile-6': 'User Profile Color 6',
};

const ColorBackgroundUsedIn = {
	default: 'Used in panels and base backgrounds',
	secondary:
		'Used on top of Default background. Also used as base for workflows with tables and steppers',
	tertiary: `Used in table rows, and elements for emphasis `,
	blur: `Backdrop background for modals`,
	'selection-light': 'Used to show form inputs that are selected',
	'selection-dark': 'Used to show elements that are selected',
	disabled: 'Used on disabled buttons',
};

const ColorTextUsedIn = {
	default: 'Default text color on light background',
	secondary: `Used for secondary information, like form field description`,
	heading: 'Used for headings',
	'on-dark': `Light text on dark background`,
	disabled: 'Used on disabled buttons',
};

const ColorBorderUsedIn = {
	light: 'Dark border',
	dark: 'Light border',
	'form-fields': 'Specific for form fields',
};

export const Common = {
	args: {
		colorUsedIn: ColorUsedIn,
		colorDefinition: TailwindConfig.theme.colors,
	},
};

export const Text = {
	args: {
		displayAs: 'text',
		colorUsedIn: ColorTextUsedIn,
		colorDefinition: TailwindConfig.theme.textColor,
	},
};

export const Background = {
	args: {
		colorUsedIn: ColorBackgroundUsedIn,
		colorDefinition: TailwindConfig.theme.backgroundColor,
	},
};

export const Border = {
	args: {
		displayAs: 'border',
		colorUsedIn: ColorBorderUsedIn,
		colorDefinition: TailwindConfig.theme.borderColor,
	},
};
