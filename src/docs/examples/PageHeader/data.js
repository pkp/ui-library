import PageHeader from '@/components/PageHeader/PageHeader.vue';
import ViewPageHeader from './ViewPageHeader.vue';
import WithActions from './WithActions.vue';
import WithActionsRaw from '!!raw-loader!./WithActions.vue';

export default {
	viewComponent: ViewPageHeader,
	baseComponent: PageHeader,
	propDescription: {},
	examples: {
		'with-actions': {
			label: 'with Actions',
			component: WithActions,
			componentRaw: WithActionsRaw,
		},
	},
};
