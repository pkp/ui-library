<template>
	<div data-cy="reviewer-recommendation-list-panel">
		<PkpTable aria-label="Reviewer recommendations list">
			<template #label>
				<h3 class="text-3xl-bold">
					{{ title }}
				</h3>
			</template>

			<template #top-controls>
				<div class="flex space-x-2">
					<PkpButton @click="openAddModal">
						{{ addRecommendationLabel }}
					</PkpButton>
				</div>
			</template>

			<TableHeader>
				<TableColumn>{{ recommendationNameTitle }}</TableColumn>
				<TableColumn>{{ recommendationStatusTitle }}</TableColumn>
				<TableColumn></TableColumn>
			</TableHeader>

			<TableBody>
				<TableRow v-for="item in items" :key="item.id">
					<TableCell :is-row-header="true">
						<span
							v-strip-unsafe-html="localize(item.title)"
							class="text-lg-normal"
						></span>
					</TableCell>

					<TableCell>
						<label>
							<input
								class="text-blue-900 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-5 w-5 rounded focus:ring-2"
								type="checkbox"
								:name="`recommendation_status[]`"
								:value="item.id"
								:checked="item.status"
								@click.prevent="
									(event) => openStatusToggleConfirmationModal(item.id, event)
								"
							/>
						</label>
					</TableCell>

					<TableCell>
						<DropdownActions
							v-if="item.removable"
							:actions="getActions(item)"
							:label="t('reviewer.recommendation.management.options')"
							button-variant="ellipsis"
							direction="left"
							@action="(actionName) => handleAction(actionName, item)"
						/>
					</TableCell>
				</TableRow>
			</TableBody>
		</PkpTable>
	</div>
</template>

<script>
import PkpTable from '@/components/Table/Table.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';
import PkpButton from '@/components/Button/Button.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import ajaxError from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog.js';
import fetch from '@/mixins/fetch';
import cloneDeep from 'clone-deep';
import ReviewerRecommendationsEditModal from './ReviewerRecommendationsEditModal.vue';

import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {sanitizeHtml} from '@/directives/stripUnsafeHtml';

const {t} = useLocalize();

export default {
	components: {
		PkpTable,
		TableColumn,
		TableHeader,
		TableBody,
		TableRow,
		TableCell,
		PkpButton,
		DropdownActions,
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
		/** A localized string for title when activating the recommendation on modal confirmation. */
		activateTitle: {
			type: String,
			required: true,
		},
		/** A localized string to confirm activating recommendation. */
		confirmActivateMessage: {
			type: String,
			required: true,
		},
		/** A localized string for title when deactivating the recommendation on modal confirmation. */
		deactivateTitle: {
			type: String,
			required: true,
		},
		/** A localized string to confirm deactivating recommendation. */
		confirmDeactivateMessage: {
			type: String,
			required: true,
		},
		/** A localized string as the heading title of recommendation name/title in table header. */
		recommendationNameTitle: {
			type: String,
			required: true,
		},
		/** A localized string as the heading title of recommendation status in table header. */
		recommendationStatusTitle: {
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
			isLoading: false,
			activeForm: null,
			activeFormTitle: '',
		};
	},
	methods: {
		/**
		 * Get the actions for recommendation items
		 *
		 * @param {Object} recommendation
		 */
		getActions(recommendation) {
			let actions = [
				{
					label: t('common.edit'),
					name: 'openEditModal',
					icon: 'Edit',
				},
			];

			if (recommendation.removable) {
				actions.push({
					label: t('common.delete'),
					name: 'openDeleteModal',
					icon: 'Cancel',
					isWarnable: true,
				});
			}

			return actions;
		},

		/**
		 * Handle action on recommendation item
		 *
		 * @param {String} actionName
		 * @param {Object} recommendation
		 */
		handleAction(actionName, recommendation) {
			this[actionName](recommendation.id);
		},

		/**
		 * Show the confirmation modal to activate/deactivate recommendation
		 *
		 * @param {Number} id
		 * @param {Object} event
		 */
		openStatusToggleConfirmationModal(id, event) {
			const recommendation = this.items.find((a) => a.id === id);

			if (typeof recommendation === 'undefined') {
				this.ajaxErrorCallback({});
				return;
			}

			this.openDialog({
				name: 'edit',
				title: recommendation.status
					? this.deactivateTitle
					: this.activateTitle,
				message: this.replaceLocaleParams(
					recommendation.status
						? this.confirmDeactivateMessage
						: this.confirmActivateMessage,
					{
						title: sanitizeHtml(this.localize(recommendation.title)),
					},
				),
				actions: [
					{
						label: this.t('common.yes'),
						isPrimary: true,
						callback: (close) => {
							var self = this;
							$.ajax({
								url: this.apiUrl + '/' + id + '/status',
								type: 'POST',
								headers: {
									'X-Csrf-Token': pkp.currentUser.csrfToken,
									'X-Http-Method-Override': 'PUT',
								},
								data: {
									status: Number(!recommendation.status),
								},
								error: self.ajaxErrorCallback,
								success: function (r) {
									self.items.forEach((item) => {
										if (item.id == recommendation.id) {
											item.status = Number(!recommendation.status);
											$(event.target).prop('checked', !recommendation.status);
										}
									});
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
					title: sanitizeHtml(this.localize(recommendation.title)),
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
