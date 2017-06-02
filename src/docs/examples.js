// import ListPanel from './examples/ListPanel/_default.vue';
import ListPanel from './../components/ListPanel.vue';
import ListPanelRaw from '!!raw-loader!./../components/ListPanel.vue';

export default {
	ListPanel: {
		component: ListPanel,
		componentRaw: ListPanelRaw,
		label: 'ListPanel',
		url: '/components/ListPanel',
	},
};
