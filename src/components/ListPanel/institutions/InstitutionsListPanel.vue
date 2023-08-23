<template>
	<div class="institutionsListPanel">
		<slot>
			<list-panel :items="items">
				<pkp-header slot="header">
					<h2>{{ title }}</h2>
					<spinner v-if="isLoading" />
					<template slot="actions">
						<search
							:searchPhrase="searchPhrase"
							@search-phrase-changed="setSearchPhrase"
						/>
						<pkp-button @click="openAddModal">
							{{ addInstitutionLabel }}
						</pkp-button>
					</template>
				</pkp-header>
				<template v-slot:item-title="{item}">
					<span :id="'institution-' + item.id">
						{{ localize(item.name) }}
					</span>
				</template>
				<template v-slot:item-actions="{item}">
					<pkp-button
						:aria-describedby="'institution-' + item.id"
						@click="openEditModal(item.id)"
					>
						{{ __('common.edit') }}
					</pkp-button>
					<pkp-button
						:isWarnable="true"
						:aria-describedby="'institution-' + item.id"
						@click="openDeleteModal(item.id)"
					>
						{{ __('common.delete') }}
					</pkp-button>
				</template>
				<pagination
					v-if="lastPage > 1"
					slot="footer"
					:currentPage="currentPage"
					:isLoading="isLoading"
					:lastPage="lastPage"
					@set-page="setPage"
				/>
			</list-panel>
			<modal
				:closeLabel="__('common.close')"
				name="form"
				:title="activeFormTitle"
				:open="isModalOpenedForm"
				@close="closeFormModal"
			>
				<pkp-form
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
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpForm from '@/components/Form/Form.vue';
import PkpHeader from '@/components/Header/Header.vue';
import Search from '@/components/Search/Search.vue';
import Modal from '@/components/Modal/Modal.vue';
import ajaxError from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog.js';
import fetch from '@/mixins/fetch';
import cloneDeep from 'clone-deep';

export default {
	components: {
		ListPanel,
		Pagination,
		PkpForm,
		PkpHeader,
		Search,
		Modal,
	},
	mixins: [dialog, fetch, ajaxError],
	props: {
		addInstitutionLabel: {
			type: String,
			required: true,
		},
		confirmDeleteMessage: {
			type: String,
			required: true,
		},
		deleteInstitutionLabel: {
			type: String,
			required: true,
		},
		editInstitutionLabel: {
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
		items: {
			type: Array,
			default() {
				return [];
			},
		},
		itemsMax: {
			type: Number,
			default() {
				return 0;
			},
		},
		title: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			activeForm: null,
			activeFormTitle: '',
			isModalOpenedForm: false,
		};
	},
	methods: {
		/**
		 * Clear the active form when the modal is closed
		 *
		 */
		closeFormModal() {
			this.activeForm = null;
			this.activeFormTitle = '';
			this.isModalOpenedForm = false;
		},

		/**
		 * The add/edit form has been successfully
		 * submitted.
		 *
		 * @param {Object} item
		 */
		formSuccess(item) {
			if (this.activeForm.method === 'POST') {
				this.offset = 0;
				this.get();
				pkp.eventBus.$emit('add:institution', item);
			} else {
				this.setItems(
					this.items.map((i) => (i.id === item.id ? item : i)),
					this.itemsMax
				);
				pkp.eventBus.$emit('update:institution', item);
			}
			this.closeFormModal();
		},

		/**
		 * Open the modal to add an item
		 */
		openAddModal() {
			let activeForm = cloneDeep(this.form);
			activeForm.action = this.apiUrl;
			activeForm.method = 'POST';
			this.activeForm = activeForm;
			this.activeFormTitle = this.addInstitutionLabel;
			this.isModalOpenedForm = true;
		},

		/**
		 * Open delete modal
		 *
		 * @param {Number} id
		 */
		openDeleteModal(id) {
			const institution = this.items.find((a) => a.id === id);
			if (typeof institution === 'undefined') {
				this.ajaxErrorCallback({});
				return;
			}
			this.openDialog({
				name: 'delete',
				title: this.deleteInstitutionLabel,
				message: this.replaceLocaleParams(this.confirmDeleteMessage, {
					title: this.localize(institution.title),
				}),
				actions: [
					{
						label: this.__('common.yes'),
						isPrimary: true,
						callback: (close) => {
							var self = this;
							$.ajax({
								url: this.apiUrl + '/' + id,
								type: 'POST',
								headers: {
									'X-Csrf-Token': pkp.currentUser.csrfToken,
									'X-Http-Method-Override': 'DELETE',
								},
								error: self.ajaxErrorCallback,
								success: function (r) {
									self.setItems(
										self.items.filter((i) => i.id !== id),
										self.itemsMax
									);
									close();
									self.setFocusIn(self.$el);
								},
							});
						},
					},
					{
						label: this.__('common.no'),
						isWarnable: true,
						callback: (close) => close(),
					},
				],
			});
		},

		/**
		 * Open the modal to edit an item
		 *
		 * @param {Number} id
		 */
		openEditModal(id) {
			const institution = this.items.find(
				(institution) => institution.id === id
			);
			if (!institution) {
				this.ajaxErrorCallback({});
				return;
			}

			let activeForm = cloneDeep(this.form);
			activeForm.action = this.apiUrl + '/' + id;
			activeForm.method = 'PUT';
			activeForm.fields = activeForm.fields.map((field) => {
				if (Object.keys(institution).includes(field.name)) {
					if (field.name === 'ipRanges') {
						field.value = institution[field.name].join('\r\n');
					} else {
						field.value = institution[field.name];
					}
				}
				return field;
			});
			this.activeForm = activeForm;
			this.activeFormTitle = this.editInstitutionLabel;
			this.isModalOpenedForm = true;
		},

		/**
		 * Set the list of items
		 *
		 * @see @/mixins/fetch.js
		 * @param {Array} items
		 * @param {Number} itemsMax
		 */
		setItems(items, itemsMax) {
			this.$emit('set', this.id, {
				items,
				itemsMax,
			});
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
};
</script>

<style lang="less">
@import '../../../styles/_import';

.institutionsListPanel {
	.listPanel__itemTitle {
		font-weight: @normal;
	}
}
</style>
