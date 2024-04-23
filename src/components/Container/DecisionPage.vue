<script type="text/javascript">
import Page from '@/components/Container/Page.vue';
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import Composer from '@/components/Composer/Composer.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import PkpForm from '@/components/Form/Form.vue';
import SelectSubmissionFileListItem from '../ListPanel/submissionFiles/SelectSubmissionFileListItem.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import ajaxError from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog';
import localizeSubmission from '@/mixins/localizeSubmission.js';

const stepTypes = {
	email: 'email',
	form: 'form',
	promoteFiles: 'promoteFiles',
};

export default {
	components: {
		ButtonRow,
		Composer,
		ListPanel,
		PkpForm,
		SelectSubmissionFileListItem,
		Tooltip,
	},
	extends: Page,
	mixins: [ajaxError, dialog, localizeSubmission],
	data() {
		return {
			/** A localized string for the button to cancel recording a decision. */
			abandonDecisionLabel: '',
			/** A localized string for the confirmation prompt to cancel recording a decision. */
			cancelConfirmationPrompt: '',
			/** Tracks the currently open step. If not passed, the first step will be opened. Default: `{}` */
			currentStep: {},
			/** An integer representing the decision type. */
			decision: 0,
			/** A localized string when a decision has been recorded. See: `DecisionType::getCompletedLabel()` */
			decisionCompleteLabel: '',
			/** A localized string when a decision has been recorded. See: `DecisionType::getCompletedLabel()` */
			decisionCompleteDescription: '',
			/** A URL to the REST API to get email templates.  */
			emailTemplatesApiUrl: '',
			/** An array of the steps that have been started. Default: `[]` */
			startedSteps: [],
			/** Whether or not the decision is being recorded. Default: `false`  */
			isSubmitting: false,
			/** A localized string for the button to keep working in the confirmation prompt to cancel recording a decision. */
			keepWorkingLabel: '',
			/** The id of the review round this decision should be recorded in. Only pass a review round for decisions in the review stage. Default: `0` */
			reviewRoundId: 0,
			/** An array of steps that have been skipped. Default: `[]` */
			skippedSteps: [],
			/** The id of the workflow stage this decision should be recorded in. One of the `WORKFLOW_STAGE_ID_*` constants. */
			stageId: 0,
			/** An array of steps to record this decision. See usage guidance below. Default: `[]` */
			steps: [],
			/** The URL to the editorial workflow of the submission. */
			submissionUrl: '',
			/** The URL to the submission summary in dashboard. */
			submissionSummaryUrl: '',
			/** The URL to the submission in the REST API. */
			submissionApiUrl: '',
			/** The URL to the current user's submissions list. */
			submissionListUrl: '',
			/** A localized string for the button to view all submissions. */
			viewAllSubmissionsLabel: '',
			/** A localized string for the button to view this submission. */
			viewSubmissionLabel: '',
		};
	},
	computed: {
		/**
		 * The array index of the current step
		 */
		currentStepIndex() {
			return this.steps.findIndex((step) => step.id === this.currentStep.id);
		},

		/**
		 * Validation errors
		 */
		errors() {
			return this.steps
				.filter(
					(step) =>
						Object.keys(step.errors).length ||
						// Form steps store errors in the form
						(step.type === stepTypes.form &&
							Object.keys(step.form.errors).length),
				)
				.reduce((errors, step) => {
					errors[step.id] = this.replaceLocaleParams(this.stepErrorMessage, {
						stepName: step.name,
					});
					return errors;
				}, {});
		},

		/**
		 * Is the current step the first step?
		 */
		isOnFirstStep() {
			return 0 === this.currentStepIndex;
		},

		/**
		 * Is the current step the last step?
		 */
		isOnLastStep() {
			return this.currentStepIndex === this.steps.length - 1;
		},

		/**
		 * Indicate the decision was triggered from submission summary page
		 * or from workflow page
		 */
		returnUrlToSubmissionSummary() {
			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);
			const ret = urlParams.get('ret');
			console.log('RET:', ret);
			if (ret) {
				let returnUrl = decodeURIComponent(ret);
				return `${pkp?.context?.pageBaseUrl}${returnUrl}`;
			}

			return null;
		},
	},
	created() {
		if (this.steps.length) {
			/**
			 * Start the first step
			 */
			this.openStep(this.steps[0].id);

			/**
			 * Set up email data for each email step
			 */
			this.steps = this.steps.map((step) => {
				if (step.type !== stepTypes.email) {
					return step;
				}
				return {
					...step,
					attachments: [],
					subject: '',
					body: '',
					cc: '',
					bcc: '',
					recipients: step.recipientOptions.map((to) => to.value),
				};
			});
		}
	},
	methods: {
		/**
		 * Open a confirmation prompt to cancel the
		 * decision and return to the submission
		 */
		cancel() {
			const submissionUrl = this.returnUrlToSubmissionSummary
				? this.returnUrlToSubmissionSummary
				: this.submissionUrl;

			this.openDialog({
				name: 'cancel',
				title: this.abandonDecisionLabel,
				message: this.cancelConfirmationPrompt,
				actions: [
					{
						label: this.abandonDecisionLabel,
						isWarnable: true,
						callback: () => {
							window.location = submissionUrl;
						},
					},
					{
						label: this.keepWorkingLabel,
						callback: (close) => close(),
					},
				],
			});
		},

		/**
		 * Copy a file to a new file stage
		 *
		 * @param {Number} fileId The submission file id
		 * @param {Number} toFileStage The file stage to copy the submission to
		 * @param {Function} callback A callback function to fire when the request finished successfully
		 */
		copyFile(fileId, toFileStage, callback) {
			$.ajax({
				url:
					this.submissionApiUrl +
					'/files/' +
					fileId +
					'/copy?' +
					$.param({stageId: this.stageId}),
				type: 'POST',
				data: {
					toFileStage: toFileStage,
				},
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'PUT',
				},
				error: this.ajaxErrorCallback,
				complete: callback,
			});
		},

		/**
		 * Go to the next step or submit if this is the last step
		 */
		nextStep() {
			const nextIndex = 1 + this.currentStepIndex;
			if (this.steps.length <= nextIndex) {
				this.submit();
			} else {
				this.openStep(this.steps[nextIndex].id);
			}
		},

		/**
		 * Open the modal when decision is complete
		 */
		openCompletedDialog() {
			let actions;
			let close;

			if (this.returnUrlToSubmissionSummary) {
				actions = [
					{
						label: this.viewSubmissionSummaryLabel,
						element: 'a',
						href: this.returnUrlToSubmissionSummary,
					},
				];
				close = () => {
					window.location = this.returnUrlToSubmissionSummary;
				};
			} else {
				actions = [
					{
						label: this.viewSubmissionLabel,
						element: 'a',
						href: this.submissionUrl,
					},
					{
						label: this.viewAllSubmissionsLabel,
						element: 'a',
						href: this.submissionListUrl,
					},
				];
				close = () => {
					window.location = this.submissionUrl;
				};
			}
			this.openDialog({
				name: 'completed',
				title: this.decisionCompleteLabel,
				message: this.decisionCompleteDescription,
				actions,
				close,
			});
		},

		/**
		 * Go to a step in the wizard
		 *
		 * @param {String} stepId The id of the step to go to
		 */
		openStep(stepId) {
			this.startedSteps = [...new Set([...this.startedSteps, stepId])];
			this.currentStep = this.steps.find((step) => step.id === stepId);
		},

		/**
		 * Go to the previous step
		 */
		previousStep() {
			const previousIndex = this.currentStepIndex - 1;
			if (previousIndex >= 0) {
				this.openStep(this.steps[previousIndex].id);
			}
		},

		/**
		 * Handle errors related to the decision request
		 *
		 * This method maps validation errors to their step.
		 *
		 * @param {Object} errors A key/value map of errors where each key represents a step index
		 */
		setStepErrors(errors) {
			this.steps.forEach((step, index) => {
				if (index in errors === false) {
					return;
				}
				// Form steps store errors in the form
				if (step.type === stepTypes.form) {
					step.form.errors = errors[index];
				} else {
					step.errors = errors[index];
				}
			});
		},

		/**
		 * Skip a step and go to the next step or activate
		 * a skipped step
		 *
		 * @param {String} stepId The id of the step
		 */
		toggleSkippedStep(stepId) {
			if (this.skippedSteps.includes(stepId)) {
				this.skippedSteps = this.skippedSteps.filter((sid) => sid !== stepId);
			} else {
				this.skippedSteps.push(stepId);
				this.steps = this.steps.map((step) => {
					if (step.id === stepId) {
						step.errors = {};
					}
					return step;
				});
				if (
					this.steps.findIndex((step) => step.id === stepId) <
					this.steps.length - 1
				) {
					this.nextStep();
				}
			}
		},

		/**
		 * Submit an editorial decision
		 *
		 * This posts the editorial decison and copies
		 * all selected files when a file promotion step
		 * exists.
		 */
		submit() {
			this.isSubmitting = true;
			const steps = this.steps.filter(
				(step) => !this.skippedSteps.includes(step.id),
			);
			const data = {
				decision: this.decision,
				actions: steps
					.filter((step) =>
						[stepTypes.form, stepTypes.email].includes(step.type),
					)
					.map((step) => {
						let stepData = {id: step.id};
						if (step.type === stepTypes.form) {
							step.form.fields.forEach((field) => {
								stepData[field.name] = field.value;
							});
							return stepData;
						} else if (step.type === stepTypes.email) {
							const bcc = step.bcc.trim();
							const cc = step.cc.trim();
							return {
								...stepData,
								attachments: step.attachments,
								bcc: bcc
									? bcc.split(',').map((item) => {
											return item.trim();
										})
									: [],
								cc: cc
									? cc.split(',').map((item) => {
											return item.trim();
										})
									: [],
								locale: step.locale,
								recipients: step.canChangeRecipients ? step.recipients : [],
								subject: step.subject,
								body: step.body,
							};
						}
					}),
			};

			if (this.reviewRoundId) {
				data.reviewRoundId = this.reviewRoundId;
			}

			const files = steps
				.filter(
					(step) =>
						step.type === stepTypes.promoteFiles && step.selected.length,
				)
				.reduce((files, step) => {
					step.selected.forEach((fileId) => {
						files.push({
							id: fileId,
							toFileStage: step.to,
						});
					});
					return files;
				}, []);

			$.ajax({
				url: this.submissionApiUrl + '/decisions',
				type: 'POST',
				context: this,
				data: data,
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
				},
				error(r) {
					if (r.status && r.status === 400) {
						// The decision is invalid
						if (r.responseJSON.decision) {
							this.ajaxErrorCallback({
								responseJSON: {
									errorMessage: r.responseJSON.decision[0],
								},
							});
							// An action is invalid
						} else if (r.responseJSON.actions) {
							this.setStepErrors(r.responseJSON.actions);
						} else {
							this.ajaxErrorCallback(r);
						}
					} else {
						this.ajaxErrorCallback(r);
					}
					this.isSubmitting = false;
				},
				success() {
					if (!files.length) {
						this.isSubmitting = false;
						this.openCompletedDialog();
					}
					let copiedCount = 0;
					const copyCompleted = () => {
						copiedCount++;
						if (copiedCount >= files.length) {
							this.openCompletedDialog();
							clearInterval(copyCompleted);
						}
					};
					files.forEach((file) =>
						this.copyFile(file.id, file.toFileStage, copyCompleted),
					);
				},
			});
		},

		/**
		 * Update the data attached to a step
		 *
		 * @param {String} stepId The id of the step to update
		 * @param {Object} data The data to update in the step
		 */
		updateStep(stepId, data) {
			this.steps = this.steps.map((step) => {
				if (step.id !== stepId) {
					return step;
				}
				// Form steps store errors in the form
				if (step.type === stepTypes.form) {
					let errors = {...step.form.errors};
					Object.keys(data).forEach((key) => delete errors[key]);
					return {
						...step,
						form: {
							...step.form,
							...data,
							errors: errors,
						},
					};
				}
				let errors = {...step.errors};
				Object.keys(data).forEach((key) => delete errors[key]);
				return {
					...step,
					...data,
					errors: errors,
				};
			});
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.app__page--decision .app__pageHeading {
	margin: 0;
}

.app__page--decision .app__pageDescription {
	margin: 0 0 2rem;
	font-size: @font-sml;
	line-height: @line-sml;
}

.app__page--decision .pkpSteps__buttonWrapper {
	border: @bg-border-light;
	border-bottom: 0;
	border-top-left-radius: @radius;
	border-top-right-radius: @radius;
}

.decision__stepPanel {
	border-bottom: none;
	border-top: none;
	border-radius: 0;
}

.decision__stepHeader {
	h2 {
		margin: 0;
		font-size: @font-large;
		line-height: @line-large;
	}

	p {
		margin: 0.5rem 0 0;
		font-size: @font-sml;
		line-height: @line-sml-tight;
	}
}

.app__page--decision .panel.composer {
	border: none;

	.panelSection {
		padding: 0;
	}
}

.decision_filesList:not(:last-child) {
	margin-bottom: 2rem;
}

.listPanel--promoteFiles__selectWrapper {
	display: flex;
	align-items: center;
	margin-inline-start: -1rem;
}

.listPanel--promoteFiles__selector {
	width: 3rem;
	padding-inline-start: 1rem;
}

.decision__error {
	margin-bottom: 1rem;
}

// Hide the form footers, where error messages will appear
// These error messages are shown above the steps
.app__page--decision .pkpFormPage__footer {
	display: none;
}

.decision__footer__panel {
	border-top: none;
	border-radius: 0;

	.panelSection {
		padding-top: 0;
	}

	.panelSection__header {
		margin-bottom: 0;
	}
}

.decision__footer {
	display: flex;
	justify-content: flex-end;
	align-items: center;

	* + .pkpButton {
		margin-inline-start: 0.5rem;
	}
}

.decision__skipStep {
	margin-inline-end: auto;
	font-size: @font-tiny;
	order: -1;
}

.decision__footer--noSteps {
	margin-top: 2rem;
	padding: 0;
	background: transparent;
	border: none;
}
</style>
