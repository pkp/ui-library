import {ref, computed} from 'vue';
import {t} from '@/utils/i18n';
import {useModal} from '@/composables/useModal';
import {useUrl} from '../../composables/useUrl';
import {useCurrentUser, EditorialRoles} from '@/composables/useCurrentUser';
import {createDropzoneOptions} from '@/components/FileUploader/dropzoneDefaults';

import FileAttacherModal from '@/components/Composer/FileAttacherModal.vue';
import FieldPreparedContentInsertModal from '@/components/Form/fields/FieldPreparedContentInsertModal.vue';

import preparedContent from '../../mixins/preparedContent';

export function useDiscussionMessages(submission) {
	const selectedFiles = ref([]);
	const messageFieldOptions = {
		toolbar: 'bold italic underline bullist | pkpAttachFiles | pkpInsert',
		plugins: ['lists'],
		size: 'large',
		init: initDiscussionText(),
	};

	const {apiUrl: temporaryFilesApiUrl} = useUrl('temporaryFiles');
	const {apiUrl: submissionFilesApiUrl} = useUrl(
		`submissions/${submission.id}/files`,
	);

	const {hasCurrentUserAtLeastOneAssignedRoleInAnyStage} = useCurrentUser();

	const fileAttachers = [
		{
			component: 'FileAttacherUpload',
			label: t('common.upload.addFile'),
			description: t('common.upload.addFile.description'),
			button: t('common.upload.addFile'),
			dropzoneOptions: createDropzoneOptions({
				url: temporaryFilesApiUrl,
			}),
			temporaryFilesApiUrl,
			addFilesLabel: t('common.addFiles'),
			attachFilesLabel: t('common.attachFiles'),
			backLabel: t('common.back'),
			dragAndDropMessage: t('common.dragAndDropHere'),
			dragAndDropOrUploadMessage: t('common.orUploadFile'),
			removeItemLabel: t('common.removeItem'),
			selectedFiles: computed(() =>
				selectedFiles.value?.filter(
					(file) => file.componentSource === 'FileAttacherUpload',
				),
			),
		},
	];

	if (
		hasCurrentUserAtLeastOneAssignedRoleInAnyStage(submission, [
			...EditorialRoles,
			pkp.const.ROLE_ID_AUTHOR,
		])
	) {
		fileAttachers.push({
			component: 'FileAttacherSubmissionStage',
			label: t('workflow.files'),
			description: t('workflow.attachUploadedFiles'),
			button: t('workflow.attachWorkflowFiles'),
			submissionFilesApiUrl,
			submission,
			attachSelectedLabel: t('common.attachSelected'),
			backLabel: t('common.back'),
			downloadLabel: t('common.download'),
			selectedFiles: computed(() =>
				selectedFiles.value?.filter(
					(file) => file.componentSource === 'FileAttacherSubmissionStage',
				),
			),
		});
	}

	function onRemoveFile(fileId) {
		const index = selectedFiles.value?.findIndex(({id}) => id === fileId);
		if (index > -1) {
			selectedFiles.value.splice(index, 1);
		}
	}

	function onAddAttachments(component, files) {
		// Add componentSource to each new file
		const mappedFiles = files.map((f) => ({
			...f,
			componentSource: component,
		}));

		// Keep existing files that are NOT from this component type
		const filtered = selectedFiles.value.filter(
			(f) => f.componentSource !== component,
		);

		selectedFiles.value = [...filtered, ...mappedFiles];
	}

	function initDiscussionText() {
		return {
			setup: (editor) => {
				editor.ui.registry.addButton('pkpAttachFiles', {
					icon: 'upload',
					text: t('common.attachFiles'),
					onAction() {
						const {openSideModal, closeSideModal} = useModal();

						openSideModal(FileAttacherModal, {
							title: t('common.attachFiles'),
							attachers: fileAttachers,
							onAddAttachments: function (component, files) {
								onAddAttachments(component, files);
								closeSideModal(FileAttacherModal);
							},
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

	return {
		messageFieldOptions,
		selectedFiles,
		onRemoveFile,
	};
}
