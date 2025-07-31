<template>
	<div class="flex flex-col gap-y-6">
		<div
			v-for="message in discussionMessagesStore.discussionMessages"
			:key="message.id"
		>
			<div class="flex justify-between border border-light bg-tertiary p-3">
				<span class="text-lg-bold">
					{{ t('discussion.messageFrom', {from: message.email}) }}
				</span>
				<span class="text-lg-normal">
					{{ formatShortDateTime(message.createdAt) }}
				</span>
			</div>
			<div class="border border-t-0 border-light p-6">
				<div
					v-strip-unsafe-html="message.discussionText"
					class="semantic-defaults"
				></div>
			</div>
		</div>

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
});

function addMessage() {
	toggleMessageForm.value = true;
}
</script>
