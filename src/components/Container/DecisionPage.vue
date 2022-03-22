<script type="text/javascript">
import Page from '@/components/Container/Page.vue';
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
	promoteFiles: 'promoteFiles'
};

export default {
	extends: Page,
	mixins: [ajaxError, dialog, localizeSubmission],
	components: {
		Composer,
		ListPanel,
		PkpForm,
		SelectSubmissionFileListItem,
		Tooltip
	},
	data() {
		return {
			abandonDecisionLabel: '',
			cancelConfirmationPrompt: '',
			currentStep: {},
			decision: 0,
			decisionCompleteLabel: '',
			decisionCompleteDescription: '',
			emailTemplatesApiUrl: '',
			fileGenres: [],
			startedSteps: [],
			isSubmitting: false,
			keepWorkingLabel: '',
			reviewRoundId: 0,
			skippedSteps: [],
			stageId: 0,
			steps: [],
			submissionUrl: '',
			submissionApiUrl: '',
			submissionListUrl: '',
			viewAllSubmissionsLabel: '',
			viewSubmissionLabel: ''
		};
	},
	computed: {
		currentStepIndex() {
			return this.steps.findIndex(step => step.id === this.currentStep.id);
		},
		errors() {
			return this.steps
				.filter(
					step =>
						Object.keys(step.errors).length ||
						// Form steps store errors in the form
						(step.type === stepTypes.form &&
							Object.keys(step.form.errors).length)
				)
				.reduce((errors, step) => {
					errors[step.id] = this.replaceLocaleParams(this.stepErrorMessage, {
						stepName: step.name
					});
					return errors;
				}, {});
		},
		isOnFirstStep() {
			return 0 === this.currentStepIndex;
		},
		isOnLastStep() {
			return this.currentStepIndex === this.steps.length - 1;
		}
	},
	methods: {
		/**
		 * Cancel the decision and return to the submission
		 */
		cancel() {
			this.openDialog({
				name: 'cancel',
				title: this.abandonDecisionLabel,
				message: this.cancelConfirmationPrompt,
				actions: [
					{
						label: this.abandonDecisionLabel,
						isWarnable: true,
						callback: () => {
							window.location = this.submissionUrl;
						}
					},
					{
						label: this.keepWorkingLabel,
						callback: () => this.$modal.hide('cancel')
					}
				]
			});
		},

		/**
		 * Copy a file to a new file stage
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
					toFileStage: toFileStage
				},
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'PUT'
				},
				error: this.ajaxErrorCallback,
				complete: callback
			});
		},

		/**
		 * Get the genre of a submission file
		 */
		getFileGenre(genreId) {
			return this.fileGenres.find(genre => genre.id === genreId);
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
			this.openDialog({
				name: 'completed',
				title: this.decisionCompleteLabel,
				message: this.decisionCompleteDescription,
				actions: [
					{
						label: this.viewSubmissionLabel,
						element: 'a',
						href: this.submissionUrl
					},
					{
						label: this.viewAllSubmissionsLabel,
						element: 'a',
						href: this.submissionListUrl
					}
				],
				close: () => {
					window.location = this.submissionUrl;
				}
			});
		},

		/**
		 * Go to a step in the wizard
		 */
		openStep(stepId) {
			this.startedSteps = [...new Set([...this.startedSteps, stepId])];
			this.currentStep = this.steps.find(step => step.id === stepId);
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
		 */
		toggleSkippedStep(stepId) {
			if (this.skippedSteps.includes(stepId)) {
				this.skippedSteps = this.skippedSteps.filter(sid => sid !== stepId);
			} else {
				this.skippedSteps.push(stepId);
				this.steps = this.steps.map(step => {
					if (step.id === stepId) {
						step.errors = {};
					}
					return step;
				});
				if (
					this.steps.findIndex(step => step.id === stepId) <
					this.steps.length - 1
				) {
					this.nextStep();
				}
			}
		},

		/**
		 * Submit an editorial decision
		 */
		submit() {
			this.isSubmitting = true;
			let self = this;
			const steps = this.steps.filter(
				step => !this.skippedSteps.includes(step.id)
			);
			const data = {
				decision: this.decision,
				actions: steps
					.filter(step => [stepTypes.form, stepTypes.email].includes(step.type))
					.map(step => {
						let stepData = {id: step.id};
						if (step.type === stepTypes.form) {
							step.form.fields.forEach(field => {
								stepData[field.name] = field.value;
							});
							return stepData;
						} else if (step.type === stepTypes.email) {
							const bcc = step.bcc.trim();
							const cc = step.cc.trim();
							return {
								...stepData,
								attachments: step.attachments,
								bcc: bcc ? bcc.split(',') : [],
								cc: cc ? cc.split(',') : [],
								locale: step.locale,
								recipients: step.canChangeRecipients ? step.recipients : [],
								subject: step.subject,
								body: step.body
							};
						}
					})
			};

			if (this.reviewRoundId) {
				data.reviewRoundId = this.reviewRoundId;
			}

			const files = steps
				.filter(
					step => step.type === stepTypes.promoteFiles && step.selected.length
				)
				.reduce((files, step) => {
					step.selected.forEach(fileId => {
						files.push({
							id: fileId,
							toFileStage: step.to
						});
					});
					return files;
				}, []);

			$.ajax({
				url: this.submissionApiUrl + '/decisions',
				type: 'POST',
				data: data,
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken
				},
				error(r) {
					if (r.status && r.status === 400) {
						// The decision is invalid
						if (r.responseJSON.decision) {
							self.ajaxErrorCallback({
								responseJSON: {
									errorMessage: r.responseJSON.decision[0]
								}
							});
							// An action is invalid
						} else if (r.responseJSON.actions) {
							self.setStepErrors(r.responseJSON.actions);
						} else {
							self.ajaxErrorCallback(r);
						}
					} else {
						self.ajaxErrorCallback(r);
					}
					self.isSubmitting = false;
				},
				success() {
					if (!files.length) {
						self.isSubmitting = false;
						self.openCompletedDialog();
					}
					let copiedCount = 0;
					const copyCompleted = () => {
						copiedCount++;
						if (copiedCount >= files.length) {
							self.openCompletedDialog();
							clearInterval(copyCompleted);
						}
					};
					files.forEach(file =>
						self.copyFile(file.id, file.toFileStage, copyCompleted)
					);
				}
			});
		},

		/**
		 * Update the data attached to a step
		 */
		updateStep(stepId, data) {
			this.steps = this.steps.map(step => {
				if (step.id !== stepId) {
					return step;
				}
				// Form steps store errors in the form
				if (step.type === stepTypes.form) {
					let errors = {...step.form.errors};
					Object.keys(data).forEach(key => delete errors[key]);
					return {
						...step,
						form: {
							...step.form,
							...data,
							errors: errors
						}
					};
				}
				let errors = {...step.errors};
				Object.keys(data).forEach(key => delete errors[key]);
				return {
					...step,
					...data,
					errors: errors
				};
			});
		}
	},
	created() {
		// Start step 1
		if (this.steps.length) {
			this.openStep(this.steps[0].id);

			// Set up email data for each email step
			this.steps = this.steps.map(step => {
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
					recipients: step.recipientOptions.map(to => to.value)
				};
			});
		}
	}
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
	margin-bottom: 2rem;
	border: @bg-border-light;
	border-radius: @radius;
}

.decision_filesList:not(:last-child) {
	margin-bottom: 2rem;
}

.listPanel--promoteFiles__selectWrapper {
	display: flex;
	align-items: center;
	margin-left: -1rem;
}

.listPanel--promoteFiles__selector {
	width: 3rem;
	padding-left: 1rem;
}

.decision__error {
	margin-bottom: 1rem;
}

// Hide the form footers, where error messages will appear
// These error messages are shown above the steps
.app__page--decision .pkpFormPage__footer {
	display: none;
}

.decision__footer {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	padding: 1rem;
	background: @lift;
	border: @bg-border-light;
	border-top: none;

	* + .pkpButton {
		margin-left: 0.5rem;
	}
}

.decision__skipStep {
	font-size: @font-tiny;
	order: -1;
	margin-right: auto;
}

@media (min-width: 1200px) {
	.decision__footer {
		padding: 2rem;
	}
}

.decision__footer--noSteps {
	justify-content: flex-start;
	padding: 0;
	background: transparent;
	border: none;
}
</style>
