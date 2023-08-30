<template>
	<div class="highlightsListPanel" :class="{'-isOrdering': isOrdering}">
		<slot>
			<list-panel :items="items">
				<pkp-header slot="header">
					<h2>{{ title }}</h2>
					<spinner v-if="isLoading" />
					<template slot="actions">
						<pkp-button
							v-if="!isOrdering"
							icon="sort"
							:isActive="isOrdering"
							@click="isOrdering = true"
							:disabled="isLoading"
						>
							{{ __('common.order') }}
						</pkp-button>
						<template v-else>
							<pkp-button
								icon="sort"
								:isActive="true"
								@click="saveOrder"
								:disabled="isLoading"
							>
								{{ i18nSaveOrder }}
							</pkp-button>
							<pkp-button
								:isWarnable="true"
								:disabled="isLoading"
								@click="isOrdering = false"
							>
								{{ __('common.cancel') }}
							</pkp-button>
						</template>
						<pkp-button :disabled="isOrdering" @click="openAddModal">
							{{ i18nAdd }}
						</pkp-button>
					</template>
				</pkp-header>
				<template v-slot:item-title="{item}">
					{{ localize(item.title) }}
				</template>
				<template v-slot:item-actions="{item}">
					<orderer
						v-if="isOrdering"
						:itemId="item.id"
						:itemTitle="localize(item.title)"
						@up="orderUp(item)"
						@down="orderDown(item)"
					></orderer>
					<pkp-button v-if="!isOrdering" @click="openEditModal(item.id)">
						{{ __('common.edit') }}
					</pkp-button>
					<pkp-button
						v-if="!isOrdering"
						:isWarnable="true"
						@click="openDeleteModal(item.id)"
					>
						{{ __('common.delete') }}
					</pkp-button>
				</template>
			</list-panel>
			<modal
				:closeLabel="__('common.close')"
				name="form"
				:title="activeFormTitle"
				@closed="formModalClosed"
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
import PkpForm from '@/components/Form/Form.vue';
import PkpHeader from '@/components/Header/Header.vue';
import Modal from '@/components/Modal/Modal.vue';
import Orderer from '@/components/Orderer/Orderer.vue';
import ajaxError from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog.js';
import fetch from '@/mixins/fetch';
import cloneDeep from 'clone-deep';

export default {
	components: {
		ListPanel,
		PkpForm,
		PkpHeader,
		Modal,
		Orderer,
	},
	mixins: [dialog, fetch, ajaxError],
	props: {
		form: {
			type: Object,
			required: true,
		},
		i18nAdd: {
			type: String,
			required: true,
		},
		i18nConfirmDelete: {
			type: String,
			required: true,
		},
		i18nDelete: {
			type: String,
			required: true,
		},
		i18nEdit: {
			type: String,
			required: true,
		},
		i18nSaveOrder: {
			type: String,
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
		title: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			activeForm: null,
			activeFormTitle: '',
			isLoading: false,
			isOrdering: false,
			resetFocusTo: null,
		};
	},
	methods: {
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
					this.itemsMax
				);
				pkp.eventBus.$emit('update:highlight', item);
			}
			this.$modal.hide('form');
		},

		/**
		 * Open the modal to add an item
		 */
		openAddModal() {
			this.resetFocusTo = document.activeElement;
			let activeForm = cloneDeep(this.form);
			activeForm.action = this.apiUrl;
			activeForm.method = 'POST';
			this.activeForm = activeForm;
			this.activeFormTitle = this.i18nAdd;
			this.$modal.show('form');
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
						label: this.__('common.yes'),
						isPrimary: true,
						callback: () => {
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
										this.itemsMax
									);
									this.$modal.hide('delete');
									this.setFocusIn(this.$el);
								},
							});
						},
					},
					{
						label: this.__('common.no'),
						isWarnable: true,
						callback: () => this.$modal.hide('delete'),
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
			this.resetFocusTo = document.activeElement;

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
			this.$modal.show('form');
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
