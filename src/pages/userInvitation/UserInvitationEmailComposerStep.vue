<template>
	<composer
		:id="store.currentStep.id"
		:add-c-c-label="t('common.addCCBCC')"
		:attach-files-label="t('common.attachFiles')"
		:attached-files-label="t('common.attachedFiles')"
		:attachers="section.email.attachers"
		:attachments="section.email.attachments"
		:bcc="section.email.bcc"
		:bcc-label="t('email.bcc')"
		:body-label="t('stageParticipants.notify.message')"
		:can-change-recipients="section.email.canChangeRecipients"
		:cc="section.email.cc"
		:cc-label="t('email.cc')"
		:confirm-switch-locale-label="t('email.confirmSwitchLocale')"
		:deselect-label="t('common.deselect')"
		:email-templates="section.email.emailTemplates"
		:email-templates-api-url="store.emailTemplatesApiUrl"
		:errors="section.email.errors"
		:find-template-label="t('common.findTemplate')"
		:initial-template-key="section.email.initialTemplateKey"
		:insert-label="t('common.insert')"
		:insert-modal-label="t('common.insertContent')"
		:insert-content-label="t('common.content')"
		:insert-search-label="t('common.insertContentSearch')"
		:load-template-label="t('common.emailTemplates')"
		:locale="section.email.locale"
		:locales="section.email.locales"
		:more-search-results-label="t('common.numberedMore')"
		:recipient-options="section.email.recipientOptions"
		:recipients="section.email.recipients"
		:recipients-label="t('email.to')"
		:remove-item-label="t('common.removeItem')"
		:searching-label="t('common.searching')"
		:search-results-label="t('search.searchResults')"
		:subject-label="t('email.subject')"
		:switch-to-label="t('common.switchTo')"
		:switch-to-named-language-label="t('common.switchToNamedItem')"
		:variables="section.email.variables"
		v-bind="emailComposer"
		@set="(componentName, update) => updateEmail(update)"
	></composer>
</template>

<script setup>
import {computed} from 'vue';
import Composer from '@/components/Composer/Composer.vue';
import {useTranslation} from '@/composables/useTranslation';
import {defineProps} from 'vue';
import {useUserInvitationPageStore} from './UserInvitationPageStore';

const props = defineProps({
	section: {type: Object, required: true},
});
const {t} = useTranslation();

const store = useUserInvitationPageStore();
const emailComposer = computed(() => store.invitationPayload.emailComposer);

function updateEmail(update) {
	const emailComposerUpdate = {
		...store.invitationPayload.emailComposer,
		...update,
	};
	store.updatePayload('emailComposer', emailComposerUpdate);
}

if (!store.invitationPayload.body) {
	updateEmail({
		subject: props.section.email.subject,
		body: props.section.email.body,
	});
}
</script>
