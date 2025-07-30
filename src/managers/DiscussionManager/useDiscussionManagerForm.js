import {computed, ref, watch} from 'vue';
import {useForm} from '@/composables/useForm';
import {useModal} from '@/composables/useModal';
import {useDate} from '@/composables/useDate';
import {useLocalize} from '@/composables/useLocalize';
import {useCurrentUser} from '@/composables/useCurrentUser';
import {useParticipantManagerStore} from '../ParticipantManager/participantManagerStore';
import {useTasksAndDiscussionsStore} from '@/pages/tasksAndDiscussions/tasksAndDiscussionsStore';
import FileAttacherModal from '@/components/Composer/FileAttacherModal.vue';
import FieldPreparedContentInsertModal from '@/components/Form/fields/FieldPreparedContentInsertModal.vue';
import DiscussionManagerTemplates from './DiscussionManagerTemplates.vue';
import DiscussionManagerTaskInfo from './DiscussionManagerTaskInfo.vue';
import preparedContent from '../../mixins/preparedContent';

export function useDiscussionManagerForm({
	status = 'New',
	submission,
	submissionStageId,
	workItem,
	closeDialog = () => {},
	onSubmitFn = null,
} = {}) {
	const {t, localize} = useLocalize();
	const participantManagerStore = useParticipantManagerStore({
		submission,
		submissionStageId,
	});

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
				showWhen: ['taskInfoIsChecked', 'true'],
				options: getParticipantOptions(),
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
		switch (status) {
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

	function initDiscussionText() {
		return {
			setup: (editor) => {
				editor.ui.registry.addButton('pkpAttachFiles', {
					icon: 'upload',
					text: t('common.attachFiles'),
					onAction() {
						const {openSideModal} = useModal();

						openSideModal(FileAttacherModal, {
							title: t('common.attachFiles'),
							attachers: [],
							onAddAttachments: [],
						});
					},
				});

				editor.ui.registry.addButton('pkpInsert', {
					icon: 'plus',
					text: t('common.insertContent'),
					onAction() {
						const {openSideModal} = useModal(FieldPreparedContentInsertModal);
						openSideModal(FieldPreparedContentInsertModal, {
							title: t('common.insertContent'),
							insertLabel: t('common.insert'),
							preparedContent,
							preparedContentLabel: 'Label',
							onInsert: () => {},
						});
					},
				});
			},
		};
	}

	function getTemplates() {
		const tasksAndDiscussionsStore = useTasksAndDiscussionsStore();
		return computed(() => {
			return tasksAndDiscussionsStore.templatesList;
		});
	}

	function onSelectTemplate(template) {
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

		setValue('taskInfoIsChecked', isTask.value ? 'true' : 'false');

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

	function onAddTaskInfo(checked) {
		isTask.value = checked;
		setValue('taskInfoIsChecked', checked ? 'true' : 'false');
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
	});

	addParticipantsField({override: false});

	addGroup('taskInformation', {
		label: t('discussion.form.taskInformation'),
		description: t('discussion.form.taskInfoDescription'),
		groupComponent: {
			component: DiscussionManagerTaskInfo,
			props: {
				isChecked: isTask,
				onAddTaskInfo,
			},
		},
	});

	addFieldText('taskInfoIsChecked', {
		groupId: 'taskInformation',
		inputType: 'hidden',
		value: isTask.value ? 'true' : 'false',
	});

	addFieldText('taskInfoDueDate', {
		groupId: 'taskInformation',
		label: t('common.dueDate'),
		inputType: 'date',
		description: t('discussion.form.taskInfoDueDateDescription'),
		size: 'large',
		showWhen: ['taskInfoIsChecked', 'true'],
		value: isTask.value ? workItem?.dueDate : null,
	});

	addAssigneesField({override: false});

	if (['Pending', 'New'].includes(status)) {
		addFieldSelect('taskInfoShouldStart', {
			groupId: 'taskInformation',
			name: 'taskInfoShouldStart',
			showWhen: ['taskInfoIsChecked', 'true'],
			value: true,
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

	addFieldRichTextArea('discussionText', {
		groupId: 'discussion',
		toolbar: 'bold italic underline bullist | pkpAttachFiles | pkpInsert',
		plugins: ['lists'],
		size: 'large',
		init: initDiscussionText(),
		value: workItem?.discussionText || '',
	});

	const badgeProps = getBadgeProps(status);

	return {
		form,
		set,
		badgeProps,
	};
}
