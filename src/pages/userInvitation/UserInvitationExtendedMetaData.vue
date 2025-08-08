<template>
	<div class="mt-8 flex flex-col gap-y-2">
		<AcceptInvitationFormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.url')"
			:value="
				store.invitationUserData.homePageUrl
					? store.invitationUserData.homePageUrl
					: '--'
			"
		></AcceptInvitationFormDisplayItemBasic>

		<AcceptInvitationFormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.phone')"
			:value="
				store.invitationUserData.phone ? store.invitationUserData.phone : '--'
			"
		></AcceptInvitationFormDisplayItemBasic>
		<AcceptInvitationFormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.workingLanguages')"
			:value="
				store.invitationUserData.locales
					? store.invitationUserData.locales
					: '--'
			"
		></AcceptInvitationFormDisplayItemBasic>

		<AcceptInvitationFormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.interests')"
			:value="
				store.invitationUserData.reviewInterests
					? store.invitationUserData.reviewInterests
					: '--'
			"
		></AcceptInvitationFormDisplayItemBasic>
		<AcceptInvitationFormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.bioStatement')"
			:html-value="
				localize(store.invitationUserData.biography)
					? localize(store.invitationUserData.biography)
					: '--'
			"
		></AcceptInvitationFormDisplayItemBasic>
		<AcceptInvitationFormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.mailingAddress')"
			:html-value="
				store.invitationUserData.mailingAddress
					? store.invitationUserData.mailingAddress
					: '--'
			"
		></AcceptInvitationFormDisplayItemBasic>
		<AcceptInvitationFormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.signature')"
			:html-value="
				localize(store.invitationUserData.signature)
					? localize(store.invitationUserData.signature)
					: '--'
			"
		></AcceptInvitationFormDisplayItemBasic>
	</div>
</template>

<script setup>
import AcceptInvitationFormDisplayItemBasic from '@/pages/acceptInvitation/AcceptInvitationFormDisplayItemBasic.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useUserInvitationPageStore} from './UserInvitationPageStore';

const {t} = useLocalize();
const store = useUserInvitationPageStore();
</script>
