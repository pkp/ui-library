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
	<div v-if="store.invitationPayload.userId === null">
		<div v-if="Object.keys(store.errors).length" class="p-4">
			<FormErrorSummary :errors="store.errors" />
		</div>
		<PkpForm
			v-bind="userForm"
			class="userInvitation__stepForm"
			:show-error-footer="false"
			@set="updateUserForm"
		></PkpForm>
	</div>
	<div v-if="store.invitationPayload.userId !== null" class="p-8">
		<div class="mb-8 flex flex-col gap-y-2">
			<FormDisplayItemBasic
				heading-element="h4"
				:heading="t('user.email')"
				:value="store.invitationPayload.inviteeEmail"
			></FormDisplayItemBasic>

			<FormDisplayItemBasic
				heading-element="h4"
				:heading="t('user.orcid')"
				:value="store.invitationPayload.orcid"
			></FormDisplayItemBasic>

			<Icon
				v-if="store.invitationPayload.orcidValidation"
				icon="Orcid"
				class="h-4 w-4"
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
		<div v-if="store.invitationMode != 'create'">
			<ShowMore :label="t('common.viewMoreDetails')">
				<UserInvitationExtendedMetaData></UserInvitationExtendedMetaData>
			</ShowMore>
		</div>
	</div>
	<div class="p-8">
		<UserInvitationUserGroupsTable :user-groups="userGroups" />
	</div>
</template>

<script setup>
import {defineProps, computed} from 'vue';
import FormDisplayItemBasic from '@/components/FormDisplay/FormDisplayItemBasic.vue';
import Icon from '@/components/Icon/Icon.vue';
import PkpForm from '@/components/Form/Form.vue';
import {useLocalize} from '@/composables/useLocalize';
import UserInvitationUserGroupsTable from './UserInvitationUserGroupsTable.vue';
import {useUserInvitationPageStore} from './UserInvitationPageStore';
import {useForm} from '@/composables/useForm';
import FormErrorSummary from '@/components/Form/FormErrorSummary.vue';
import UserInvitationExtendedMetaData from './UserInvitationExtendedMetaData.vue';
import ShowMore from '@/components/ShowMore/ShowMore.vue';

/**
 * Update the payload by using form values on multilingual or not
 * @param id string
 * @param form Object
 * @param c
 * @param d
 */
function updateUserForm(id, form, c, d) {
	set(id, form, c, d);
	if (form.fields) {
		form.fields.forEach((field) => {
			if (field.isMultilingual) {
				Object.keys(field.value).forEach((element) => {
					if (field.value[element] === null || field.value[element] === '') {
						delete field.value[element]; // remove empty values form the object
					}
				});
				store.updatePayload(field.name, field.value, false);
			} else {
				store.updatePayload(field.name, field.value, false);
			}
		});
	}
}

const {t} = useLocalize();
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
	set,
	structuredErrors,
} = useForm(props.form);

/**
 * popuplate the form with existing values in the invitation payload
 * if its a existing user form will not populate
 */
if (!store.invitationPayload.userId) {
	userForm.value.fields.forEach((field) => {
		if (field.isMultilingual) {
			store.updatePayload(
				field.name,
				store.invitationPayload[field.name]
					? store.invitationPayload[field.name]
					: field.value,
				store.invitationPayload[field.name] ? false : true,
			);
		} else {
			if (store.invitationPayload[field.name] === null) {
				store.updatePayload(field.name, field.value, true);
			} else {
				store.updatePayload(
					field.name,
					store.invitationPayload[field.name],
					true,
				);
			}
		}
	});
	connectWithPayload(store.invitationPayload);
}

/**
 * handing errors and covert dot notation to object
 */
const sectionErrors = computed(() => {
	return structuredErrors(store.errors);
});
connectWithErrors(sectionErrors);
</script>
