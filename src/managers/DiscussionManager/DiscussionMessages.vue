<template>
	<div class="flex flex-col gap-y-6">
		<ul class="flex flex-col gap-y-6">
			<li
				v-for="message in discussionMessagesStore.discussionMessages"
				:key="message.id"
			>
				<p class="flex justify-between border border-light bg-tertiary p-3">
					<span class="text-lg-bold">
						{{ t('discussion.messageFrom', {from: message.email}) }}
					</span>
					<span class="text-lg-normal">
						{{ formatShortDateTime(message.createdAt) }}
					</span>
				</p>
				<p class="border border-t-0 border-light p-6">
					<span
						v-strip-unsafe-html="message.discussionText"
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
				v-bind="discussionMessagesStore.messageFieldOptions"
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
import {useDiscussionMessagesStore} from './discussionMessagesStore';

import PkpButton from '@/components/Button/Button.vue';
import FieldRichTextarea from '@/components/Form/fields/FieldRichTextarea.vue';

const emit = defineEmits(['newMessage']);
const {formatShortDateTime} = useDate();
const toggleMessageForm = ref(false);
const discussionMessagesStore = useDiscussionMessagesStore();

defineProps({
	submission: {
		type: Object,
		required: true,
	},
	discussion: {
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
