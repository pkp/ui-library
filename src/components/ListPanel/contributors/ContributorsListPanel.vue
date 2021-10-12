<template>
	<div class="contributorsListPanel">
		<slot>
			<list-panel
				:items="items"
				class="listPanel--contributor"
				:class="isOrdering ? '-isOrdering' : ''"
			>
				<pkp-header slot="header">
					<h2>{{ title }}</h2>
					<spinner v-if="isLoading" />
					<template
						slot="actions"
						v-if="publication.status !== getConstant('STATUS_PUBLISHED')"
					>
						<pkp-button
							class="listPanel--contributor__orderToggle"
							icon="sort"
							:isActive="isOrdering"
							@click="toggleOrdering"
						>
							{{ __('common.order') }}
						</pkp-button>
						<pkp-button
							v-if="isOrdering"
							class="listPanel--contributor__orderCancel"
							:isWarnable="true"
							@click="cancelOrdering"
						>
							{{ __('common.cancel') }}
						</pkp-button>
						<pkp-button v-if="!isOrdering" @click="$modal.show('preview')">
							Preview
						</pkp-button>
						<pkp-button v-if="!isOrdering" @click="openAddModal">
							{{ addContributorLabel }}
						</pkp-button>
					</template>
				</pkp-header>
				<template v-slot:itemTitle="{item}">
					{{ localize(item.givenName) }} {{ localize(item.familyName) }}
					<badge>
						{{ item.userGroupLabel }}
					</badge>
				</template>
				<template v-slot:itemSubtitle="{item}">
					{{ localize(item.affiliation) }}
				</template>
				<template
					v-if="publication.status !== getConstant('STATUS_PUBLISHED')"
					v-slot:itemActions="{item}"
				>
					<template v-if="isOrdering">
						<orderer
							@up="$emit('order-up', item)"
							@down="$emit('order-down', item)"
							:itemId="item.id"
							:itemTitle="item.title"
						/>
					</template>
					<template v-else>
						<badge v-if="primaryAuthorId == item.id" :isPrimary="true">
							{{ __('author.users.contributor.principalContact') }}
						</badge>
						<pkp-button
							v-else
							class="listPanel--contributor__setPrimaryContact"
							@click="setPrimaryContact(item.id)"
						>
							{{ __('author.users.contributor.setPrincipalContact') }}
						</pkp-button>
						<pkp-button @click="openEditModal(item.id)">
							{{ __('common.edit') }}
						</pkp-button>
						<pkp-button :isWarnable="true" @click="openDeleteModal(item.id)">
							{{ __('common.delete') }}
						</pkp-button>
					</template>
				</template>
			</list-panel>
			<modal v-bind="MODAL_PROPS" name="form" @closed="formModalClosed">
				<modal-content
					:closeLabel="__('common.close')"
					modalName="form"
					:title="activeFormTitle"
				>
					<pkp-form
						v-bind="activeForm"
						@set="updateForm"
						@success="formSuccess"
					/>
				</modal-content>
			</modal>
			<modal v-bind="MODAL_PROPS" name="preview">
				<modal-content
					:closeLabel="__('common.close')"
					modalName="preview"
					title="List of Contributors"
				>
					<p>
						Contributors to this publication will be identified in this journal
						in the following formats.
					</p>
					<table class="pkpTable">
						<thead>
							<tr>
								<th>Format</th>
								<th>Display</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Abbreviated</td>
								<td>{{ publication.authorsStringShort }}</td>
							</tr>
							<tr>
								<td>Publication Lists</td>
								<td>{{ publication.authorsStringIncludeInBrowse }}</td>
							</tr>
							<tr>
								<td>Full</td>
								<td>{{ publication.authorsString }}</td>
							</tr>
						</tbody>
					</table>
				</modal-content>
			</modal>
		</slot>
	</div>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import PkpForm from '@/components/Form/Form.vue';
import PkpHeader from '@/components/Header/Header.vue';
import ajaxError from '@/mixins/ajaxError';
import fetch from '@/mixins/fetch';
import modal from '@/mixins/modal';
import cloneDeep from 'clone-deep';
import Orderer from '@/components/Orderer/Orderer.vue';

export default {
	components: {
		ListPanel,
		PkpForm,
		PkpHeader,
		Orderer
	},
	mixins: [fetch, modal, ajaxError],
	props: {
		addContributorLabel: {
			type: String,
			required: true
		},
		confirmDeleteMessage: {
			type: String,
			required: true
		},
		deleteContributorLabel: {
			type: String,
			required: true
		},
		editContributorLabel: {
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
		title: {
			type: String,
			required: true
		},
		primaryAuthorId: {
			type: Number,
			required: true
		},
		publicationApiUrl: {
			type: String,
			required: true
		},
		publication: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			activeForm: null,
			activeFormTitle: '',
			resetFocusTo: null,
			isOrdering: false
		};
	},
	computed: {
		/**
		 * Return the appropriate label for the ordering button depending on
		 * if we're ordering or not.
		 *
		 * @return {String}
		 */
		orderingLabel() {
			return this.isOrdering
				? this.__('grid.action.order')
				: this.__('grid.action.order');
		},
		sourceUrl() {
			return this.apiUrl.replace('__publicationId__', this.publication.id);
		}
	},
	methods: {
		/**
		 * Helper method to access a global constant in the template
		 *
		 * @return {Object}
		 */
		getConstant(constant) {
			return pkp.const[constant];
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
		 * The add/edit form has been successfully
		 * submitted.
		 *
		 * @param {Object} item
		 */
		formSuccess(item) {
			if (this.activeForm.method === 'POST') {
				this.offset = 0;
				this.$emit('added', item);
			} else {
				// this.setItems(
				// 	this.items.map(i => (i.id === item.id ? item : i)),
				// 	this.itemsMax
				// );
				this.$emit('edited', item);
			}
			this.$modal.hide('form');
		},

		/**
		 * Open the modal to add an item
		 */
		openAddModal() {
			this.resetFocusTo = document.activeElement;
			let activeForm = cloneDeep(this.form);
			activeForm.action = this.sourceUrl;
			activeForm.method = 'POST';
			this.activeForm = activeForm;
			this.activeFormTitle = this.addContributorLabel;
			this.$modal.show('form');
		},

		/**
		 * Open delete modal
		 *
		 * @param {Number} id
		 */
		openDeleteModal(id) {
			const author = this.items.find(a => a.id === id);
			if (typeof author === 'undefined') {
				this.openDialog({
					confirmLabel: this.__('common.ok'),
					modalName: 'unknownError',
					message: this.__('common.unknownError'),
					title: this.__('common.error'),
					callback: () => {
						this.$modal.hide('unknownError');
					}
				});
				return;
			}
			this.openDialog({
				cancelLabel: this.__('common.no'),
				modalName: 'delete',
				title: this.deleteContributorLabel,
				message: this.replaceLocaleParams(this.confirmDeleteMessage, {
					title: this.localize(author.title)
				}),
				callback: () => {
					var self = this;
					$.ajax({
						url: this.sourceUrl + '/' + id,
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
							self.$emit('deleted', author);
						}
					});
				}
			});
		},

		/**
		 * Open the modal to edit an item
		 *
		 * @param {Number} id
		 */
		openEditModal(id) {
			var self = this;

			this.resetFocusTo = document.activeElement;

			$.ajax({
				url: this.sourceUrl + '/' + id,
				type: 'GET',
				error: self.ajaxErrorCallback,
				success: function(r) {
					var author = r;

					if (!author) {
						self.openDialog({
							confirmLabel: self.__('common.ok'),
							modalName: 'unknownError',
							message: self.__('common.unknownError'),
							callback: () => {
								self.$modal.hide('unknownError');
							}
						});
					}

					let activeForm = cloneDeep(self.form);
					activeForm.action = self.sourceUrl + '/' + id;
					activeForm.method = 'PUT';
					activeForm.fields = activeForm.fields.map(field => {
						if (Object.keys(author).includes(field.name)) {
							field.value = author[field.name];
						}
						return field;
					});
					self.activeForm = activeForm;
					self.activeFormTitle = self.editContributorLabel;
					self.$modal.show('form');
				}
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
		},

		/**
		 * Toggle the ordering and save a new order
		 */
		toggleOrdering() {
			if (this.isOrdering) {
				this.setItemOrderSequence();
			}
			this.isOrdering = !this.isOrdering;
		},

		/**
		 * Cancel changes made by ordering items
		 */
		cancelOrdering() {
			this.isOrdering = false;
		},

		/**
		 * Update the order sequence property for items in this list based on
		 * the new order of items
		 */
		setItemOrderSequence() {
			let seq = 0;
			for (const item of this.items) {
				item.seq = seq;
				seq++;
			}

			let self = this;
			this.isLoading = true;

			$.ajax({
				url: this.sourceUrl + '/saveOrder',
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken
				},
				data: {
					sortedAuthors: this.items
				},
				success: function(r) {
					self.$emit('contributors-order-changed', r);
				},
				error(r) {
					self.ajaxErrorCallback(r);
				},
				complete() {
					self.isLoading = false;
				}
			});
		},

		/**
		 * Sets the given contributor as the primary contact
		 */
		setPrimaryContact(id) {
			this.isLoading = true;

			let self = this;

			$.ajax({
				url: this.publicationApiUrl + '/' + this.publication.id,
				type: 'PUT',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken
				},
				data: {
					primaryContactId: id
				},
				success: function(r) {
					self.$emit('primary-contact-changed', r);
				},
				error(r) {
					self.ajaxErrorCallback(r);
				},
				complete() {
					self.isLoading = false;
				}
			});
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.listPanel--contributor.-isOrdering {
	.listPanel__item {
		padding: 0;
	}

	.listPanel__itemIdentity {
		padding: 0.75rem 8rem 0.75rem 1rem;
	}

	.orderer__dragDrop {
		display: none;
	}

	.listPanel__itemSummary {
		margin-right: 8rem;
	}
}
</style>
