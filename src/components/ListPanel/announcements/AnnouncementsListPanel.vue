<template>
	<div class="announcementsListPanel">
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
								{{ addAnnouncementLabel }}
							</PkpButton>
						</template>
					</PkpHeader>
				</template>
				<template #item-title="{item}">
					{{ localize(item.title) }}
				</template>
				<template #item-actions="{item}">
					<PkpButton element="a" :href="item.url">
						{{ t('common.view') }}
					</PkpButton>
					<PkpButton @click="openEditModal(item.id)">
						{{ t('common.edit') }}
					</PkpButton>
					<PkpButton :is-warnable="true" @click="openDeleteModal(item.id)">
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
import PkpButton from '@/components/Button/Button.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpHeader from '@/components/Header/Header.vue';
import Search from '@/components/Search/Search.vue';
import ajaxError from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog.js';
import fetch from '@/mixins/fetch';
import cloneDeep from 'clone-deep';
import AnnouncementsEditModal from './AnnouncementsEditModal.vue';
import {useModal} from '@/composables/useModal';

export default {
	components: {
		PkpButton,
		Spinner,
		ListPanel,
		Pagination,
		PkpHeader,
		Search,
	},
	mixins: [dialog, fetch, ajaxError],
	props: {
		/** A localized string for the button to add an announcement. */
		addAnnouncementLabel: {
			type: String,
			required: true,
		},
		/** A localized string for the confirmation message before deleting an announcement. */
		confirmDeleteMessage: {
			type: String,
			required: true,
		},
		/** A localized string for the button to delete an announcement. */
		deleteAnnouncementLabel: {
			type: String,
			required: true,
		},
		/** A localized string for the button to edit an announcement. */
		editAnnouncementLabel: {
			type: String,
			required: true,
		},
		/** The Form to edit an announcement. */
		form: {
			type: Object,
			required: true,
		},
		/** A unique id for this component. */
		id: {
			type: String,
			required: true,
		},
		/** An array of announcements. */
		items: {
			type: Array,
			default() {
				return [];
			},
		},
		/** A count of all announcements in the journal, press or preprint server. */
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
		/** Emitted when an announcement is added. Payload: `(announcement)` */
		'add:announcement',
		/** Emitted when a prop should be changed. Payload: `(id, newProps)` */
		'set',
		/** Emitted when an announcement is updated. Payload: `(announcement)` */
		'update:announcement',
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
		 * @param {Object} event
		 */
		closeFormModal(event) {
			this.activeForm = null;
			this.activeFormTitle = '';
			const {closeSideModal} = useModal();

			closeSideModal(AnnouncementsEditModal);
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
				pkp.eventBus.$emit('add:announcement', item);
			} else {
				this.setItems(
					this.items.map((i) => (i.id === item.id ? item : i)),
					this.itemsMax,
				);
				pkp.eventBus.$emit('update:announcement', item);
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
			this.activeFormTitle = this.addAnnouncementLabel;

			const {openSideModal} = useModal();

			openSideModal(AnnouncementsEditModal, {
				title: this.activeFormTitle,
				activeForm,
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
			const announcement = this.items.find((a) => a.id === id);
			if (typeof announcement === 'undefined') {
				this.ajaxErrorCallback({});
				return;
			}
			this.openDialog({
				name: 'delete',
				title: this.deleteAnnouncementLabel,
				message: this.replaceLocaleParams(this.confirmDeleteMessage, {
					title: this.localize(announcement.title),
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
			const announcement = this.items.find(
				(announcement) => announcement.id === id,
			);
			if (!announcement) {
				this.ajaxErrorCallback({});
				return;
			}

			let activeForm = cloneDeep(this.form);
			activeForm.action = this.apiUrl + '/' + id;
			activeForm.method = 'PUT';
			activeForm.fields = activeForm.fields.map((field) => {
				if (Object.keys(announcement).includes(field.name)) {
					field.value = announcement[field.name];
				}
				return field;
			});
			this.activeForm = activeForm;
			this.activeFormTitle = this.editAnnouncementLabel;

			const {openSideModal} = useModal();

			openSideModal(AnnouncementsEditModal, {
				title: this.editAnnouncementLabel,
				activeForm,
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

.announcementsListPanel {
	.listPanel__item {
		padding-top: 0.25rem;
		padding-bottom: 0.25rem;
	}

	.listPanel__itemTitle {
		font-weight: @normal;
	}
}
</style>
