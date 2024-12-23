import {defineComponentStore} from '@/utils/defineComponentStore';
import {useLocalize} from '@/composables/useLocalize';
import {useAnnouncer} from '@/composables/useAnnouncer';
import {useFetch} from '@/composables/useFetch';
import {computed, onMounted, ref, watch} from 'vue';
import {useUrl} from '@/composables/useUrl';
import {useModal} from '@/composables/useModal';

export const useAcceptInvitationPageStore = defineComponentStore(
	'userInvitationPage',
	(pageInitConfig) => {
		const {openDialog} = useModal();
		const {t} = useLocalize();

		/** Announcer */

		const {announce} = useAnnouncer();

		/** Accept invitation payload, initial value*/
		const acceptInvitationPayload = ref({});

		const email = ref(null);
		const userId = ref(null);
		const existingUser = ref(null);

		/** All Errors */
		const errors = ref({});

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
				openDialog({
					title: t('acceptInvitation.authorization.shouldBeAnonymous'),
					message: t('acceptInvitation.authorization.message'),
					actions: [
						{
							label: t('user.logOut'),
							callback: () => {
								const {redirectToPage} = useUrl(`login/signOut`);
								redirectToPage();
							},
						},
						{
							label: t('common.close'),
							isWarnable: true,
							callback: (close) => {
								close();
							},
						},
					],
					close: () => {
						const {redirectToPage} = useUrl('submissions');
						redirectToPage();
					},
					modalStyle: 'negative',
				});
			} else {
				email.value = data.value.email;
				userId.value = data.value.userId;
				if (data.value.familyName) {
					updateAcceptInvitationPayload('familyName', data.value.familyName); //if not check this override the multilingual structure
				}
				if (data.value.givenName) {
					updateAcceptInvitationPayload('givenName', data.value.givenName); //if not check this override the multilingual structure
				}
				if (data.value.affiliation) {
					updateAcceptInvitationPayload('affiliation', data.value.affiliation);
				}
				updateAcceptInvitationPayload('userCountry', data.value.country);

				updateAcceptInvitationPayload('orcid', data.value.orcid);
				updateAcceptInvitationPayload(
					'orcidIsVerified',
					data.value.orcidIsVerified,
				);
				updateAcceptInvitationPayload(
					'orcidAccessDenied',
					data.value.orcidAccessDenied,
				);
				updateAcceptInvitationPayload(
					'orcidAccessToken',
					data.value.orcidAccessToken,
				);
				updateAcceptInvitationPayload(
					'orcidAccessScope',
					data.value.orcidAccessScope,
				);
				updateAcceptInvitationPayload(
					'orcidRefreshToken',
					data.value.orcidRefreshToken,
				);
				updateAcceptInvitationPayload(
					'orcidAccessExpiresOn',
					data.value.orcidAccessExpiresOn,
				);

				updateAcceptInvitationPayload(
					'userGroupsToAdd',
					data.value.userGroupsToAdd,
				);
				updateAcceptInvitationPayload(
					'privacyStatement',
					userId.value ? true : false,
				);
				// add username to invitation payload for validations
				updateAcceptInvitationPayload('username', data.value.username);
				// add password to invitation payload for validations
				updateAcceptInvitationPayload('password', null);

				existingUser.value = data.existingUser;
				errors.value = [];
				if (steps.value.length === 0) {
					await submit();
				}
			}
		}

		function updateAcceptInvitationPayload(fieldName, value) {
			acceptInvitationPayload.value[fieldName] = value;
		}

		/**
		 * Sets ORCID data in invitation payload. If data is null, all ORCID related fields will be set to null/zero value.
		 *
		 * @param {Object|null} data - The ORCID OAuth data object.
		 * @param {string} data.orcid - The ORCID URL of the user.
		 * @param {boolean} data.orcidIsVerified - Indicates if the user's ORCID is verified.
		 * @param {null|string} data.orcidAccessDenied - Indicates if access to ORCID is denied (null if not denied).
		 * @param {string} data.orcidAccessToken - The access token for ORCID API.
		 * @param {string} data.orcidAccessScope - The scope of access for the ORCID API.
		 * @param {string} data.orcidRefreshToken - The refresh token for obtaining new access tokens.
		 * @param {string} data.orcidAccessExpiresOn - The expiration date and time of the access token in ISO format.
		 * @param data
		 */
		function setOrcidData(data) {
			const fields = [
				'orcid',
				'orcidIsVerified',
				'orcidAccessDenied',
				'orcidAccessToken',
				'orcidAccessScope',
				'orcidRefreshToken',
				'orcidAccessExpiresOn',
			];
			const isDataNull = data === null;
			fields.forEach((fieldName) => {
				acceptInvitationPayload.value[fieldName] = isDataNull
					? null
					: data[fieldName];
			});
		}

		const hasValidOrcid = computed(() => {
			if (acceptInvitationPayload.value['orcidIsVerified']) {
				return true;
			} else if (existingUser.value.orcidIsVerified) {
				return true;
			}

			return false;
		});

		const orcidUri = computed(() => {
			const invitationOrcid = acceptInvitationPayload.value['orcid'];
			if (invitationOrcid) {
				return invitationOrcid;
			}

			const userOrcid = existingUser.value['orcid'];
			if (userOrcid) {
				return userOrcid;
			}

			return null;
		});

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
				if (isValid.value) {
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
			return currentStep.value.stepLabel.replace(
				'{$step}',
				t('invitation.step') + ' ' + (1 + currentStepIndex.value),
			);
		});

		/**
		 * The step next button name
		 */
		const stepButtonTitle = computed(() => {
			if (!currentStep.value) {
				return '';
			}
			return currentStep.value.nextButtonLabel;
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

		const invitationRequestPayload = computed(() => {
			let payload = {};
			if (!userId.value) {
				if (currentStep.value) {
					currentStep.value.sections.forEach((element, index) => {
						let sectionPayload = {};
						element.props.validateFields.forEach((field) => {
							if (Object.keys(acceptInvitationPayload.value).includes(field)) {
								sectionPayload[field] = acceptInvitationPayload.value[field];
							}
						});
						payload = {
							...payload,
							...sectionPayload,
						};
					});
				}
			}
			return payload;
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
				body: {invitationData: invitationRequestPayload.value},
			});
			// FIXME: Privacy statement check blocks ORCID from saving before hand.
			//  		  Can this check be moved outside of update payload check?
			if (
				!acceptInvitationPayload.value.privacyStatement &&
				currentStep.value.id !== 'verifyOrcid'
			) {
				errors.value = {
					privacyStatement: [t('acceptInvitation.privacyStatement.validation')],
				};
			} else {
				await fetch();
				if (validationError.value) {
					errors.value = validationError.value.errors;
				} else {
					errors.value = [];
				}
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

		const {redirectToPage} = useUrl('submissions');
		/**
		 * Complete the submission
		 *
		 * Opens a confirmation dialog and then makes the submission
		 * request with any required confirmation fields
		 */
		async function submit() {
			if (Object.keys(invitationRequestPayload.value).length > 0) {
				await updateInvitationPayload();
			}
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
									redirectToPage();
								},
							},
						],
						modalStyle: 'success',
					});
				}
			}
		}

		function cancel() {
			openDialog({
				name: 'cancel',
				title: t('acceptInvitation.cancelInvite.title'),
				message: t('acceptInvitation.cancel.message'),
				actions: [
					{
						label: t('acceptInvitation.cancelInvite.button'),
						isWarnable: true,
						callback: (close) => {
							redirectToPage();
						},
					},
					{
						label: t('userInvitation.cancel.goBack'),
						callback: (close) => {
							close();
						},
					},
				],
				modalStyle: 'negative',
			});
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
			hasValidOrcid,
			isOnFirstStep,
			isOnLastStep,
			isValid,
			pageTitle,
			startedSteps,
			stepTitle,
			openStep,
			orcidUri,
			steps,
			pageTitleDescription,
			errors,
			stepButtonTitle,
			formSteps,

			//methods
			nextStep,
			previousStep,
			setOrcidData,
			updateAcceptInvitationPayload,
			cancel,

			//refs
			acceptInvitationPayload,
			email,
			userId,
		};
	},
);
