<script>
import Page from './Page.vue';
import Modal from '../Modal/Modal.vue';
import PkpFilter from '../Filter/Filter.vue';
import Search from '../Search/Search.vue';
import dialog from '../../mixins/dialog';
import EditMailableModal from '@/pages/manageEmails/EditMailableModal.vue';
import EditTemplateModal from '@/pages/manageEmails/EditTemplateModal.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';

const {t} = useLocalize();

export default {
	name: 'ManageEmailsPage',
	components: {
		Modal,
		PkpFilter,
		Search,
	},
	extends: Page,
	mixins: [dialog],
	data() {
		return {
			/** An object containing the currently active Filters */
			activeFilters: {},
			/**  The `Mailable` currently open in a modal. */
			currentMailable: {},
			/** The `EmailTemplate` currently open in a modal. */
			currentTemplate: {},
			/** A copy of the form to add or edit an `EmailTemplate` that is currently open in a modal. This form may have an email template's details loaded into it. */
			currentTemplateForm: {},
			/** A localized string for the button to remove a template. */
			i18nRemoveTemplate: '',
			/** A localized string for the confirmation message when removing a template. */
			i18nRemoveTemplateMessage: '',
			/** A localized string for the button to reset all email templates. */
			i18nResetAll: '',
			/**  A localized string for the confirmation message when removing a template.  */
			i18nResetAllMessage: '',
			/** An array of all `Mailable`s active in this journal, press or preprint server. */
			mailables: [],
			/** The URL to the `/mailables` endpoint in the REST API. */
			mailablesApiUrl: '',
			/** The value of the search input.  */
			searchPhrase: '',
			/** A "clean" copy of the form to add or edit an `EmailTemplate`. The `currentTemplateForm` is a copy of this form that has been modified to add or edit a specific template. */
			templateForm: {},
			/** The URL to the `/emailTemplates` endpoint in the REST API. */
			templatesApiUrl: '',
			isModalOpenedMailable: false,
			isModalOpenedTemplate: false,
		};
	},
	computed: {
		/**
		 * Mailables currently visible in the list after
		 * search and filters applied
		 */
		currentMailables() {
			let newMailables = [...this.mailables];

			if (
				!this.searchPhrase.length &&
				!Object.keys(this.activeFilters).length
			) {
				return newMailables;
			}

			if (this.searchPhrase.length) {
				const searchPhrase = this.searchPhrase.toLowerCase();
				newMailables = newMailables.filter((mailable) => {
					return (
						mailable.name.toLowerCase().includes(searchPhrase) ||
						mailable.description.toLowerCase().includes(searchPhrase)
					);
				});
			}

			Object.keys(this.activeFilters).forEach((filter) => {
				this.activeFilters[filter].forEach((value) => {
					newMailables = newMailables.filter((mailable) =>
						mailable[filter].includes(value),
					);
				});
			});

			return newMailables;
		},
	},
	watch: {
		/**
		 * Update the email template form whenever the current
		 * email template is changed
		 */
		currentTemplate(newVal) {
			this.setCurrentTemplateForm(newVal);
		},
	},
	methods: {
		/**
		 * Add a filter to the active filters list
		 *
		 * @param {String} param The query param to effect
		 * @param {String|Number} value The value to add to the query param
		 */
		addFilter(param, value) {
			let newFilters = {...this.activeFilters};
			if (!newFilters[param]) {
				newFilters[param] = [value];
			} else {
				newFilters[param].push(value);
			}
			this.activeFilters = newFilters;
		},

		/**
		 * Open a confirmation dialog to remove a template
		 *
		 * @param {Object} template The template to remove
		 */
		confirmRemoveTemplate(template) {
			this.openDialog({
				name: 'removeTemplate',
				title: this.i18nRemoveTemplate,
				message: this.i18nRemoveTemplateMessage.replace(
					'{$template}',
					this.localize(template.subject),
				),
				actions: [
					{
						label: this.i18nRemoveTemplate,
						isWarnable: true,
						callback: (close) => {
							this.deleteTemplate(
								template,
								() => {
									this.currentMailable.emailTemplates =
										this.currentMailable.emailTemplates.filter(
											(t) => t.key !== template.key,
										);
								},
								() => {
									close();
								},
							);
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
		 * Open a confirmation dialog to reset all templates
		 */
		confirmResetAll() {
			this.openDialog({
				name: 'resetAll',
				title: this.i18nResetAll,
				message: this.i18nResetAllMessage,
				actions: [
					{
						label: this.i18nResetAll,
						isWarnable: true,
						callback: () => {
							$.ajax({
								url: this.templatesApiUrl + '/restoreDefaults',
								type: 'POST',
								context: this,
								headers: {
									'X-Csrf-Token': pkp.currentUser.csrfToken,
									'X-Http-Method-Override': 'DELETE',
								},
								error: this.ajaxErrorCallback,
								success(r) {
									window.location.reload();
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
		 * Open a confirmation dialog to reset a template
		 *
		 * @param {Object} template The template to remove
		 */
		confirmResetTemplate(template) {
			this.openDialog({
				name: 'resetTemplate',
				title: this.i18nResetTemplate,
				message: this.i18nResetTemplateMessage.replace(
					'{$template}',
					this.currentMailable.name,
				),
				actions: [
					{
						label: this.i18nResetTemplate,
						isWarnable: true,
						callback: (close) => {
							this.deleteTemplate(template, () => {
								this.getTemplate(template.key, (r) => {
									this.currentMailable.emailTemplates =
										this.currentMailable.emailTemplates.map((t) =>
											t.key === template.key ? r : t,
										);
									close();
								});
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
		 * Delete an email template
		 *
		 * @param {Object} template The template to remove
		 * @param {Function} onSuccess A callback function to fire when a success response is received
		 * @param {Function} onComplete A callback function to fire after any response is received
		 */
		deleteTemplate(template, onSuccess, onComplete) {
			$.ajax({
				url: this.templatesApiUrl + '/' + template.key,
				type: 'POST',
				context: this,
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'DELETE',
				},
				error: this.ajaxErrorCallback,
				success: onSuccess,
				complete: onComplete,
			});
		},

		/**
		 * Get a mailable from the API
		 *
		 * @param {Object} mailable The mailable to get from the API
		 * @param {Function} onSuccess A callback function to fire when a success response is received
		 */
		getMailable(mailable, onSuccess) {
			$.ajax({
				url:
					this.mailablesApiUrl +
					'/' +
					encodeURIComponent(mailable.emailTemplateKey),
				type: 'GET',
				context: this,
				error: this.ajaxErrorCallback,
				success: onSuccess,
			});
		},

		/**
		 * Get an email template from the API
		 *
		 * @param {Object} template The template to get from the API
		 * @param {Function} onSuccess A callback function to fire when a success response is received
		 */
		getTemplate(template, onSuccess) {
			$.ajax({
				url: this.templatesApiUrl + '/' + encodeURIComponent(template),
				type: 'GET',
				context: this,
				error: this.ajaxErrorCallback,
				success: onSuccess,
			});
		},

		/**
		 * Check if a filter is active
		 *
		 * @param {String} param The query param to check
		 * @param {String|Number} value The value of the query param to check
		 */
		isFilterActive(param, value) {
			return (
				this.activeFilters[param] && this.activeFilters[param].includes(value)
			);
		},

		/**
		 * Fired when the mailable modal is closed
		 */
		closeMailableModal() {
			const {closeSideModal} = useModal();
			closeSideModal(EditMailableModal);
			setTimeout(() => {
				this.currentMailable = {};
				this.currentTemplate = {};
			}, 300);
		},

		/**
		 * Open the modal to edit a mailable
		 *
		 * If a mailable only has one template, this will open the
		 * email template modal instead.
		 *
		 * @param {Object} mailable The mailable to open
		 */
		openMailable(mailable) {
			if (mailable.supportsTemplates) {
				this.getMailable(mailable, (mailable) => {
					this.currentMailable = mailable;
					const {openSideModal} = useModal();
					openSideModal(EditMailableModal, {
						title: mailable ? mailable.name : '',
						mailable: this.currentMailable,
						onOpenTemplate: this.openTemplate,
						onConfirmResetTemplate: this.confirmResetTemplate,
						onConfirmRemoveTemplate: this.confirmRemoveTemplate,
					});
				});
			} else {
				this.getTemplate(mailable.emailTemplateKey, (template) => {
					this.currentMailable = mailable;
					this.openTemplate(template);
				});
			}
		},

		/**
		 * Open the modal to edit an email template
		 *
		 * @param {Object} template The template open
		 */
		openTemplate(template) {
			template = template || {};
			this.currentTemplate = template;
			const {openSideModal} = useModal();
			this.$nextTick(() =>
				openSideModal(EditTemplateModal, {
					title: this.currentTemplate
						? t('manager.mailables.editTemplate')
						: t('manager.emails.addEmail'),
					currentTemplateForm: this.currentTemplateForm,
					onUpdateCurrentTemplateForm: this.updateCurrentTemplateForm,
					onTemplateSaved: this.templateSaved,
				}),
			);
		},

		/**
		 * Remove a filter from the active filters list
		 *
		 *
		 * @param {String} param The query param to effect
		 * @param {String|Number} value The value to remove from the query param
		 */
		removeFilter(param, value) {
			if (!this.activeFilters[param]) {
				return;
			}
			let newFilters = {...this.activeFilters};
			newFilters[param] = newFilters[param].filter((v) => v !== value);
			this.activeFilters = newFilters;
		},

		/**
		 * Setup the form to edit an email template
		 *
		 * @param {Object} newTemplate The email template to set up the form.
		 *   This will be empty if creating a new template.
		 */
		setCurrentTemplateForm(newTemplate) {
			// Get a deep copy of the form to eliminate references
			let templateForm = JSON.parse(JSON.stringify(this.templateForm));

			if (!Object.entries(this.currentMailable).length) {
				this.currentTemplateForm = templateForm;
				return;
			}

			if (Object.entries(newTemplate).length) {
				templateForm.action = newTemplate._href;
				templateForm.method = 'PUT';

				const props = Object.keys(newTemplate);

				templateForm.fields = templateForm.fields.map((field) => {
					if (props.includes(field.name)) {
						field.value = field.isMultilingual
							? {...newTemplate[field.name]}
							: newTemplate[field.name];
					}
					return field;
				});
			}

			templateForm.fields = templateForm.fields.map((field) => {
				if (field.name === 'body') {
					field.preparedContent = Object.keys(
						this.currentMailable.dataDescriptions,
					).map((variable) => {
						return {
							key: variable,
							value: '{$' + variable + '}',
							description: this.currentMailable.dataDescriptions[variable],
						};
					});
				}
				return field;
			});

			if (
				!newTemplate ||
				(newTemplate &&
					this.currentMailable.emailTemplateKey !== newTemplate.key)
			) {
				templateForm.hiddenFields.alternateTo =
					this.currentMailable.emailTemplateKey;
			}

			this.currentTemplateForm = templateForm;
		},

		/**
		 * Fired when the email template form has been saved
		 *
		 * @param {Object} template The updated values of the template
		 */
		templateSaved(template) {
			const {closeSideModal} = useModal();
			setTimeout(() => closeSideModal(EditTemplateModal), 1000);

			if (!this.currentMailable.supportsTemplates) {
				return;
			}

			const exists =
				this.currentMailable.emailTemplates.findIndex(
					(t) => t.key === template.key,
				) > -1;

			if (exists) {
				this.currentMailable.emailTemplates =
					this.currentMailable.emailTemplates.map((t) =>
						t.key === template.key ? template : t,
					);
			} else {
				this.currentMailable.emailTemplates.push(template);
			}
		},

		/**
		 * Fired when the email template modal has been closed
		 */
		closeTemplateModal() {
			const {closeSideModal} = useModal();
			closeSideModal(EditTemplateModal);
			if (this.currentMailable.supportsTemplates) {
				setTimeout(() => {
					this.currentTemplate = {};
				}, 300);
			} else {
				this.closeMailableModal();
			}
		},

		/**
		 * Sync the form data with user input
		 *
		 * @param {String} formId The id for the form. Unused
		 * @param {Object} data The form data to be updated
		 */
		updateCurrentTemplateForm(formId, data) {
			this.currentTemplateForm = {
				...this.currentTemplateForm,
				...data,
			};
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.manageEmails__listPanel {
	background: @lift;
}
</style>
