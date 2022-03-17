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
					<template slot="actions">
						<pkp-button
							icon="sort"
							:isActive="isOrdering"
							@click="toggleOrdering"
							v-if="
								publication.status !== getConstant('STATUS_PUBLISHED') &&
									canEditPublication
							"
							:disabled="isLoading"
						>
							{{ orderingLabel }}
						</pkp-button>
						<pkp-button
							v-if="isOrdering"
							:isWarnable="true"
							@click="cancelOrdering"
							:disabled="isLoading"
						>
							{{ __('common.cancel') }}
						</pkp-button>
						<pkp-button
							v-if="!isOrdering"
							@click="openPreviewModal"
							:disabled="isLoading"
						>
							{{ __('contributor.listPanel.preview') }}
						</pkp-button>
						<pkp-button
							v-if="
								!isOrdering &&
									publication.status !== getConstant('STATUS_PUBLISHED') &&
									canEditPublication
							"
							@click="openAddModal"
							:disabled="isLoading"
						>
							{{ addContributorLabel }}
						</pkp-button>
					</template>
				</pkp-header>
				<template v-slot:itemTitle="{item}">
					{{ item.fullName }}
					<badge v-if="item.userGroupName">
						{{ localize(item.userGroupName) }}
					</badge>
				</template>
				<template v-slot:itemSubtitle="{item}">
					{{ localize(item.affiliation) }}
				</template>
				<template
					v-if="
						publication.status !== getConstant('STATUS_PUBLISHED') &&
							canEditPublication
					"
					v-slot:itemActions="{item}"
				>
					<template v-if="isOrdering">
						<orderer
							@up="contributorItemOrderUp(item)"
							@down="contributorItemOrderDown(item)"
							:itemId="item.id"
							:itemTitle="item.title"
						/>
					</template>
					<template v-else>
						<badge
							v-if="publication.primaryContactId == item.id"
							:isPrimary="true"
						>
							{{ __('author.users.contributor.principalContact') }}
						</badge>
						<pkp-button
							v-else
							@click="setPrimaryContact(item.id)"
							:disabled="isLoading"
						>
							{{ __('author.users.contributor.setPrincipalContact') }}
						</pkp-button>
						<pkp-button @click="openEditModal(item.id)" :disabled="isLoading">
							{{ __('common.edit') }}
						</pkp-button>
						<pkp-button
							:disabled="isLoading"
							:isWarnable="true"
							@click="openDeleteModal(item.id)"
						>
							{{ __('common.delete') }}
						</pkp-button>
					</template>
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
			<modal
				:closeLabel="__('common.close')"
				name="preview"
				:title="__('submission.contributors')"
			>
				<p>
					{{ __('contributor.listPanel.preview.description') }}
				</p>
				<table class="pkpTable">
					<thead>
						<tr>
							<th>{{ __('contributor.listPanel.preview.format') }}</th>
							<th>{{ __('contributor.listPanel.preview.display') }}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{{ __('contributor.listPanel.preview.abbreviated') }}</td>
							<td>{{ publication.authorsStringShort }}</td>
						</tr>
						<tr>
							<td>
								{{ __('contributor.listPanel.preview.publicationLists') }}
							</td>
							<td>{{ publication.authorsStringIncludeInBrowse }}</td>
						</tr>
						<tr>
							<td>{{ __('contributor.listPanel.preview.full') }}</td>
							<td>{{ publication.authorsString }}</td>
						</tr>
					</tbody>
				</table>
			</modal>
		</slot>
	</div>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import Modal from '@/components/Modal/Modal.vue';
import Orderer from '@/components/Orderer/Orderer.vue';
import PkpForm from '@/components/Form/Form.vue';
import PkpHeader from '@/components/Header/Header.vue';
import ajaxError from '@/mixins/ajaxError';
import cloneDeep from 'clone-deep';

export default {
	components: {
		ListPanel,
		Modal,
		Orderer,
		PkpForm,
		PkpHeader
	},
	mixins: [ajaxError],
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
		publicationApiUrl: {
			type: String,
			required: true
		},
		publication: {
			type: Object,
			required: true
		},
		canEditPublication: {
			type: Boolean,
			required: true
		}
	},
	data() {
		return {
			activeForm: null,
			activeFormTitle: '',
			resetFocusTo: null,
			isOrdering: false,
			isLoading: false,
			itemsBeforeReordering: null
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
				? this.__('grid.action.saveOrdering')
				: this.__('grid.action.order');
		},
		apiUrl() {
			return this.publicationApiUrl + '/contributors';
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
		formSuccess(contributor) {
			if (this.activeForm.method === 'POST') {
				this.offset = 0;

				const newContributors = [...this.publication.authors];
				newContributors.push(contributor);
				this.$emit('updated:contributors', newContributors);
			} else {
				const newContributors = this.publication.authors.map(author => {
					if (author.id === contributor.id) {
						return contributor;
					}
					return author;
				});
				this.$emit('updated:contributors', newContributors);
			}
			this.$modal.hide('form');
		},

		/**
		 * Open a modal to view a preview of the contributor lists.
		 */
		openPreviewModal() {
			var self = this;

			self.isLoading = true;

			$.ajax({
				url: self.publicationApiUrl,
				type: 'GET',
				error: self.ajaxErrorCallback,
				success(r) {
					self.$emit('updated:publication', r);

					self.$modal.show('preview');
				},
				complete(r) {
					self.isLoading = false;
				}
			});
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
			this.activeFormTitle = this.addContributorLabel;
			this.$modal.show('form');
		},

		/**
		 * Open delete modal
		 *
		 * @param {Number} id
		 */
		openDeleteModal(id) {
			const contributor = this.items.find(a => a.id === id);

			this.openDialog({
				name: 'delete',
				title: this.deleteContributorLabel,
				message: this.replaceLocaleParams(this.confirmDeleteMessage, {
					name: contributor.fullName
				}),
				actions: [
					{
						label: this.abandonDecisionLabel,
						isPrimary: true,
						callback: () => {
							var self = this;

							self.isLoading = true;

							$.ajax({
								url: this.apiUrl + '/' + id,
								type: 'POST',
								headers: {
									'X-Csrf-Token': pkp.currentUser.csrfToken,
									'X-Http-Method-Override': 'DELETE'
								},
								error: self.ajaxErrorCallback,
								success(r) {
									self.$modal.hide('delete');
									self.setFocusIn(self.$el);

									const newContributors = self.publication.authors.filter(
										author => {
											return author.id !== id;
										}
									);
									self.$emit('updated:contributors', newContributors);
								},
								complete(r) {
									self.isLoading = false;
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
			var self = this;

			self.isLoading = true;

			this.resetFocusTo = document.activeElement;

			$.ajax({
				url: this.apiUrl + '/' + id,
				type: 'GET',
				error: self.ajaxErrorCallback,
				success(r) {
					var author = r;

					let activeForm = cloneDeep(self.form);
					activeForm.action = self.apiUrl + '/' + id;
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
				},
				complete(r) {
					self.isLoading = false;
				}
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
			} else {
				this.itemsBeforeReordering = this.items;
				this.isOrdering = !this.isOrdering;
			}
		},

		/**
		 * Cancel changes made by ordering items
		 */
		cancelOrdering() {
			this.$emit('updated:contributors', this.itemsBeforeReordering);

			this.itemsBeforeReordering = null;
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
			self.isLoading = true;

			$.ajax({
				url: this.apiUrl + '/saveOrder',
				type: 'PUT',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken
				},
				data: {
					sortedAuthors: this.items
				},
				success(r) {
					self.$emit('updated:contributors', self.items);
				},
				error: this.ajaxErrorCallback,
				complete() {
					self.isLoading = false;
					self.isOrdering = false;
				}
			});
		},

		/**
		 * Sets the given contributor as the primary contact
		 */
		setPrimaryContact(id) {
			let self = this;

			self.isLoading = true;

			$.ajax({
				url: this.publicationApiUrl,
				type: 'PUT',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken
				},
				data: {
					primaryContactId: id
				},
				success(r) {
					self.$emit('updated:publication', r);

					self.setFocusIn(self.$el);
				},
				error: this.ajaxErrorCallback,
				complete() {
					self.isLoading = false;
				}
			});
		},

		/**
		 * Move an item down in the list
		 *
		 * @param {Object} item The item to move
		 */
		contributorItemOrderDown(item) {
			var index = this.items.findIndex(obj => {
				return item.id == obj.id;
			});
			if (index === this.items.length - 1) {
				return;
			}
			let newItems = [...this.items];
			newItems.splice(index + 1, 0, newItems.splice(index, 1)[0]);

			this.$emit('updated:contributors', newItems);
		},

		/**
		 * Move an item up in the list
		 *
		 * @param {Object} item The item to move
		 */
		contributorItemOrderUp(item) {
			var index = this.items.findIndex(obj => {
				return item.id == obj.id;
			});
			if (index === 0) {
				return;
			}
			let newItems = [...this.items];
			newItems.splice(index - 1, 0, newItems.splice(index, 1)[0]);

			this.$emit('updated:contributors', newItems);
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
