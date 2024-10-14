<template>
	<div class="reviewerSuggestionsListPanel">
		<slot>
			<ListPanel :items="items" class="listPanel--reviewerSuggestions">
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
								:disabled="isLoading"
								@click="openAddModal"
							>
								{{ t('grid.action.addReviewerSuggestion') }}
							</PkpButton>
						</template>
					</PkpHeader>
				</template>

				<template #item-title="{item}">
					{{ localize(item.fullName) }} {{ item.email }}
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
					<template>
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
// import Badge from '@/components/Badge/Badge.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import PkpHeader from '@/components/Header/Header.vue';
import ReviewerSuggestionsEditModal from './ReviewerSuggestionsEditModal.vue';

import ajaxError from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog.js';
import cloneDeep from 'clone-deep';
import {useModal} from '@/composables/useModal';

export default {
	components: {
		Spinner,
		PkpButton,
		// Badge,
		ListPanel,
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
		reviewerSuggestionsApiUrl: {
			type: String,
			required: true,
		},
		submission: {
			type: Object,
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
			isLoading: false,
			itemsBeforeReordering: null,
		};
	},
	computed: {
		/**
		 * Unique ID for the form modal
		 */
		formModal() {
			return this.id + 'form';
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
			closeSideModal(ReviewerSuggestionsEditModal);
			this.activeForm = null;
			this.activeFormTitle = '';
		},

		/**
		 * The add/edit form has been successfully
		 * submitted.
		 *
		 * @param {Object} item
		 */
		formSuccess(reviewerSuggestion) {
			console.log(this.submission.reviewerSuggestions);
			if (this.activeForm.method === 'POST') {
				this.offset = 0;

				const newReviewerSuggestions = [...this.submission.reviewerSuggestions];
				newReviewerSuggestions.push(reviewerSuggestion);
				this.$emit('updated:reviewerSuggestions', newReviewerSuggestions);
			} else {
				const newReviewerSuggestions = this.submission.reviewerSuggestions.map(
					(suggestion) => {
						if (suggestion.id === reviewerSuggestion.id) {
							return reviewerSuggestion;
						}
						return suggestion;
					},
				);
				this.$emit('updated:reviewerSuggestions', newReviewerSuggestions);
			}
			this.closeFormModal();

			// this.getAndUpdatePublication();
		},

		/**
		 * Open the modal to add an item
		 */
		openAddModal() {
			let activeForm = cloneDeep(this.form);
			activeForm.action = this.reviewerSuggestionsApiUrl;
			activeForm.method = 'POST';
			this.activeForm = activeForm;
			this.activeFormTitle = this.t('grid.action.addReviewerSuggestion');
			const {openSideModal} = useModal();

			openSideModal(ReviewerSuggestionsEditModal, {
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
			const reviewerSuggestion = this.items.find((a) => a.id === id);

			this.openDialog({
				name: 'delete',
				title: this.t('grid.action.deleteReviewerSuggestion'),
				message: this.t(
					'grid.action.deleteReviewerSuggestion.confirmationMessage',
					{
						name: reviewerSuggestion.familyName,
					},
				),
				actions: [
					{
						label: this.t('grid.action.deleteReviewerSuggestion'),
						isWarnable: true,
						callback: (close) => {
							this.isLoading = true;

							$.ajax({
								url: this.reviewerSuggestionsApiUrl + '/' + id,
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

									const newReviewerSuggestions =
										this.submission.reviewerSuggestions.filter(
											(reviewerSuggestion) => {
												return reviewerSuggestion.id !== id;
											},
										);
									this.$emit(
										'updated:reviewerSuggestions',
										newReviewerSuggestions,
									);

									// this.getAndUpdatePublication();
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
			const apiUrl = this.reviewerSuggestionsApiUrl + '/' + id;

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
							field.orcidVerificationRequested =
								author['orcidVerificationRequested'];
						} else if (Object.keys(author).includes(field.name)) {
							field.value = author[field.name];
						}
						return field;
					});
					this.activeForm = activeForm;
					this.activeFormTitle = this.t('grid.action.edit');
					const {openSideModal} = useModal();
					openSideModal(ReviewerSuggestionsEditModal, {
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
		 * Update the publication in the background so that
		 * any author strings are updated
		 */
		// TODO : Probably not needed here?
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
