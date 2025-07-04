import {computed} from 'vue';
import {useForm} from '@/composables/useForm';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {useCurrentUser} from '@/composables/useCurrentUser';
import {useParticipantManagerStore} from '../ParticipantManager/participantManagerStore';
import FileAttacherModal from '@/components/Composer/FileAttacherModal.vue';
import FieldPreparedContentInsertModal from '@/components/Form/fields/FieldPreparedContentInsertModal.vue';
import preparedContent from '../../mixins/preparedContent';

export function useDiscussionManagerForm({
	status = 'New',
	submission,
	submissionStageId,
	closeDialog = () => {},
	onSubmitFn = null,
} = {}) {
	const {t} = useLocalize();
	const participantManagerStore = useParticipantManagerStore({
		submission,
		submissionStageId,
	});

	const currentUser = useCurrentUser();

	const participantOptions = computed(() => {
		return participantManagerStore.participantsList.map((participant) => {
			let label = `${participant.fullName} (${participant.userName})`;

			if (participant.userName === currentUser.getCurrentUserName()) {
				label += ` (${t('common.me')})`;
			}

			return {
				label,
				subLabel: participant.roleName,
				value: participant.id,
			};
		});
	});

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

	async function handleFormSubmission(formData) {
		// return result to Form component handler
		return {
			data: {},
			validationError: {},
		};
	}

	const {
		form,
		initEmptyForm,
		addPage,
		addGroup,
		set,
		addFieldText,
		addFieldOptions,
		addFieldRichTextArea,
	} = useForm({}, {customSubmit: handleFormSubmission});

	initEmptyForm('discussion', {
		showErrorFooter: false,
	});

	addPage('default', {
		submitButton: {label: t('common.save')},
		cancelButton: {label: t('common.cancel')},
	});

	addGroup('details', {
		label: t('common.details'),
		description: 'Placeholder',
	});

	addFieldText('detailsName', {
		label: t('common.name'),
		description: t('tasks.discussions.form.details.name.description'),
		groupId: 'details',
		size: 'large',
	});

	addFieldOptions('detailsParticipants', 'checkbox', {
		label: t('editor.submission.stageParticipants'),
		description: t('tasks.discussions.form.details.participants.description'),
		groupId: 'details',
		name: 'detailsParticipants',
		options: participantOptions,
	});

	addGroup('taskInformation');

	addGroup('discussion', {
		label: t('submission.discussion'),
		description: t('tasks.discussions.form.discussion.description'),
	});

	addFieldRichTextArea('discussionText', {
		groupId: 'discussion',
		toolbar: 'bold italic underline bullist | pkpAttachFiles | pkpInsert',
		plugins: ['lists'],
		size: 'large',
		init: {
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
		},
	});

	const badgeProps = getBadgeProps(status);

	return {
		form,
		set,
		badgeProps,
	};
}
