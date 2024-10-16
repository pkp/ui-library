<template>
	<div class="highlightsListPanel" :class="{'-isOrdering': isOrdering}">
		<slot>
			<ListPanel :items="items">
				<template #header>
					<PkpHeader>
						<h2>{{ title }}</h2>
						<Spinner v-if="isLoading" />
						<template #actions>
							<PkpButton
								v-if="!isOrdering"
								:is-active="isOrdering"
								:disabled="isLoading"
								@click="isOrdering = true"
							>
								{{ t('common.order') }}
							</PkpButton>
							<template v-else>
								<PkpButton
									:is-active="true"
									:disabled="isLoading"
									@click="saveOrder"
								>
									{{ i18nSaveOrder }}
								</PkpButton>
								<PkpButton
									:is-warnable="true"
									:disabled="isLoading"
									@click="isOrdering = false"
								>
									{{ t('common.cancel') }}
								</PkpButton>
							</template>
							<PkpButton :disabled="isOrdering" @click="openAddModal">
								{{ i18nAdd }}
							</PkpButton>
						</template>
					</PkpHeader>
				</template>
				<template #item-title="{item}">
					{{ localize(item.title) }}
				</template>
				<template #item-actions="{item}">
					<Orderer
						v-if="isOrdering"
						:item-id="item.id"
						:item-title="localize(item.title)"
						@up="orderUp(item)"
						@down="orderDown(item)"
					></Orderer>
					<PkpButton v-if="!isOrdering" @click="openEditModal(item.id)">
						{{ t('common.edit') }}
					</PkpButton>
					<PkpButton
						v-if="!isOrdering"
						:is-warnable="true"
						@click="openDeleteModal(item.id)"
					>
						{{ t('common.delete') }}
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
import Orderer from '@/components/Orderer/Orderer.vue';
import HighlightsEditModal from './HighlightsEditModal.vue';
import ajaxError from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog.js';
import fetch from '@/mixins/fetch';
import cloneDeep from 'clone-deep';
import {useModal} from '@/composables/useModal';

export default {
	components: {
		ListPanel,
		PkpHeader,
		Orderer,
		PkpButton,
		Spinner,
	},
	mixins: [dialog, fetch, ajaxError],
	props: {
		/** The URL to the REST API endpoint for highlights. */
		apiUrl: {type: String, required: true},
		/** The [Form](../?path=/docs/forms-form--docs) to edit a highlight. */
		form: {
			type: Object,
			required: true,
		},
		/**  A localized string for the button to add a highlight. */
		i18nAdd: {
			type: String,
			required: true,
		},
		/** A localized string for the confirmation message before deleting a highlight. */
		i18nConfirmDelete: {
			type: String,
			required: true,
		},
		/** A localized string for the button to delete a highlight. */
		i18nDelete: {
			type: String,
			required: true,
		},
		/** A localized string for the button to edit a highlight. */
		i18nEdit: {
			type: String,
			required: true,
		},
		i18nSaveOrder: {
			type: String,
			required: true,
		},
		/** A unique id for this component. */
		id: {
			type: String,
			required: true,
		},
		/** An array of highlights. */
		items: {
			type: Array,
			default() {
				return [];
			},
		},
		/** A count of all highlights in the journal, press or preprint server, or in the site for site-level highlights. */
		itemsMax: {type: Number, required: true},
		/** The title of the list panel. */
		title: {
			type: String,
			required: true,
		},
	},
	emits: [
		/** [Event Bus](http://localhost:8080/#/pages/event-bus) | Emitted when a highlight is added. Payload: `(highlight)` */
		'add:highligh',
		/** Component | Emitted when a prop should be changed. Payload: `(id, newProps)`  */
		'set',
		/** [Event Bus](http://localhost:8080/#/pages/event-bus) | Emitted when a highlight is updated. Payload: `(highlight)` */
		'update:highlight',
	],
	data() {
		return {
			activeForm: null,
			activeFormTitle: '',
			isLoading: false,
			isOrdering: false,
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
			closeSideModal(HighlightsEditModal);
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
				pkp.eventBus.$emit('add:highlight', item);
			} else {
				this.setItems(
					this.items.map((i) => (i.id === item.id ? item : i)),
					this.itemsMax,
				);
				pkp.eventBus.$emit('update:highlight', item);
			}
			const {closeSideModal} = useModal();
			closeSideModal(HighlightsEditModal);
		},

		/**
		 * Open the modal to add an item
		 */
		openAddModal() {
			let activeForm = cloneDeep(this.form);
			activeForm.action = this.apiUrl;
			activeForm.method = 'POST';
			this.activeForm = activeForm;
			this.activeFormTitle = this.i18nAdd;
			const {openSideModal} = useModal();
			openSideModal(HighlightsEditModal, {
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
			const highlight = this.items.find((a) => a.id === id);
			if (typeof highlight === 'undefined') {
				this.ajaxErrorCallback({});
				return;
			}
			this.openDialog({
				name: 'delete',
				title: this.i18nDelete,
				message: this.replaceLocaleParams(this.i18nConfirmDelete, {
					title: this.localize(highlight.title),
				}),
				actions: [
					{
						label: this.t('common.yes'),
						isWarnable: true,
						callback: (close) => {
							$.ajax({
								url: this.apiUrl + '/' + id,
								type: 'POST',
								headers: {
									'X-Csrf-Token': pkp.currentUser.csrfToken,
									'X-Http-Method-Override': 'DELETE',
								},
								error: this.ajaxErrorCallback,
								success: (r) => {
									this.setItems(
										this.items.filter((i) => i.id !== id),
										this.itemsMax,
									);
									close();
									this.setFocusIn(this.$el);
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
			const highlight = this.items.find((highlight) => highlight.id === id);
			if (!highlight) {
				this.ajaxErrorCallback({});
				return;
			}

			let activeForm = cloneDeep(this.form);
			activeForm.action = this.apiUrl + '/' + id;
			activeForm.method = 'PUT';
			activeForm.fields = activeForm.fields.map((field) => {
				if (Object.keys(highlight).includes(field.name)) {
					field.value = highlight[field.name];
				}
				return field;
			});
			this.activeForm = activeForm;
			this.activeFormTitle = this.i18nEdit;
			const {openSideModal} = useModal();
			openSideModal(HighlightsEditModal, {
				title: this.activeFormTitle,
				activeForm: this.activeForm,
				onUpdateForm: this.updateForm,
				onFormSuccess: this.formSuccess,
			});
		},

		/**
		 * Move an item down in the list
		 *
		 * @param {Object} item The item to move
		 */
		orderDown(item) {
			var index = this.items.findIndex((obj) => {
				return item.id == obj.id;
			});
			if (index === this.items.length - 1) {
				return;
			}
			let newItems = [...this.items];
			newItems.splice(index + 1, 0, newItems.splice(index, 1)[0]);

			this.setItems(newItems, newItems.length);
		},

		/**
		 * Move an item up in the list
		 *
		 * @param {Object} item The item to move
		 */
		orderUp(item) {
			var index = this.items.findIndex((obj) => {
				return item.id == obj.id;
			});
			if (index === 0) {
				return;
			}
			let newItems = [...this.items];
			newItems.splice(index - 1, 0, newItems.splice(index, 1)[0]);

			this.setItems(newItems, newItems.length);
		},

		/**
		 * Save the order of items
		 */
		saveOrder() {
			this.isLoading = true;

			let sequence = 0;
			for (const item of this.items) {
				item.sequence = sequence;
				sequence++;
			}

			$.ajax({
				url: this.apiUrl + '/order',
				type: 'POST',
				context: this,
				data: {
					sequence: this.items.map(({id, sequence}) => ({id, sequence})),
				},
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'PUT',
				},
				error: this.ajaxErrorCallback,
				success: (r) => {
					this.setItems(r.items, r.itemsMax);
				},
				complete: () => {
					this.isLoading = false;
					this.isOrdering = false;
				},
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

.highlightsListPanel {
	.listPanel__item {
		padding-top: 0.25rem;
		padding-bottom: 0.25rem;
	}

	.listPanel__itemTitle {
		font-weight: @normal;
	}

	&.-isOrdering {
		.listPanel__item {
			padding: 0;
		}

		.listPanel__itemIdentity {
			padding: 0.55rem 1rem;
			padding-inline-end: 8rem;
		}

		.orderer__dragDrop {
			display: none;
		}

		.listPanel__itemSummary {
			margin-inline-end: 8rem;
		}
	}
}
</style>
