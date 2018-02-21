import Icon from '@/components/Icon/Icon.vue';
import IconRaw from '!!raw-loader!@/components/Icon/Icon.vue';
import ViewIcon from './ViewIcon.vue';
import IsInline from './IsInline.vue';
import HelpIcon from './HelpIcon.vue';
import WarningIcon from './WarningIcon.vue';

export default {
	viewComponent: ViewIcon,
	baseComponent: Icon,
	dataDesc: {
		id: 'Used internally. Do not modify.',
	},
	propDescription: {
		icon: 'Which <a href="https://fontawesome.com/">FontAwesome</a> icon to use.',
		inline: 'Use when an icon sits alongside text to ensure adequate spacing between the icon and text.',
	},
	examples: {
		'is-Inline': {
			label: 'is Inline',
			component: IsInline,
			componentRaw: IconRaw,
		},
		'Help-Icon': {
			label: 'Help Icon',
			component: HelpIcon,
			componentRaw: IconRaw,
		},
		'Warning-Icon': {
			label: 'Warning Icon',
			component: WarningIcon,
			componentRaw: IconRaw,
		},
	},
};
