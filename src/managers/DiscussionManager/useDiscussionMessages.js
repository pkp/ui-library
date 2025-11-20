import {t} from '@/utils/i18n';
import {useModal} from '@/composables/useModal';
import {useUrl} from '../../composables/useUrl';
import {createDropzoneOptions} from '@/components/FileUploader/dropzoneDefaults';

import FileAttacherModal from '@/components/Composer/FileAttacherModal.vue';
import FieldPreparedContentInsertModal from '@/components/Form/fields/FieldPreparedContentInsertModal.vue';

import preparedContent from '../../mixins/preparedContent';

export function useDiscussionMessages({submissionId} = {}) {
	const messageFieldOptions = {
		toolbar: 'bold italic underline bullist | pkpAttachFiles | pkpInsert',
		plugins: ['lists'],
		size: 'large',
		init: initDiscussionText(),
	};

	const {apiUrl: temporaryFilesApiUrl} = useUrl('temporaryFiles');
	const {apiUrl: submissionFilesApiUrl} = useUrl(
		`submissions/${submissionId}/files`,
	);
	const {apiUrl: libraryApiUrl} = useUrl('_library');

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
		{
			component: 'FileAttacherFileStage',
			label: t('workflow.files'),
			description: t('workflow.attachUploadedFiles'),
			button: t('workflow.attachWorkflowFiles'),
			submissionFilesApiUrl,
			attachSelectedLabel: t('common.attachSelected'),
			backLabel: t('common.back'),
			downloadLabel: t('common.download'),
			fileStages: [
				{
					label: t('editor.submission.revisions'),
					queryParams: {
						fileStage: pkp.const.SUBMISSION_FILE_REVIEW_REVISION,
						reviewRoundId: 1,
					},
				},
				{
					label: t('fileManager.filesForReview'),
					queryParams: {
						fileStage: pkp.const.SUBMISSION_FILE_REVIEW_FILE,
						reviewRoundId: 1,
					},
				},
			],
		},
		{
			component: 'FileAttacherLibrary',
			label: t('email.addAttachment.libraryFiles'),
			description: t('email.addAttachment.libraryFiles.description'),
			button: t('email.addAttachment.libraryFiles.attach'),
			libraryApiUrl,
			includeSubmissionId: submissionId,
			attachSelectedLabel: t('common.attachSelected'),
			backLabel: t('common.back'),
			downloadLabel: t('common.download'),
		},
	];

	function onAddAttachments(component, files) {
		console.log('Attachments added from', component, files);
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
							attachers: fileAttachers,
							onAddAttachments,
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
	};
}
