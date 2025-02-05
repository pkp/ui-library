<template>
	<div class="contributorsListPanel">
		<slot>
			<ListPanel
				:items="items"
				class="listPanel--contributor"
				:class="isOrdering ? '-isOrdering' : ''"
			>
				<template #header>
					<PkpHeader>
						<h2>{{ title }}</h2>
						<Spinner v-if="isLoading" />
						<template #actions>
							<PkpButton
								v-if="
									publication.status !== getConstant('STATUS_PUBLISHED') &&
									canEditPublication
								"
								icon="Sort"
								:is-active="isOrdering"
								:disabled="isLoading"
								@click="toggleOrdering"
							>
								{{ orderingLabel }}
							</PkpButton>
							<PkpButton
								v-if="isOrdering"
								:is-warnable="true"
								:disabled="isLoading"
								@click="cancelOrdering"
							>
								{{ t('common.cancel') }}
							</PkpButton>
							<PkpButton
								v-if="!isOrdering"
								:disabled="isLoading"
								@click="openPreviewModal"
							>
								{{ t('contributor.listPanel.preview') }}
							</PkpButton>
							<PkpButton
								v-if="
									!isOrdering &&
									publication.status !== getConstant('STATUS_PUBLISHED') &&
									canEditPublication
								"
								:disabled="isLoading"
								@click="openAddModal"
							>
								{{ t('grid.action.addContributor') }}
							</PkpButton>
						</template>
					</PkpHeader>
				</template>
				<template #item-title="{item}">
					<div class="whitespace-normal text-justify">
						{{ item.fullName }}
						<Badge v-if="item.userGroupName">
							{{ localize(item.userGroupName) }}
						</Badge>
					</div>
				</template>
				<template #item-subtitle="{item}">
					<div class="whitespace-normal text-justify">
						{{ localize(item.affiliation) }}
					</div>
				</template>
				<template
					v-if="
						publication.status !== getConstant('STATUS_PUBLISHED') &&
						canEditPublication
					"
					#item-actions="{item}"
				>
					<template v-if="isOrdering">
						<Orderer
							:item-id="item.id"
							:item-title="item.fullName"
							@up="contributorItemOrderUp(item)"
							@down="contributorItemOrderDown(item)"
						/>
					</template>
					<template v-else>
						<Badge
							v-if="publication.primaryContactId == item.id"
							:is-primary="true"
						>
							{{ t('author.users.contributor.principalContact') }}
						</Badge>
						<PkpButton
							v-else
							:disabled="isLoading"
							@click="setPrimaryContact(item.id)"
						>
							{{ t('author.users.contributor.setPrincipalContact') }}
						</PkpButton>
						<PkpButton :disabled="isLoading" @click="openEditModal(item.id)">
							{{ t('common.edit') }}
						</PkpButton>
						<PkpButton
							:disabled="isLoading"
							:is-warnable="true"
							@click="openDeleteModal(item.id)"
						>
							{{ t('common.delete') }}
						</PkpButton>
					</template>
				</template>
			</ListPanel>
		</slot>
	</div>
</template>

<script>
import Spinner from '@/components/Spinner/Spinner.vue';
import PkpButton from '@/components/Button/Button.vue';
import Badge from '@/components/Badge/Badge.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import Orderer from '@/components/Orderer/Orderer.vue';
import PkpHeader from '@/components/Header/Header.vue';
import ContributorsPreviewModal from './ContributorsPreviewModal.vue';
import ContributorsEditModal from './ContributorsEditModal.vue';

import ajaxError from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog.js';
import cloneDeep from 'clone-deep';
import {useModal} from '@/composables/useModal';

export default {
	components: {
		Spinner,
		PkpButton,
		Badge,
		ListPanel,
		Orderer,
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
	},
	data() {
		return {
			activeForm: null,
			activeFormTitle: '',
			isOrdering: false,
			isLoading: false,
			itemsBeforeReordering: null,
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
			return this.isOrdering
				? this.t('grid.action.saveOrdering')
				: this.t('common.order');
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
			const {closeSideModal} = useModal();
			closeSideModal(ContributorsEditModal);
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
				const {openSideModal} = useModal();
				openSideModal(ContributorsPreviewModal, {
					publication: this.publication,
				});
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
			this.activeFormTitle = this.t('grid.action.addContributor');
			const {openSideModal} = useModal();

			openSideModal(ContributorsEditModal, {
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
			const contributor = this.items.find((a) => a.id === id);

			this.openDialog({
				name: 'delete',
				title: this.t('grid.action.deleteContributor'),
				message: this.t('grid.action.deleteContributor.confirmationMessage', {
					name: contributor.fullName,
				}),
				actions: [
					{
						label: this.t('grid.action.deleteContributor'),
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
				modalStyle: 'negative',
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
							field.orcidDisplayValue = author['orcidDisplayValue'];
							field.isVerified = author['orcidIsVerified'] ?? false;
							field.orcidVerificationRequested =
								author['orcidVerificationRequested'];
						} else if (field.name === 'affiliations') {
							field.authorId = author['id'];
							field.value = author[field.name];
						} else if (Object.keys(author).includes(field.name)) {
							field.value = author[field.name];
						}
						return field;
					});
					this.activeForm = activeForm;
					this.activeFormTitle = this.t('grid.action.edit');
					const {openSideModal} = useModal();
					openSideModal(ContributorsEditModal, {
						title: this.activeFormTitle,
						activeForm: this.activeForm,
						onUpdateForm: this.updateForm,
						onFormSuccess: this.formSuccess,
					});
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
