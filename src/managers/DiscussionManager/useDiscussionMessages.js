import {ref} from 'vue';
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
	const {apiUrl: libraryApiUrl} = useUrl('_library');

	const {
		hasCurrentUserAtLeastOneAssignedRoleInAnyStage,
		hasCurrentUserAtLeastOneRole,
	} = useCurrentUser();

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
		},
	];

	if (
		hasCurrentUserAtLeastOneAssignedRoleInAnyStage(submission, EditorialRoles)
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
			selectedFiles,
		});
	}

	if (
		hasCurrentUserAtLeastOneRole([
			pkp.const.ROLE_ID_SITE_ADMIN,
			pkp.const.ROLE_ID_MANAGER,
		])
	) {
		fileAttachers.push({
			component: 'FileAttacherLibrary',
			label: t('email.addAttachment.libraryFiles'),
			description: t('email.addAttachment.libraryFiles.description'),
			button: t('email.addAttachment.libraryFiles.attach'),
			libraryApiUrl,
			includeSubmissionId: submission.id,
			attachSelectedLabel: t('common.attachSelected'),
			backLabel: t('common.back'),
			downloadLabel: t('common.download'),
		});
	}

	function onRemoveFile(fileId) {
		const index = selectedFiles.value?.findIndex(({id}) => id === fileId);
		selectedFiles.value.splice(index, 1);
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
								selectedFiles.value = files;
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
