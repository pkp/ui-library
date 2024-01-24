<template>
	<div class="counterReportsListPanel">
		<slot>
			<list-panel :items="items">
				<pkp-header slot="header">
					<h2>{{ title }}</h2>
					<spinner v-if="isLoading" />
				</pkp-header>
				<template v-slot:item-title="{item}">
					<span :id="item.Report_ID">
						{{ item.Report_Name }} ({{ item.Report_ID }})
					</span>
				</template>
				<template v-slot:item-actions="{item}">
					<pkp-button
						:aria-describedby="item.Report_ID"
						@click="openEditModal(item.Report_ID)"
					>
						{{ __('common.edit') }}
					</pkp-button>
				</template>
			</list-panel>
			<modal
				:closeLabel="__('common.close')"
				name="form"
				:title="activeFormTitle"
				@closed="formModalClosed"
			>
				<counter-report-form
					v-bind="activeForm"
					@set="updateForm"
					@success="formSuccess"
				/>
			</modal>
		</slot>
	</div>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import CounterReportForm from '@/components/Form/counter/CounterReportForm.vue';
import PkpHeader from '@/components/Header/Header.vue';
import Modal from '@/components/Modal/Modal.vue';
import ajaxError from '@/mixins/ajaxError';
import fetch from '@/mixins/fetch';
import cloneDeep from 'clone-deep';

export default {
	components: {
		ListPanel,
		CounterReportForm,
		PkpHeader,
		Modal,
	},
	mixins: [fetch, ajaxError],
	props: {
		editCounterReportLabel: {
			type: String,
			required: true,
		},
		form: {
			type: Object,
			required: true,
		},
		id: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			items: [],
			isLoadingItems: false,
			latestItemsGetRequest: '',
			isDownloadingReport: false,
			activeForm: null,
			activeFormTitle: '',
			resetFocusTo: null,
		};
	},
	methods: {
		/**
		 * Get the list of items from the server
		 */
		getItems() {
			let self = this;

			this.isLoadingItems = true;
			this.latestItemsGetRequest = $.pkp.classes.Helper.uuid();

			$.ajax({
				url: this.apiUrl + '/reports',
				type: 'GET',
				data: [],
				_uuid: this.latestItemsGetRequest,
				error(r) {
					if (self.latestItemsGetRequest !== this._uuid) {
						return;
					}
					self.ajaxErrorCallback(r);
				},
				success(r) {
					if (self.latestItemsGetRequest !== this._uuid) {
						return;
					}
					self.setItems(r);
				},
				complete(r) {
					if (self.latestItemsGetRequest !== this._uuid) {
						return;
					}
					self.isLoadingItems = false;
				},
			});
		},

		/**
		 * Clear the active form when the modal is closed
		 *
		 * @param {Object} event
		 */
		formModalClosed(event) {
			this.activeForm = null;
			this.activeFormTitle = '';
			if (this.resetFocusTo) {
				this.resetFocusTo.focus();
			}
		},

		/**
		 * The edit form has been successfully
		 * submitted.
		 */
		formSuccess() {
			this.$modal.hide('form');
		},

		/**
		 * Open the modal to edit an item
		 *
		 * @param {Number} id
		 */
		openEditModal(id) {
			this.resetFocusTo = document.activeElement;

			const report = this.items.find((report) => report.Report_ID === id);
			if (!report) {
				this.ajaxErrorCallback({});
				return;
			}

			let activeForm = cloneDeep(this.form);
			activeForm.reportId = id;
			activeForm.action = this.apiUrl + '/' + report.Path;
			activeForm.method = 'GET';
			activeForm.fields = activeForm.reportFields[id];
			this.activeForm = activeForm;
			this.activeFormTitle = this.editCounterReportLabel;
			this.$modal.show('form');
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
			let activeForm = {...this.activeForm};
			Object.keys(data).forEach(function (key) {
				activeForm[key] = data[key];
			});
			this.activeForm = activeForm;
		},
	},
	mounted() {
		/**
		 * Load the items
		 */
		this.getItems();
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
