import {ref} from 'vue';
import {localize} from '@/utils/i18n';
import {useForm} from '@/composables/useForm';
import {useFormChanged} from '@/composables/useFormChanged';
import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';

import TaskTemplateManagerEmails from './TaskTemplateManagerEmails.vue';
import FileAttacherModal from '@/components/Composer/FileAttacherModal.vue';
import FieldPreparedContentInsertModal from '@/components/Form/fields/FieldPreparedContentInsertModal.vue';

import preparedContent from '../../mixins/preparedContent';

export function useTaskTemplateManagerForm({
	taskTemplate = null,
	stage = null,
	onCloseFn = () => {},
} = {}) {
	const {t} = useLocalize();
	const isTask = ref(taskTemplate?.type === 'Task');
	let isTemplateOverrideConfirmed = false;

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
	} = useForm({}, {customSubmit: handleFormSubmission});

	async function handleFormSubmission(formData) {
		// return result to Form component handler
		return {
			data: {},
			validationError: {},
		};
	}

	function getParticipantOptions() {
		return [
			{label: 'Journal Manager', value: pkp.const.ROLE_ID_MANAGER},
			{label: 'Editor', value: pkp.const.ROLE_ID_MANAGER},
			{label: 'Author', value: pkp.const.ROLE_ID_AUTHOR},
			{label: 'Section Editor', value: pkp.const.ROLE_ID_SUB_EDITOR},
		];
	}

	function getDueDateOptions() {
		return [
			{
				value: 'P1W',
				label: t('taskTemplates.dueDateFromCreationDate', {
					dueDate: t('common.oneWeek'),
				}),
			},
			{
				value: 'P2W',
				label: t('taskTemplates.dueDateFromCreationDate', {
					dueDate: `2 ${t('common.weeks')}`,
				}),
			},
			{
				value: 'P3W',
				label: t('taskTemplates.dueDateFromCreationDate', {
					dueDate: `3 ${t('common.weeks')}`,
				}),
			},
			{
				value: 'P4W',
				label: t('taskTemplates.dueDateFromCreationDate', {
					dueDate: `4 ${t('common.weeks')}`,
				}),
			},
			{
				value: 'P1M',
				label: t('taskTemplates.dueDateFromCreationDate', {
					dueDate: t('common.oneMonth'),
				}),
			},
			{
				value: 'P1M15D',
				label: t('taskTemplates.dueDateFromCreationDate', {
					dueDate: `1.5 ${t('common.months')}`,
				}),
			},
			{
				value: 'P2M',
				label: t('taskTemplates.dueDateFromCreationDate', {
					dueDate: `2 ${t('common.months')}`,
				}),
			},
			{
				value: 'P2M15D',
				label: t('taskTemplates.dueDateFromCreationDate', {
					dueDate: `2.5 ${t('common.months')}`,
				}),
			},
			{
				value: 'P3M',
				label: t('taskTemplates.dueDateFromCreationDate', {
					dueDate: `3 ${t('common.months')}`,
				}),
			},
		];
	}

	function onSelectEmailTemplate(emailTemplate) {
		const content = localize(emailTemplate?.body);
		if (!content) return;

		if (!taskTemplate || isTemplateOverrideConfirmed) {
			setValue('discussionText', content);
			return;
		}

		// When editing, confirm overriding the discussion text with the selected email template
		const {openDialog} = useModal();
		openDialog({
			name: 'selectTemplate',
			title: t('taskTemplate.apply'),
			message: t('taskTemplates.confirmEmailTemplate'),
			actions: [
				{
					label: t('common.yes', {}),
					isWarnable: true,
					callback: async (close) => {
						setValue('discussionText', content);
						isTemplateOverrideConfirmed = true;
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

	initEmptyForm('taskTemplate', {
		showErrorFooter: false,
	});

	addPage('default', {
		submitButton: {label: t('common.save')},
		cancelButton: {label: t('common.cancel')},
	});

	addGroup('details', {
		label: t('common.details'),
		description: t('discussion.form.detailsDescription'),
	});

	addFieldText('title', {
		groupId: 'details',
		label: t('common.name'),
		description: t('discussion.form.detailsNameDescription'),
		size: 'large',
		value: taskTemplate?.title,
		hideOnDisplay: true,
	});

	addFieldOptions('userGroupIds', 'checkbox', {
		groupId: 'details',
		label: t('editor.submission.stageParticipants'),
		description: t('discussion.form.detailsParticipantsDescription'),
		name: 'userGroupIds',
		options: getParticipantOptions(),
		value: taskTemplate?.userGroups?.map(({id}) => id) || [],
	});

	addGroup('taskInformation', {
		label: t('discussion.form.taskInformation'),
		description: t('discussion.form.taskInfoDescription'),
	});

	addFieldCheckbox('taskInfoAdd', {
		groupId: 'taskInformation',
		label: t('discussion.form.taskInfoLabel'),
		value: isTask.value,
		hideOnDisplay: true,
		disabled:
			taskTemplate?.type === 'Discussion' && taskTemplate?.status === 'Closed',
	});

	addFieldSelect('taskInfoDueDate', {
		groupId: 'taskInformation',
		label: t('common.dueDate'),
		name: 'taskInfoDueDate',
		showWhen: 'taskInfoAdd',
		value: isTask.value ? taskTemplate?.dueDate : null,
		options: getDueDateOptions(),
		size: 'large',
	});

	addGroup('discussion', {
		label: t('discussion.name'),
		description: t('discussion.form.discussionDescription'),
		groupComponent: {
			component: TaskTemplateManagerEmails,
			props: {
				stage,
				taskTemplate,
				onSelectEmailTemplate,
			},
		},
	});

	addFieldRichTextArea('discussionText', {
		groupId: 'discussion',
		toolbar: 'bold italic underline bullist | pkpAttachFiles | pkpInsert',
		plugins: ['lists'],
		size: 'large',
		init: initDiscussionText(),
		value: taskTemplate?.content || '',
	});

	addGroup('autoAddTemplate');

	addFieldCheckbox('include', {
		groupId: 'autoAddTemplate',
		label: t('taskTemplates.templateAutoAddInStage'),
		value: taskTemplate?.include || false,
	});

	useFormChanged(form, [], onCloseFn, {
		warnOnClose: true,
	});

	return {
		form,
		set,
	};
}
