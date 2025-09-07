import {computed, ref} from 'vue';
import {useForm} from '@/composables/useForm';
import {useFormChanged} from '@/composables/useFormChanged';
import {useModal} from '@/composables/useModal';
import {useUrl} from '@/composables/useUrl';
import {useDate} from '@/composables/useDate';
import {useLocalize} from '@/composables/useLocalize';
import {useFetch} from '@/composables/useFetch';
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
		onFinishFn = null,
	} = {},
	{inDisplayMode = false} = {},
) {
	const workItemStatus = workItem?.status || status;
	const {t} = useLocalize();
	const participantManagerStore = useParticipantManagerStore({
		submission,
		submissionStageId,
	});
	const discussionMessagesStore = useDiscussionMessagesStore();

	const currentUser = useCurrentUser();
	const {getRelativeTargetDate} = useDate();
	const isTask = ref(workItem?.type === pkp.const.EDITORIAL_TASK_TYPE_TASK);
	const statusUpdateValue = ref(
		workItem?.status === pkp.const.EDITORIAL_TASK_STATUS_CLOSED,
	);
	const statusUpdates = {
		start: 'start',
		close: 'close',
		open: 'open',
	};
	const newMessage = ref(null);
	const formId = inDisplayMode ? 'discussionDisplay' : 'discussionForm';

	const {
		form,
		initEmptyForm,
		addPage,
		addGroup,
		set,
		setValue,
		getField,
		addFieldText,
		addFieldOptions,
		addFieldRichTextArea,
		addFieldSelect,
		addFieldCheckbox,
		addFieldComponent,
	} = useForm({}, {customSubmit: handleFormSubmission});

	function mapParticipantOptions(withSubLabel) {
		return (participant) => {
			let label = `${participant.fullName} (${participant.userName})`;

			if (participant.userName === currentUser.getCurrentUserName()) {
				label += ` (${t('common.me')})`;
			}

			return {
				label,
				subLabel: withSubLabel ? participant.roleName : null,
				value: participant.id,
			};
		};
	}

	function getParticipantOptions() {
		return computed(() =>
			participantManagerStore.participantsList.map(mapParticipantOptions(true)),
		);
	}

	function getAssigneeOptions() {
		return computed(() => {
			return participantManagerStore.participantsList
				?.filter((participant) => {
					return selectedParticipants.value.includes(participant.id);
				})
				.map(mapParticipantOptions());
		});
	}

	function getBadgeProps() {
		let badgeProps = {};
		switch (workItemStatus) {
			case pkp.const.EDITORIAL_TASK_STATUS_PENDING:
				badgeProps = {
					slot: t('common.yetToBegin'),
					icon: 'New',
					isPrimary: true,
				};
				break;
			case pkp.const.EDITORIAL_TASK_STATUS_IN_PROGRESS:
				badgeProps = {
					slot: t('common.inProgress'),
					icon: 'InProgress',
					isPrimary: true,
				};
				break;
			case pkp.const.EDITORIAL_TASK_STATUS_CLOSED:
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

		// check if overdue
		const isOverdue =
			workItem?.dateDue &&
			!workItem?.dateClosed &&
			new Date(workItem.dateDue) < new Date();
		if (
			workItemStatus === pkp.const.EDITORIAL_TASK_STATUS_IN_PROGRESS &&
			isOverdue
		) {
			badgeProps = {
				slot: t('common.overdue'),
				icon: 'Overdue',
				isWarnable: true,
			};
		}

		return badgeProps;
	}

	// temporarily disable fetching templates until the api is ready
	// eslint-disable-next-line no-unused-vars
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

		setValue('taskInfoAdd', isTask.value);

		if (isTask.value) {
			setValue('taskInfoAssignee', selectedParticipants);

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

	function getSelectedParticipants(workItemData) {
		return workItemData?.participants?.map((p) => p.userId) || [];
	}

	function getSelectedAssignee(workItemData) {
		return (
			workItemData?.participants?.find((p) => p.isResponsible)?.userId || null
		);
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

	function addTaskInfoGroup(workItemData, {override = false} = {}) {
		addGroup(
			'taskInformation',
			{
				label: t('discussion.form.taskInformation'),
				description: t('discussion.form.taskInfoDescription'),
				groupComponent: {
					component: DiscussionManagerTaskInfo,
					props: {
						workItem: workItemData,
						inDisplayMode,
						autoAddTaskDetails,
						onUpdateStatusCheckbox,
					},
				},
			},
			{override},
		);
	}

	function mapParticipantsBody(formData) {
		if (!formData.detailsParticipants) return [];

		return (
			formData.detailsParticipants.map((userId) => {
				let isResponsible = formData.taskInfoAdd
					? formData?.taskInfoAssignee === userId
					: undefined;
				return {
					userId,
					isResponsible,
				};
			}) || []
		);
	}

	async function saveWorkItem(formData) {
		const isTaskType = formData.taskInfoAdd;
		const dataBody = {
			type: isTaskType
				? pkp.const.EDITORIAL_TASK_TYPE_TASK
				: pkp.const.EDITORIAL_TASK_TYPE_DISCUSSION,
			title: formData.detailsName,
			stageId: submissionStageId,
			dateDue: isTaskType ? formData.taskInfoDueDate : undefined,
			participants: mapParticipantsBody(formData),
		};

		let taskUrl = `submissions/${submission.id}/tasks`;
		if (workItem?.id) {
			taskUrl += `/${workItem.id}`;
		}
		const {apiUrl: addTaskUrl} = useUrl(taskUrl);

		const {
			fetch,
			data: taskData,
			validationError,
			isSuccess,
		} = useFetch(addTaskUrl, {
			method: workItem?.id ? 'PUT' : 'POST',
			body: dataBody,
			expectValidationError: true,
		});

		await fetch();

		return {
			data: taskData.value,
			validationError: validationError.value,
			isSuccess: isSuccess.value,
		};
	}

	async function addWorkItem(formData) {
		const {data, validationError, isSuccess} = await saveWorkItem(formData);

		if (isSuccess) {
			// start the task if begin upon saving is selected
			if (formData.taskInfoAdd && formData.taskInfoShouldStart) {
				await updateWorkItemStatus(data?.id, true);
			}
		}

		return {
			data,
			validationError,
		};
	}

	async function addNewMessage() {
		console.log('add new message');
	}

	async function updateWorkItemStatus(workItemId, isNewTask) {
		if (!workItemId) return;
		let status;

		if (workItem && statusUpdateValue.value) {
			if (!workItem.dateClosed) {
				status = statusUpdates.close;
			}
			if (!workItem.dateStarted) {
				status = statusUpdates.start;
			}
		} else {
			if (isNewTask) {
				status = statusUpdates.start;
			}
		}

		if (!status) return;

		const {apiUrl: updateTaskStatusUrl} = useUrl(
			`submissions/${submission.id}/tasks/${workItemId}/${status}`,
		);

		const {
			fetch,
			data: updateTaskStatusData,
			isSuccess,
		} = useFetch(updateTaskStatusUrl, {
			method: 'PUT',
			expectValidationError: true,
		});

		await fetch();

		return {data: updateTaskStatusData.value, isSuccess: isSuccess.value};
	}

	async function handleFormSubmission(formData) {
		let result = {
			data: {},
			validationError: null,
		};

		if (inDisplayMode) {
			await updateWorkItemStatus(workItem?.id);
		} else {
			if (workItem) {
				result = await saveWorkItem(formData);
			} else {
				result = await addWorkItem(formData);
			}
		}

		if (workItem && newMessage.value) {
			// check if there is message
			await addNewMessage();
		}

		if (typeof onFinishFn === 'function') {
			await onFinishFn();
		}
		onCloseFn();

		// return result to Form component handler
		return result;
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
				// templates: getTemplates(), // temporarily disable fetching templates until the api is ready
				templates: [],
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
		value: workItem?.title,
		hideOnDisplay: true,
	});

	addFieldOptions('detailsParticipants', 'checkbox', {
		groupId: 'details',
		label: t('editor.submission.stageParticipants'),
		description: t('discussion.form.detailsParticipantsDescription'),
		name: 'detailsParticipants',
		options: getParticipantOptions(),
		showNumberedList: true,
		value: getSelectedParticipants(workItem),
	});

	const participantsField = getField('detailsParticipants');
	const selectedParticipants = computed(() => participantsField?.value || []);

	addTaskInfoGroup(workItem);

	addFieldCheckbox('taskInfoAdd', {
		groupId: 'taskInformation',
		label: t('discussion.form.taskInfoLabel'),
		value: isTask.value || autoAddTaskDetails,
		hideOnDisplay: true,
		disabled:
			workItem?.type === pkp.const.EDITORIAL_TASK_TYPE_DISCUSSION &&
			workItem?.status === pkp.const.EDITORIAL_TASK_STATUS_CLOSED,
	});

	addFieldText('taskInfoDueDate', {
		groupId: 'taskInformation',
		label: t('common.dueDate'),
		inputType: 'date',
		description: t('discussion.form.taskInfoDueDateDescription'),
		size: 'large',
		showWhen: 'taskInfoAdd',
		value: isTask.value ? workItem?.dateDue : null,
	});

	addFieldOptions('taskInfoAssignee', 'radio', {
		groupId: 'taskInformation',
		label: t('discussion.form.taskInfoAssigneesLabel'),
		description: t('discussion.form.taskInfoAssigneesDescription'),
		name: 'taskInfoAssignee',
		showWhen: 'taskInfoAdd',
		options: getAssigneeOptions(),
		value: getSelectedAssignee(workItem),
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
		label: t('discussion.name'),
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

	const {setInitialState} = useFormChanged(form, additionalFields, onCloseFn, {
		warnOnClose: true,
	});

	function refreshFormData(newWorkItem) {
		setValue('detailsName', newWorkItem?.title || '');
		setValue('detailsParticipants', getSelectedParticipants(newWorkItem));
		setValue(
			'taskInfoAdd',
			newWorkItem.type === pkp.const.EDITORIAL_TASK_TYPE_TASK,
		);
		setValue('taskInfoDueDate', newWorkItem?.dateDue || '');
		setValue('taskInfoAssignee', getSelectedAssignee(newWorkItem));

		addTaskInfoGroup(newWorkItem, {override: true});

		setInitialState(form, additionalFields);
	}

	return {
		form,
		set,
		badgeProps,
		refreshFormData,
	};
}
