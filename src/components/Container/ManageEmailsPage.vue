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
		Search
	},
	data() {
		return {
			activeFilters: {},
			currentMailable: {},
			currentTemplate: {},
			currentTemplateForm: {},
			customTemplates: [],
			i18nRemoveTemplate: '',
			i18nRemoveTemplateMessage: '',
			i18nResetAll: '',
			i18nResetAllMessage: '',
			mailables: [],
			mailablesApiUrl: '',
			resetFocusTo: {},
			searchPhrase: '',
			templateForm: {},
			templatesApiUrl: ''
		};
	},
	computed: {
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
				newMailables = newMailables.filter(mailable => {
					return (
						mailable.name.toLowerCase().includes(searchPhrase) ||
						mailable.description.toLowerCase().includes(searchPhrase)
					);
				});
			}

			Object.keys(this.activeFilters).forEach(filter => {
				this.activeFilters[filter].forEach(value => {
					newMailables = newMailables.filter(mailable =>
						mailable[filter].includes(value)
					);
				});
			});

			return newMailables;
		}
	},
	methods: {
		addFilter(param, value) {
			let newFilters = {...this.activeFilters};
			if (!newFilters[param]) {
				newFilters[param] = [value];
			} else {
				newFilters[param].push(value);
			}
			this.activeFilters = newFilters;
		},
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
						callback: () => {
							this.deleteTemplate(
								template,
								() => {
									this.currentMailable.emailTemplates = this.currentMailable.emailTemplates.filter(
										t => t.key !== template.key
									);
								},
								() => {
									this.$modal.hide('removeTemplate');
								}
							);
						}
					},
					{
						label: this.__('common.cancel'),
						callback: () => this.$modal.hide('removeTemplate')
					}
				]
			});
		},
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
									'X-Http-Method-Override': 'DELETE'
								},
								error: this.ajaxErrorCallback,
								success(r) {
									window.location.reload();
								}
							});
						}
					},
					{
						label: this.__('common.cancel'),
						callback: () => this.$modal.hide('resetAll')
					}
				]
			});
		},
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
						callback: () => {
							this.deleteTemplate(template, () => {
								this.getTemplate(template.key, r => {
									this.currentMailable.emailTemplates = this.currentMailable.emailTemplates.map(
										t => (t.key === template.key ? r : t)
									);
									this.$modal.hide('resetTemplate');
								});
							});
						}
					},
					{
						label: this.__('common.cancel'),
						callback: () => this.$modal.hide('resetTemplate')
					}
				]
			});
		},
		deleteTemplate(template, onSuccess, onComplete) {
			$.ajax({
				url: this.templatesApiUrl + '/' + template.key,
				type: 'POST',
				context: this,
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'DELETE'
				},
				error: this.ajaxErrorCallback,
				success: onSuccess,
				complete: onComplete
			});
		},
		getMailable(mailable, onSuccess) {
			$.ajax({
				url:
					this.mailablesApiUrl +
					'/' +
					encodeURIComponent(mailable.emailTemplateKey),
				type: 'GET',
				context: this,
				error: this.ajaxErrorCallback,
				success: onSuccess
			});
		},
		getTemplate(template, onSuccess) {
			$.ajax({
				url: this.templatesApiUrl + '/' + encodeURIComponent(template),
				type: 'GET',
				context: this,
				error: this.ajaxErrorCallback,
				success: onSuccess
			});
		},
		isFilterActive(param, value) {
			return (
				this.activeFilters[param] && this.activeFilters[param].includes(value)
			);
		},
		mailableModalClosed() {
			this.resetFocus();
			setTimeout(() => {
				this.currentMailable = {};
				this.currentTemplate = {};
			}, 300);
		},
		openMailable(mailable) {
			if (mailable.supportsTemplates) {
				this.getMailable(mailable, mailable => {
					this.resetFocusTo = document.activeElement;
					this.currentMailable = mailable;
					this.$modal.show('mailable');
				});
			} else {
				this.getTemplate(mailable.emailTemplateKey, template => {
					this.currentMailable = mailable;
					this.openTemplate(template);
				});
			}
		},
		openTemplate(template) {
			template = template || {};
			this.resetFocusTo = document.activeElement;
			this.currentTemplate = template;
			this.$nextTick(() => this.$modal.show('template'));
		},
		removeFilter(param, value) {
			if (!this.activeFilters[param]) {
				return;
			}
			let newFilters = {...this.activeFilters};
			newFilters[param] = newFilters[param].filter(v => v !== value);
			this.activeFilters = newFilters;
		},
		resetFocus() {
			if (this.resetFocusTo) {
				this.resetFocusTo.focus();
			}
		},
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

				templateForm.fields = templateForm.fields.map(field => {
					if (props.includes(field.name)) {
						field.value = field.isMultilingual
							? {...newTemplate[field.name]}
							: newTemplate[field.name];
					}
					return field;
				});
			}

			templateForm.fields = templateForm.fields.map(field => {
				if (field.name === 'body') {
					field.preparedContent = Object.keys(
						this.currentMailable.dataDescriptions
					).map(variable => {
						return {
							key: variable,
							value: '{$' + variable + '}',
							description: this.currentMailable.dataDescriptions[variable]
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
				templateForm.hiddenFields.alternateTo = this.currentMailable.emailTemplateKey;
			}

			this.currentTemplateForm = templateForm;
		},
		templateSaved(template) {
			const exists =
				this.currentMailable.emailTemplates.findIndex(
					t => t.key === template.key
				) > -1;

			if (exists) {
				this.currentMailable.emailTemplates = this.currentMailable.emailTemplates.map(
					t => (t.key === template.key ? template : t)
				);
			} else {
				this.currentMailable.emailTemplates.push(template);
			}

			setTimeout(() => this.$modal.hide('template'), 1000);
		},
		templateModalClosed() {
			if (this.currentMailable.supportsTemplates) {
				this.resetFocus();
				setTimeout(() => {
					this.currentTemplate = {};
				}, 300);
			} else {
				this.mailableModalClosed();
			}
		},
		updateCurrentTemplateForm(formId, data) {
			this.currentTemplateForm = {
				...this.currentTemplateForm,
				...data
			};
		}
	},
	watch: {
		currentTemplate(newVal) {
			this.setCurrentTemplateForm(newVal);
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.manageEmails__listPanel {
	background: @lift;
}
</style>
