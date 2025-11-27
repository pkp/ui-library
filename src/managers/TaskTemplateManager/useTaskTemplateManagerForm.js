import {ref, computed, inject} from 'vue';
import {useForm} from '@/composables/useForm';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {useFormChanged} from '@/composables/useFormChanged';
import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';
import {useTaskTemplateManagerEmails} from './useTaskTemplateManagerEmails';

import FileAttacherModal from '@/components/Composer/FileAttacherModal.vue';

export function useTaskTemplateManagerForm({
	taskTemplate = null,
	stage = null,
} = {}) {
	const {t} = useLocalize();
	const closeModal = inject('closeModal');
	const isTask = ref(taskTemplate?.type === pkp.const.EDITORIAL_TASK_TYPE_TASK);
	const stageId = taskTemplate?.stageId || stage?.key;
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
		addFieldText,
		addFieldOptions,
		addFieldSelect,
		addFieldCheckbox,
		addFieldPreparedContent,
	} = useForm({}, {customSubmit: handleFormSubmission});

	async function handleFormSubmission(formData) {
		const dataBody = {
			title: formData.title,
			stageId,
			userGroupIds: formData.userGroupIds,
			include: formData.include,
			dueInterval: isTask.value ? formData.dueInterval : null,
			description: formData.description,
			type: isTask.value
				? pkp.const.EDITORIAL_TASK_TYPE_TASK
				: pkp.const.EDITORIAL_TASK_TYPE_DISCUSSION,
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
			setInitialState(form);
			closeModal();
		}

		// return result to Form component handler
		return {
			data: taskTemplateData.value,
			validationError: validationError.value,
			isSuccess: isSuccess.value,
		};
	}

	function getParticipantOptions() {
		const {apiUrl: userGroupsApiUrl} = useUrl(`/userGroups`);

		const {items: userGroupsData, fetch: fetchUserGroups} = useFetchPaginated(
			userGroupsApiUrl,
			{
				page: 1,
				pageSize: 999,
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
		isRequired: true,
	});

	addFieldOptions('userGroupIds', 'checkbox', {
		groupId: 'details',
		label: t('editor.submission.stageParticipants'),
		description: t('discussion.form.detailsParticipantsDescription'),
		name: 'userGroupIds',
		options: getParticipantOptions(),
		value: taskTemplate?.userGroups?.map(({id}) => id) || [],
		isRequired: true,
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
		onChange: (val) => {
			isTask.value = val;
		},
	});

	addFieldSelect('dueInterval', {
		groupId: 'taskInformation',
		label: t('common.dueDate'),
		name: 'dueInterval',
		showWhen: 'taskInfoAdd',
		value: isTask.value ? taskTemplate?.dueInterval : null,
		options: getDueDateOptions(),
		size: 'large',
		isRequired: isTask,
	});

	addGroup('discussion', {
		label: t('discussion.name'),
		description: t('discussion.form.discussionDescription'),
	});

	addFieldPreparedContent('description', {
		groupId: 'discussion',
		toolbar: 'bold italic underline bullist | pkpAttachFiles | pkpInsert',
		plugins: ['lists'],
		size: 'large',
		init: initDiscussionText(),
		value: taskTemplate?.description || '',
		insertModalLabel: t('common.insertContent'),
		insertLabel: t('common.insert'),
		preparedContent,
		preparedContentLabel: t('common.label'),
		isRequired: true,
	});

	addGroup('autoAddTemplate');

	addFieldCheckbox('include', {
		groupId: 'autoAddTemplate',
		label: t('taskTemplates.templateAutoAddInStage'),
		value: taskTemplate?.include || false,
	});

	const {setInitialState} = useFormChanged(form, [], {
		warnOnClose: true,
	});

	return {
		form,
		set,
	};
}
