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
				:is-active="toggleMessageForm"
				:is-disabled="toggleMessageForm"
				@click="addMessage"
			>
				{{ t('discussion.addNewMessage') }}
			</PkpButton>
		</div>
		<div v-if="toggleMessageForm">
			<FieldRichTextarea
				v-bind="messageFieldOptions"
				id="newMessage"
				name="newMessage"
				group-id="discussion"
				component="field-rich-textarea"
				:form-id="formId"
				@change="fieldChanged"
			></FieldRichTextarea>
		</div>
	</div>
</template>

<script setup>
import {ref} from 'vue';
import {t} from '@/utils/i18n';
import {useDate} from '@/composables/useDate';
import {useDiscussionMessages} from './useDiscussionMessages';

import PkpButton from '@/components/Button/Button.vue';
import FieldRichTextarea from '@/components/Form/fields/FieldRichTextarea.vue';

const emit = defineEmits(['newMessage']);
const {formatShortDateTime} = useDate();
const toggleMessageForm = ref(false);
const {messageFieldOptions} = useDiscussionMessages();

defineProps({
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
});

function addMessage() {
	toggleMessageForm.value = true;
}

function fieldChanged(name, prop, newVal, localeKey) {
	emit('newMessage', newVal);
}
</script>
