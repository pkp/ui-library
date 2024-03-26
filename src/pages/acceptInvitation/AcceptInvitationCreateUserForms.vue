<template>
	<pkp-form
		v-if="section.type === 'form'"
		v-bind="section.form"
		ref="autosaveForms"
		class="userInvitation__stepForm"
		@set="store.updateAutosaveForm"
	></pkp-form>
</template>

<script setup>
import {defineProps} from 'vue';
import PkpForm from '@/components/Form/Form.vue';
import {useAcceptInvitationPageStore} from './AcceptInvitationPageStore';

defineProps({
	section: {type: Object, required: true},
});
const store = useAcceptInvitationPageStore();
</script>
