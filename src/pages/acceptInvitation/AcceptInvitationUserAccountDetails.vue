<template>
	<div>
		<div class="userInvitation__reviewPanel__item">
			<h4 class="userInvitation__reviewPanel__item__header">Email Address</h4>
			<div class="userInvitation__reviewPanel__item__value">
				{{ store.email }}
			</div>
		</div>
	</div>
	<br />
	<FieldText
		:label="t('user.username')"
		:value="fields.username"
		name="username"
		size="large"
		:all-errors="sectionErrors"
		@change="updateField"
	/>
	<br />
	<FieldText
		:label="t('user.password')"
		:value="fields.password"
		name="password"
		input-type="password"
		size="large"
		:all-errors="sectionErrors"
		@change="updateField"
	/>
	<div>
		<FieldShowEnsuringLink
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
.userInvitation__reviewPanel__item {
	&:last-child {
		border-bottom: none;
	}
}
.userInvitation__reviewPanel__item__header {
	margin: 0;
	font-size: 0.875rem;
	line-height: 1.5rem;
}
.userInvitation__reviewPanel__item__value {
	margin-bottom: 1rem;
	font-size: 0.875rem;
	line-height: 1.5rem;
}
div fieldset {
	border: none !important;
}
</style>
