<template>
	<div>
		<div class="border-t border-light p-8">
			<div class="p-4">
				<FormDisplayItemBasic
					heading-element="h4"
					heading="Title"
					:value="store.submission?.title"
				></FormDisplayItemBasic>
			</div>
			<div class="p-4">
				<AcceptInvitationFormDisplayItemBasic
					heading-class="inline-block text-xl-bold"
					heading-element="h4"
					heading="Abstract"
					:html-value="localize(store.submission?.abstract)"
				></AcceptInvitationFormDisplayItemBasic>
			</div>
		</div>
		<div class="border-t border-light p-8">
			<div class="flex items-center p-4">
				<h3>{{ t('editor.review.reviewDetails') }}</h3>
			</div>
			<div class="flex items-center p-4">
				<FormDisplayItemBasic
					heading-element="h4"
					:heading="t('reviewerInvitation.responseDueDate')"
					:value="store.acceptInvitationPayload.responseDueDate"
				></FormDisplayItemBasic>
			</div>
			<div class="flex items-center p-4">
				<FormDisplayItemBasic
					heading-element="h4"
					:heading="t('reviewerInvitation.reviewDueDate')"
					:value="store.acceptInvitationPayload.responseDueDate"
				></FormDisplayItemBasic>
			</div>
		</div>
	</div>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import FormDisplayItemBasic from '@/components/FormDisplay/FormDisplayItemBasic.vue';
import {useAcceptInvitationPageStore} from './AcceptInvitationPageStore';
import AcceptInvitationFormDisplayItemBasic from './AcceptInvitationFormDisplayItemBasic.vue';

const store = useAcceptInvitationPageStore();
const {t} = useLocalize();
</script>
