<template>
	<div class="flex flex-col gap-y-6">
		<ul class="flex flex-col gap-y-6">
			<li v-for="note in workItem.notes" :key="note.id">
				<p class="flex justify-between border border-light bg-tertiary p-3">
					<span class="text-lg-bold">
						{{ t('discussion.messageFrom', {from: note.createdByUsername}) }}
					</span>
					<span class="text-lg-normal">
						{{ formatShortDateTime(note.dateCreated) }}
					</span>
				</p>
				<p class="border border-t-0 border-light p-4">
					<span
						v-strip-unsafe-html="note.contents"
						class="semantic-defaults"
					></span>
				</p>
			</li>
		</ul>

		<div>
			<PkpButton
				v-if="hasAccessToAddMessage"
				:is-active="showNewMessageField"
				:is-disabled="showNewMessageField"
				@click="addMessage"
			>
				{{ t('discussion.addNewMessage') }}
			</PkpButton>
		</div>
		<div v-if="showNewMessageField">
			<FieldRichTextarea
				v-bind="messageFieldOptions"
				id="newMessage"
				name="newMessage"
				group-id="discussion"
				component="field-rich-textarea"
				:form-id="formId"
				@change="fieldChanged"
			>
				<template #footer>
					<FileAttacherAttachedFiles
						:selected-files="selectedFiles"
						@remove-file="onRemoveFile"
					></FileAttacherAttachedFiles>
				</template>
			</FieldRichTextarea>
			<FieldError
				v-if="newMessageError && newMessageError.length"
				:messages="newMessageError"
			/>
		</div>
	</div>
</template>

<script setup>
import {computed} from 'vue';
import {t} from '@/utils/i18n';
import {useDate} from '@/composables/useDate';
import {useDiscussionMessages} from './useDiscussionMessages';
import {useCurrentUser} from '@/composables/useCurrentUser';

import PkpButton from '@/components/Button/Button.vue';
import FieldRichTextarea from '@/components/Form/fields/FieldRichTextarea.vue';
import FieldError from '@/components/Form/FieldError.vue';
import FileAttacherAttachedFiles from '@/components/FileAttacher/FileAttacherAttachedFiles.vue';

const emit = defineEmits(['newMessage', 'newMessageChanged']);
const {formatShortDateTime} = useDate();
const {getCurrentUserId} = useCurrentUser();

const props = defineProps({
	submission: {
		type: Object,
		required: true,
	},
	workItem: {
		type: Object,
		required: true,
	},
	inDisplayMode: {
		type: Boolean,
		default: () => false,
	},
	formId: {
		type: String,
		required: true,
	},
	newMessageError: {
		type: Object,
		default: () => null,
	},
	showNewMessageField: {
		type: Boolean,
		default: false,
	},
});

const {messageFieldOptions, selectedFiles, onRemoveFile} =
	useDiscussionMessages(props.submission);

function addMessage() {
	emit('newMessage');
}

function fieldChanged(name, prop, newVal, localeKey) {
	emit('newMessageChanged', newVal);
}

const hasAccessToAddMessage = computed(() =>
	props.workItem.participants?.find(
		(particpant) => particpant.userId === getCurrentUserId(),
	),
);
</script>
