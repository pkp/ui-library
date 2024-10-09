import {defineComponentStore} from '@/utils/defineComponentStore';
import {useTranslation} from '@/composables/useTranslation';
import {useAnnouncer} from '@/composables/useAnnouncer';
import {useFetch} from '@/composables/useFetch';
import {computed, onMounted, ref, watch} from 'vue';
import {useUrl} from '@/composables/useUrl';
import {useModal} from '@/composables/useModal';

export const useAcceptInvitationPageStore = defineComponentStore(
	'userInvitationPage',
	(pageInitConfig) => {
		const {openDialog} = useModal();
		const {t} = useTranslation();

		/** Announcer */

		const {announce} = useAnnouncer();

		/** Accept invitation payload, initial value*/
		const acceptinvitationPayload = ref({});
		/** Updated values only for invitation payload*/
		const updatedPayload = ref({});

		const email = ref({});
		const userId = ref({});

		/** Create receive invitation url */
		const receiveInvitationUrl = computed(() => {
			const {apiUrl} = useUrl('invitations');
			return (
				apiUrl.value +
				'/' +
				pageInitConfig.invitationId +
				'/key/' +
				pageInitConfig.invitationKey
			);
		});

		/**
		 * Get invitation data object
		 * request with invitation key and id
		 */
		async function receiveInvitation() {
			const {data, validationError, fetch} = useFetch(receiveInvitationUrl, {
				expectValidationError: true,
				method: 'GET',
			});
			await fetch();
			if (validationError.value) {
				errors.value = validationError.value;
			} else {
				updateAcceptInvitationPayload(
					'familyName',
					data.value.payload.familyName,
					true,
				);
				updateAcceptInvitationPayload(
					'givenName',
					data.value.payload.givenName,
					true,
				);
				updateAcceptInvitationPayload('orcid', data.value.payload.orcid, true);
				updateAcceptInvitationPayload(
					'userGroupsToAdd',
					data.value.payload.userGroupsToAdd,
					true,
				);
				email.value = data.value.email;
				userId.value = data.value.userId;
				errors.value = [];
				if (steps.value.length === 0) {
					await submit();
				}
			}
		}

		function updateAcceptInvitationPayload(
			fieldName,
			value,
			initialValue = false,
		) {
			acceptinvitationPayload.value[fieldName] = value;
			if (!initialValue) {
				updatedPayload.value[fieldName] = value;
			}
		}

		/** Steps */
		const currentStepId = ref(
			pageInitConfig.steps[0] ? pageInitConfig.steps[0].id : '',
		);
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

		const formSteps = computed(() => {
			return steps.value.filter((step) => step.type === 'form');
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
			if (isOnLastStep.value) {
				submit();
			} else {
				await updateInvitationPayload();
				if (currentStepErrorsPerSection.value.length === 0) {
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
				openStep(steps.value[previousIndex].id);
			}
		}

		/** Errors */
		const errors = ref({});
		/**
		 * Set current step section errors
		 */
		const currentStepErrorsPerSection = computed(() => {
			let error = [];
			if (Object.keys(errors.value).length != 0) {
				currentStep.value.sections.forEach((element, index) => {
					if (element.props.validateFields.length > 0) {
						let sectionErr = {};
						element.props.validateFields.forEach((field) => {
							if (Object.keys(errors.value).includes(field)) {
								sectionErr[field] = errors.value[field];
							}
						});
						if (Object.keys(sectionErr).length != 0) {
							error[index] = sectionErr;
						}
					}
				});
			}

			return error;
		});

		/**
		 * Are there any validation errors?
		 */
		const isValid = computed(() => {
			return Object.keys(errors.value).length === 0;
		});

		/** Page titles*/
		const pageTitleDescription = ref(pageInitConfig.pageTitleDescription);
		/**
		 * The title to show at the top of the page
		 */
		const pageTitle = computed(() => {
			if (!currentStep.value) {
				return '';
			}
			return currentStep.value.name.replace(
				'{$step}',
				pageInitConfig.pageTitle,
			);
		});

		/**
		 * The step title to show at the top of the step
		 */
		const stepTitle = computed(() => {
			if (!currentStep.value) {
				return '';
			}
			return currentStep.value.stepName.replace(
				'{$step}',
				'STEP ' + (1 + currentStepIndex.value),
			);
		});

		/**
		 * The step next button name
		 */
		const stepButtonTitle = computed(() => {
			if (!currentStep.value) {
				return '';
			}
			return currentStep.value.stepButtonName;
		});

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

		/** Create update invitation url */
		const updateInvitationUrl = computed(() => {
			const {apiUrl} = useUrl('invitations');
			return (
				apiUrl.value +
				'/' +
				pageInitConfig.invitationId +
				'/key/' +
				pageInitConfig.invitationKey +
				'/refine'
			);
		});

		/**
		 * Update the payload
		 *
		 * Opens a confirmation dialog and then makes the submission
		 * request with any required confirmation fields
		 */
		async function updateInvitationPayload() {
			const {validationError, fetch} = useFetch(updateInvitationUrl, {
				expectValidationError: true,
				method: 'PUT',
				body: updatedPayload.value,
			});
			await fetch();
			if (validationError.value) {
				errors.value = validationError.value;
			} else {
				errors.value = [];
			}
		}

		/** Create accpet invitation url */
		const finalizeInvitationUrl = computed(() => {
			const {apiUrl} = useUrl('invitations');
			return (
				apiUrl.value +
				'/' +
				pageInitConfig.invitationId +
				'/key/' +
				pageInitConfig.invitationKey +
				'/finalize'
			);
		});
		/**
		 * Complete the submission
		 *
		 * Opens a confirmation dialog and then makes the submission
		 * request with any required confirmation fields
		 */
		async function submit() {
			await updateInvitationPayload();
			if (isValid.value) {
				const {data, fetch} = useFetch(finalizeInvitationUrl, {
					expectValidationError: true,
					method: 'PUT',
					body: {},
				});

				await fetch();
				if (data.value) {
					openDialog({
						title: t('acceptInvitation.modal.title'),
						message: t('acceptInvitation.modal.message'),
						actions: [
							{
								label: t('acceptInvitation.modal.button'),
								callback: (close) => {
									close();
								},
							},
						],
						modalStyle: 'success',
					});
				}
			}
		}

		onMounted(async () => {
			announce(t('common.loading'));
			await receiveInvitation();
			if (steps.value[0]) {
				openStep(steps.value[0].id);
			}
			announce(t('common.loaded'));
		});

		return {
			//computed
			currentStep,
			currentStepIndex,
			isOnFirstStep,
			isOnLastStep,
			isValid,
			pageTitle,
			startedSteps,
			stepTitle,
			openStep,
			steps,
			pageTitleDescription,
			errors,
			stepButtonTitle,
			formSteps,

			//methods
			nextStep,
			previousStep,
			updateAcceptInvitationPayload,

			//refs
			acceptinvitationPayload,
			email,
			userId,
		};
	},
);
