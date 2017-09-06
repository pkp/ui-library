<script>
import SelectListPanel from '@/components/SelectListPanel/SelectListPanel.vue';
import SelectListPanelData from './data.js';

export default {
	name: 'SelectListPanelWithRadio',
	extends: SelectListPanel,
	data: function () {
		return Object.assign(SelectListPanelData.baseData(), {
			id: 'SelectListPanelWithRadio',
			inputName: 'radioInputName',
			inputType: 'radio',
			i18n: {
				title: 'Select List Panel with Radio Buttons',
			},
		});
	},
};
</script>
