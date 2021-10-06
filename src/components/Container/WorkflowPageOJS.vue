<script type="text/javascript">
import WorkflowPage from './WorkflowPage.vue';

export default {
	name: 'WorkflowPageOJS',
	extends: WorkflowPage,
	data() {
		return {
			assignToIssueUrl: '',
			issueApiUrl: '',
			sectionWordLimits: {},
			selectIssueLabel: ''
		};
	},
	methods: {
		/**
		 * Open a modal to select an issue if the user has opted to
		 * schedule for publication before assigning to an issue
		 */
		openAssignToIssue() {
			const sourceUrl = this.assignToIssueUrl.replace(
				'__publicationId__',
				this.workingPublication.id
			);

			const opts = {
				title: this.selectIssueLabel,
				url: sourceUrl,
				closeOnFormSuccessId: pkp.const.FORM_ASSIGN_TO_ISSUE
			};

			$(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabIndex="-1"></div>'
			).pkpHandler('$.pkp.controllers.modal.AjaxModalHandler', opts);
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
		editAuthor(id) {
			this.resetFocusTo = document.activeElement;

			const author = this.workingPublication.authors.find(x => x.id === id);
			if (!author) {
				this.openDialog({
					confirmLabel: this.__('common.ok'),
					modalName: 'unknownError',
					message: this.__('common.unknownError'),
					callback: () => {
						this.$modal.hide('unknownError');
					}
				});
			}
			var activeForm = this.get('contributor');

			// let activeForm = cloneDeep(form);
			//activeForm.action = this.apiUrl + '/' + id;
			//activeForm.method = 'PUT';
			activeForm.fields = activeForm.fields.map(field => {
				if (Object.keys(author).includes(field.name)) {
					field.value = author[field.name];
				}
				return field;
			});
			this.activeForm = activeForm;
			this.activeFormTitle = 'test'; // this.editAnnouncementLabel;
			this.$modal.show('form');

			// this.workingPublication.authors
		}
	},
	watch: {
		workingPublication(newVal, oldVal) {
			// Update the abstract word count when the section changes
			if (
				newVal.sectionId !== oldVal.sectionId &&
				this.components[pkp.const.FORM_TITLE_ABSTRACT]
			) {
				const wordLimit = this.sectionWordLimits[newVal.sectionId] || 0;
				let form = {...this.components[pkp.const.FORM_TITLE_ABSTRACT]};
				form.fields = form.fields.map(field => {
					if (field.name === 'abstract') {
						field.wordLimit = wordLimit;
					}
					return field;
				});
				this.components[pkp.const.FORM_TITLE_ABSTRACT] = {};
				this.components[pkp.const.FORM_TITLE_ABSTRACT] = form;
			}

			if (newVal.issueId !== oldVal.issueId) {
				// Update the issue selection in the form when it has changed
				// through the schedule for publication form
				let form = this.components[pkp.const.FORM_ISSUE_ENTRY];
				form.fields = form.fields.map(field => {
					if (field.name === 'issueId') {
						field.value = newVal.issueId;
					}
					return field;
				});

				// Update the issue volume and number used in the DOI
				// field when the issue changes
				if (!newVal.issueId) {
					this.publicationFormIds.forEach(formId => {
						if (formId !== pkp.const.FORM_PUBLICATION_IDENTIFIERS) {
							return;
						}
						let form = {...this.components[formId]};
						form.fields = form.fields.map(field => {
							if (field.name === 'pub-id::doi') {
								field.issueNumber = '';
								field.issueVolume = '';
								if (!this.workingPublication.datePublished) {
									field.year = '';
								}
							}
							return field;
						});
						this.components[formId] = {};
						this.components[formId] = form;
					});
				} else {
					var self = this;
					$.ajax({
						url: this.issueApiUrl.replace('__issueId__', newVal.issueId),
						type: 'GET',
						error(r) {
							self.ajaxErrorCallback(r);
						},
						success(r) {
							self.publicationFormIds.forEach(formId => {
								if (formId !== pkp.const.FORM_PUBLICATION_IDENTIFIERS) {
									return;
								}
								let form = {...self.components[formId]};
								form.fields = form.fields.map(field => {
									if (field.name === 'pub-id::doi') {
										field.issueNumber = r.number || '';
										field.issueVolume = r.volume || '';
										if (!self.workingPublication.datePublished) {
											field.year = r.year || '';
										}
									}
									return field;
								});
								self.components[formId] = {};
								self.components[formId] = form;
							});
						}
					});
				}
			}
		}
	},
	mounted() {
		/**
		 * Open the publish modal when a publication has been
		 * assigned to an issue
		 */
		pkp.eventBus.$on('form-success', (formId, data) => {
			if (
				!pkp.const.FORM_ASSIGN_TO_ISSUE ||
				formId !== pkp.const.FORM_ASSIGN_TO_ISSUE
			) {
				return;
			}
			this.workingPublication = data;
			if (this.workingPublication.issueId) {
				this.$nextTick(() => this.openPublish());
			}
		});

		/**
		 * Open the assign to issue modal when a global publish
		 * event is fired
		 */
		pkp.eventBus.$on('schedule:publication', this.openAssignToIssue);
	}
};
</script>

<style lang="less">
@import '../../styles/_import';
.pkpWorkflow__submissionPayments .pkpDropdown__content {
	min-width: 15em;
	max-width: 15em;
}
</style>
