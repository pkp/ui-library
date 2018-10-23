import MultilingualProgress from '@/components/MultilingualProgress/MultilingualProgress.vue';
import ViewMultilingualProgress from './ViewMultilingualProgress.vue';
import PartiallyComplete from './PartiallyComplete.vue';
import PartiallyCompleteRaw from '!!raw-loader!./PartiallyComplete.vue';
import Complete from './Complete.vue';
import CompleteRaw from '!!raw-loader!./Complete.vue';

export default {
	viewComponent: ViewMultilingualProgress,
	baseComponent: MultilingualProgress,
	propDescription: {
		count: 'The number of completed multilingual items.',
		total: 'The total number of multilingual items expected to be completed.',
		i18n: 'A translation object containing one property, `multilingualProgress`, in the follwoing form: `{$count}/{$total} items completed.`',
	},
	examples: {
		'partially-complete': {
			label: 'Partially Complete',
			component: PartiallyComplete,
			componentRaw: PartiallyCompleteRaw,
		},
		'complete': {
			label: 'Complete',
			component: Complete,
			componentRaw: CompleteRaw,
		},
	},
};
