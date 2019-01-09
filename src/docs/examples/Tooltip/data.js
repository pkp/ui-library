import Tooltip from '@/components/Tooltip/Tooltip.vue';
import ViewTooltip from './ViewTooltip.vue';

export default {
	viewComponent: ViewTooltip,
	baseComponent: Tooltip,
	propDescription: {
		tooltip: 'The message to display in the popup.',
		label: 'A label for the button that screenreaders will use to understand it. This should refer to the thing it is describing. A tooltip for the submission subtitle field might say "Tooltip for subtitle".',
	},
};
