<script type="text/javascript">
import Page from './Page.vue';
import ContributorsListPanel from '@/components/ListPanel/contributors/ContributorsListPanel.vue';
import WorkflowPublicationJats from '@/pages/workflow/components/publication/WorkflowPublicationJats.vue';
import Composer from '@/components/Composer/Composer.vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import Modal from '@/components/Modal/Modal.vue';
import PkpHeader from '@/components/Header/Header.vue';
import LocalizeSubmission from '@/mixins/localizeSubmission.js';
import ajaxError from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog.js';
import WorkflowChangeSubmissionLanguage from '@/pages/workflow/components/publication/WorkflowChangeSubmissionLanguage.vue';
import SelectRevisionDecisionModal from '@/pages/workflow/modals/WorkflowSelectRevisionDecisionModalLegacyWorkflow.vue';
import {useModal} from '@/composables/useModal';

export default {
	name: 'WorkflowPage',
	components: {
		WorkflowChangeSubmissionLanguage,
		ContributorsListPanel,
		Composer,
		Dropdown,
		Modal,
		PkpHeader,
		WorkflowPublicationJats,
	},
	extends: Page,
	mixins: [LocalizeSubmission, dialog, ajaxError],
	data() {
		return {
			activityLogLabel: '',
			canAccessPublication: false,
			canChangeSubmissionLanguage: false,
			currentSubmissionLanguageLabel: '',
			canEditPublication: false,
			currentPublication: null,
			decisionUrl: '',
			editorialHistoryUrl: '',
			isLoadingVersion: false,
			publicationFormIds: [],
			publicationList: [],
			publicationTabsLabel: '',
			publishLabel: '',
			publishUrl: '',
			representationsGridUrl: '',
			schedulePublicationLabel: '',
			submission: null,
			submissionApiUrl: '',
			submissionFileApiUrl: '',
			submissionLibraryLabel: '',
			submissionLibraryUrl: '',
			supportsReferences: false,
			statusLabel: '',
			unpublishConfirmLabel: '',
			unpublishLabel: '',
			unscheduleConfirmLabel: '',
			unscheduleLabel: '',
			uploadFileModalLabel: '',
			uploadFileUrl: '',
			versionLabel: '',
			versionConfirmMessage: '',
			versionConfirmTitle: '',
			workingPublication: null,
		};
	},
	computed: {
		/**
		 * Can a new version be created?
		 *
		 * @return {Boolean}
		 */
		canCreateNewVersion() {
			return (
				this.submission.status === pkp.const.STATUS_PUBLISHED &&
				this.latestPublicationId <= this.currentPublication.id
			);
		},

		/**
		 * Get the id of the most recently created publication
		 *
		 * @return {Number}
		 */
		latestPublicationId() {
			return this.publicationList.reduce((a, b) => {
				return a < b.id ? b.id : a;
			}, 0);
		},

		/**
		 * The classes to add to the publication loading mask
		 *
		 * @return {Array}
		 */
		publicationMaskClasses() {
			let classes = [];
			if (this.isLoadingVersion) {
				classes.push('-isVisible');
			}
			return classes;
		},

		/**
		 * A label for the publication tabs for assistive devices
		 */
		currentPublicationTabsLabel() {
			return this.replaceLocaleParams(this.publicationTabsLabel, {
				version: this.workingPublication.version,
			});
		},
	},
	watch: {
		workingPublication(newVal, oldVal) {
			this.setPublicationForms(newVal);
			this.loadRepresentationsGrid(newVal);
			if (newVal.id === this.currentPublication.id) {
				this.currentPublication = {};
				this.currentPublication = newVal;
			}
		},
	},
	created() {
		/**
		 * Subscribe to publication forms and update the publication
		 * with the details that have changed
		 */
		pkp.eventBus.$on('form-success', (formId, newPublication) => {
			if (this.publicationFormIds.includes(formId)) {
				this.workingPublication = {};
				this.workingPublication = newPublication;
			}

			// Update the submission's status when the publish form is completed
			if (formId === pkp.const.FORM_PUBLISH) {
				this.setPublicationForms(newPublication);
				this.currentPublication = {};
				this.currentPublication = newPublication;
				this.submission.currentPublicationId = newPublication.id;
				this.refreshSubmission();
			}
		});

		/**
		 * Open the unpublish confirmation modal when a global unpublish
		 * event is fired
		 */
		pkp.eventBus.$on('unpublish:publication', this.openUnpublish);

		/**
		 * Open the modals to select the revision type when requested
		 */
		pkp.eventBus.$on('decision:revisions', (reviewRoundId) => {
			this.components.selectRevisionDecision.hiddenFields['reviewRoundId'] =
				reviewRoundId;
			const {openSideModal} = useModal();
			openSideModal(SelectRevisionDecisionModal, {
				activeForm: this.components.selectRevisionDecision,
				onSet: this.set,
				onGoToRevisionDecision: this.goToRevisionDecision,
			});
		});
		pkp.eventBus.$on('recommendation:revisions', (reviewRoundId) => {
			this.components.selectRevisionRecommendation.hiddenFields[
				'reviewRoundId'
			] = reviewRoundId;

			const {openSideModal} = useModal();

			openSideModal(SelectRevisionDecisionModal, {
				activeForm: this.components.selectRevisionRecommendation,
				onSet: this.set,
				onGoToRevisionDecision: this.goToRevisionDecision,
			});
		});

		/**
		 * Load forms
		 */
		this.setPublicationForms(this.workingPublication);
	},
	mounted() {
		/**
		 * Load publication grids
		 *
		 * Add a delay to allow the workflow requests to be sent first
		 */
		setTimeout(() => {
			this.loadRepresentationsGrid(this.workingPublication);
		}, 1000);
	},
	unmounted() {
		pkp.eventBus.$off('form-success');
		pkp.eventBus.$off('unpublish:publication');
		pkp.eventBus.$off('decision:revisions');
		pkp.eventBus.$off('recommendation:revisions');
	},
	methods: {
		/**
		 * Create a new version of the latest publication
		 */
		createVersion() {
			this.isLoadingVersion = true;
			const startTime = new Date();
			var self = this;

			$.ajax({
				url:
					this.submissionApiUrl +
					'/publications/' +
					this.latestPublicationId +
					'/version',
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
				},
				error(r) {
					self.isLoadingVersion = false;
					self.ajaxErrorCallback(r);
				},
				success(r) {
					self.publicationList.push({
						id: r.id,
						datePublished: r.datePublished,
						status: r.status,
						version: r.version,
					});
					self.workingPublication = {};
					self.workingPublication = r;
					self.$nextTick(() => {
						self.setFocusIn(self.$refs.publication);

						// Enforce a minimum 3-second delay when a new
						// version is created. We do this to force the
						// user to slow down and process what happened.
						// We hope this will reinforce the perception
						// that creating a new version is a "big
						// action", and properly communicate the scale
						// of what has happened behind the scenes.
						const nowTime = new Date();
						const timeDiff = nowTime - startTime;
						if (timeDiff / 1000 >= 3) {
							self.isLoadingVersion = false;
						} else {
							setTimeout(() => {
								self.isLoadingVersion = false;
							}, timeDiff);
						}
					});
				},
			});
		},

		/**
		 * Helper method to access a global constant in the template
		 *
		 * @param {String} constant
		 * @return {Object}
		 */
		getConstant(constant) {
			return pkp.const[constant];
		},

		/**
		 * When the user has selected whether revisions will be sent for
		 * a new round of review
		 */
		goToRevisionDecision(formData) {
			window.location = this.decisionUrl
				.replace('__decision__', formData.decision)
				.replace('__reviewRoundId__', formData.reviewRoundId);
		},

		/**
		 * Load/reload the representations grid (galleys/publication formats)
		 *
		 * @param Object publication Load representations for this publication
		 */
		loadRepresentationsGrid(publication) {
			if (!this.$refs.representations) {
				return;
			}
			const $representationsEl = $(this.$refs.representations);
			const sourceUrl = this.representationsGridUrl.replace(
				'__publicationId__',
				publication.id,
			);
			if (!$.pkp.classes.Handler.hasHandler($representationsEl)) {
				$representationsEl.pkpHandler('$.pkp.controllers.UrlInDivHandler', {
					sourceUrl: sourceUrl,
					refreshOn: 'form-success',
				});
			} else {
				const representationsHandler =
					$.pkp.classes.Handler.getHandler($representationsEl);
				representationsHandler.setSourceUrl(sourceUrl);
				representationsHandler.reload();
			}
		},

		/**
		 * Open a modal displaying the editorial history
		 */
		openActivity() {
			var opts = {
				title: this.activityLogLabel,
				url: this.editorialHistoryUrl,
				closeCallback: () => this.$refs.activityButton.$el.focus(),
			};

			$(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabIndex="-1"></div>',
			).pkpHandler('$.pkp.controllers.modal.AjaxModalHandler', opts);
		},

		/**
		 * Open a modal displaying the change submission language form
		 */
		openChangeSubmissionLanguageModal() {
			const {openSideModal} = useModal();
			openSideModal(WorkflowChangeSubmissionLanguage, {
				form: this.components[
					pkp.const.FORM_CHANGE_SUBMISSION_LANGUAGE_METADATA
				],
				publicationId: this.workingPublication.id,
				submissionId: this.submission.id,
			});
		},

		/**
		 * Open a modal to prompt the user to confirm creation of
		 * a new version
		 */
		openCreateVersionPrompt() {
			this.openDialog({
				name: 'createVersion',
				title: this.versionConfirmTitle,
				message: this.versionConfirmMessage,
				actions: [
					{
						label: this.t('common.yes'),
						isPrimary: true,
						callback: (close) => {
							close();
							this.createVersion();
						},
					},
					{
						label: this.t('common.no'),
						callback: (close) => close(),
					},
				],
				modalStyle: 'primary',
			});
		},

		/**
		 * Open a file upload modal
		 *
		 * Only used in author dashboard
		 */
		openFileUpload() {
			var opts = {
				title: this.uploadFileModalLabel,
				url: this.uploadFileUrl,
				closeCallback: () => {
					pkp.eventBus.$emit('refreshRevisionsGrid');
					this.$refs.uploadFileButton.$el.focus();
				},
			};

			$(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabIndex="-1"></div>',
			).pkpHandler('$.pkp.controllers.modal.WizardModalHandler', opts);
		},

		/**
		 * Open a modal displaying the editorial history
		 */
		openLibrary() {
			var opts = {
				title: this.submissionLibraryLabel,
				url: this.submissionLibraryUrl,
				closeCallback: () => this.$refs.library.$el.focus(),
			};

			$(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabIndex="-1"></div>',
			).pkpHandler('$.pkp.controllers.modal.AjaxModalHandler', opts);
		},

		/**
		 * Open a modal with the final publishing confirmation steps
		 */
		openPublish() {
			const sourceUrl = this.publishUrl.replace(
				'__publicationId__',
				this.workingPublication.id,
			);

			const opts = {
				title: this.publishLabel,
				url: sourceUrl,
				closeCallback: () => {
					if (this.$refs.publish) {
						this.$refs.publish.$el.focus();
					} else if (this.$refs.createVersion) {
						this.$refs.createVersion.$el.focus();
					}
					this.setFocusIn(this.$refs.publication);
				},
				closeOnFormSuccessId: pkp.const.FORM_PUBLISH,
			};

			$(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabIndex="-1"></div>',
			).pkpHandler('$.pkp.controllers.modal.AjaxModalHandler', opts);
		},

		/**
		 * Open a confirmation modal before unpublishing a publication
		 */
		openUnpublish() {
			this.openDialog({
				name: 'confirmUnpublish',
				title:
					this.workingPublication.status === pkp.const.STATUS_SCHEDULED
						? this.unscheduleLabel
						: this.unpublishLabel,
				message:
					this.workingPublication.status === pkp.const.STATUS_SCHEDULED
						? this.unscheduleConfirmLabel
						: this.unpublishConfirmLabel,
				actions: [
					{
						label:
							this.workingPublication.status === pkp.const.STATUS_SCHEDULED
								? this.unscheduleLabel
								: this.unpublishLabel,
						isWarnable: true,
						callback: (close) => {
							this.unpublish(this.workingPublication);
							close();
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
		 * Update the submission details
		 */
		refreshSubmission() {
			const self = this;
			$.ajax({
				url: this.submissionApiUrl,
				type: 'GET',
				success(submission) {
					// Store some publication data and discard the rest
					submission.publications.forEach((publication) =>
						self.updatePublicationInList(publication),
					);
					delete submission.publications;
					self.submission = {};
					self.submission = submission;
				},
				error(r) {
					self.ajaxErrorCallback(r);
				},
			});
		},

		/**
		 * Update the publication forms to match a particular publication
		 *
		 * @param Object publication
		 */
		setPublicationForms(publication) {
			this.publicationFormIds.forEach((formId) => {
				if (!this.components[formId]) {
					return;
				}

				// Update form action URLs and field values
				let form = {...this.components[formId]};
				form.action = this.submissionApiUrl + '/publications/' + publication.id;
				form.fields = form.fields.map((field) => {
					if (Object.keys(publication).includes(field.name)) {
						field.value = publication[field.name];
					}
					return field;
				});

				// Add/remove save button depending on user permissions
				form.canSubmit = this.canEditPublication;
				
				// Pass the publication status to the issue selection field
				if (formId === pkp.const.FORM_ISSUE_ENTRY) {
					form.fields = form.fields.map((field) => {
						if (field.name === 'issueId') {
							field.publicationStatus = publication.status;
						}
						return field;
					});
				}

				// Pass identifier requirements to the DOI/URN fields
				if (formId === pkp.const.FORM_PUBLICATION_IDENTIFIERS) {
					form.fields = form.fields.map((field) => {
						if (['pub-id::doi', 'pub-id::other::urn'].includes(field.name)) {
							field.pages = publication.pages || '';
							field.publisherId = publication['pub-id::publisher-id'] || '';
						}
						return field;
					});
				}

				this.components[formId] = {};
				this.components[formId] = form;
			});
		},

		/**
		 * Change the publication the user is working with
		 *
		 * @param Number publication id
		 */
		setWorkingPublicationById(publicationId) {
			this.isLoadingVersion = true;
			var self = this;

			$.ajax({
				url: this.submissionApiUrl + '/publications/' + publicationId,
				type: 'GET',
				error(r) {
					self.isLoadingVersion = false;
					self.ajaxErrorCallback(r);
				},
				success(r) {
					self.workingPublication = {};
					self.workingPublication = r;
					self.updatePublicationInList(r);
					self.$nextTick(() => {
						self.setFocusIn(self.$refs.publication);
						self.isLoadingVersion = false;
					});
				},
			});
		},

		/**
		 * Unpublish a publication
		 */
		unpublish(publication) {
			this.isLoadingVersion = true;
			var self = this;

			$.ajax({
				url:
					this.submissionApiUrl +
					'/publications/' +
					publication.id +
					'/unpublish',
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'PUT',
				},
				error(r) {
					self.isLoadingVersion = false;
					self.ajaxErrorCallback(r);
				},
				success(r) {
					self.workingPublication = {};
					self.workingPublication = r;
					self.updatePublicationInList(r);
					self.setPublicationForms(r);
					self.loadRepresentationsGrid(r);
					self.isLoadingVersion = false;
					self.setFocusIn(self.$refs.publication);
					self.refreshSubmission();
				},
			});
		},

		/**
		 * Update a publication's details in the publication list
		 *
		 * @param {Object} newPublication
		 */
		updatePublicationInList(newPublication) {
			this.publicationList.forEach((publication) => {
				if (publication.id === newPublication.id) {
					publication.datePublished = newPublication.datePublished;
					publication.status = newPublication.status;
					publication.version = newPublication.version;
				}
			});
		},

		/**
		 * Update a publication
		 *
		 * @param {Object} publication
		 */
		setWorkingPublication(publication) {
			this.workingPublication = publication;
		},

		/**
		 * Update a set of publication contributors
		 *
		 * @param {Object} contributors
		 */
		setContributors(contributors) {
			this.workingPublication.authors = [...contributors];
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpWorkflow__header {
	margin-bottom: 2rem;
	padding: 0;
	min-height: 2rem;
}

.pkpWorkflow__header .pkpWorkflow__identification {
	font-size: @font-sml;
	font-weight: @normal;
	line-height: 2rem;
}

.pkpWorkflow__identificationStatus {
	margin-right: 0.5em;
}

.pkpWorkflow__identificationAuthor {
	font-weight: @bold;
}

.pkpWorkflow__identificationDivider {
	color: @text-light;
	margin-left: 0.5em;
	margin-right: 0.5em;
}

.pkpWorkflow .pkpTabs__button .fa {
	margin-left: 0.5rem;
	margin-right: 0.5rem;
}

.pkpPublication__header {
	margin: -2rem -2rem 0;
	padding: 1rem;
	border-bottom: @bg-border-light;

	.pkpHeader__title {
		padding: 0;
		font-size: @font-sml;
		font-weight: @normal;
	}
}

.pkpPublication__status + .pkpPublication__version {
	margin-left: 1.5rem;
}

.pkpPublication__statusPublished {
	color: @yes;
}

.pkpPublication__statusUnpublished {
	color: @no-red;
}

.pkpPublication__versionPublished {
	margin: 0 -2rem;
	padding: 1rem;
	background: @no-red;
	font-size: @font-sml;
	color: #fff;
	text-align: center;
}

.pkpPublication__tabs.pkpTabs--side {
	.pkpTabs__button:first-child {
		border-top: none;
	}

	.pkpTab > .pkpForm {
		margin-right: -1rem;
		border-top: none;
		border-right: none;

		@media (min-width: 767px) {
			margin-right: -2rem;
		}
	}
}

// A mask over the publication details to use for a loading animation
.pkpPublication__mask {
	visibility: hidden;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: #fff;
	z-index: 99999;
	opacity: 0;
	transition:
		opacity 0.6s,
		visibility 0.6s;

	&.-isVisible {
		visibility: visible;
		opacity: 1;
	}

	> .pkpSpinner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		&:before {
			width: 100px;
			height: 100px;
			animation-duration: 0.8s;
		}
	}
}

.pkpSubmission__localeNotSupported {
	margin: 0 -2rem;
	padding: 1rem;
	background: @primary;
	font-size: @font-sml;
	color: #fff;
	text-align: center;
}

.pkpPublication__changeSubmissionLanguage {
	display: block;
	padding-bottom: 0.25rem;
}

// Integrate the grids in the publication tab
.pkpWorkflow__contributors,
#representations-grid {
	padding-top: 2rem;
}
</style>
