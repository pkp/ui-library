<template>
	<PkpButton @click="verifyOrcid">verify ORCID iD</PkpButton>
	<br />
	<PkpButton @click="skipOrcid">Skip ORCID verification</PkpButton>
</template>

<script setup>
import PkpButton from '@/components/Button/Button.vue';
import {defineProps} from 'vue';
import {useAcceptInvitationPageStore} from './AcceptInvitationPageStore';

defineProps({});
const store = useAcceptInvitationPageStore();

/**
 * Go to the next step
 */
function skipOrcid() {
	store.openStep(store.steps[1 + store.currentStepIndex].id);
}

function verifyOrcid() {
	store.openStep(store.steps.value[1 + store.currentStepIndex].id);
}
</script>
