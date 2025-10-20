import {ref, computed} from 'vue';
import {localize} from '@/utils/i18n';
import {useForm} from '@/composables/useForm';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {useFormChanged} from '@/composables/useFormChanged';
import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';
import {useTaskTemplateManagerEmails} from './useTaskTemplateManagerEmails';

import FileAttacherModal from '@/components/Composer/FileAttacherModal.vue';
import FieldPreparedContentInsertModal from '@/components/Form/fields/FieldPreparedContentInsertModal.vue';

export function useTaskTemplateManagerForm({
	taskTemplate = null,
	stage = null,
	onCloseFn = () => {},
} = {}) {
	const {t} = useLocalize();
	const isTask = ref(taskTemplate?.type === 'Task');
	const stageId = taskTemplate?.stageId || stage?.key;
	let isTemplateOverrideConfirmed = false;
	const {emailTemplatesData} = useTaskTemplateManagerEmails({
		stage,
		taskTemplate,
	});

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
		const dataBody = {
			title: formData.title,
			stageId,
			userGroupIds: formData.userGroupIds,
			include: formData.include,
		};

		let taskTemplatesUrl = 'editTaskTemplates';
		if (taskTemplate?.id) {
			taskTemplatesUrl += `/${taskTemplate.id}`;
		}
		const {apiUrl: addTaskTemplateUrl} = useUrl(taskTemplatesUrl);

		const {
			fetch,
			data: taskTemplateData,
			validationError,
			isSuccess,
		} = useFetch(addTaskTemplateUrl, {
			method: taskTemplate?.id ? 'PUT' : 'POST',
			body: dataBody,
			expectValidationError: true,
		});

		await fetch();

		if (isSuccess.value) {
			onCloseFn();
		}

		// return result to Form component handler
		return {
			data: taskTemplateData.value,
			validationError: validationError.value,
			isSuccess: isSuccess.value,
		};
	}

	function getParticipantOptions() {
		const {apiUrl: userGroupsApiUrl} = useUrl(
			`contexts/${pkp.context.id}/userGroups`,
		);

		const {items: userGroupsData, fetch: fetchUserGroups} = useFetchPaginated(
			userGroupsApiUrl,
			{
				page: 1,
				pageSize: 50,
			},
		);

		fetchUserGroups();

		return computed(
			() =>
				userGroupsData.value?.map((userGroup) => ({
					value: userGroup.id,
					label: userGroup.name,
				})) || [],
		);
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

	// eslint-disable-next-line no-unused-vars
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
						const {openSideModal, closeSideModal} = useModal(
							FieldPreparedContentInsertModal,
						);
						openSideModal(FieldPreparedContentInsertModal, {
							title: t('common.insertContent'),
							insertLabel: t('common.insert'),
							preparedContent,
							preparedContentLabel: 'Label',
							onInsert: (text) => {
								editor.insertContent(text);
								closeSideModal(FieldPreparedContentInsertModal);
							},
						});
					},
				});
			},
		};
	}

	const preparedContent = computed(() => {
		const dataDescriptions = emailTemplatesData.value?.dataDescriptions;
		if (!dataDescriptions) {
			return [];
		}

		const items = [];

		Object.keys(dataDescriptions).forEach((key) => {
			items.push({
				key,
				value: `{$${key}}`,
				description: dataDescriptions[key],
			});
		});

		return items;
	});

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
