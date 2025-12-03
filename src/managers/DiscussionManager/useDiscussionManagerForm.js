import {computed, ref, onMounted, inject, nextTick} from 'vue';
import {useForm} from '@/composables/useForm';
import {useFormChanged} from '@/composables/useFormChanged';
import {useModal} from '@/composables/useModal';
import {useUrl} from '@/composables/useUrl';
import {useLocalize} from '@/composables/useLocalize';
import {useFetch} from '@/composables/useFetch';
import {useCurrentUser} from '@/composables/useCurrentUser';
import {useDiscussionMessages} from './useDiscussionMessages';
import {
	useDiscussionManagerStatusUpdater,
	statusUpdates,
} from './useDiscussionManagerStatusUpdater';
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
	} = {},
	{inDisplayMode = false, refetchData = null} = {},
) {
	const workItemRef = ref(workItem);
	const workItemStatus = ref(workItemRef.value?.status || status);
	const {t} = useLocalize();
	const participants = ref([]);
	const {messageFieldOptions} = useDiscussionMessages();
	const {updateStatus, startWorkItem} = useDiscussionManagerStatusUpdater(
		submission.id,
	);
	const closeModal = inject('closeModal');

	const currentUser = useCurrentUser();
	const isTask = ref(
		workItemRef.value?.type === pkp.const.EDITORIAL_TASK_TYPE_TASK,
	);
	const isClosed =
		workItemRef.value?.status === pkp.const.EDITORIAL_TASK_STATUS_CLOSED;
	const statusUpdateValue = ref(isClosed);
	let updateStatusInViewMode = false;
	const newMessageError = ref(null);
	const showNewMessageField = ref(false);
	let initialStatusUpdateVal = isClosed;

	const newMessage = ref(null);
	const formId = inDisplayMode ? 'discussionDisplay' : 'discussionForm';

	const {
		form,
		initEmptyForm,
		addPage,
		addGroup,
		set,
		setValue,
		setCanSubmit,
		getField,
		addFieldText,
		addFieldDate,
		addFieldOptions,
		addFieldRichTextArea,
		addFieldSelect,
		addFieldCheckbox,
		addFieldComponent,
	} = useForm({}, {customSubmit: handleFormSubmission});

	function mapParticipantOptions(withSubLabel) {
		return (participant) => {
			const username = participant.username && `(${participant.username})`;
			let label = `${participant.fullName} ${username}`;

			if (participant.username === currentUser.getCurrentUserName()) {
				label += ` (${t('common.me')})`;
			}

			return {
				label,
				subLabel: withSubLabel ? participant.roles?.[0]?.name : null,
				value: participant.userId,
			};
		};
	}

	async function getAllParticipants() {
		const {apiUrl: participantsApiUrl} = useUrl(
			`submissions/${encodeURIComponent(submission.id)}/stages/${submissionStageId}/tasks/participants`,
		);

		const {data: participantsData, fetch: fetchParticipants} =
			useFetch(participantsApiUrl);

		await fetchParticipants();

		return participantsData.value || [];
	}

	const participantOptions = computed(() =>
		participants.value.map(mapParticipantOptions(true)),
	);

	const assigneeOptions = computed(() => {
		return participants.value
			.filter((participant) =>
				selectedParticipants.value.includes(participant.userId),
			)
			.map(mapParticipantOptions());
	});

	function getBadgeProps() {
		let badgeProps = {};
		switch (workItemStatus.value) {
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
			workItemRef.value?.dateDue &&
			!workItemRef.value?.dateClosed &&
			new Date(workItemRef.value.dateDue) < new Date();
		if (
			workItemStatus.value === pkp.const.EDITORIAL_TASK_STATUS_IN_PROGRESS &&
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

	function getTemplates() {
		// no need to fetch the templates in display mode
		if (inDisplayMode) {
			return [];
		}

		const {apiUrl: taskTemplatesApiUrl} = useUrl(
			`editTaskTemplates?stageId=${submissionStageId}`,
		);

		const {data: taskTemplatesData, fetch: fetchTaskTemplates} =
			useFetch(taskTemplatesApiUrl);

		fetchTaskTemplates();

		return computed(() => taskTemplatesData.value?.data || []);
	}

	async function setValuesFromTemplate(template) {
		const {apiUrl: applyTemplateUrl} = useUrl(
			`submissions/${encodeURIComponent(submission.id)}/stages/${submissionStageId}/tasks/fromTemplate/${template.id}`,
		);

		const {data: templateData, fetch: fetchTemplateData} = useFetch(
			applyTemplateUrl,
			{showFullScreenSpinner: true},
		);

		await fetchTemplateData();

		isTask.value =
			templateData.value.type === pkp.const.EDITORIAL_TASK_TYPE_TASK;
		setValue('title', templateData.value.title);

		setValue('taskInfoAdd', isTask.value);
		await nextTick(); // wait for the date due & assignee fields to re-render based on isTask value
		setValue('dateDue', isTask.value ? templateData.value.dateDue : null);
		// there's no assignee data from the template, this needs to be always reset
		setValue('taskInfoAssignee', null);

		setValue('description', templateData.value.notes?.[0]?.contents);
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
		if (!workItemRef.value?.id) {
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
		updateStatusInViewMode = initialStatusUpdateVal !== val;
		statusUpdateValue.value = val;
		toggleSaveBtnOnDisplayMode();
	}

	function onNewMessage() {
		showNewMessageField.value = true;
		toggleSaveBtnOnDisplayMode();
	}

	function onNewMessageChanged(val) {
		newMessage.value = val;
		newMessageError.value = null;
		toggleSaveBtnOnDisplayMode();
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
						statusValue: statusUpdateValue,
					},
				},
			},
			{override},
		);
	}

	function addTaskInfoDueDate({override = false} = {}) {
		addFieldDate(
			'dateDue',
			{
				groupId: 'taskInformation',
				label: t('common.dueDate'),
				description: t('discussion.form.taskInfoDueDateDescription'),
				size: 'normal',
				showWhen: 'taskInfoAdd',
				value: isTask.value ? workItemRef.value?.dateDue : null,
				isRequired: isTask.value || autoAddTaskDetails,
				min: 'today',
			},
			{override},
		);
	}

	function addTaskInfoAssignee({override = false} = {}) {
		addFieldOptions(
			'taskInfoAssignee',
			'radio',
			{
				groupId: 'taskInformation',
				label: t('discussion.form.taskInfoAssigneesLabel'),
				description: t('discussion.form.taskInfoAssigneesDescription'),
				name: 'taskInfoAssignee',
				showWhen: 'taskInfoAdd',
				options: assigneeOptions,
				value: getSelectedAssignee(workItemRef.value),
				isRequired: isTask.value || autoAddTaskDetails,
			},
			{override},
		);
	}

	function addDiscussionGroup(workItemData, {override = false} = {}) {
		addGroup(
			'discussion',
			{
				label: t('discussion.name'),
				description: t('discussion.form.discussionDescription'),
				groupComponent: {
					component: DiscussionManagerDiscussion,
					props: {
						workItem: workItemData,
						inDisplayMode,
						onUpdateStatusCheckbox,
					},
				},
			},
			{override},
		);
	}

	function addMessagesComponent(workItemData, {override = false} = {}) {
		showNewMessageField.value = false;
		newMessage.value = null;

		addFieldComponent(
			'messagesComponent',
			{
				component: DiscussionMessages,
				componentProps: {
					submission,
					workItem: workItemData,
					inDisplayMode,
					showNewMessageField,
					onNewMessageChanged,
					onNewMessage,
					newMessageError,
				},
				groupId: 'discussion',
			},
			{override},
		);
	}

	// This function updates the Save button state in display mode
	function toggleSaveBtnOnDisplayMode() {
		if (!inDisplayMode) return;

		const hasValidMessage = !newMessageError.value;
		const hasChanges =
			updateStatusInViewMode || showNewMessageField.value || newMessage.value;

		setCanSubmit(hasValidMessage && hasChanges);
	}

	function mapParticipantsBody(formData) {
		if (!formData.participants) return [];

		return (
			formData.participants.map((userId) => {
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
			title: formData.title,
			stageId: submissionStageId,
			dateDue: isTaskType ? formData.dateDue : undefined,
			participants: mapParticipantsBody(formData),
			description: formData.description,
		};

		let taskUrl = `submissions/${submission.id}/tasks`;
		if (workItemRef.value?.id) {
			taskUrl += `/${workItemRef.value.id}`;
		}
		const {apiUrl: addTaskUrl} = useUrl(taskUrl);

		const {
			fetch,
			data: taskData,
			validationError,
			isSuccess,
		} = useFetch(addTaskUrl, {
			method: workItemRef.value?.id ? 'PUT' : 'POST',
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
				await startWorkItem(data?.id);
			}
		}

		return {
			data,
			validationError,
			isSuccess,
		};
	}

	async function addNewMessage() {
		const {apiUrl: addNoteUrl} = useUrl(
			`submissions/${submission.id}/tasks/${workItemRef.value.id}/notes`,
		);

		const {
			fetch,
			data: noteData,
			validationError,
			isSuccess,
		} = useFetch(addNoteUrl, {
			method: 'POST',
			body: {contents: newMessage.value},
		});

		await fetch();

		return {
			data: noteData.value,
			validationError: validationError.value,
			isSuccess: isSuccess.value,
		};
	}

	// Update the work item status: start, close, or open
	async function updateWorkItemStatus(workItemId) {
		if (!workItemId) return;
		let status;

		if (workItemRef.value && inDisplayMode && updateStatusInViewMode) {
			switch (workItemRef.value.status) {
				case pkp.const.EDITORIAL_TASK_STATUS_PENDING:
					status = statusUpdates.start;
					break;
				case pkp.const.EDITORIAL_TASK_STATUS_IN_PROGRESS:
					status = statusUpdates.close;
					break;
				case pkp.const.EDITORIAL_TASK_STATUS_CLOSED:
					status = statusUpdates.open;
					break;
				default:
					break;
			}

			// if discussion, only allow closing or re-opening
			if (
				status === statusUpdates.start &&
				workItemRef.value.type === pkp.const.EDITORIAL_TASK_TYPE_DISCUSSION
			) {
				status = statusUpdates.close;
			}
		}

		if (!status) {
			return;
		}

		return await updateStatus(workItemId, status);
	}

	// manually validate the new message field in display mode, since it doesn't use the standard form component.
	function validateNewMessage() {
		const isInvalid = showNewMessageField.value && !newMessage.value;
		newMessageError.value = isInvalid ? [t('validator.filled')] : null;

		toggleSaveBtnOnDisplayMode();

		return !isInvalid;
	}

	async function handleFormSubmission(formData) {
		let result = {
			data: {},
			validationError: null,
			isSuccess: false,
		};

		if (inDisplayMode) {
			// manually validate the new message field since display mode doesn't use the standard form component
			if (!validateNewMessage()) return;

			result = (await updateWorkItemStatus(workItemRef.value?.id)) ?? result;
		} else {
			if (workItemRef.value) {
				result = await saveWorkItem(formData);
			} else {
				result = await addWorkItem(formData);
			}
		}

		// save the note if there is a new message
		if (workItemRef.value && inDisplayMode && newMessage.value) {
			result = await addNewMessage();
		}

		if (result.isSuccess) {
			if (inDisplayMode && refetchData) {
				await refetchData();
			} else {
				setInitialState(form, additionalFields);
				closeModal();
			}
		}

		// return result to Form component handler
		return result;
	}

	initEmptyForm(formId, {
		showErrorFooter: false,
		canSubmit: !inDisplayMode,
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
				isTask: workItemRef.value?.type === pkp.const.EDITORIAL_TASK_TYPE_TASK,
			},
		},
	});

	addFieldText('title', {
		groupId: 'details',
		label: t('common.name'),
		description: t('discussion.form.detailsNameDescription'),
		size: 'large',
		value: workItemRef.value?.title,
		hideOnDisplay: true,
		isRequired: true,
	});

	addFieldOptions('participants', 'checkbox', {
		groupId: 'details',
		label: t('editor.submission.stageParticipants'),
		description: t('discussion.form.detailsParticipantsDescription'),
		name: 'participants',
		options: participantOptions,
		showNumberedList: true,
		value: getSelectedParticipants(workItemRef.value),
		isRequired: true,
	});

	const participantsField = getField('participants');
	const selectedParticipants = computed(() => participantsField?.value || []);

	addTaskInfoGroup(workItemRef.value);

	addFieldCheckbox('taskInfoAdd', {
		groupId: 'taskInformation',
		label: t('discussion.form.taskInfoLabel'),
		value: isTask.value || autoAddTaskDetails,
		hideOnDisplay: true,
		disabled: workItemRef.value?.type === pkp.const.EDITORIAL_TASK_TYPE_TASK,
		onChange: (name, attr, val) => {
			isTask.value = val;
			addTaskInfoDueDate({override: true});
			addTaskInfoAssignee({override: true});
		},
	});

	addTaskInfoDueDate();

	addTaskInfoAssignee();

	// this select is only enabled when adding a new entry
	addFieldSelect('taskInfoShouldStart', {
		groupId: 'taskInformation',
		name: 'taskInfoShouldStart',
		showWhen: 'taskInfoAdd',
		value: true,
		hideOnDisplay: true,
		disabled: !!workItemRef.value,
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

	addDiscussionGroup(workItemRef.value);

	if (inDisplayMode) {
		addMessagesComponent(workItemRef.value);
	} else {
		addFieldRichTextArea('description', {
			groupId: 'discussion',
			...messageFieldOptions,
			value: workItemRef.value?.notes?.[0]?.contents,
			isRequired: true,
		});
	}

	const badgeProps = computed(() => getBadgeProps());
	const additionalFields = [newMessage, statusUpdateValue];

	const {setInitialState} = useFormChanged(form, additionalFields, {
		warnOnClose: true,
	});

	function refreshFormData(newWorkItem) {
		workItemRef.value = newWorkItem;
		workItemStatus.value = newWorkItem?.status;

		statusUpdateValue.value =
			newWorkItem?.status === pkp.const.EDITORIAL_TASK_STATUS_CLOSED;
		initialStatusUpdateVal = statusUpdateValue.value;
		updateStatusInViewMode = false;

		setValue('title', newWorkItem?.title || '');
		setValue('participants', getSelectedParticipants(newWorkItem));
		setValue(
			'taskInfoAdd',
			newWorkItem.type === pkp.const.EDITORIAL_TASK_TYPE_TASK,
		);
		setValue('dateDue', newWorkItem?.dateDue || '');
		setValue('taskInfoAssignee', getSelectedAssignee(newWorkItem));

		addTaskInfoGroup(newWorkItem, {override: true});
		addDiscussionGroup(newWorkItem, {override: true});
		addMessagesComponent(newWorkItem, {override: true});

		toggleSaveBtnOnDisplayMode();
		setInitialState(form, additionalFields);
	}

	onMounted(async () => {
		participants.value = await getAllParticipants();
	});

	return {
		form,
		set,
		badgeProps,
		refreshFormData,
	};
}
