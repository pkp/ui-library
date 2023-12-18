import InstitutionsListPanel from './InstitutionsListPanel.vue';

import PkpDialog from '@/components/Modal/Dialog.vue';
import FormInstitutionMock from '@/components/Form/mocks/form-institution';

export default {
	title: 'ListPanel/InstitutionsListPanel',
	component: InstitutionsListPanel,
};

const institutions = [
	{
		id: 1,
		name: {
			en: 'Institution 1 Name EN',
			fr_CA: 'Institution 1 Name FR',
			ar: 'Institution 1 Name AR',
		},
		ipRanges: ['142.60.*.*'],
	},
	{
		id: 2,
		name: {
			en: 'Institution 2 Name EN',
			fr_CA: 'Institution 2 Name FR',
			ar: 'Institution 2 Name AR',
		},
		ipRanges: ['142.58.103.1 - 142.58.103.4', '142.59.*.*'],
	},
	{
		id: 3,
		name: {
			en: 'Institution 3 Name EN',
			fr_CA: 'Institution 3 Name FR',
			ar: 'Institution 3 Name AR',
		},
	},
	{
		id: 4,
		name: {
			en: 'Institution 4 Name EN',
			fr_CA: 'Institution 4 Name FR',
			ar: 'Institution 4 Name AR',
		},
	},
];

export const Base = {
	render: (args) => ({
		components: {InstitutionsListPanel, PkpDialog},
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
			<InstitutionsListPanel
				v-bind="args"
			/>
		`,
	}),

	args: {
		id: 'previewInstitutionsListPanel',
		addInstitutionLabel: 'Add Institution',
		apiUrl: '',
		confirmDeleteMessage: 'Are you sure you want to delete this institution?',
		deleteInstitutionLabel: 'Delete Institution',
		editInstitutionLabel: 'Edit Institution',
		title: 'Institutions',
		form: {...FormInstitutionMock},
		items: [...institutions],
		itemsMax: institutions.length,
	},
};
