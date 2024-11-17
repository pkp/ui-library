<template>
	<div class="institutionsListPanel">
		<slot>
			<ListPanel :items="items">
				<template #header>
					<PkpHeader>
						<h2>{{ title }}</h2>
						<Spinner v-if="isLoading" />
						<template #actions>
							<Search
								:search-phrase="searchPhrase"
								@search-phrase-changed="setSearchPhrase"
							/>
							<PkpButton @click="openAddModal">
								{{ addInstitutionLabel }}
							</PkpButton>
						</template>
					</PkpHeader>
				</template>
				<template #item-title="{item}">
					<span :id="'institution-' + item.id">
						{{ localize(item.name) }}
					</span>
				</template>
				<template #item-actions="{item}">
					<PkpButton
						:aria-describedby="'institution-' + item.id"
						@click="openEditModal(item.id)"
					>
						{{ t('common.edit') }}
					</PkpButton>
					<PkpButton
						:is-warnable="true"
						:aria-describedby="'institution-' + item.id"
						@click="openDeleteModal(item.id)"
					>
						{{ t('common.delete') }}
					</PkpButton>
				</template>
				<template #footer>
					<Pagination
						v-if="lastPage > 1"
						:current-page="currentPage"
						:is-loading="isLoading"
						:last-page="lastPage"
						@set-page="setPage"
					/>
				</template>
			</ListPanel>
		</slot>
	</div>
</template>

<script>
import Spinner from '@/components/Spinner/Spinner.vue';
import PkpButton from '@/components/Button/Button.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpHeader from '@/components/Header/Header.vue';
import Search from '@/components/Search/Search.vue';
import ajaxError from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog.js';
import fetch from '@/mixins/fetch';
import cloneDeep from 'clone-deep';
import InstitutionsEditModal from './InstitutionsEditModal.vue';
import {useModal} from '@/composables/useModal';

export default {
	components: {
		ListPanel,
		Pagination,
		PkpHeader,
		Search,
		Spinner,
		PkpButton,
	},
	mixins: [dialog, fetch, ajaxError],
	props: {
		/** A localized string for the button to add an institution. */
		addInstitutionLabel: {
			type: String,
			required: true,
		},
		/**  A localized string for the confirmation message before deleting an institution. */
		confirmDeleteMessage: {
			type: String,
			required: true,
		},
		/** A localized string for the button to delete an institution. */
		deleteInstitutionLabel: {
			type: String,
			required: true,
		},
		/** A localized string for the button to edit an institution. */
		editInstitutionLabel: {
			type: String,
			required: true,
		},
		/** The [Form](../?path=/docs/forms-form--docs) to edit an institution */
		form: {
			type: Object,
			required: true,
		},
		/** A unique id for this component. */
		id: {
			type: String,
			required: true,
		},
		/** An array of institutions. */
		items: {
			type: Array,
			default() {
				return [];
			},
		},
		/**  A count of all institutions in the journal, press or preprint server. */
		itemsMax: {
			type: Number,
			default() {
				return 0;
			},
		},
		/** The title of the list panel. */
		title: {
			type: String,
			required: true,
		},
	},
	emits: [
		/** Emitted when an institution is added. Payload: `(institution)` */
		'add:institution',
		/** Emitted when a prop should be changed. Payload: `(id, newProps)` */
		'set',
		/** Emitted when an institution is updated. Payload: `(institution)` */
		'update:institution',
	],
	data() {
		return {
			activeForm: null,
			activeFormTitle: '',
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
			const {closeSideModal} = useModal();
			closeSideModal(InstitutionsEditModal);
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
					this.itemsMax,
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
			const {openSideModal} = useModal();
			openSideModal(InstitutionsEditModal, {
				title: this.activeFormTitle,
				activeForm: this.activeForm,
				onUpdateForm: this.updateForm,
				onFormSuccess: this.formSuccess,
			});
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
						label: this.t('common.yes'),
						isWarnable: true,
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
										self.itemsMax,
									);
									close();
									self.setFocusIn(self.$el);
								},
							});
						},
					},
					{
						label: this.t('common.no'),
						callback: (close) => close(),
					},
				],
				modalStyle: 'negative',
			});
		},

		/**
		 * Open the modal to edit an item
		 *
		 * @param {Number} id
		 */
		openEditModal(id) {
			const institution = this.items.find(
				(institution) => institution.id === id,
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

			const {openSideModal} = useModal();
			openSideModal(InstitutionsEditModal, {
				title: this.activeFormTitle,
				activeForm: this.activeForm,
				onUpdateForm: this.updateForm,
				onFormSuccess: this.formSuccess,
			});
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

.institutionsListPanel {
	.listPanel__itemTitle {
		font-weight: @normal;
	}
}
</style>
