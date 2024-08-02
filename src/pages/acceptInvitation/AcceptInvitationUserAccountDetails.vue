<template>
	<div class="p-8">
		<div class="py-1">
			<FormDisplayItemBasic
				heading-element="h4"
				:heading="t('user.emailAddress')"
				:value="store.email"
			></FormDisplayItemBasic>
		</div>
		<div class="my-4">
			<FieldText
				:label="t('user.username')"
				:value="fields.username"
				:description="t('acceptInvitation.usernameField.description')"
				:is-required="true"
				name="username"
				size="large"
				:all-errors="sectionErrors"
				@change="updateField"
			/>
		</div>

		<div class="my-4">
			<FieldText
				:label="t('user.password')"
				:value="fields.password"
				:description="t('acceptInvitation.passwordField.description')"
				:is-required="true"
				name="password"
				input-type="password"
				size="large"
				:all-errors="sectionErrors"
				@change="updateField"
			/>
		</div>

		<div class="flex">
			<FieldOptions
				component="field-options"
				:value="fields.privacyStatement"
				name="privacyStatement"
				type="checkbox"
				:options="options"
				:all-errors="sectionErrors"
				@change="updateField"
			/>
		</div>
	</div>
</template>

<script setup>
import {defineProps, ref, computed} from 'vue';
import {useTranslation} from '@/composables/useTranslation';
import FormDisplayItemBasic from '@/components/FormDisplay/FormDisplayItemBasic.vue';
import FieldText from '@/components/Form/fields/FieldText.vue';
import FieldOptions from '@/components/Form/fields/FieldOptions.vue';
import {useAcceptInvitationPageStore} from './AcceptInvitationPageStore';
const props = defineProps({
	validateFields: {type: Array, required: true},
});
const {t} = useTranslation();
const fields = ref({username: '', password: '', privacyStatement: false});
const options = [
	{
		value: true,
		label:
			t('acceptInvitation.privacyStatement.label') +
			' <button class="text-blue-600 text-primary hover:underline"> ' +
			t('acceptInvitation.privacyStatement.btn') +
			'</button> ',
	},
];
const store = useAcceptInvitationPageStore();

function updateField(fieldName, b, fieldValue) {
	fields.value[fieldName] = fieldValue;
	store.updateAcceptInvitationPayload(fieldName, fieldValue);
}

const sectionErrors = computed(() => {
	return props.validateFields.reduce((obj, key) => {
		if (store.errors[key]) {
			obj[key] = store.errors[key];
		}
		return obj;
	}, {});
});
</script>
