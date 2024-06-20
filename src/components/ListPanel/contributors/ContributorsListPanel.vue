<template>
	<div class="contributorsListPanel">
		<slot>
			<list-panel
				:items="items"
				class="listPanel--contributor"
				:class="isOrdering ? '-isOrdering' : ''"
			>
				<template #header>
					<pkp-header>
						<h2>{{ title }}</h2>
						<spinner v-if="isLoading" />
						<template #actions>
							<pkp-button
								v-if="
									publication.status !== getConstant('STATUS_PUBLISHED') &&
									canEditPublication
								"
								icon="sort"
								:is-active="isOrdering"
								:disabled="isLoading"
								@click="toggleOrdering"
							>
								{{ orderingLabel }}
							</pkp-button>
							<pkp-button
								v-if="isOrdering"
								:is-warnable="true"
								:disabled="isLoading"
								@click="cancelOrdering"
							>
								{{ t('common.cancel') }}
							</pkp-button>
							<pkp-button
								v-if="!isOrdering"
								:disabled="isLoading"
								@click="openPreviewModal"
							>
								{{ i18nPreview }}
							</pkp-button>
							<pkp-button
								v-if="
									!isOrdering &&
									publication.status !== getConstant('STATUS_PUBLISHED') &&
									canEditPublication
								"
								:disabled="isLoading"
								@click="openAddModal"
							>
								{{ i18nAddContributor }}
							</pkp-button>
						</template>
					</pkp-header>
				</template>
				<template #item-title="{item}">
					{{ item.fullName }}
					<badge v-if="item.userGroupName">
						{{ localize(item.userGroupName) }}
					</badge>
				</template>
				<template #item-subtitle="{item}">
					{{ localize(item.affiliation) }}
				</template>
				<template
					v-if="
						publication.status !== getConstant('STATUS_PUBLISHED') &&
						canEditPublication
					"
					#item-actions="{item}"
				>
					<template v-if="isOrdering">
						<orderer
							:item-id="item.id"
							:item-title="item.fullName"
							@up="contributorItemOrderUp(item)"
							@down="contributorItemOrderDown(item)"
						/>
					</template>
					<template v-else>
						<badge
							v-if="publication.primaryContactId == item.id"
							:is-primary="true"
						>
							{{ i18nPrimaryContact }}
						</badge>
						<pkp-button
							v-else
							:disabled="isLoading"
							@click="setPrimaryContact(item.id)"
						>
							{{ i18nSetPrimaryContact }}
						</pkp-button>
						<pkp-button :disabled="isLoading" @click="openEditModal(item.id)">
							{{ t('common.edit') }}
						</pkp-button>
						<pkp-button
							:disabled="isLoading"
							:is-warnable="true"
							@click="openDeleteModal(item.id)"
						>
							{{ t('common.delete') }}
						</pkp-button>
					</template>
				</template>
			</list-panel>
			<modal
				:close-label="t('common.close')"
				:name="formModal"
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
			<modal
				:close-label="t('common.close')"
				:name="previewModal"
				:title="i18nContributors"
				:open="isModalOpenedPreview"
				@close="isModalOpenedPreview = false"
			>
				<p>
					{{ i18nPreviewDescription }}
				</p>
				<table class="pkpTable">
					<thead>
						<tr>
							<th>{{ i18nFormat }}</th>
							<th>{{ i18nDisplay }}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{{ i18nAbbreviated }}</td>
							<td>{{ publication.authorsStringShort }}</td>
						</tr>
						<tr>
							<td>
								{{ i18nPublicationLists }}
							</td>
							<td>{{ publication.authorsStringIncludeInBrowse }}</td>
						</tr>
						<tr>
							<td>{{ i18nFull }}</td>
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
import dialog from '@/mixins/dialog.js';
import cloneDeep from 'clone-deep';

export default {
	components: {
		ListPanel,
		Modal,
		Orderer,
		PkpForm,
		PkpHeader,
	},
	mixins: [ajaxError, dialog],
	props: {
		canEditPublication: {
			type: Boolean,
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
		title: {
			type: String,
			required: true,
		},
		publicationApiUrlFormat: {
			type: String,
			required: true,
		},
		publication: {
			type: Object,
			required: true,
		},
		i18nAbbreviated: {
			type: String,
			required: true,
		},
		i18nAddContributor: {
			type: String,
			required: true,
		},
		i18nConfirmDelete: {
			type: String,
			required: true,
		},
		i18nContributors: {
			type: String,
			required: true,
		},
		i18nDisplay: {
			type: String,
			required: true,
		},
		i18nDeleteContributor: {
			type: String,
			required: true,
		},
		i18nEditContributor: {
			type: String,
			required: true,
		},
		i18nFormat: {
			type: String,
			required: true,
		},
		i18nFull: {
			type: String,
			required: true,
		},
		i18nPreview: {
			type: String,
			required: true,
		},
		i18nPreviewDescription: {
			type: String,
			required: true,
		},
		i18nPrimaryContact: {
			type: String,
			required: true,
		},
		i18nPublicationLists: {
			type: String,
			required: true,
		},
		i18nSaveOrder: {
			type: String,
			required: true,
		},
		i18nSetPrimaryContact: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			activeForm: null,
			activeFormTitle: '',
			isOrdering: false,
			isLoading: false,
			itemsBeforeReordering: null,
			isModalOpenedForm: false,
			isModalOpenedPreview: false,
		};
	},
	computed: {
		/**
		 * URL to the API endpoint for the current publication's contributors.
		 */
		contributorsApiUrl() {
			return this.publicationApiUrlFormat.replace(
				'__publicationId__',
				this.publication.id + '/contributors',
			);
		},

		/**
		 * Unique ID for the form modal
		 */
		formModal() {
			return this.id + 'form';
		},

		/**
		 * Unique ID for the preview modal
		 */
		previewModal() {
			return this.id + 'preview';
		},

		/**
		 * URL to the API endpoint for the current publication
		 */
		publicationApiUrl() {
			return this.publicationApiUrlFormat.replace(
				'__publicationId__',
				this.publication.id,
			);
		},

		/**
		 * Return the appropriate label for the ordering button depending on
		 * if we're ordering or not.
		 *
		 * @return {String}
		 */
		orderingLabel() {
			return this.isOrdering ? this.i18nSaveOrder : this.t('common.order');
		},
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
		closeFormModal(event) {
			this.isModalOpenedForm = false;
			this.activeForm = null;
			this.activeFormTitle = '';
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
				const newContributors = this.publication.authors.map((author) => {
					if (author.id === contributor.id) {
						return contributor;
					}
					return author;
				});
				this.$emit('updated:contributors', newContributors);
			}
			this.closeFormModal();

			this.getAndUpdatePublication();
		},

		/**
		 * Open a modal to view a preview of the contributor lists.
		 */
		openPreviewModal() {
			this.isLoading = true;

			this.getAndUpdatePublication(() => {
				this.isModalOpenedPreview = true;
			});
		},

		/**
		 * Open the modal to add an item
		 */
		openAddModal() {
			let activeForm = cloneDeep(this.form);
			activeForm.action = this.contributorsApiUrl;
			activeForm.method = 'POST';
			this.activeForm = activeForm;
			this.activeFormTitle = this.i18nAddContributor;
			this.isModalOpenedForm = true;
		},

		/**
		 * Open delete modal
		 *
		 * @param {Number} id
		 */
		openDeleteModal(id) {
			const contributor = this.items.find((a) => a.id === id);

			this.openDialog({
				name: 'delete',
				title: this.i18nDeleteContributor,
				message: this.replaceLocaleParams(this.i18nConfirmDelete, {
					name: contributor.fullName,
				}),
				actions: [
					{
						label: this.i18nDeleteContributor,
						isWarnable: true,
						callback: (close) => {
							this.isLoading = true;

							$.ajax({
								url: this.contributorsApiUrl.replace(
									'/contributors',
									'/contributors/' + id,
								),
								type: 'POST',
								context: this,
								headers: {
									'X-Csrf-Token': pkp.currentUser.csrfToken,
									'X-Http-Method-Override': 'DELETE',
								},
								error: this.ajaxErrorCallback,
								success(r) {
									close();
									this.setFocusIn(this.$el);

									const newContributors = this.publication.authors.filter(
										(author) => {
											return author.id !== id;
										},
									);
									this.$emit('updated:contributors', newContributors);

									this.getAndUpdatePublication();
								},
								complete(r) {
									this.isLoading = false;
								},
							});
						},
					},
					{
						label: this.t('common.cancel'),
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
			this.isLoading = true;
			const apiUrl = this.contributorsApiUrl.replace(
				'/contributors',
				'/contributors/' + id,
			);

			$.ajax({
				url: apiUrl,
				type: 'GET',
				error: this.ajaxErrorCallback,
				context: this,
				success(author) {
					let activeForm = cloneDeep(this.form);
					activeForm.action = apiUrl;
					activeForm.method = 'PUT';
					activeForm.fields = activeForm.fields.map((field) => {
						if (field.name === 'orcid') {
							field.orcid = author['orcid'] ?? '';
							field.authorId = author['id'];
							field.isVerified = author['orcidIsVerified'] ?? false;
						} else if (Object.keys(author).includes(field.name)) {
							field.value = author[field.name];
						}
						return field;
					});
					this.activeForm = activeForm;
					this.activeFormTitle = this.i18nEditContributor;
					this.isModalOpenedForm = true;
				},
				complete(r) {
					this.isLoading = false;
				},
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

			this.getAndUpdatePublication();
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

			this.isLoading = true;

			$.ajax({
				url: this.contributorsApiUrl.replace(
					'/contributors',
					'/contributors/saveOrder',
				),
				context: this,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'PUT',
				},
				data: {
					sortedAuthors: this.items,
				},
				success(contributors) {
					this.$emit('updated:contributors', contributors);

					this.getAndUpdatePublication();
				},
				error: this.ajaxErrorCallback,
				complete() {
					this.isLoading = false;
					this.isOrdering = false;
				},
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
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'PUT',
				},
				data: {
					primaryContactId: id,
				},
				success(r) {
					self.$emit('updated:publication', r);

					self.setFocusIn(self.$el);
				},
				error: this.ajaxErrorCallback,
				complete() {
					self.isLoading = false;
				},
			});
		},

		/**
		 * Move an item down in the list
		 *
		 * @param {Object} item The item to move
		 */
		contributorItemOrderDown(item) {
			var index = this.items.findIndex((obj) => {
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
			var index = this.items.findIndex((obj) => {
				return item.id == obj.id;
			});
			if (index === 0) {
				return;
			}
			let newItems = [...this.items];
			newItems.splice(index - 1, 0, newItems.splice(index, 1)[0]);

			this.$emit('updated:contributors', newItems);
		},

		/**
		 * Update the publication in the background so that
		 * any author strings are updated
		 */
		getAndUpdatePublication(onComplete = () => {}) {
			$.ajax({
				url: this.publicationApiUrl,
				context: this,
				type: 'GET',
				success(publication) {
					this.$emit('updated:publication', publication);

					onComplete();
				},
				complete() {
					this.isLoading = false;
					this.isOrdering = false;
				},
			});
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.listPanel--contributor.-isOrdering {
	.listPanel__item {
		padding: 0;
	}

	.listPanel__itemIdentity {
		padding: 0.75rem 1rem;
		padding-inline-end: 8rem;
	}

	.orderer__dragDrop {
		display: none;
	}

	.listPanel__itemSummary {
		margin-inline-end: 8rem;
	}
}
</style>
