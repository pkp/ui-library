<script type="text/javascript">
import Container from './Container.vue';
import Badge from '@/components/Badge/Badge.vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import PkpButton from '@/components/Button/Button.vue';
import PkpHeader from '@/components/Header/Header.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import LocalizeSubmission from '@/mixins/localizeSubmission.js';

export default {
	name: 'WorkflowContainer',
	extends: Container,
	mixins: [LocalizeSubmission],
	components: {
		Badge,
		Dropdown,
		PkpButton,
		PkpHeader,
		Spinner
	},
	data() {
		return {
			contributorsGridUrl: '',
			csrfToken: '',
			currentPublication: null,
			editorialHistoryUrl: '',
			isLoadingVersion: false,
			publicationFormIds: [],
			submission: null,
			submissionApiUrl: '',
			submissionLibraryUrl: '',
			supportsReferences: false,
			uploadFileUrl: '',
			workingPublication: null
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
		publicationTabsLabel() {
			return this.__('publicationTabsLabel', {
				version: this.workingPublication.id
			});
		}
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
					'X-Csrf-Token': this.csrfToken
				},
				error(r) {
					self.isLoadingVersion = false;
					self.ajaxErrorCallback(r);
				},
				success(r) {
					self.publicationList.push({
						id: r.id,
						datePublished: r.datePublished,
						status: r.status
					});
					self.workingPublication = {};
					self.workingPublication = r;
					self.$nextTick(() => {
						self.setFocusIn(self.$refs.publication);

						// Enforce a minimum 3-second delay when a new
						// version is created. We do this to force the
						// user to slow down and process what happened.
						// We hope this will reinforce the perception
						// that cerating a new version is a "big
						// action", and properly communicate the scale
						// of what has happened behind the scenes.
						const nowTime = new Date();
						const timeDiff = nowTime - startTime;
						if (timeDiff / 1000 >= 3) {
							self.isLoadingVersion = false;
						} else {
							setTimeout(() => {
								self.isLoadingVersion = true;
							}, timeDiff);
						}
					});
				}
			});
		},

		/**
		 * Helper method to access a global constant in the template
		 *
		 * @return {Object}
		 */
		getConstant(constant) {
			return pkp.const[constant];
		},

		/**
		 * Load/reload the contributors grid
		 *
		 * @param Object publication Load contributors for this publication
		 */
		loadContributorsGrid(publication) {
			if (!this.$refs.contributors) {
				return;
			}
			const $contributorsEl = $(this.$refs.contributors);
			const sourceUrl = this.contributorsGridUrl.replace(
				'__publicationId__',
				publication.id
			);
			if (!$.pkp.classes.Handler.hasHandler($contributorsEl)) {
				$contributorsEl.pkpHandler('$.pkp.controllers.UrlInDivHandler', {
					sourceUrl: sourceUrl,
					refreshOn: 'form-success'
				});
			} else {
				const contributorHandler = $.pkp.classes.Handler.getHandler(
					$contributorsEl
				);
				contributorHandler.setSourceUrl(sourceUrl);
				contributorHandler.reload();
			}
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
				publication.id
			);
			if (!$.pkp.classes.Handler.hasHandler($representationsEl)) {
				$representationsEl.pkpHandler('$.pkp.controllers.UrlInDivHandler', {
					sourceUrl: sourceUrl,
					refreshOn: 'form-success'
				});
			} else {
				const representationsHandler = $.pkp.classes.Handler.getHandler(
					$representationsEl
				);
				representationsHandler.setSourceUrl(sourceUrl);
				representationsHandler.reload();
			}
		},

		/**
		 * Open a modal displaying the editorial history
		 */
		openActivity() {
			var opts = {
				title: this.i18n.activityLog,
				url: this.editorialHistoryUrl,
				closeCallback: () => this.$refs.activityButton.$el.focus()
			};

			$(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabIndex="-1"></div>'
			).pkpHandler('$.pkp.controllers.modal.AjaxModalHandler', opts);
		},

		/**
		 * Open a file upload modal
		 *
		 * Only used in author dashboard
		 */
		openFileUpload() {
			alert('todo: ' + this.uploadFileUrl);
		},

		/**
		 * Open a modal displaying the editorial history
		 */
		openLibrary() {
			var opts = {
				title: this.i18n.submissionLibrary,
				url: this.submissionLibraryUrl,
				closeCallback: () => this.$refs.library.$el.focus()
			};

			$(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabIndex="-1"></div>'
			).pkpHandler('$.pkp.controllers.modal.AjaxModalHandler', opts);
		},

		/**
		 * Open a modal with the final publishing confirmation steps
		 */
		openPublish() {
			const sourceUrl = this.publishUrl.replace(
				'__publicationId__',
				this.workingPublication.id
			);

			const opts = {
				title: this.i18n.publish,
				url: sourceUrl,
				closeCallback: () => {
					if (this.$refs.publish) {
						this.$refs.publish.$el.focus();
					} else if (this.$refs.createVersion) {
						this.$refs.createVersion.$el.focus();
					}
					this.setFocusIn(this.$refs.publication);
				},
				closeOnFormSuccessId: pkp.const.FORM_PUBLISH
			};

			$(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabIndex="-1"></div>'
			).pkpHandler('$.pkp.controllers.modal.AjaxModalHandler', opts);
		},

		/**
		 * Open a confirmation modal before unpublishing a publication
		 */
		openUnpublish() {
			const focusTarget = document.activeElement;
			const modalOptions = {
				modalHandler: '$.pkp.controllers.modal.ConfirmationModalHandler',
				title: '',
				okButton: this.i18n.ok,
				cancelButton: this.i18n.cancel,
				dialogText:
					this.workingPublication.status === pkp.const.STATUS_SCHEDULED
						? this.i18n.unscheduleConfirm
						: this.i18n.unpublishConfirm,
				callback: () => {
					this.unpublish(this.workingPublication);
				},
				closeCallback: () => {
					if (focusTarget) {
						focusTarget.focus();
					}
				}
			};

			$(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>'
			).pkpHandler(modalOptions.modalHandler, modalOptions);
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
					submission.publications.forEach(publication =>
						self.updatePublication(publication)
					);
					delete submission.publications;
					self.submission = {};
					self.submission = submission;
				},
				error(r) {
					self.ajaxErrorCallback(r);
				}
			});
		},

		/**
		 * Update the publication forms to match a particular publication
		 *
		 * @param Object publication
		 */
		setPublicationForms(publication) {
			this.publicationFormIds.forEach(formId => {
				if (!this.components[formId]) {
					return;
				}

				// Update form action URLs and field values
				let form = {...this.components[formId]};
				form.action = this.submissionApiUrl + '/publications/' + publication.id;
				form.fields = form.fields.map(field => {
					if (Object.keys(publication).includes(field.name)) {
						field.value = publication[field.name];
					}
					return field;
				});

				// Add/remove save button depending on publication status
				form.pages = form.pages.map(page => {
					if (publication.status === pkp.const.STATUS_PUBLISHED) {
						delete page['submitButton'];
					} else {
						page.submitButton = {label: this.i18n.save};
					}
					return page;
				});

				// Pass the publication status to the issue selection field
				if (formId === pkp.const.FORM_JOURNAL_ENTRY) {
					form.fields = form.fields.map(field => {
						if (field.name === 'issueId') {
							field.publicationStatus = publication.status;
						}
						return field;
					});
				}

				// Pass identifier requirements to the DOI/URN fields
				if (formId === pkp.const.FORM_PUBLICATION_IDENTIFIERS) {
					form.fields = form.fields.map(field => {
						if (field.name === 'pub-id::doi') {
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
					self.updatePublication(r);
					self.$nextTick(() => {
						self.setFocusIn(self.$refs.publication);
						self.isLoadingVersion = false;
					});
				}
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
				type: 'PUT',
				headers: {
					'X-Csrf-Token': this.csrfToken
				},
				error(r) {
					self.isLoadingVersion = false;
					self.ajaxErrorCallback(r);
				},
				success(r) {
					self.workingPublication = {};
					self.workingPublication = r;
					self.updatePublication(r);
					self.isLoadingVersion = false;
					self.setFocusIn(self.$refs.publication);
					self.refreshSubmission();
				}
			});
		},

		/**
		 * Update a publication's details
		 */
		updatePublication(newPublication) {
			this.publicationList.forEach(publication => {
				if (publication.id === newPublication.id) {
					(publication.id = newPublication.id),
						(publication.datePublished = newPublication.datePublished);
					publication.status = newPublication.status;
				}
			});
			if (this.workingPublication.id === newPublication.id) {
				this.workingPublication = {};
				this.workingPublication = newPublication;
			}
			if (this.currentPublication.id === newPublication.id) {
				this.currentPublication = {};
				this.currentPublication = newPublication;
			}
		}
	},
	watch: {
		workingPublication(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.setPublicationForms(newVal);
			this.loadContributorsGrid(newVal);
			this.loadRepresentationsGrid(newVal);
		}
	},
	created() {
		/**
		 * Subscribe to publication forms and update the publication
		 * with the details that have changed
		 */
		pkp.eventBus.$on('form-success', (formId, newPublication) => {
			if (this.publicationFormIds.includes(formId)) {
				this.updatePublication(newPublication);
			}

			// Update the submission's status when the publish form is completed
			if (formId === pkp.const.FORM_PUBLISH) {
				this.setPublicationForms(newPublication);
				this.refreshSubmission();
			}
		});

		/**
		 * Update the working publication authors when the authors are updated
		 */
		pkp.eventBus.$on('authorsUpdated', () => {
			let self = this;
			$.ajax({
				url:
					this.submissionApiUrl + '/publications/' + this.workingPublication.id,
				type: 'GET',
				success(publication) {
					self.updatePublication(publication);
				}
			});
		});
	},
	mounted() {
		/**
		 * Load publication grids
		 *
		 * Add a delay to allow the workflow requests to be sent first
		 */
		setTimeout(() => {
			this.loadContributorsGrid(this.workingPublication);
			this.loadRepresentationsGrid(this.workingPublication);
		}, 1000);

		/**
		 * Open the unpublish confirmation modal when a global unpublish
		 * event is fired
		 */
		pkp.eventBus.$on('unpublish:publication', this.openUnpublish);
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpWorkflow__header {
	margin-bottom: 2rem;
	padding: 0;
	min-height: 2rem;
}

.pkpWorkflow__identification {
	font-size: @font-sml;
	font-weight: @normal;
	line-height: 2rem;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
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
	margin: -@double -@double 0;
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
	margin: 0 -@double;
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

	.pkpTab .pkpForm {
		margin-right: -@base;
		border-top: none;
		border-right: none;

		@media (min-width: 767px) {
			margin-right: -@double;
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
	transition: opacity 0.6s, visibility 0.6s;

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

// Integrate the grids in the publication tab
#contributors-grid,
#representations-grid {
	padding-top: @double;
}
</style>
