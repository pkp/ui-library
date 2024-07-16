<template>
	<div v-if="store.invitationPayload.userId === null">
		<PkpForm
			v-bind="userForm"
			class="userInvitation__stepForm"
			@set="updateUserForm"
		></PkpForm>
	</div>
	<div v-if="store.invitationPayload.userId !== null" class="p-8">
		<div class="p-1">
			<FormDisplayItemBasic
				heading-element="h4"
				:heading="t('user.emailAddress')"
				:value="store.invitationPayload.email"
			></FormDisplayItemBasic>

			<FormDisplayItemBasic
				heading-element="h4"
				:heading="t('user.orcid')"
				:value="store.invitationPayload.orcid"
			></FormDisplayItemBasic>

			<Icon
				v-if="store.invitationPayload.orcidValidation"
				icon="orcid"
				:inline="true"
			/>

			<FormDisplayItemBasic
				heading-element="h4"
				:heading="t('user.givenName')"
				:value="localize(store.invitationPayload.givenName)"
			></FormDisplayItemBasic>

			<FormDisplayItemBasic
				heading-element="h4"
				:heading="t('user.familyName')"
				:value="localize(store.invitationPayload.familyName)"
			></FormDisplayItemBasic>

			<FormDisplayItemBasic
				heading-element="h4"
				:heading="t('user.affiliation')"
				:value="localize(store.invitationPayload.affiliation)"
			></FormDisplayItemBasic>
		</div>
	</div>
	<div class="p-8">
		<UserInvitationUserGroupsTable
			:user-groups="userGroups"
			:errors="sectionErrors"
		/>
	</div>
</template>

<script setup>
import {defineProps, computed} from 'vue';
import FormDisplayItemBasic from '@/components/FormDisplay/FormDisplayItemBasic.vue';
import Icon from '@/components/Icon/Icon.vue';
import PkpForm from '@/components/Form/Form.vue';
import {useTranslation} from '@/composables/useTranslation';
import UserInvitationUserGroupsTable from './UserInvitationUserGroupsTable.vue';
import {useUserInvitationPageStore} from './UserInvitationPageStore';
import {useForm} from '@/composables/useForm';

function updateUserForm(a, {fields}, c, d) {
	if (fields) {
		fields.forEach((field) => {
			if (store.invitationPayload[field.name] !== field.value) {
				store.updatePayload(field.name, field.value);
			}
		});
	}
}

const {t} = useTranslation();
const store = useUserInvitationPageStore();

const props = defineProps({
	form: {type: Object, required: true},
	userGroups: {type: Object, required: true},
	validateFields: {type: Array, required: true},
});
const {
	form: userForm,
	connectWithPayload,
	connectWithErrors,
} = useForm(props.form);

connectWithPayload(store.invitationPayload);

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
