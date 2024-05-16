<template>
	<field-text v-bind="store.emailField" @change="store.emailChange" />
	<br />
	<field-text v-bind="store.usernameField" @change="store.usernameChange" />
	<br />
	<field-text v-bind="store.passwordField" @change="store.passwordChange" />
</template>

<script setup>
import {defineProps} from 'vue';
import FieldText from '@/components/Form/fields/FieldText.vue';
import {useAcceptInvitationPageStore} from './AcceptInvitationPageStore';

defineProps({
	section: {
		type: Object,
		default() {
			return null;
		},
	},
});

const store = useAcceptInvitationPageStore();
</script>
