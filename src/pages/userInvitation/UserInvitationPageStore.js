import {defineComponentStore} from '@/utils/defineComponentStore';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {computed, onMounted, ref, watch} from 'vue';
import {useModal} from '@/composables/useModal';
export const useUserInvitationPageStore = defineComponentStore(
	'userInvitationPage',
	(pageInitConfig) => {
		const {openDialog} = useModal();

		/** Invitation payload, initial valu */
		const invitationPayload = ref({...pageInitConfig.invitationPayload});

		function updatePayload(fieldName, value) {
			invitationPayload.value[fieldName] = value;
		}

		/** Steps */
		const currentStepId = ref(pageInitConfig.steps[0].id);
		const steps = ref(pageInitConfig.steps);
		const pageTitleDescription = ref(pageInitConfig.pageTitleDescription);
		const primaryLocale = ref(pageInitConfig.primaryLocale);
		const errors = ref({});
		const startedSteps = ref([]);
		const user = ref(pageInitConfig.user);

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
		 * Are there any validation errors?
		 */
		const isValid = computed(() => {
			return Object.keys(errors.value).length === 0;
		});
		/**
		 * The title to show at the top of the page
		 */
		const pageTitle = computed(() => {
			if (!currentStep.value) {
				return '';
			}
			return currentStep.value.name.replace('{$step}', currentStep.value);
		});

		/**
		 * The step title to show at the top of the step
		 */
		const stepTitle = computed(() => {
			if (!currentStep.value) {
				return '';
			}
			return currentStep.value.reviewName.replace(
				'{$step}',
				'STEP -' + (1 + currentStepIndex.value),
			);
		});

		/** Handling invitation */
		const invitationId = ref(null);
		/**
		 * Create invitation
		 */
		async function createInvitation() {
			const {apiUrl} = useUrl('invitations');

			const {data, fetch: createInvitation} = useFetch(apiUrl, {
				method: 'POST',
				body: {type: pageInitConfig.invitationType},
			});
			await createInvitation();
			invitationId.value = data.value.invitationId;
		}

		/** Update Invitation */
		async function updateInvitation() {
			if (!invitationId.value) {
				await createInvitation();
			}

			const {apiUrl} = useUrl(`invitations/${invitationId.value}`);

			const {fetch, validationError} = useFetch(apiUrl, {
				method: 'POST',
				body: invitationPayload.value,
				expectValidationError: true,
			});

			if (validationError.value) {
				errors.value = validationError.value;
			} else {
				errors.value = [];
			}

			await fetch();
		}

		/** Submit invitation */
		async function submitInvitation() {
			const {apiUrl} = useUrl(`invitations/${invitationId.value}/submit`);

			const {data, fetch} = useFetch(apiUrl, {
				method: 'POST',
				body: {},
			});

			await fetch();
			if (data.value) {
				openDialog({
					title: 'Invitation sent',
					actions: [
						{
							label: 'Ok',
							callback: (close) => {
								close();
							},
						},
					],
				});
			}
		}

		const registeredActionsForSteps = {};
		function registerActionForStepId(stepId, callback) {
			registeredActionsForSteps[stepId] = callback;
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
			// document.title = this.getPageTitle(step);
			if (step.id !== window.location.hash.replace('#', '')) {
				addHistory(step);
			}

			// Trigger validation on the review step
			if (newVal === steps.value.length - 1) {
				// validate();
			}
		});

		onMounted(() => {
			/**
			 * Open the correct step when the page is loaded
			 */
			if (!window.location.hash) {
				openStep(steps.value[0].id);
			}
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
					// this needs to check only relevant errors for given step using the step.validateFields
					if (!errors.value?.length) {
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
			const newStep = steps.value.find((step) => step.id === stepId);
			if (!newStep) {
				return;
			}
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

		return {
			invitationPayload,
			updatePayload,
			registerActionForStepId,
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

			//page values
			steps,
			pageTitleDescription,
			errors,
			user,

			//form feilds
			primaryLocale,

			//methods
			nextStep,
			previousStep,
		};
	},
);
