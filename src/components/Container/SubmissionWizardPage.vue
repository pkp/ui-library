<script type="text/javascript">
import Page from '@/components/Container/Page.vue';
import ButtonRow from '../ButtonRow/ButtonRow.vue';
import ContributorsListPanel from '../ListPanel/contributors/ContributorsListPanel.vue';
import File from '../File/File.vue';
import Modal from '../Modal/Modal.vue';
import SubmissionFilesListPanel from '../ListPanel/submissionFiles/SubmissionFilesListPanel.vue';
import ajaxError from '@/mixins/ajaxError';
import autosave from '@/mixins/autosave';
import dialog from '@/mixins/dialog';
import localizeMoment from '@/mixins/localizeMoment';
import localizeSubmission from '@/mixins/localizeSubmission';
import localStorage from '@/mixins/localStorage';
import moment from 'moment';

export default {
	extends: Page,
	mixins: [
		ajaxError,
		autosave,
		dialog,
		localizeMoment,
		localizeSubmission,
		localStorage,
	],
	components: {
		ButtonRow,
		ContributorsListPanel,
		File,
		Modal,
		SubmissionFilesListPanel,
	},
	data() {
		return {
			autosavesKeyBase: 'submitAutosaves',
			categories: {},
			currentStepId: '',
			errors: {},
			isValidating: false,
			lastAutosavedMessage: '',
			publication: {},
			publicationApiUrl: '',
			reconfigurePublicationProps: [],
			reconfigureSubmissionProps: [],
			staleForms: [],
			startedSteps: [],
			steps: [],
			submission: {},
			submissionApiUrl: '',
			submissionSavedUrl: '',
			submissionWizardUrl: '',
			submitApiUrl: '',
			i18nConfirmSubmit: '',
			i18nDiscardChanges: '',
			i18nDisconnected: '',
			i18nLastAutosaved: '',
			i18nPageTitle: '',
			i18nSubmit: '',
			i18nTitleSeparator: '',
			i18nUnableToSave: '',
			i18nUnsavedChanges: '',
			i18nUnsavedChangesMessage: '',
			isModalOpenedConfig: false,
		};
	},
	computed: {
		/**
		 * A unique key for autosaves stored in local storage
		 *
		 * This should be unique to each submission so that autosaves
		 * for two different submissions do not collide.
		 */
		autosavesKey() {
			return this.autosavesKeyBase + this.submission.id;
		},

		/**
		 * Can the user submit?
		 *
		 * Check whether the user is connected, all required data is
		 * present, and any confirmation fields are ticked.
		 */
		canSubmit() {
			return (
				!this.isAutosaving &&
				!this.isDisconnected &&
				this.isValid &&
				this.isConfirmed
			);
		},

		/**
		 * The titles of the selected category ids
		 */
		currentCategoryTitles() {
			return this.publication.categoryIds
				.filter((id) => !!this.categories[id])
				.map((id) => this.categories[id]);
		},

		/**
		 * The currently active step
		 */
		currentStep() {
			return this.steps.find((step) => step.id === this.currentStepId);
		},

		/**
		 * The index of the currently active step
		 * in the steps array
		 */
		currentStepIndex() {
			return this.steps.findIndex((step) => step.id === this.currentStepId);
		},

		/**
		 * Are all confirmation fields checked?
		 */
		isConfirmed() {
			const hasUnconfirmedField = this.steps
				.find((step) => step.id === 'review')
				?.sections.find((section) => section.id === 'confirmSubmission')
				?.form.fields.map(
					(field) => field.component !== 'field-options' || field.value
				)
				.includes(false);
			return !hasUnconfirmedField;
		},

		/**
		 * Is the current step the first step?
		 */
		isOnFirstStep() {
			return !this.currentStepIndex;
		},

		/**
		 * Is the current step the last step?
		 */
		isOnLastStep() {
			return this.currentStepIndex === this.steps.length - 1;
		},

		/**
		 * Are there any validation errors?
		 */
		isValid() {
			return Object.keys(this.errors).length === 0;
		},

		/**
		 * The title to show at the top of the page
		 */
		pageTitle() {
			if (!this.currentStep) {
				return '';
			}
			return this.i18nPageTitle.replace('{$step}', this.currentStep.name);
		},
	},
	methods: {
		/**
		 * Add stale forms that need to be autosaved
		 */
		addAutosaves() {
			// Don't autosave if no form data has been changed
			if (!this.staleForms.length) {
				return;
			}

			while (this.staleForms.length) {
				const formId = this.staleForms.splice(0, 1)[0];
				const form = this.$refs.autosaveForms.find((ref) => ref.id === formId);
				if (!form) {
					return;
				}
				this.addAutosave(form.id, form.action, {...form.submitValues});
			}
		},

		/**
		 * Add a step change to the browser history so the
		 * user can use the browser's back button
		 *
		 * @param {Object} step The step to add
		 */
		addHistory(step) {
			window.history.pushState({}, step.name, '#' + step.id);
		},

		/**
		 * A callback function fired when an autosave fails
		 *
		 * If we fail to connect to the server (0) or receive a
		 * 500 server error, we assume that this problem will
		 * eventually be resolved. No action is required.
		 *
		 * If we get a 403 authorization error, we assume that
		 * the user's login or CSRF token has expired and ask
		 * them to reload/login again.
		 *
		 * Otherwise, the problem is probably with the request,
		 * in which case we must delete the invalid autosave
		 * payload and ask the user to reload the page.
		 *
		 * @param {Object} autosave The autosave payload, with the form id at payload.id
		 * @param {jqXHR} xhr jQuery XHR, a superset of XMLHttpRequest
		 * @param {String} status See `error` docs at https://api.jquery.com/jquery.ajax
		 */
		autosaveErrored(autosave, xhr, status) {
			if ([0, 500].includes(xhr.status)) {
				return;
			}

			if (xhr.status !== 403) {
				let autosaves = this.getLocalStorage(this.autosavesKey);
				if (autosaves.length) {
					this.setLocalStorage(
						this.autosavesKey,
						autosaves.filter((payload) => payload.id !== autosave.id)
					);
				}
			}

			this.isDisconnected = true;
			this.ajaxErrorCallback({});
		},

		/**
		 * A callback function fired when the autosave
		 * is complete. Use this to sync the response
		 * data with the submission and publication
		 * objects in data()
		 *
		 * @param {Object} autosave The autosave payload
		 * @param {Object} response The server response, usually the object that was saved
		 */
		autosaveSucceeded(autosave, response) {
			if (response.submissionId) {
				this.publication = response;
			} else if (response.dateSubmitted) {
				this.submission = response;
			}
		},

		/**
		 * Get an author's name and affiliation separated
		 * by a comma
		 *
		 * @param {Object} author An author object
		 * @return {String}
		 */
		getAuthorName(author) {
			let affiliation = this.localize(author.affiliation);
			if (affiliation) {
				return [author.fullName, affiliation].join(
					pkp.localeKeys['common.commaListSeparator']
				);
			}
			return author.fullName;
		},

		/**
		 * Get the page's <title> tag for a step
		 *
		 * This gets the title used in the HTML <head> so that the
		 * browser updates the page title as the user navigates the
		 * wizard. This is used in the browser's history.
		 *
		 * @param {Object} step The step just opened
		 * @return {String}
		 */
		getPageTitle(step) {
			return document.title
				.split(this.i18nTitleSeparator)
				.map((part, i) => {
					return i ? part : this.i18nPageTitle.replace('{$step}', step.name);
				})
				.join(this.i18nTitleSeparator);
		},

		/**
		 * Go to the next step or submit if this is the last step
		 */
		nextStep() {
			if (this.isOnLastStep) {
				this.submit();
			} else {
				this.openStep(this.steps[1 + this.currentStepIndex].id);
			}
		},

		/**
		 * Show a pop-up when save for later fails
		 */
		openSaveForLaterFailed() {
			this.openDialog({
				name: 'saveForLaterFailed',
				title: this.i18nDisconnected,
				message: this.i18nUnableToSave,
				actions: [
					{
						label: this.__('common.ok'),
						callback: (close) => close(),
					},
				],
			});
		},

		/**
		 * Go to a step in the wizard
		 *
		 * @param {String} stepId
		 */
		openStep(stepId) {
			const newStep = this.steps.find((step) => step.id === stepId);
			if (!newStep) {
				return;
			}
			this.currentStepId = stepId;
		},

		/**
		 * Handle changes to the #hash in the URL
		 *
		 * This makes sure that the the correct step
		 * is opened when the hash is changed
		 */
		openUrlHash() {
			const stepId = window.location.hash.replace('#', '');
			const newStep = this.steps.find((step) => step.id === stepId);
			this.openStep(newStep ? newStep.id : this.steps[0].id);
		},

		/**
		 * Go to the previous step in the wizard
		 */
		previousStep() {
			const previousIndex = this.currentStepIndex - 1;
			if (previousIndex >= 0) {
				this.openStep(this.steps[previousIndex].id);
			}
		},

		/**
		 * This method is fired when the form to reconfigure
		 * a submission is saved
		 *
		 * Splits the properties that need to be saved to the
		 * publication or submission object and makes the save
		 * requests.
		 *
		 * @param {Object} values The form data
		 */
		reconfigureSubmission(values) {
			const getData = (data, prop) => {
				if (typeof values[prop] !== undefined) {
					data[prop] = values[prop];
				}
				return data;
			};
			const submissionData = this.reconfigureSubmissionProps.reduce(
				getData,
				{}
			);
			const publicationData = this.reconfigurePublicationProps.reduce(
				getData,
				{}
			);

			$.ajax({
				url: this.submissionApiUrl,
				method: 'POST',
				context: this,
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'PUT',
				},
				data: submissionData,
				error: this.ajaxErrorCallback,
				success(r) {
					if (!Object.keys(publicationData).length) {
						window.location.reload();
						return;
					}
					$.ajax({
						url: this.publicationApiUrl,
						method: 'POST',
						context: this,
						headers: {
							'X-Csrf-Token': pkp.currentUser.csrfToken,
							'X-Http-Method-Override': 'PUT',
						},
						data: publicationData,
						error: this.ajaxErrorCallback,
						success(r) {
							window.location.reload();
						},
					});
				},
			});
		},

		/**
		 * Save the submission for later
		 *
		 * Make sure all autosaves that are outstanding
		 * get saved first.
		 */
		saveForLater() {
			this.isLoading = true;

			this.addAutosaves();

			const waitForSaves = setInterval(() => {
				if (this.isAutosaving) {
					return;
				}
				if (this.isDisconnected) {
					clearInterval(waitForSaves);
					this.isLoading = false;
					this.openSaveForLaterFailed();
					return;
				}
				$.ajax({
					url: this.submissionApiUrl + '/saveForLater',
					method: 'POST',
					context: this,
					headers: {
						'X-Csrf-Token': pkp.currentUser.csrfToken,
						'X-Http-Method-Override': 'PUT',
					},
					data: {
						step: this.startedSteps[this.startedSteps.length - 1],
					},
					error() {
						this.isLoading = false;
						this.openSaveForLaterFailed();
					},
					success() {
						window.location = this.submissionSavedUrl;
					},
				});
				clearInterval(waitForSaves);
			}, 1000);
		},

		/**
		 * Update the message for when the last autosave occurred
		 */
		setLastAutosaveMessage() {
			if (!this.lastSavedTimestamp) {
				this.lastAutosavedMessage = '';
				return;
			}
			this.lastAutosavedMessage = this.i18nLastAutosaved.replace(
				'{$when}',
				moment(this.lastSavedTimestamp)
					.locale(this.getMomentLocale($.pkp.app.currentLocale))
					.fromNow()
			);
		},

		/**
		 * Update the contributors in the submission
		 */
		setContributors(newContributors) {
			this.publication.authors = newContributors;
		},

		/**
		 * Update the publication in the submission
		 */
		setPublication(newPublication) {
			this.publication = newPublication;
		},

		/**
		 * Complete the submission
		 *
		 * Opens a confirmation dialog and then makes the submission
		 * request with any required confirmation fields
		 */
		submit() {
			this.openDialog({
				name: 'submitConfirmation',
				title: this.i18nSubmit,
				message: this.i18nConfirmSubmit.replace(
					'{$title}',
					this.localize(this.publication.title)
				),
				actions: [
					{
						label: this.i18nSubmit,
						isPrimary: true,
						callback: (close) => {
							const confirmData = this.steps
								.find((step) => step.id === 'review')
								?.sections.find((section) => section.type === 'confirm')
								?.form.fields.filter(
									(field) => field.component === 'field-options' && field.value
								)
								.reduce(
									(data, field) => ({...data, [field.name]: field.value}),
									{}
								);
							$.ajax({
								url: this.submitApiUrl,
								context: this,
								method: 'POST',
								data: confirmData,
								headers: {
									'X-Csrf-Token': pkp.currentUser.csrfToken,
									'X-Http-Method-Override': 'PUT',
								},
								error(r) {
									if (!r.responseJSON) {
										this.ajaxErrorCallback();
									} else {
										this.errors = r.responseJSON;
									}
									close();
								},
								success() {
									window.location = this.submissionWizardUrl;
								},
							});
						},
					},
					{
						label: this.__('common.cancel'),
						isWarnable: true,
						callback: (close) => close(),
					},
				],
			});
		},

		/**
		 * Apply an autosave that was stored in local
		 * storage instead of saved
		 *
		 * Updates any forms of state data that is outdated
		 *
		 * @param {Object} payload The payload with autosave data
		 */
		restoreStoredAutosave(payload) {
			let form;
			const dataKeys = Object.keys(payload.data);
			this.steps.forEach((step) => {
				step.sections.forEach((section) => {
					if (section.type !== 'form' || section.form.id !== payload.id) {
						return;
					}
					form = section.form;
				});
			});
			if (!form) {
				return;
			}
			this.updateForm(payload.id, {
				fields: form.fields.map((field) => {
					if (!dataKeys.includes(field.name)) {
						return field;
					}
					return {
						...field,
						value: payload.data[field.name],
					};
				}),
			});
		},

		/**
		 * Update an autosave form
		 *
		 * @param {String} formId
		 * @param {Object} data
		 */
		updateAutosaveForm(formId, data) {
			this.updateForm(formId, data);
			if (this.staleForms.indexOf(formId) === -1) {
				this.staleForms.push(formId);
			}
		},

		/**
		 * Update a form with new data
		 *
		 * This is fired every time a form field changes, so
		 * resource-intensive code should not be run every
		 * time this method is called.
		 *
		 * @param {String} formId
		 * @param {Object} data
		 */
		updateForm(formId, data) {
			this.steps.forEach((step, stepIndex) => {
				step.sections.forEach((section, sectionIndex) => {
					if (section.type !== 'form' || section.form.id !== formId) {
						return;
					}
					this.steps[stepIndex].sections[sectionIndex].form = {
						...this.steps[stepIndex].sections[sectionIndex].form,
						...data,
					};
				});
			});
		},

		/**
		 * Validate the submission details
		 *
		 * Always wait for autosaves to complete before
		 * trying to validate
		 */
		validate() {
			this.isValidating = true;
			this.errors = {};

			const waitForSaves = setInterval(() => {
				if (this.isAutosaving || this.isDisconnected) {
					return;
				}
				clearInterval(waitForSaves);

				$.ajax({
					url: this.submitApiUrl,
					method: 'POST',
					context: this,
					headers: {
						'X-Csrf-Token': pkp.currentUser.csrfToken,
						'X-Http-Method-Override': 'PUT',
					},
					data: {
						_validateOnly: true,
					},
					error(r) {
						if (!r.responseJSON) {
							this.ajaxErrorCallback();
						} else {
							this.errors = r.responseJSON;
						}
					},
					success(r) {
						this.errors = {};
					},
					complete() {
						this.isValidating = false;
					},
				});
			}, 500);
		},
	},
	watch: {
		/**
		 * Update when the step changes
		 */
		currentStepIndex(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}

			// Add forms to be autosaved
			this.addAutosaves();

			// Update the list of steps that have been started
			this.steps.forEach((step, i) => {
				if (
					!this.startedSteps.includes(step.id) &&
					i <= this.currentStepIndex
				) {
					this.startedSteps.push(step.id);
				}
			});

			// Track step changes in the title and browser history
			const step = this.steps[newVal];
			document.title = this.getPageTitle(step);
			if (step.id !== window.location.hash.replace('#', '')) {
				this.addHistory(step);
			}

			// Trigger validation on the review step
			if (newVal === this.steps.length - 1) {
				this.validate();
			}
		},

		/**
		 * Set form data when validation errors are changed
		 */
		errors(newVal, oldVal) {
			const keys = Object.keys(newVal);
			this.steps.forEach((step, stepIndex) => {
				step.sections.forEach((section, sectionIndex) => {
					if (section.type === 'form') {
						section.form.fields.forEach((field) => {
							if (keys.includes(field.name)) {
								this.steps[stepIndex].sections[sectionIndex].form.errors = {
									...this.steps[stepIndex].sections[sectionIndex].form.errors,
									...{[field.name]: newVal[field.name]},
								};
							}
						});
					}
				});
			});

			pkp.eventBus.$emit('submission:submit:errors', newVal, this);
		},

		/**
		 * Update the last autosave message as soon
		 * as autosave finishes
		 */
		isAutosaving(newVal, oldVal) {
			if (!newVal && oldVal) {
				this.setLastAutosaveMessage();
			}
		},
	},
	created() {
		/**
		 * Open the correct step when the page is loaded
		 */
		if (!window.location.hash) {
			const newStep = this.steps.find(
				(step) => step.id === this.submission.submissionProgress
			);
			this.openStep(newStep ? newStep.id : this.steps[0].id);
		} else {
			this.openStep(this.steps[0].id);
		}

		/**
		 * Regularly update the last saved message
		 * so it shows an accurate time
		 */
		setInterval(this.setLastAutosaveMessage, 3000);
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.submissionWizard .app__pageHeading {
	display: flex;
	margin: 2rem 0 0.25rem;

	> .pkpButton {
		margin-inline-start: auto;
	}
}

.submissionWizard__steps {
	margin-top: 2rem;
}

.submissionWizard .pkpSteps__buttonWrapper {
	border: @bg-border-light;
	border-radius: @radius;
	margin-bottom: 2rem;
}

.submissionWizard__submissionDetails,
.submissionWizard__submissionConfiguration {
	font-size: @font-sml;
	line-height: @line-sml;
}

// Override the form locale switcher styles
.submissionWizard__stepForm .pkpFormLocales {
	border: none;
	margin-top: -1rem;
	margin-bottom: 1rem;
	padding-right: 0;

	.pkpFormLocales__locale--isPrimary {
		border: none;
	}
}

// Hide the form footer for each form, since
// buttons and errors are handled separately
.submissionWizard__stepForm .pkpFormPage__footer {
	display: none;
}

// Review step
.submissionWizard__reviewPanel {
	border: @bg-border-light;
	border-radius: @radius;

	+ .submissionWizard__reviewPanel {
		margin-top: 2rem;
	}
}

.submissionWizard__reviewPanel__header {
	display: flex;
	align-items: center;
	padding: 0.5rem 1rem;
	border-bottom: @bg-border-light;

	h3 {
		margin: 0;
		font-size: @font-base;
		line-height: @line-base;
	}
}

.submissionWizard__reviewPanel__edit {
	margin-inline-start: auto;
}

.submissionWizard__reviewPanel__body {
	font-size: @font-sml;
	line-height: @line-sml;
}

.submissionWizard__reviewPanel__list {
	margin: 0;
	padding: 0;
	list-style: none;

	li {
		display: flex;
		align-items: center;
		margin: 1rem;
	}

	.pkpBadge {
		white-space: nowrap;
	}
}

.submissionWizard__reviewPanel__list__name {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.submissionWizard__reviewPanel__list__actions {
	margin-inline-start: auto;
	white-space: nowrap;

	> * {
		margin-inline-start: 0.5rem;
	}
}

.submissionWizard__review_errors {
	margin-bottom: 2rem;
}

.submissionWizard__reviewPanel__fileLink {
	display: block;
	margin-left: -0.25rem;
	padding: 0.25rem;
	border: 1px solid transparent;
	border-radius: @radius;
	color: @text;
	text-decoration: none;

	&:hover,
	&:focus {
		color: @text;
		border-color: @primary;
		outline: 0;
	}
}

.submissionWizard__reviewPanel__download {
	text-align: center;
}

.submissionWizard__reviewPanel__item {
	padding: 1rem;
	border-bottom: @bg-border-light;

	&:last-child {
		border-bottom: none;
	}

	.pkpNotification {
		margin-bottom: 0.5rem;
	}
}

.submissionWizard__reviewPanel__item__header,
.submissionWizard__reviewPanel__item__value {
	margin: 0;
	font-size: @font-sml;
	line-height: @line-sml;
}

.submissionWizard__reviewPanel__item__value {
	> p:first-child,
	> ul:first-child {
		margin-top: 0;
	}

	> p:last-child,
	> ul:last-child {
		margin-bottom: 0;
	}
}

.submissionWizard__reviewEmptyWarning {
	margin: 1rem;
}

// When the data being reviewed is a list of items
ul.submissionWizard__reviewPanel__item__value {
	margin: 0;
	padding: 0;
	list-style: none;
}

// A table used for a review
.submissionWizard__reviewPanel__body {
	.pkpTable {
		border: none;
	}
}

.submissionWizard__reviewPanel__citation
	+ .submissionWizard__reviewPanel__citation {
	margin-top: 1rem;
}

.submissionWizard__footer {
	padding: 2rem;
	background: @lift;
	border: @bg-border-light;
	border-top: none;
}

.submissionWizard__lastSaved {
	margin-right: 0.5rem;
	font-size: @font-sml;
	line-height: @line-sml;
}

.submissionWizard__lastSaved--disconnected {
	color: @no-red;

	.pkpSpinner:before {
		border-top-color: @no-red;
		border-left-color: @no-red;
	}
}

// Loading screen when review is opened
.submissionWizard__loadingReview {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 2;
	transition: opacity 0.3s;
	background: rgba(255, 255, 255, 0.75);
	text-align: center;
	font-size: @font-sml;
}

.submissionWizard__reviewLoading-enter,
.submissionWizard__reviewLoading-leave-to {
	opacity: 0;
}
</style>
