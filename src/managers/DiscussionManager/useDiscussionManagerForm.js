import {computed, ref} from 'vue';
import {useForm} from '@/composables/useForm';
import {useFormChanged} from '@/composables/useFormChanged';
import {useModal} from '@/composables/useModal';
import {useDate} from '@/composables/useDate';
import {useLocalize} from '@/composables/useLocalize';
import {useCurrentUser} from '@/composables/useCurrentUser';
import {useParticipantManagerStore} from '../ParticipantManager/participantManagerStore';
import {useTasksAndDiscussionsStore} from '@/pages/tasksAndDiscussions/tasksAndDiscussionsStore';
import {useDiscussionMessagesStore} from './discussionMessagesStore';
import DiscussionMessages from './DiscussionMessages.vue';
import DiscussionManagerTemplates from './DiscussionManagerTemplates.vue';
import DiscussionManagerTaskInfo from './DiscussionManagerTaskInfo.vue';
import DiscussionManagerDiscussion from './DiscussionManagerDiscussion.vue';

export function useDiscussionManagerForm(
	{
		status = 'New',
		submission,
		submissionStageId,
		workItem,
		autoAddTaskDetails = false,
		onCloseFn = () => {},
		onSubmitFn = null,
	} = {},
	{inDisplayMode = false} = {},
) {
	const workItemStatus = workItem?.status || status;
	const {t, localize} = useLocalize();
	const participantManagerStore = useParticipantManagerStore({
		submission,
		submissionStageId,
	});
	const discussionMessagesStore = useDiscussionMessagesStore();

	const currentUser = useCurrentUser();
	const {getRelativeTargetDate} = useDate();
	const isTask = ref(workItem?.type === 'Task');
	const statusUpdateValue = ref(false);
	const newMessage = ref(null);
	const formId = inDisplayMode ? 'discussionDisplay' : 'discussionForm';

	const {
		form,
		initEmptyForm,
		addPage,
		addGroup,
		set,
		setValue,
		addFieldText,
		addFieldOptions,
		addFieldRichTextArea,
		addFieldSelect,
		addFieldCheckbox,
		addFieldComponent,
	} = useForm({}, {customSubmit: handleFormSubmission});

	function getParticipantOptions(withSubLabel) {
		return computed(() => {
			return participantManagerStore.participantsList.map((participant) => {
				let label = `${participant.fullName} (${participant.userName})`;

				if (participant.userName === currentUser.getCurrentUserName()) {
					label += ` (${t('common.me')})`;
				}

				return {
					label,
					subLabel: withSubLabel ? participant.roleName : undefined,
					value: participant.id,
				};
			});
		});
	}

	function getBadgeProps() {
		let badgeProps = {};
		switch (workItemStatus) {
			case 'Pending':
				badgeProps = {
					slot: t('common.yetToBegin'),
					icon: 'New',
					isPrimary: true,
				};
				break;
			case 'In Progress':
				badgeProps = {
					slot: t('common.inProgress'),
					icon: 'InProgress',
					isPrimary: true,
				};
				break;
			case 'Overdue':
				badgeProps = {
					slot: t('common.overdue'),
					icon: 'InProgress',
					isWarnable: true,
				};
				break;
			case 'Closed':
				badgeProps = {
					slot: t('common.closed'),
					icon: 'Complete',
					isSuccess: true,
				};
				break;
			default:
				badgeProps = {
					slot: t('common.new'),
					icon: 'New',
					colorVariant: 'stage-in-review-bg',
				};
		}

		return badgeProps;
	}

	function getTemplates() {
		const tasksAndDiscussionsStore = useTasksAndDiscussionsStore();
		return computed(() => {
			return tasksAndDiscussionsStore.templatesList;
		});
	}

	function setValuesFromTemplate(template) {
		isTask.value = template.type === 'Task';
		setValue('detailsName', template.name);
		setValue('discussionText', template.content);

		const selectedParticipants =
			participantManagerStore.participantsList
				.filter((p) =>
					template.taskDetails?.participantRoles?.includes(p.roleId),
				)
				.map((p) => p.id) || [];
		setValue('detailsParticipants', selectedParticipants);

		if (isTask.value) {
			setValue('taskInfoParticipants', selectedParticipants);

			if (template.taskDetails.dueDate) {
				setValue(
					'taskInfoDueDate',
					getRelativeTargetDate(template.taskDetails.dueDate),
				);
			}
		} else {
			setValue('taskInfoDueDate', null);
		}
	}

	function onSelectTemplate(template) {
		if (!workItem?.id) {
			return setValuesFromTemplate(template);
		}

		// Confirm overriding existing data with values from the selected template, if any data is already present
		const {openDialog} = useModal();
		openDialog({
			name: 'selectTemplate',
			title: t('taskTemplate.apply'),
			message: t('taskTemplate.applyConfirmation'),
			actions: [
				{
					label: t('common.yes', {}),
					isWarnable: true,
					callback: async (close) => {
						setValuesFromTemplate(template);
						close();
					},
				},
				{
					label: t('common.no', {}),
					callback: (close) => {
						close();
					},
				},
			],
			close: () => {},
			modalStyle: 'negative',
		});
	}

	function onUpdateStatusCheckbox(val) {
		statusUpdateValue.value = val;
	}

	function onNewMessage(val) {
		newMessage.value = val;
	}

	function addWorkItem() {
		console.log('add form');
	}

	function addNewMessage() {
		console.log('add new message');
	}

	function updateWorkItemStatus() {
		if (statusUpdateValue.value) {
			console.log('update task status');
		}
	}

	function updateWorkItem() {
		console.log('update form');
	}

	async function handleFormSubmission(formData) {
		if (inDisplayMode) {
			updateWorkItemStatus();
		} else {
			if (workItem) {
				updateWorkItem();
			} else {
				addWorkItem();
			}
		}

		if (workItem && newMessage.value) {
			// check if there is message
			addNewMessage();
		}

		// return result to Form component handler
		return {
			data: {},
			validationError: {},
		};
	}

	initEmptyForm(formId, {
		showErrorFooter: false,
	});

	addPage('default', {
		submitButton: {label: t('common.save')},
		cancelButton: {label: t('common.cancel')},
	});

	addGroup('details', {
		label: t('common.details'),
		description: t('discussion.form.detailsDescription'),
		groupComponent: {
			component: DiscussionManagerTemplates,
			props: {
				templates: getTemplates(),
				onSelectTemplate,
				inDisplayMode,
			},
		},
	});

	addFieldText('detailsName', {
		groupId: 'details',
		label: t('common.name'),
		description: t('discussion.form.detailsNameDescription'),
		size: 'large',
		value: localize(workItem?.title),
		hideOnDisplay: true,
	});

	addFieldOptions('detailsParticipants', 'checkbox', {
		groupId: 'details',
		label: t('editor.submission.stageParticipants'),
		description: t('discussion.form.detailsParticipantsDescription'),
		name: 'detailsParticipants',
		options: getParticipantOptions(true),
		showNumberedList: true,
		value: workItem?.participants || [],
	});

	addGroup('taskInformation', {
		label: t('discussion.form.taskInformation'),
		description: t('discussion.form.taskInfoDescription'),
		groupComponent: {
			component: DiscussionManagerTaskInfo,
			props: {
				workItem,
				inDisplayMode,
				autoAddTaskDetails,
				onUpdateStatusCheckbox,
			},
		},
	});

	addFieldCheckbox('taskInfoAdd', {
		groupId: 'taskInformation',
		label: t('discussion.form.taskInfoLabel'),
		value: isTask.value || autoAddTaskDetails,
		hideOnDisplay: true,
		disabled: workItem?.type === 'Discussion' && workItem?.status === 'Closed',
	});

	addFieldText('taskInfoDueDate', {
		groupId: 'taskInformation',
		label: t('common.dueDate'),
		inputType: 'date',
		description: t('discussion.form.taskInfoDueDateDescription'),
		size: 'large',
		showWhen: 'taskInfoAdd',
		value: isTask.value ? workItem?.dueDate : null,
	});

	addFieldOptions('taskInfoParticipants', 'checkbox', {
		groupId: 'taskInformation',
		label: t('discussion.form.taskInfoAssigneesLabel'),
		description: t('discussion.form.taskInfoAssigneesDescription'),
		name: 'taskInfoParticipants',
		showWhen: 'taskInfoAdd',
		options: getParticipantOptions(),
		value: workItem?.assignees,
	});

	// this select is only enabled when adding a new entry
	addFieldSelect('taskInfoShouldStart', {
		groupId: 'taskInformation',
		name: 'taskInfoShouldStart',
		showWhen: 'taskInfoAdd',
		value: true,
		hideOnDisplay: true,
		disabled: !!workItem,
		options: [
			{
				label: t('discussion.form.startTaskUponSaving'),
				value: true,
			},
			{
				label: t('discussion.form.createDontStartTask'),
				value: false,
			},
		],
	});

	addGroup('discussion', {
		label: t('submission.discussion'),
		description: t('discussion.form.discussionDescription'),
		groupComponent: {
			component: DiscussionManagerDiscussion,
			props: {
				workItem,
				inDisplayMode,
				onUpdateStatusCheckbox,
			},
		},
	});

	if (workItemStatus === 'New') {
		addFieldRichTextArea('discussionText', {
			groupId: 'discussion',
			...discussionMessagesStore.messageFieldOptions,
		});
	} else {
		addFieldComponent('messagesComponent', {
			component: DiscussionMessages,
			componentProps: {
				submission,
				discussion: workItem,
				inDisplayMode,
				onNewMessage,
			},
			groupId: 'discussion',
		});
	}

	const badgeProps = getBadgeProps(status);
	const additionalFields = [newMessage, statusUpdateValue];

	useFormChanged(form, additionalFields, onCloseFn, {
		warnOnClose: true,
	});

	return {
		form,
		set,
		badgeProps,
	};
}
