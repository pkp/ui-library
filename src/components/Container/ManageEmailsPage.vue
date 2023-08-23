<script>
import Page from './Page.vue';
import Modal from '../Modal/Modal.vue';
import PkpFilter from '../Filter/Filter.vue';
import Search from '../Search/Search.vue';
import dialog from '../../mixins/dialog';

export default {
	name: 'ManageEmailsPage',
	extends: Page,
	mixins: [dialog],
	components: {
		Modal,
		PkpFilter,
		Search,
	},
	data() {
		return {
			activeFilters: {},
			currentMailable: {},
			currentTemplate: {},
			currentTemplateForm: {},
			i18nRemoveTemplate: '',
			i18nRemoveTemplateMessage: '',
			i18nResetAll: '',
			i18nResetAllMessage: '',
			mailables: [],
			mailablesApiUrl: '',
			resetFocusTo: {},
			searchPhrase: '',
			templateForm: {},
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
						mailable[filter].includes(value)
					);
				});
			});

			return newMailables;
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
					this.localize(template.subject)
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
											(t) => t.key !== template.key
										);
								},
								() => {
									close();
								}
							);
						},
					},
					{
						label: this.__('common.cancel'),
						callback: (close) => close(),
					},
				],
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
						label: this.__('common.cancel'),
						callback: (close) => close(),
					},
				],
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
					this.currentMailable.name
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
											t.key === template.key ? r : t
										);
									close();
								});
							});
						},
					},
					{
						label: this.__('common.cancel'),
						callback: (close) => close(),
					},
				],
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
			this.isModalOpenedMailable = false;
			this.resetFocus();
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
					this.resetFocusTo = document.activeElement;
					this.currentMailable = mailable;
					this.isModalOpenedMailable = true;
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
			this.resetFocusTo = document.activeElement;
			this.currentTemplate = template;
			this.$nextTick(() => (this.isModalOpenedTemplate = true));
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
		 * A helper function to move the focus back to the element
		 * it was last at. This is usually used with modals to restore
		 * the focus after a modal is closed.
		 */
		resetFocus() {
			if (this.resetFocusTo) {
				this.resetFocusTo.focus();
			}
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
						this.currentMailable.dataDescriptions
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
			const exists =
				this.currentMailable.emailTemplates.findIndex(
					(t) => t.key === template.key
				) > -1;

			if (exists) {
				this.currentMailable.emailTemplates =
					this.currentMailable.emailTemplates.map((t) =>
						t.key === template.key ? template : t
					);
			} else {
				this.currentMailable.emailTemplates.push(template);
			}

			setTimeout(() => this.closeTemplateModal(), 1000);
		},

		/**
		 * Fired when the email template modal has been closed
		 */
		closeTemplateModal() {
			this.isModalOpenedTemplate = false;
			if (this.currentMailable.supportsTemplates) {
				this.resetFocus();
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
	watch: {
		/**
		 * Update the email template form whenever the current
		 * email template is changed
		 */
		currentTemplate(newVal) {
			this.setCurrentTemplateForm(newVal);
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
