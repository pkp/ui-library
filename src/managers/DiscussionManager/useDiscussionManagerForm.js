import {computed, ref, watch} from 'vue';
import {useForm} from '@/composables/useForm';
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

export function useDiscussionManagerForm({
	status = 'New',
	submission,
	submissionStageId,
	workItem,
	closeDialog = () => {},
	onSubmitFn = null,
} = {}) {
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
	}

	function addParticipantsField({override = false} = {}) {
		addFieldOptions(
			'detailsParticipants',
			'checkbox',
			{
				groupId: 'details',
				label: t('editor.submission.stageParticipants'),
				description: t('discussion.form.detailsParticipantsDescription'),
				name: 'detailsParticipants',
				options: getParticipantOptions(true),
				showNumberedList: true,
				value: workItem?.participants || [],
			},
			{override},
		);
	}

	function addAssigneesField({override = false} = {}) {
		addFieldOptions(
			'taskInfoParticipants',
			'checkbox',
			{
				groupId: 'taskInformation',
				label: t('discussion.form.taskInfoAssigneesLabel'),
				description: t('discussion.form.taskInfoAssigneesDescription'),
				name: 'taskInfoParticipants',
				showWhen: 'taskInfoAdd',
				options: getParticipantOptions(),
				value: workItem?.assignees,
			},
			{override},
		);
	}

	// update the field-options when participantsList changes
	watch(
		() => participantManagerStore.participantsList,
		(participantsList) => {
			if (participantsList.length) {
				addParticipantsField({override: true});
				addAssigneesField({override: true});
			}
		},
		{immediate: true},
	);

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

	async function handleFormSubmission(formData) {
		// return result to Form component handler
		return {
			data: {},
			validationError: {},
		};
	}

	initEmptyForm('discussion', {
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

	addParticipantsField({override: false});

	addGroup('taskInformation', {
		label: t('discussion.form.taskInformation'),
		description: t('discussion.form.taskInfoDescription'),
		groupComponent: {
			component: DiscussionManagerTaskInfo,
		},
		hideOnDisplay: !isTask.value,
	});

	addFieldCheckbox('taskInfoAdd', {
		groupId: 'taskInformation',
		label: t('discussion.form.taskInfoLabel'),
		value: isTask,
		hideOnDisplay: true,
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

	addAssigneesField({override: false});

	if (['Pending', 'New'].includes(status)) {
		addFieldSelect('taskInfoShouldStart', {
			groupId: 'taskInformation',
			name: 'taskInfoShouldStart',
			showWhen: 'taskInfoAdd',
			value: true,
			hideOnDisplay: true,
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
	}

	addGroup('discussion', {
		label: t('submission.discussion'),
		description: t('discussion.form.discussionDescription'),
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
			},
			groupId: 'discussion',
		});
	}

	const badgeProps = getBadgeProps(status);

	return {
		form,
		set,
		badgeProps,
	};
}
