<template>
	<div>
		<div class="userInvitation__reviewPanel__item">
			<h4 class="userInvitation__reviewPanel__item__header">Email Address</h4>
			<div class="userInvitation__reviewPanel__item__value">
				{{ store.email }}
			</div>
		</div>
	</div>
	<div>
		<div class="userInvitation__reviewPanel__item">
			<h4 class="userInvitation__reviewPanel__item__header">ORCID iD</h4>
			<div class="userInvitation__reviewPanel__item__value">
				{{
					store.acceptinvitationPayload.orcid
						? store.acceptinvitationPayload.orcid
						: t('invitation.orcid.acceptInvitation.message')
				}}
				<Icon
					v-if="store.acceptinvitationPayload.orcid"
					icon="orcid"
					:inline="true"
				/>
			</div>
		</div>
	</div>
	<PkpForm
		v-bind="userForm"
		class="userInvitation__stepForm"
		@set="updateUserDetailsForm"
	></PkpForm>
</template>

<script setup>
import {defineProps, computed} from 'vue';
import PkpForm from '@/components/Form/Form.vue';
import Icon from '@/components/Icon/Icon.vue';
import {useForm} from '@/composables/useForm';
import {useAcceptInvitationPageStore} from './AcceptInvitationPageStore';

const props = defineProps({
	form: {type: Object, required: true},
	validateFields: {type: Array, required: true},
});

const store = useAcceptInvitationPageStore();

function updateUserDetailsForm(a, {fields}, c, d) {
	if (fields) {
		fields.forEach((field) => {
			if (store.acceptinvitationPayload[field.name] !== field.value) {
				store.updateAcceptInvitationPayload(field.name, field.value);
			}
		});
	}
}

const {
	form: userForm,
	connectWithPayload,
	connectWithErrors,
} = useForm(props.form);
connectWithPayload(store.acceptinvitationPayload);

const sectionErrors = computed(() => {
	return props.validateFields.reduce((obj, key) => {
		if (store.errors[key]) {
			obj[key] = store.errors[key];
		}
		return obj;
	}, {});
});

connectWithErrors(sectionErrors);
</script>
