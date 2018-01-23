import Badge from '@/components/Badge/Badge.vue';
import BadgeRaw from '!!raw-loader!@/components/Badge/Badge.vue';
import ViewBadge from './ViewBadge.vue';
import IsPrimary from './IsPrimary.vue';
import IsWarnable from './IsWarnable.vue';
import IsButton from './IsButton.vue';
import HasDot from './HasDot.vue';
import IsStage from './IsStage.vue';

export default {
	viewComponent: ViewBadge,
	baseComponent: Badge,
	dataDesc: {
		id: 'Used internally. Do not modify.',
	},
	propDescription: {
		content: 'What to display in the Badge.',
		label: 'A hidden label for the value for users isout sight.',
		isPrimary: 'Badges which should stand out from adjacent badges.',
		isWarnable: 'Badges which describe an alert or warning.',
		isButton: 'If the badge can be used to perform an action, set this to true.',
		hasDot: 'Adds a small dot to the left of the <code>content</code>.',
		stage: 'Pass a stage name to use a special design for stage badges. Supports: <code>submission</code>, <code>review</code>, <code>copyediting</code>, <code>production</code>.',
	},
	examples: {
		'is-Primary': {
			label: 'is Primary',
			component: IsPrimary,
			componentRaw: BadgeRaw,
		},
		'is-Warnable': {
			label: 'is Warnable',
			component: IsWarnable,
			componentRaw: BadgeRaw,
		},
		'has-Dot': {
			label: 'has Dot',
			component: HasDot,
			componentRaw: BadgeRaw,
		},
		'is-Stage': {
			label: 'is Stage',
			component: IsStage,
			componentRaw: BadgeRaw,
		},
		'is-Button': {
			label: 'is Button',
			component: IsButton,
			componentRaw: BadgeRaw,
		},
	},
};
