import ColorsDisplay from './ColorsDisplay.vue';
import TailwindConfig from '../../../../tailwind.config.js';
export default {
	title: 'DocsHelpers/ColorsDisplay',
	component: ColorsDisplay,
	render: (args) => ({
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
	'state-success': `
		Success State
		Positive State
	`,
	'state-error': `
		Warning or triggering alertness that something is not right and needs something to be done.
	`,
	'action-negative': `
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
	dark: 'Dark Background',
	medium: 'Medium Background',
	lightest: `Lightest Background`,
	blur: `Backdrop background for modals`,
};

const ColorTextUsedIn = {
	dark: 'Default text color on light background',
	'dark-accent': 'Heading text on light background',
	light: `Light text on light background`,
	lightest: `Lightest text on dark background`,
};

const ColorBorderUsedIn = {
	dark: 'Dark border',
	light: 'Light border',
	darkest: 'Darkest border',
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
