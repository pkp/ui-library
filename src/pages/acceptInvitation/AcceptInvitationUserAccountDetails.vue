<template>
	<div class="py-1">
		<h4 class="text-sm m-0 leading-6">Email Address</h4>
		<div class="text-sm mb-4 leading-6">
			{{ store.email }}
		</div>
	</div>
	<div class="my-4">
		<field-text
			:label="t('user.username')"
			:value="fields.username"
			:description="t('acceptInvitation.usernameField.description')"
			name="username"
			size="large"
			:all-errors="sectionErrors"
			@change="updateField"
		/>
	</div>

	<div class="my-4">
		<field-text
			:label="t('user.password')"
			:value="fields.password"
			:description="t('acceptInvitation.passwordField.description')"
			name="password"
			input-type="password"
			size="large"
			:all-errors="sectionErrors"
			@change="updateField"
		/>
	</div>

	<div>
		<field-show-ensuring-link
			primary-locale="en"
			name="privacyStatement"
			:value="fields.privacyStatement"
			:all-errors="sectionErrors"
			:options="options"
			@change="updateField"
		/>
	</div>
</template>

<script setup>
import {defineProps, ref, computed} from 'vue';
import {useTranslation} from '@/composables/useTranslation';
import FieldText from '@/components/Form/fields/FieldText.vue';
import FieldShowEnsuringLink from '@/components/Form/fields/FieldShowEnsuringLink.vue';
import {useAcceptInvitationPageStore} from './AcceptInvitationPageStore';

const props = defineProps({
	validateFields: {type: Array, required: true},
});
const {t} = useTranslation();
const fields = ref({username: '', password: '', privacyStatement: false});
const options = ref([
	{
		value: true,
		label:
			'Yes, I agree to have my data collected and stored according to the <button>Privacy Statement</button>.',
	},
]);
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
<style lang="less">
div fieldset {
	border: none !important;
}
</style>
