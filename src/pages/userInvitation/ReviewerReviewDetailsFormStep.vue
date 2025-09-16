<template>
	<div
		v-if="store.invitationPayload.disabled"
		class="m-8 border-x border-b border-t border-light bg-secondary p-4"
	>
		<h2 class="text-xl-bold text-heading">
			{{ t('userInvitation.user.disableTitle') }}
		</h2>
		<p class="text-base-normal text-secondary">
			{{ t('userInvitation.user.disableMessage') }}
		</p>
	</div>
	<div>
		<div v-if="Object.keys(store.errors).length" class="p-4">
			<FormErrorSummary :errors="store.errors" />
		</div>
		<PkpForm
			v-bind="reviewerRevieweDetailsForm"
			class="userInvitation__stepForm"
			:show-error-footer="false"
			@set="updateReviewerRevieweDetailsForm"
		></PkpForm>
	</div>
</template>
<script setup>
import {defineProps, computed} from 'vue';
import PkpForm from '@/components/Form/Form.vue';
import {useForm} from '@/composables/useForm';
import FormErrorSummary from '@/components/Form/FormErrorSummary.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useUserInvitationPageStore} from './UserInvitationPageStore';

const props = defineProps({
	form: {type: Object, required: true},
	validateFields: {type: Array, required: true},
});
const {
	form: reviewerRevieweDetailsForm,
	connectWithPayload,
	connectWithErrors,
	set,
	structuredErrors,
} = useForm(props.form);

const store = useUserInvitationPageStore();
const {t} = useLocalize();

reviewerRevieweDetailsForm.value.fields.forEach((field) => {
	console.log(field);
	if (store.invitationPayload[field.name] === null) {
		console.log(1);
		store.updatePayload(field.name, field.value, true);
	} else {
		console.log(2);
		store.updatePayload(field.name, store.invitationPayload[field.name], false);
	}
});
console.log(store.invitationPayload);
connectWithPayload(store.invitationPayload);

/*
 * Update the payload by using form values on multilingual or not
 * @param id string
 * @param form Object
 * @param c
 * @param d
 */
function updateReviewerRevieweDetailsForm(id, form, c, d) {
	set(id, form, c, d);
	if (form.fields) {
		form.fields.forEach((field) => {
			store.updatePayload(field.name, field.value, false);
		});
	}
}

/**
 * handing errors and covert dot notation to object
 */
const sectionErrors = computed(() => {
	return structuredErrors(store.errors);
});
connectWithErrors(sectionErrors);
</script>
