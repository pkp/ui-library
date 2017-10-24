<script>
import SelectListPanel from '@/components/SelectListPanel/SelectListPanel.vue';
import SelectListPanelData from './data.js';

export default {
	name: 'SelectListPanelWithSelectAll',
	extends: SelectListPanel,
	data: function () {
		return Object.assign(SelectListPanelData.baseData(), {
			id: 'SelectListPanelWithSelectAll',
			selected: [],
			showSelectAll: true,
			initializeAllSelected: false,
			i18n: {
				title: 'Select List Panel with Select All',
				selectAllLabel: 'Select All',
			},
		});
	},
};
</script>
