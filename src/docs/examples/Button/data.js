import pkpButton from '@/components/Button/Button.vue';
import pkpButtonRaw from '!!raw-loader!@/components/Button/Button.vue';
import ViewButton from './ViewButton.vue';
import IsPrimary from './IsPrimary.vue';
import IsWarnable from './IsWarnable.vue';
import IsLink from './IsLink.vue';
import IsActive from './IsActive.vue';
import WithIcon from './WithIcon.vue';

export default {
	viewComponent: ViewButton,
	baseComponent: pkpButton,
	dataDesc: {
		id: 'Used internally. Do not modify.',
	},
	propDescription: {
		element: 'Whether to use a <code>button</code> or <code>a</code> HTML tag. Default: <code>button</code>',
		href: 'URL when using a link element. <code>element</code> must be set to <code>a</code>',
		label: 'A label describing the button action.',
		icon: 'Add an icon before the button label.',
		isPrimary: 'Use when this button represents the default or expected action in a group of actions. A single group of actions should never have more than one primary button.',
		isWarnable: 'Use when this button represents an action such as delete, go back, revert or cancel.',
		isActive: 'Use when the button controls another element, and that element is active. Think of it like an <a href="https://www.google.co.uk/search?q=on+air+sign&tbm=isch">On Air</a> button.',
		isLink: 'Use when you want the button to look more like a traditional link than a button.',
		hasDot: 'Adds a small dot to the left of the <code>content</code>.',
		stage: 'Pass a stage name to use a special design for stage badges. Supports: <code>submission</code>, <code>review</code>, <code>copyediting</code>, <code>production</code>.',
	},
	examples: {
		'is-Primary': {
			label: 'is Primary',
			component: IsPrimary,
			componentRaw: pkpButtonRaw,
		},
		'is-Warnable': {
			label: 'is Warnable',
			component: IsWarnable,
			componentRaw: pkpButtonRaw,
		},
		'is-Link': {
			label: 'is Link',
			component: IsLink,
			componentRaw: pkpButtonRaw,
		},
		'is-Active': {
			label: 'is Active',
			component: IsActive,
			componentRaw: pkpButtonRaw,
		},
		'with-Icon': {
			label: 'with Icon',
			component: WithIcon,
			componentRaw: pkpButtonRaw,
		},
	},
};
