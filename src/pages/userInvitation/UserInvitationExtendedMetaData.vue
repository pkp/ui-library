<template>
	<div class="mt-8 flex flex-col gap-y-2">
		<FormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.url')"
			:value="
				store.invitationUserData.homePageUrl
					? store.invitationUserData.homePageUrl
					: '--'
			"
		></FormDisplayItemBasic>

		<FormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.phone')"
			:value="
				store.invitationUserData.phone ? store.invitationUserData.phone : '--'
			"
		></FormDisplayItemBasic>
		<FormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.workingLanguages')"
			:value="
				store.invitationUserData.locales
					? store.invitationUserData.locales
					: '--'
			"
		></FormDisplayItemBasic>

		<FormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.interests')"
			:value="
				localize(store.invitationUserData.reviewerInterests)
					? localize(store.invitationUserData.reviewerInterests)
					: '--'
			"
		></FormDisplayItemBasic>
		<FormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.bioStatement')"
			:html-value="
				localize(store.invitationUserData.biography)
					? localize(store.invitationUserData.biography)
					: '--'
			"
		></FormDisplayItemBasic>
		<FormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.mailingAddress')"
			:html-value="
				store.invitationUserData.mailingAddress
					? store.invitationUserData.mailingAddress
					: '--'
			"
		></FormDisplayItemBasic>
		<FormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.signature')"
			:html-value="
				localize(store.invitationUserData.signature)
					? localize(store.invitationUserData.signature)
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
