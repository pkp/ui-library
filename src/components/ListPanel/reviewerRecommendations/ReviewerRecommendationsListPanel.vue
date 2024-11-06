<template>
	<div class="reviewerRecommendationsListPanel">
		<slot>
			<ListPanel :items="items">
				<template #header>
					<PkpHeader>
						<h2>{{ title }}</h2>
						<Spinner v-if="isLoading" />
						<template #actions>
							<PkpButton @click="openAddModal">
								{{ addRecommendationLabel }}
							</PkpButton>
						</template>
					</PkpHeader>
				</template>
				<template #item-title="{item}">
					{{ localize(item.title) }}
					<Badge v-bind="item.status ? {isPrimary: true} : {isWarnable: true}">
						{{ item.status ? t('common.active') : t('common.inactive') }}
					</Badge>
				</template>
				<template #item-actions="{item}">
					<PkpButton @click="openEditModal(item.id)">
						{{ t('common.edit') }}
					</PkpButton>
					<PkpButton
						v-if="item.removable"
						:is-warnable="true"
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
import PkpButton from '@/components/Button/Button.vue';
import Badge from '@/components/Badge/Badge.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpHeader from '@/components/Header/Header.vue';
import ajaxError from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog.js';
import fetch from '@/mixins/fetch';
import cloneDeep from 'clone-deep';
import ReviewerRecommendationsEditModal from './ReviewerRecommendationsEditModal.vue';
import {useModal} from '@/composables/useModal';

export default {
	components: {
		PkpButton,
		Spinner,
		ListPanel,
		Pagination,
		PkpHeader,
		Badge,
	},
	mixins: [dialog, fetch, ajaxError],
	props: {
		/** A localized string for the button to add an recommendation. */
		addRecommendationLabel: {
			type: String,
			required: true,
		},
		/** A localized string for the confirmation message before deleting an recommendation. */
		confirmDeleteMessage: {
			type: String,
			required: true,
		},
		/** A localized string for the button to delete an recommendation. */
		deleteRecommendationLabel: {
			type: String,
			required: true,
		},
		/** A localized string for the button to edit an recommendation. */
		editRecommendationLabel: {
			type: String,
			required: true,
		},
		/** The Form to edit an recommendation. */
		form: {
			type: Object,
			required: true,
		},
		/** A unique id for this component. */
		id: {
			type: String,
			required: true,
		},
		/** An array of recommendations. */
		items: {
			type: Array,
			default() {
				return [];
			},
		},
		/** A count of all recommendations in the journal, press or preprint server. */
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
		/** Emitted when an recommendation is added. Payload: `(recommendation)` */
		'add:recommendation',
		/** Emitted when a prop should be changed. Payload: `(id, newProps)` */
		'set',
		/** Emitted when an recommendation is updated. Payload: `(recommendation)` */
		'update:recommendation',
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

			closeSideModal(ReviewerRecommendationsEditModal);
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
				pkp.eventBus.$emit('add:recommendation', item);
			} else {
				this.setItems(
					this.items.map((i) => (i.id === item.id ? item : i)),
					this.itemsMax,
				);
				pkp.eventBus.$emit('update:recommendation', item);
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
			this.activeFormTitle = this.addRecommendationLabel;

			const {openSideModal} = useModal();

			openSideModal(ReviewerRecommendationsEditModal, {
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
			const recommendation = this.items.find((a) => a.id === id);
			if (typeof recommendation === 'undefined') {
				this.ajaxErrorCallback({});
				return;
			}
			this.openDialog({
				name: 'delete',
				title: this.deleteRecommendationLabel,
				message: this.replaceLocaleParams(this.confirmDeleteMessage, {
					title: this.localize(recommendation.title),
				}),
				actions: [
					{
						label: this.t('common.yes'),
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
			const recommendation = this.items.find(
				(recommendation) => recommendation.id === id,
			);
			if (!recommendation) {
				this.ajaxErrorCallback({});
				return;
			}

			let activeForm = cloneDeep(this.form);
			activeForm.action = this.apiUrl + '/' + id;
			activeForm.method = 'PUT';
			activeForm.fields = activeForm.fields.map((field) => {
				if (Object.keys(recommendation).includes(field.name)) {
					field.value = recommendation[field.name];
				}
				return field;
			});
			this.activeForm = activeForm;
			this.activeFormTitle = this.editRecommendationLabel;

			const {openSideModal} = useModal();

			openSideModal(ReviewerRecommendationsEditModal, {
				title: this.editRecommendationLabel,
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

.reviewerRecommendationsListPanel {
	.listPanel__item {
		padding-top: 0.25rem;
		padding-bottom: 0.25rem;
	}

	.listPanel__itemTitle {
		font-weight: @normal;
	}
}
</style>
