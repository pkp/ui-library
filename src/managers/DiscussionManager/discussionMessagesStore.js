import {defineComponentStore} from '@/utils/defineComponentStore';

import {computed, watch} from 'vue';

import {t} from '@/utils/i18n';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useDataChanged} from '@/composables/useDataChanged';
import {useExtender} from '@/composables/useExtender';
import {useModal} from '@/composables/useModal';

import FileAttacherModal from '@/components/Composer/FileAttacherModal.vue';
import FieldPreparedContentInsertModal from '@/components/Form/fields/FieldPreparedContentInsertModal.vue';

import preparedContent from '../../mixins/preparedContent';

export const useDiscussionMessagesStore = defineComponentStore(
	'discussionMessages',
	(props) => {
		const extender = useExtender();
		const messageFieldOptions = {
			toolbar: 'bold italic underline bullist | pkpAttachFiles | pkpInsert',
			plugins: ['lists'],
			size: 'large',
			init: initDiscussionText(),
		};

		const relativeUrl = computed(() => {
			return `messages`;
		});

		const {apiUrl: messagesApiUrl} = useUrl(relativeUrl);

		const {data: messages, fetch: fetchDiscussionMessages} =
			useFetch(messagesApiUrl);

		watch(relativeUrl, () => {
			messages.value = null;
			fetchDiscussionMessages();
		});

		fetchDiscussionMessages();

		const {triggerDataChange} = useDataChanged(() => fetchDiscussionMessages());

		function triggerDataChangeCallback() {
			triggerDataChange();
		}

		const discussionMessages = computed(() => {
			if (!messages.value) {
				return [];
			}

			return messages.value;
		});

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

		return {
			discussionMessages,
			triggerDataChangeCallback,
			messageFieldOptions,

			extender,
			props,
		};
	},
);
