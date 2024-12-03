<template>
	<div class="p-8">
		<div class="py-1">
			<FormDisplayItemBasic
				heading-element="h4"
				:heading="t('user.email')"
				:value="store.email"
			></FormDisplayItemBasic>
		</div>
		<div class="my-4">
			<FieldText
				:label="t('user.username')"
				:value="store.acceptInvitationPayload.username"
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
import {useLocalize} from '@/composables/useLocalize';
import FormDisplayItemBasic from '@/components/FormDisplay/FormDisplayItemBasic.vue';
import FieldText from '@/components/Form/fields/FieldText.vue';
import FieldOptions from '@/components/Form/fields/FieldOptions.vue';
import {useAcceptInvitationPageStore} from './AcceptInvitationPageStore';
import {useUrl} from '@/composables/useUrl';

const props = defineProps({
	validateFields: {type: Array, required: true},
});
const {t} = useLocalize();
const fields = ref({password: '', privacyStatement: false});
const {pageUrl} = useUrl('about/privacy');
const options = [
	{
		value: true,
		label: t('acceptInvitation.privacyStatement.label', {
			url: `<a href='${pageUrl.value}'>${t('acceptInvitation.privacyStatement.btn')}</a>`,
		}),
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
