<template>
	<div class="p-8 pb-0">
		<div>
			<div class="p-1">
				<FormDisplayItemBasic
					heading-element="h4"
					:heading="t('user.emailAddress')"
					:value="store.email"
				></FormDisplayItemBasic>
			</div>
		</div>
		<div>
			<div class="p-1">
				<FormDisplayItemBasic
					heading-element="h4"
					:heading="t('user.orcid')"
					:value="
						store.acceptinvitationPayload.orcid
							? store.acceptinvitationPayload.orcid
							: t('invitation.orcid.acceptInvitation.message')
					"
				></FormDisplayItemBasic>
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
		class="acceptInvitation__stepForm"
		@set="updateUserDetailsForm"
	></PkpForm>
</template>

<script setup>
import {defineProps, computed} from 'vue';
import FormDisplayItemBasic from '@/components/FormDisplay/FormDisplayItemBasic.vue';
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
