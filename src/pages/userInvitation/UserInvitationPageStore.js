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

export const useUserInvitationPageStore = defineComponentStore(
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
		const userId = ref(null);
		const isModalOpened = ref(false);

		const emailField = ref({
			label: t('user.email'),
			name: 'email',
			size: 'large',
			value: '',
		});
		const usernameField = ref({
			label: t('user.username'),
			name: 'username',
			size: 'large',
			value: '',
		});
		const orcidField = ref({
			label: t('user.orcid'),
			name: 'orcid',
			size: 'large',
			value: '',
		});
		const email = ref('');
		const username = ref('');
		const orcid = ref('');
		const recipientOptions = ref([]);
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

		/**
		 * create searchPhrase
		 */
		const searchPhrase = computed(() => {
			let seachText = '';
			if (email.value) {
				seachText = email.value + ' ';
			}
			if (orcid.value) {
				seachText = seachText + orcid.value + ' ';
			}
			if (username.value) {
				seachText = seachText + username.value;
			}

			return seachText;
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
				// validate();
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

		function emailChange(fieldName, propName, newValue, localeKey) {
			email.value = newValue;
		}
		function usernameChange(fieldName, propName, newValue, localeKey) {
			username.value = newValue;
		}
		function orcidChange(fieldName, propName, newValue, localeKey) {
			orcid.value = newValue;
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
			if (isOnLastStep.value) {
				submit();
			} else if (isOnFirstStep.value) {
				searchUser();
			} else {
				openStep(steps.value[1 + currentStepIndex.value].id);
				updateEmailComposer();
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
			if (stepId === 'userInvitedEmail') {
				errors.value = {};
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
		 * Complete the submission
		 *
		 * Opens a confirmation dialog and then makes the submission
		 * request with any required confirmation fields
		 */
		async function submit() {
			const data = {
				userId: userId.value,
				actions: {},
			};
			steps.value.forEach((step) => {
				step.sections.forEach((section) => {
					if (section.type === 'form' || section.length > 0) {
						section.form.fields.forEach((field) => {
							if (field.value != null) {
								data[field.name] = field.value;
							}
						});
					} else if (section.type === 'email') {
						data.actions['actionattachments'] = section.email.attachments;
						data.actions['locale'] = section.email.locale;
						data.actions['recipients'] = section.email.recipients;
						data.actions['subject'] = section.email.subject;
						data.actions['body'] = section.email.body;
					}
				});
			});
			const {
				data: res,
				validationError,
				fetch,
			} = useFetch(pageInitConfig.inviteUserApiUrl, {
				expectValidationError: true,
				method: 'POST',
				body: data,
			});
			await fetch();
			if (validationError.value) {
				errors.value = validationError.value;
			} else if (res.value && !validationError.value) {
				isModalOpened.value = true;
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
					steps.value[stepIndex].sections[sectionIndex].form.fields.forEach(
						(field) => {
							if (data[field.name] instanceof Object) {
								field.value = data[field.name][pageInitConfig.primaryLocale];
							} else {
								field.value = data[field.name];
							}
						},
					);
				});
			});
		}

		/**
		 * Update a form with new data
		 *
		 * This is fired every time a form field changes, so
		 * resource-intensive code should not be run every
		 * time this method is called.
		 */
		function updateEmailComposer() {
			steps.value.forEach((step, stepIndex) => {
				step.sections.forEach((section, sectionIndex) => {
					if (section.type !== 'email') {
						return;
					}
					steps.value[stepIndex].sections[sectionIndex].email.variables[
						pageInitConfig.primaryLocale
					].push({
						key: 'recipientName',
						value:
							recipientOptions.value[0].label[pageInitConfig.primaryLocale],
					});
					steps.value[stepIndex].sections[sectionIndex].email = {
						...steps.value[stepIndex].sections[sectionIndex].email,
						recipients: recipientOptions.value.map((to) => to.value),
						recipientOptions: recipientOptions.value,
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
		async function searchUser() {
			if (searchPhrase.value !== '') {
				const {data: user, fetch} = useFetch(pageInitConfig.searchUserApiUrl, {
					query: {searchPhrase: searchPhrase.value, status: 'all'},
				});
				await fetch();
				let userObj = {};
				if (user.value.items.length > 0) {
					user.value.items.forEach((data) => {
						userId.value = data.id;
						email.value = data.email;
						userObj = {
							email: data.email,
							givenName: data.fullName.split(' ')[0],
							familyName: data.fullName.split(' ')[1],
							orcid: data.orcid,
						};
						recipientOptions.value.push({
							value: data.id,
							label: {
								[pageInitConfig.primaryLocale]: data.fullName,
							},
						});
					});
				} else {
					errors.value = {
						error: t('invitation.noUserFound'),
					};
					recipientOptions.value.push({
						value: email.value,
						label: {
							[pageInitConfig.primaryLocale]: email.value,
						},
					});
					userObj = {
						email: email.value,
					};
				}
				updateForm('userDetails', userObj);
				openStep(steps.value[1 + currentStepIndex.value].id);
			} else {
				errors.value = {
					error: t('invitation.emptySearchFields'),
				};
			}
		}

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
			window.location = pageInitConfig.userInvitationSavedUrl;
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
			email,

			//form feilds
			emailField,
			usernameField,
			orcidField,
			emailChange,
			orcidChange,
			usernameChange,

			//methods
			nextStep,
			previousStep,
			updateStep,

			//modal
			isModalOpened,
			isModalClosed,
		};
	},
);
