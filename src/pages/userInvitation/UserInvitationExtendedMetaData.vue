<template>
	<div class="mt-8 flex flex-col gap-y-2">
		<FormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.url')"
			:value="
				store.invitationPayload.homePageUrl
					? store.invitationPayload.homePageUrl
					: '--'
			"
		></FormDisplayItemBasic>

		<FormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.phone')"
			:value="
				store.invitationPayload.phone ? store.invitationPayload.phone : '--'
			"
		></FormDisplayItemBasic>
		<FormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.workingLanguages')"
			:value="
				store.invitationPayload.locales ? store.invitationPayload.locales : '--'
			"
		></FormDisplayItemBasic>

		<FormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.interests')"
			:value="
				localize(store.invitationPayload.reviewerInterests)
					? localize(store.invitationPayload.reviewerInterests)
					: '--'
			"
		></FormDisplayItemBasic>

		<FormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.affiliation')"
			:value="
				localize(store.invitationPayload.affiliation)
					? localize(store.invitationPayload.affiliation)
					: '--'
			"
		></FormDisplayItemBasic>
		<FormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.bioStatement')"
			:html-value="
				localize(store.invitationPayload.biography)
					? localize(store.invitationPayload.biography)
					: '--'
			"
		></FormDisplayItemBasic>
		<FormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.mailingAddress')"
			:html-value="
				store.invitationPayload.mailingAddress
					? store.invitationPayload.mailingAddress
					: '--'
			"
		></FormDisplayItemBasic>
		<FormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.signature')"
			:html-value="
				localize(store.invitationPayload.signature)
					? localize(store.invitationPayload.signature)
					: '--'
			"
		></FormDisplayItemBasic>
	</div>
</template>

<script setup>
import FormDisplayItemBasic from '@/components/FormDisplay/FormDisplayItemBasic.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useUserInvitationPageStore} from './UserInvitationPageStore';

const {t} = useLocalize();
const store = useUserInvitationPageStore();
</script>
