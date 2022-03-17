<template>
	<div class="announcementsListPanel">
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
							{{ addAnnouncementLabel }}
						</pkp-button>
					</template>
				</pkp-header>
				<template v-slot:itemTitle="{item}">
					{{ localize(item.title) }}
				</template>
				<template v-slot:itemActions="{item}">
					<pkp-button element="a" :href="urlBase.replace('__id__', item.id)">
						{{ __('common.view') }}
					</pkp-button>
					<pkp-button @click="openEditModal(item.id)">
						{{ __('common.edit') }}
					</pkp-button>
					<pkp-button :isWarnable="true" @click="openDeleteModal(item.id)">
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
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpForm from '@/components/Form/Form.vue';
import PkpHeader from '@/components/Header/Header.vue';
import Modal from '@/components/Modal/Modal.vue';
import Search from '@/components/Search/Search.vue';
import ajaxError from '@/mixins/ajaxError';
import fetch from '@/mixins/fetch';
import cloneDeep from 'clone-deep';

export default {
	components: {
		ListPanel,
		Pagination,
		PkpForm,
		PkpHeader,
		Modal,
		Search
	},
	mixins: [fetch, ajaxError],
	props: {
		addAnnouncementLabel: {
			type: String,
			required: true
		},
		confirmDeleteMessage: {
			type: String,
			required: true
		},
		deleteAnnouncementLabel: {
			type: String,
			required: true
		},
		editAnnouncementLabel: {
			type: String,
			required: true
		},
		form: {
			type: Object,
			required: true
		},
		id: {
			type: String,
			required: true
		},
		items: {
			type: Array,
			default() {
				return [];
			}
		},
		itemsMax: {
			type: Number,
			default() {
				return 0;
			}
		},
		title: {
			type: String,
			required: true
		},
		urlBase: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			activeForm: null,
			activeFormTitle: '',
			resetFocusTo: null
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
				pkp.eventBus.$emit('add:announcement', item);
			} else {
				this.setItems(
					this.items.map(i => (i.id === item.id ? item : i)),
					this.itemsMax
				);
				pkp.eventBus.$emit('update:announcement', item);
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
			this.activeFormTitle = this.addAnnouncementLabel;
			this.$modal.show('form');
		},

		/**
		 * Open delete modal
		 *
		 * @param {Number} id
		 */
		openDeleteModal(id) {
			const announcement = this.items.find(a => a.id === id);
			if (typeof announcement === 'undefined') {
				this.ajaxErrorCallback({});
				return;
			}
			this.openDialog({
				name: 'delete',
				title: this.deleteAnnouncementLabel,
				message: this.replaceLocaleParams(this.confirmDeleteMessage, {
					title: this.localize(announcement.title)
				}),
				actions: [
					{
						label: this.__('common.yes'),
						isPrimary: true,
						callback: () => {
							var self = this;
							$.ajax({
								url: this.apiUrl + '/' + id,
								type: 'POST',
								headers: {
									'X-Csrf-Token': pkp.currentUser.csrfToken,
									'X-Http-Method-Override': 'DELETE'
								},
								error: self.ajaxErrorCallback,
								success: function(r) {
									self.setItems(
										self.items.filter(i => i.id !== id),
										self.itemsMax
									);
									self.$modal.hide('delete');
									self.setFocusIn(self.$el);
								}
							});
						}
					},
					{
						label: this.__('common.no'),
						isWarnable: true,
						callback: () => this.$modal.hide('delete')
					}
				]
			});
		},

		/**
		 * Open the modal to edit an item
		 *
		 * @param {Number} id
		 */
		openEditModal(id) {
			this.resetFocusTo = document.activeElement;

			const announcement = this.items.find(
				announcement => announcement.id === id
			);
			if (!announcement) {
				this.ajaxErrorCallback({});
				return;
			}

			let activeForm = cloneDeep(this.form);
			activeForm.action = this.apiUrl + '/' + id;
			activeForm.method = 'PUT';
			activeForm.fields = activeForm.fields.map(field => {
				if (Object.keys(announcement).includes(field.name)) {
					field.value = announcement[field.name];
				}
				return field;
			});
			this.activeForm = activeForm;
			this.activeFormTitle = this.editAnnouncementLabel;
			this.$modal.show('form');
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
				itemsMax
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
			Object.keys(data).forEach(function(key) {
				activeForm[key] = data[key];
			});
			this.activeForm = activeForm;
		}
	}
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
