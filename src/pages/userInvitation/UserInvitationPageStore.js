import {defineComponentStore} from '@/utils/defineComponentStore';
import {useLocalize} from '@/composables/useLocalize';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {computed, onMounted, ref, watch} from 'vue';
import {useModal} from '@/composables/useModal';
export const useUserInvitationPageStore = defineComponentStore(
	'userInvitationPage',
	(pageInitConfig) => {
		const {openDialog} = useModal();
		const {t} = useLocalize();
		/**
		 * email templates api url for search emails
		 */
		const emailTemplatesApiUrl = ref(pageInitConfig.emailTemplatesApiUrl);
		/**
		 * Invitation payload, initial value
		 */
		const invitationPayload = ref({...pageInitConfig.invitationPayload});
		/**
		 * Invitation updated payload, updated by adding new values
		 */
		const updatedPayload = ref({});
		const invitationType = ref(pageInitConfig.invitationType);
		const invitationMode = ref(pageInitConfig.invitationMode);

		function updatePayload(fieldName, value, initialValue = true) {
			invitationPayload.value[fieldName] = value;
			if (!initialValue) {
				updatedPayload.value[fieldName] = value;
				// when user type and remove the values, updated fields should remove from the payloads
				if (
					value !== null &&
					typeof value === 'object' &&
					Object.keys(value).length === 0
				) {
					delete invitationPayload.value[fieldName];
					delete updatedPayload.value[fieldName];
				}
			}
		}

		/**
		 * Steps
		 */
		const currentStepId = ref(pageInitConfig.steps[0].id);
		const steps = ref(pageInitConfig.steps);
		const startedSteps = ref([]);

		/**
		 * The currently active step
		 */
		const currentStep = computed(() => {
			return steps.value.find((step) => step.id === currentStepId.value);
		});
		/**
		 * The index of the currently active step
		 * in the steps array
		 */
		const currentStepIndex = computed(() => {
			return steps.value.findIndex((step) => step.id === currentStepId.value);
		});
		/**
		 * Is the current step the first step?
		 */
		const isOnFirstStep = computed(() => {
			return !currentStepIndex.value;
		});

		/**
		 * Is the current step the last step?
		 */
		const isOnLastStep = computed(() => {
			return currentStepIndex.value === steps.value.length - 1;
		});

		/**
		 * Add a step change to the browser history so the
		 * user can use the browser's back button
		 *
		 * @param {Object} step The step to add
		 */
		function addHistory(step) {
			window.history.pushState({}, step.name, '#' + step.id);
		}

		/**
		 * Go to the next step or submit if this is the last step
		 */
		async function nextStep() {
			if (registeredActionsForSteps[currentStep.value.id]) {
				let shouldContinue = true;
				shouldContinue =
					await registeredActionsForSteps[currentStep.value.id]();
				if (!shouldContinue) {
					return;
				}
			}
			if (isOnLastStep.value) {
				submitInvitation();
			} else {
				if (!currentStep.value?.skipInvitationUpdate) {
					await updateInvitation();
					if (isValid.value) {
						openStep(steps.value[1 + currentStepIndex.value].id);
					}
				} else {
					openStep(steps.value[1 + currentStepIndex.value].id);
				}
			}
		}

		/**
		 * Go to a step in the wizard
		 *
		 * @param {String} stepId
		 */
		function openStep(stepId) {
			startedSteps.value = [...new Set([...startedSteps.value, stepId])];
			const newStep = steps.value.find((step) => step.id === stepId);
			if (!newStep) {
				return;
			}
			errors.value = [];
			currentStepId.value = stepId;
		}

		/**
		 * Go to the previous step in the wizard
		 */
		function previousStep() {
			const previousIndex = currentStepIndex.value - 1;
			if (previousIndex >= 0) {
				// when user search and go back agin to search reset payload to initial state
				if (previousIndex === 0) {
					invitationPayload.value = {...pageInitConfig.invitationPayload};
					updatedPayload.value = {};
				}
				openStep(steps.value[previousIndex].id);
				userSearch.value = {
					message: '',
					class: '',
				};
			}
		}
		/**
		 * Update when the step changes
		 */
		watch(currentStepIndex, async (newVal, oldVal) => {
			if (newVal === oldVal) {
				return;
			}

			// Update the list of steps that have been started
			steps.value.forEach((step, i) => {
				if (
					!startedSteps.value.includes(step.id) &&
					i <= currentStepIndex.value
				) {
					startedSteps.value.push(step.id);
				}
			});

			// Track step changes in the title and browser history
			const step = steps.value[newVal];
			if (step.id !== window.location.hash.replace('#', '')) {
				addHistory(step);
			}
		});

		watch(
			invitationPayload,
			async (newVal, oldVal) => {
				if (
					newVal.inviteeEmail === createInvitationPayload.value.inviteeEmail
				) {
					return;
				}

				// If change of email new invitation will be created
				invitationId.value = null;
			},
			{deep: true},
		);

		/** Page titles */
		const pageTitleDescription = ref(pageInitConfig.pageTitleDescription);
		const primaryLocale = ref(pageInitConfig.primaryLocale);
		/**
		 * The title to show at the top of the page
		 */
		const pageTitle = computed(() => {
			return pageInitConfig.pageTitle;
		});

		/**
		 * The step title to show at the top of the step
		 */
		const stepTitle = computed(() => {
			if (!currentStep.value) {
				return '';
			}
			return currentStep.value.stepLabel.replace(
				'{$step}',
				t('invitation.step') + ' ' + (1 + currentStepIndex.value),
			);
		});

		/** All Errors */
		const errors = ref({});
		/** User search message */
		const userSearch = ref({
			message: '',
			class: '',
		});

		/**
		 * Are there any validation errors?
		 */
		const isValid = computed(() => {
			return !Object.keys(errors.value).length;
		});

		const createInvitationPayload = computed(() => {
			if (invitationPayload.value.userId) {
				return {
					invitationData: {
						userId: invitationPayload.value.userId,
					},
				};
			}
			return {
				invitationData: {
					inviteeEmail: invitationPayload.value.inviteeEmail,
				},
			};
		});

		const updateInvitationPayload = computed(() => {
			let invitationData = {
				...updatedPayload.value,
				userGroupsToAdd: invitationPayload.value.userGroupsToAdd,
			};
			return {
				invitationData: invitationData,
			};
		});
		/**
		 * Invitation actions
		 */
		const invitationId = ref(null);
		/**
		 * Create invitation
		 */
		async function createInvitation() {
			const {apiUrl} = useUrl(`invitations/add/${invitationType.value}`);

			const {
				data,
				fetch: createInvitation,
				validationError,
			} = useFetch(apiUrl, {
				method: 'POST',
				body: createInvitationPayload.value,
				expectValidationError: true,
			});
			await createInvitation();

			if (validationError.value) {
				errors.value = validationError.value.errors;
			} else {
				errors.value = [];
				invitationId.value = data.value.invitationId;
			}
		}

		/** Update invitation */
		async function updateInvitation() {
			errors.value = [];
			userSearch.value = {};
			if (!invitationId.value) {
				await createInvitation();
			}
			if (isValid.value) {
				const {apiUrl} = useUrl(`invitations/${invitationId.value}/populate`);

				const {fetch, validationError} = useFetch(apiUrl, {
					method: 'PUT',
					body: updateInvitationPayload.value,
					expectValidationError: true,
				});
				await fetch();
				if (validationError.value) {
					errors.value = validationError.value.errors;
				} else {
					errors.value = [];
				}
			}
		}

		const {redirectToPage} = useUrl('management/settings/access');
		const isSubmitting = ref(false);
		/** Submit invitation */
		async function submitInvitation() {
			await updateInvitation();
			if (isValid.value) {
				isSubmitting.value = true;
				const {apiUrl} = useUrl(`invitations/${invitationId.value}/invite`);

				const {data, fetch} = useFetch(apiUrl, {
					method: 'PUT',
					body: {},
				});

				await fetch();
				if (data.value) {
					openDialog({
						title: t('userInvitation.modal.title'),
						message: t('userInvitation.modal.message', {
							email: invitationPayload.value.inviteeEmail,
						}),
						actions: [
							{
								label: t('userInvitation.modal.button'),
								callback: (close) => {
									redirectToPage();
								},
							},
						],
						modalStyle: 'primary',
					});
				} else {
					isSubmitting.value = false;
				}
			}
		}

		function cancel() {
			openDialog({
				name: 'cancel',
				title: t('invitation.cancelInvite.title'),
				message: t('userInvitation.cancel.message'),
				actions: [
					{
						label: t('invitation.cancelInvite.actionName'),
						isWarnable: true,
						callback: (close) => {
							redirectToPage();
						},
					},
					{
						label: t('userInvitation.cancel.goBack'),
						callback: (close) => {
							redirectToPage();
							close();
						},
					},
				],
				modalStyle: 'negative',
			});
		}

		const registeredActionsForSteps = {};
		function registerActionForStepId(stepId, callback) {
			if (stepId === 'searchUser') {
				invitationId.value = null;
			}
			registeredActionsForSteps[stepId] = callback;
		}

		onMounted(() => {
			/**
			 * Open the correct step when the page is loaded
			 */
			if (!window.location.hash) {
				openStep(steps.value[0].id);
			}
		});

		return {
			invitationPayload,
			updatePayload,
			registerActionForStepId,
			emailTemplatesApiUrl,

			currentStep,
			currentStepIndex,
			isOnFirstStep,
			isOnLastStep,
			isValid,
			pageTitle,
			startedSteps,
			stepTitle,
			openStep,
			isSubmitting,
			invitationMode,

			steps,
			pageTitleDescription,
			errors,
			userSearch,

			primaryLocale,

			nextStep,
			previousStep,
			cancel,
		};
	},
);
