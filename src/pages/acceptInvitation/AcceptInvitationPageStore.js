import {useTranslation} from '@/composables/useTranslation';

import {defineComponentStore} from '@/utils/defineComponentStore';
import {useFetch} from '@/composables/useFetch';
import {computed, onMounted, ref, watch} from 'vue';
//let pageInitConfig = null;

/*export function initSubmissionsPageStore(_pageInitConfig) {
	pageInitConfig = _pageInitConfig;
}

export function disposeSubmissionsPageStore() {
	const store = useSubmissionsPageStore();
	store.$dispose();
	pageInitConfig = null;
	delete getActivePinia().state.value[store.$id];
}*/

export const useAcceptInvitationPageStore = defineComponentStore(
	'userInvitationPage',
	(pageInitConfig) => {
		/**
		 * Translation
		 */

		const {t} = useTranslation();

		const currentStepId = ref(pageInitConfig.steps[0].id);
		const steps = ref(pageInitConfig.steps);
		const pageTitleDescription = ref(pageInitConfig.pageTitleDescription);
		const errors = ref({});
		const startedSteps = ref([]);
		const isModalOpened = ref(false);
		const reviewSteps = ref([]);

		const emailField = ref({
			label: t('user.email'),
			name: 'email',
			size: 'large',
			value: '',
			allErrors: {},
		});

		const usernameField = ref({
			label: t('user.username'),
			name: 'username',
			size: 'large',
			value: '',
			allErrors: {},
		});
		const passwordField = ref({
			label: t('user.password'),
			name: 'password',
			size: 'large',
			value: '',
			inputType: 'password',
			allErrors: {},
		});
		const password = ref('');
		const username = ref('');
		const user = ref('');
		const email = ref(pageInitConfig.userEmail);
		emailField.value.value = email;

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
		 * accept invitation request
		 */
		const updateUserRequestBody = computed(() => {
			const reqBody = {
				username: username.value,
				password: password.value,
				email: email.value,
				invitationId: pageInitConfig.invitationId,
				invitationKey: pageInitConfig.invitationKey,
			};
			steps.value.forEach((step) => {
				step.sections.forEach((section) => {
					if (section.type === 'form' || section.length > 0) {
						section.form.fields.forEach((field) => {
							reqBody[field.name] = field.value;
						});
					}
				});
			});

			return reqBody;
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
			// document.title = this.getPageTitle(step);
			if (step.id !== window.location.hash.replace('#', '')) {
				addHistory(step);
			}

			// Trigger validation on the review step
			if (newVal === steps.value.length - 1) {
				validateOnServer(steps.value[currentStepIndex.value].id);
			}
		});

		/**
		 * Set form data when validation errors are changed
		 */
		watch(errors, async (newVal, oldVal) => {
			const keys = Object.keys(newVal);
			steps.value.forEach((step, stepIndex) => {
				step.sections.forEach((section, sectionIndex) => {
					if (section.type === 'form') {
						section.form.fields.forEach((field) => {
							if (keys.includes(field.name)) {
								steps.value[stepIndex].sections[sectionIndex].form.errors = {
									...steps.value[stepIndex].sections[sectionIndex].form.errors,
									...{[field.name]: newVal[field.name]},
								};
							}
						});
					}
				});
			});
		});

		onMounted(() => {
			/**
			 * Open the correct step when the page is loaded
			 */
			if (!window.location.hash) {
				openStep(steps.value[0].id);
			}
		});

		function passwordChange(fieldName, propName, newValue, localeKey) {
			password.value = newValue;
			passwordField.value.value = newValue;
			passwordField.value.allErrors = {};
		}
		function usernameChange(fieldName, propName, newValue, localeKey) {
			username.value = newValue;
			usernameField.value.value = newValue;
			usernameField.value.allErrors = {};
		}

		function emailChange(fieldName, propName, newValue, localeKey) {
			email.value = newValue;
			email.value.value = newValue;
			email.value.allErrors = {};
		}
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
		function nextStep() {
			if (!validateOnClient(steps.value[currentStepIndex.value].id)) {
				return;
			}
			if (isOnLastStep.value) {
				submit();
			} else {
				openStep(steps.value[1 + currentStepIndex.value].id);
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

		/**
		 * Validate the user details
		 *
		 * Always wait for autosaves to complete before
		 * trying to validate
		 */
		function validateOnClient(stepId) {
			let isValidate = true;
			usernameField.value.allErrors = {};
			passwordField.value.allErrors = {};
			emailField.value.allErrors = {};
			if (stepId === 'userCreate') {
				if (username.value === '') {
					usernameField.value.allErrors.username = [t('validator.required')];
					isValidate = false;
				}
				if (password.value === '') {
					passwordField.value.allErrors.password = [t('validator.required')];
					isValidate = false;
				}
				if (email.value === '') {
					emailField.value.allErrors.email = [t('validator.required')];
					isValidate = false;
				}
			}
			if (stepId === 'userDetails') {
				const formErrors = {};
				steps.value.forEach((step, stepIndex) => {
					step.sections.forEach((section, sectionIndex) => {
						if (section.type === 'form') {
							section.form.fields.forEach((field) => {
								if (
									(field.value === '' || field.value === null) &&
									field.isRequired
								) {
									formErrors[field.name] = [t('validator.required')];
									isValidate = false;
								}
							});
						}
					});
				});
				errors.value = formErrors;
			}

			return isValidate;
		}
		/**
		 * Validate the user details
		 *
		 * Always wait for autosaves to complete before
		 * trying to validate
		 */
		async function validateOnServer(stepId) {
			let isValidate = true;
			updateUserRequestBody.value['_validateOnly'] = true;
			const {
				data: res,
				validationError,
				fetch,
			} = useFetch(pageInitConfig.userApiUrl + '/' + user.value.id, {
				expectValidationError: true,
				method: 'PUT',
				body: updateUserRequestBody.value,
			});
			await fetch();
			steps.value.forEach((step) => {
				if (step.id !== 'userCreate') {
					return;
				}
				step.reviewData[0] = {
					username: username.value,
					password: password.value,
					email: email.value,
				};
			});
			if (validationError.value) {
				isValidate = false;
				errors.value = validationError.value;
			} else if (res.value && !validationError.value) {
				errors.value = {};
			}
			return isValidate;
		}

		/**
		 * Update an autosave form
		 *
		 * @param {String} formId
		 * @param {Object} data
		 */
		function updateAutosaveForm(formId, data) {
			updateForm(formId, data);
		}

		/**
		 * Complete the submission
		 *
		 * Opens a confirmation dialog and then makes the submission
		 * request with any required confirmation fields
		 */
		async function submit() {
			if (pageInitConfig.userId) {
				const {
					data: res,
					validationError,
					fetch,
				} = useFetch(pageInitConfig.acceptInvitationApiUrl, {
					expectValidationError: true,
					method: 'PUT',
					body: {invitationKey: pageInitConfig.invitationKey},
				});
				await fetch();
				if (validationError.value) {
					errors.value = validationError.value;
				} else if (res.value && !validationError.value) {
					errors.value = {};
					isModalOpened.value = true;
				}
			} else {
				delete updateUserRequestBody.value._validateOnly;
				const {
					data: res,
					validationError,
					fetch,
				} = useFetch(pageInitConfig.userApiUrl + '/' + user.value.id, {
					expectValidationError: true,
					method: 'PUT',
					body: updateUserRequestBody.value,
				});
				await fetch();
				if (validationError.value) {
					errors.value = validationError.value;
				} else if (res.value && !validationError.value) {
					errors.value = {};
					isModalOpened.value = true;
				}
			}
		}

		/**
		 * Update a form with new data
		 *
		 * This is fired every time a form field changes, so
		 * resource-intensive code should not be run every
		 * time this method is called.
		 *
		 * @param {String} formId
		 * @param {Object} data
		 */
		function updateForm(formId, data) {
			steps.value.forEach((step, stepIndex) => {
				step.sections.forEach((section, sectionIndex) => {
					if (section.type !== 'form' || section.form.id !== formId) {
						return;
					}
					steps.value[stepIndex].sections[sectionIndex].form = {
						...steps.value[stepIndex].sections[sectionIndex].form,
						...data,
					};
				});
			});
		}
		/**
		 * Complete the submission
		 *
		 * Opens a confirmation dialog and then makes the submission
		 * request with any required confirmation fields
		 */
		// async function searchUser() {
		// }

		/**
		 * Update the data attached to a step
		 *
		 * @param {String} stepId The id of the step to update
		 * @param {Object} data The data to update in the step
		 */
		function updateStep(stepId, data) {
			steps.value.forEach((step, stepIndex) => {
				step.sections.forEach((section, sectionIndex) => {
					if (section.type !== 'email') {
						return;
					}
					let errors = {...step.sections.errors};
					Object.keys(data).forEach((key) => delete errors[key]);
					steps.value[stepIndex].sections[sectionIndex].email = {
						...steps.value[stepIndex].sections[sectionIndex].email,
						...data,
						errors: errors,
					};
				});
			});
		}

		/**
		 * Close modal popup
		 */
		function isModalClosed() {
			isModalOpened.value = false;
		}

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
			reviewSteps,
			stepButtonTitle,

			//form feilds
			passwordField,
			usernameField,
			passwordChange,
			usernameChange,
			emailField,
			emailChange,

			//methods
			nextStep,
			previousStep,
			updateStep,
			updateAutosaveForm,

			//modal
			isModalOpened,
			isModalClosed,
		};
	},
);
