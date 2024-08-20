<template>
	<div class="counterReportsListPanel">
		<slot>
			<ListPanel :items="items">
				<template #header>
					<PkpHeader>
						<h2>{{ title }}</h2>
						<Spinner v-if="isLoadingItems" />
					</PkpHeader>
				</template>
				<template #item-title="{item}">
					<span :id="item.Report_ID">
						{{ item.Report_Name }} ({{ item.Report_ID }})
					</span>
				</template>
				<template #item-actions="{item}">
					<PkpButton @click="openEditModal(item.Report_ID)">
						{{ t('common.edit') }}
					</PkpButton>
				</template>
			</ListPanel>
		</slot>
	</div>
</template>

<script>
import PkpButton from '@/components/Button/Button.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import PkpHeader from '@/components/Header/Header.vue';
import ajaxError from '@/mixins/ajaxError';
import fetch from '@/mixins/fetch';
import cloneDeep from 'clone-deep';
import CounterReportsEditModal from './CounterReportsEditModal.vue';
import {useModal} from '@/composables/useModal';
import {useFetch} from '@/composables/useFetch';

export default {
	components: {
		PkpButton,
		Spinner,
		ListPanel,
		PkpHeader,
	},
	mixins: [fetch, ajaxError],
	props: {
		/** A localized string for the button to edit a report. */
		editCounterReportLabel: {
			type: String,
			required: true,
		},
		/** The Form to edit a report. */
		form: {
			type: Object,
			required: true,
		},
		/** A unique id for this component. */
		id: {
			type: String,
			required: true,
		},
		/** The title of the list panel. */
		title: {
			type: String,
			required: true,
		},
	},
	emits: [
		/** Emitted when a prop should be changed. Payload: `(id, newProps)` */
		'set',
	],
	data() {
		return {
			items: [],
			isLoadingItems: false,
			activeForm: null,
			activeFormTitle: '',
		};
	},
	mounted() {
		/**
		 * Load the items
		 */
		this.getItems();
	},
	methods: {
		/**
		 * Get the list of items from the server
		 */
		getItems: async function () {
			let self = this;
			this.isLoadingItems = true;

			const {data, isSuccess, fetch} = useFetch(`${this.apiUrl}/reports`, {
				method: 'GET',
			});
			await fetch();

			if (isSuccess) {
				self.setItems(data.value);
			}
			self.isLoadingItems = false;
		},

		/**
		 * Clear the active form when the modal is closed
		 *
		 * @param {Object} event
		 */
		closeFormModal(event) {
			this.activeForm = null;
			this.activeFormTitle = '';
			const {closeSideModal} = useModal();
			closeSideModal(CounterReportsEditModal);
		},

		/**
		 * The edit form has been successfully
		 * submitted.
		 */
		formSuccess() {
			this.closeFormModal();
		},

		/**
		 * Open the modal to edit an item
		 *
		 * @param {Number} id
		 */
		openEditModal(id) {
			const report = this.items.find((report) => report.Report_ID === id);
			if (!report) {
				this.ajaxErrorCallback({});
				return;
			}

			let activeForm = cloneDeep(this.form);
			activeForm.method = 'GET';
			activeForm.fields = activeForm.reportFields[id];
			this.activeForm = activeForm;
			this.activeFormTitle = this.editCounterReportLabel;

			const {openSideModal} = useModal();

			openSideModal(CounterReportsEditModal, {
				title: this.editCounterReportLabel,
				submitAction: this.apiUrl + '/' + report.Path,
				activeForm,
				onUpdateForm: this.updateForm,
				onFormSuccess: this.formSuccess,
			});
		},

		/**
		 * Set the list of items
		 *
		 * @see @/mixins/fetch.js
		 * @param {Array} result
		 */
		setItems(result) {
			let self = this;
			self.items = result;
		},

		/**
		 * Update form values when they change
		 *
		 * @param {String} formId
		 * @param {Object} data
		 */
		updateForm(formId, data) {
			if (!this.activeForm) {
				return;
			}
			let activeForm = this.activeForm;
			Object.keys(data).forEach(function (key) {
				activeForm[key] = data[key];
			});
			this.activeForm = activeForm;
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.counterReportsListPanel {
	.listPanel__itemTitle {
		font-weight: @normal;
	}
}
</style>
