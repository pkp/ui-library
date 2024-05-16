<template>
	<field-text v-bind="store.emailField" @change="store.emailChange" />
	<br />
	<p>or</p>
	<br />
	<field-text v-bind="store.usernameField" @change="store.usernameChange" />
	<br />
	<p>or</p>
	<br />
	<field-text v-bind="store.orcidField" @change="store.orcidChange" />
</template>

<script setup>
import {defineProps} from 'vue';
import FieldText from '@/components/Form/fields/FieldText.vue';
import {useUserInvitationPageStore} from './UserInvitationPageStore';

defineProps({
	section: {
		type: Object,
		default() {
			return null;
		},
	},
});

const store = useUserInvitationPageStore();
</script>
