import HighlightsListPanel from './HighlightsListPanel.vue';
import HighlightMock from '@/mocks/highlight';
import FormHighlightMock from '@/components/Form/mocks/form-highlight';
import PkpDialog from '@/components/Modal/Dialog.vue';

export default {
	title: 'ListPanel/HighlightsListPanel',
	component: HighlightsListPanel,
};

const highlights = [
	{
		...HighlightMock,
	},
	{
		...HighlightMock,
		id: 2,
		title: {
			en: 'Eros in cursus turpis massa tincidunt dui ut ornare lectus',
			fr_CA: 'Eros in cursus turpis massa tincidunt dui ut ornare lectus',
			ar: 'Eros in cursus turpis massa tincidunt dui ut ornare lectus',
		},
		description: {
			en: 'Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at turpis massa tincidunt dui ut ornare lectus',
			fr_CA:
				'Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at turpis massa tincidunt dui ut ornare lectus',
			ar: 'Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at turpis massa tincidunt dui ut ornare lectus',
		},
	},
	{
		...HighlightMock,
		id: 3,
		title: {
			en: 'Risus feugiat in ante metus dictum at',
			fr_CA: 'Risus feugiat in ante metus dictum at',
			ar: 'Risus feugiat in ante metus dictum at',
		},
	},
	{
		...HighlightMock,
		id: 4,
		title: {
			en: 'Morbi tincidunt ornare massa eget egestas purus viverra accumsan',
			fr_CA: 'Morbi tincidunt ornare massa eget egestas purus viverra accumsan',
			ar: 'Morbi tincidunt ornare massa eget egestas purus viverra accumsan',
		},
	},
	{
		...HighlightMock,
		id: 5,
		title: {
			en: 'Nibh praesent tristique magna sit amet purus gravida quis',
			fr_CA: 'Nibh praesent tristique magna sit amet purus gravida quis',
			ar: 'Nibh praesent tristique magna sit amet purus gravida quis',
		},
	},
];

export const Base = {
	render: (args) => ({
		components: {HighlightsListPanel, PkpDialog},
		setup() {
			function setData(id, newData) {
				Object.keys(newData).forEach((key) => {
					if (args[key]) {
						args[key] = newData[key];
					}
				});
			}

			return {args, setData};
		},
		template: `
			<HighlightsListPanel
				v-bind="args"
				@set="setData"

			/>
		`,
	}),

	args: {
		id: 'previewHighlightsListPanel',
		apiUrl: 'https://httpbin.org',
		i18nAdd: 'Add Highlight',
		i18nConfirmDelete:
			'Are you sure you want to delete {$title}? This action can not be undone.',
		i18nDelete: 'Delete Highlight',
		i18nEdit: 'Edit Highlight',
		i18nSaveOrder: 'Save Order',
		title: 'Highlights',
		form: {...FormHighlightMock},
		items: [...highlights],
		itemsMax: highlights.length,
	},
};
