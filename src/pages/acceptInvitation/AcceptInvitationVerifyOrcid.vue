<template>
	<div class="m-4">
		<pkp-button @click="verifyOrcid">verify ORCID iD</pkp-button>
	</div>
	<div class="m-4">
		<pkp-button @click="skipOrcid">Skip ORCID verification</pkp-button>
	</div>
</template>

<script setup>
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
