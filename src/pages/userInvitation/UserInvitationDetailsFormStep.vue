<template>
	<div v-if="store.invitationPayload.userId === null">
		<pkp-form
			v-bind="userForm"
			class="userInvitation__stepForm"
			@set="updateUserForm"
		></pkp-form>
	</div>
	<div v-if="store.invitationPayload.userId !== null">
		<div class="p-1">
			<h4 class="text-sm m-0 leading-6">Email Address</h4>
			<div class="text-sm mb-4 leading-6">
				{{ store.invitationPayload.email }}
			</div>
			<h4 class="text-sm m-0 leading-6">ORCID iD</h4>
			<div class="text-sm mb-4 leading-6">
				{{
					store.invitationPayload.orcid
						? store.invitationPayload.orcid
						: t('invitation.orcid.message')
				}}
				<icon
					v-if="store.invitationPayload.orcidValidation"
					icon="orcid"
					:inline="true"
				/>
			</div>
			<h4 class="text-sm m-0 leading-6">Given Name</h4>
			<div class="text-sm mb-4 leading-6">
				{{ store.invitationPayload.givenName }}
			</div>
			<h4 class="text-sm m-0 leading-6">Family Name</h4>
			<div class="text-sm mb-4 leading-6">
				{{ store.invitationPayload.familyName }}
			</div>
			<h4 class="text-sm m-0 leading-6">Affiliation</h4>
			<div class="text-sm mb-4 leading-6">
				{{ store.invitationPayload.affiliation }}
			</div>
		</div>
	</div>
	<br />
	<UserInvitationUserGroupsTable
		:user-groups="userGroups"
		:errors="sectionErrors"
	/>
</template>

<script setup>
import {defineProps, computed} from 'vue';
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
<style lang="less">
.userInvitation__stepForm .pkpFormField--select__input {
	width: 100% !important;
}
</style>
