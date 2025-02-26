<template>
	<Button
		is-active
		:icon="isVisible ? 'Dropup' : 'Dropdown'"
		@click="isVisible = !isVisible"
	>
		{{ t('common.viewMoreDetails') }}
	</Button>
	<div v-if="isVisible" class="mt-8 flex flex-col gap-y-2">
		<FormDisplayItemBasic
			heading-element="h4"
			:heading="t('user.homePageUrl')"
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
		<h4 class="text-base-normal text-secondary">
			{{ t('user.bioStatement') }}
		</h4>
		<p
			class="pt-1 text-lg-normal"
			v-html="
				localize(store.invitationPayload.biography)
					? localize(store.invitationPayload.biography)
					: '--'
			"
		></p>
		<h4 class="text-base-normal text-secondary">
			{{ t('user.mailingAddress') }}
		</h4>
		<p
			class="pt-1 text-lg-normal"
			v-html="
				store.invitationPayload.mailingAddress
					? store.invitationPayload.mailingAddress
					: '--'
			"
		></p>
		<h4 class="text-base-normal text-secondary">
			{{ t('user.signature') }}
		</h4>
		<p
			class="pt-1 text-lg-normal"
			v-html="
				localize(store.invitationPayload.signature)
					? localize(store.invitationPayload.signature)
					: '--'
			"
		></p>
	</div>
</template>

<script setup>
import Button from '@/components/Button/Button.vue';
import FormDisplayItemBasic from '@/components/FormDisplay/FormDisplayItemBasic.vue';
import {useTranslation} from '@/composables/useTranslation';
import {useUserInvitationPageStore} from './UserInvitationPageStore';
import {ref} from 'vue';

const {t} = useTranslation();
const store = useUserInvitationPageStore();
const isVisible = ref(false);
</script>
