<template>
	<div class="p-8 pb-0">
		<div>
			<div class="p-1">
				<FormDisplayItemBasic
					heading-element="h4"
					:heading="t('user.email')"
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
						store.acceptInvitationPayload.orcid
							? store.acceptInvitationPayload.orcid
							: t('invitation.orcid.acceptInvitation.message')
					"
				></FormDisplayItemBasic>
				<Icon
					v-if="store.acceptInvitationPayload.orcid"
					icon="Orcid"
					class="h-4 w-4"
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

function updateUserDetailsForm(a, form, c, d) {
	set(a, form, c, d);
	if (form.fields) {
		form.fields.forEach((field) => {
			if (
				field.isMultilingual &&
				!Object.values(field.value).every(
					(value) => value === null || value === '',
				)
			) {
				store.updateAcceptInvitationPayload(field.name, field.value);
			} else {
				store.updateAcceptInvitationPayload(field.name, field.value);
			}
		});
	}
}

const {
	form: userForm,
	connectWithPayload,
	connectWithErrors,
	set,
	structuredErrors,
} = useForm(props.form);

if (!store.userId) {
	userForm.value.fields.forEach((field) => {
		if (field.isMultilingual) {
			store.updateAcceptInvitationPayload(
				field.name,
				store.acceptInvitationPayload[field.name]
					? store.acceptInvitationPayload[field.name]
					: field.value,
			);
		} else {
			if (store.acceptInvitationPayload[field.name] === null) {
				store.updateAcceptInvitationPayload(field.name, field.value);
			} else {
				store.updateAcceptInvitationPayload(
					field.name,
					store.acceptInvitationPayload[field.name],
				);
			}
		}
	});
}

connectWithPayload(store.acceptInvitationPayload);

/**
 * handing errors and covert dot notation to object
 */
const sectionErrors = computed(() => {
	return structuredErrors(store.errors);
});
connectWithErrors(sectionErrors);
</script>
