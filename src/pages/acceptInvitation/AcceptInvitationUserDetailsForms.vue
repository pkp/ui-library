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
				store.updateAcceptInvitationPayload(field.name, field.value, false);
			} else {
				store.updateAcceptInvitationPayload(field.name, field.value, false);
			}
		});
	}
}

const {
	form: userForm,
	connectWithPayload,
	connectWithErrors,
	set,
} = useForm(props.form);

if (!store.userId) {
	userForm.value.fields.forEach((field) => {
		if (field.isMultilingual) {
			store.updateAcceptInvitationPayload(
				field.name,
				store.acceptinvitationPayload[field.name]
					? store.acceptinvitationPayload[field.name]
					: field.value,
				false,
			);
		} else {
			if (store.acceptinvitationPayload[field.name] === null) {
				store.updateAcceptInvitationPayload(field.name, field.value, true);
			} else {
				store.updateAcceptInvitationPayload(
					field.name,
					store.acceptinvitationPayload[field.name],
					true,
				);
			}
		}
	});
}

connectWithPayload(store.acceptinvitationPayload);

const sectionErrors = computed(() => {
	const result = {};
	for (const key in store.errors) {
		const value = store.errors[key];
		const keys = key.split('.');
		let current = result;
		for (let i = 0; i < keys.length; i++) {
			const obj = keys[i];
			if (i === keys.length - 1) {
				current[obj] = value;
			} else {
				current[obj] = current[obj] || {};
				current = current[obj];
			}
		}
	}
	return result;
});

connectWithErrors(sectionErrors);
</script>
