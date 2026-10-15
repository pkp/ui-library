<template>
	<div class="p-8">
		<div class="m-4">
			<PkpButton @click="verifyOrcid">
				{{ t('acceptInvitation.verifyOrcid') }}
			</PkpButton>
		</div>
		<div class="m-4">
			<PkpButton @click="nextStepWithoutRefine">
				{{ t('acceptInvitation.skipVerifyOrcid') }}
			</PkpButton>
		</div>
	</div>
</template>

<script setup>
import PkpButton from '@/components/Button/Button.vue';
import {defineProps, onBeforeUnmount, onMounted} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useAcceptInvitationPageStore} from './AcceptInvitationPageStore';

const props = defineProps({
	orcidOAuthUrl: {type: String, required: true},
});

const store = useAcceptInvitationPageStore();
const {t} = useLocalize();

onMounted(() => {
	pkp.eventBus.$on('orcidAddedToInvitation', orcidAdded);
});

onBeforeUnmount(() => {
	pkp.eventBus.$off('orcidAddedToInvitation', orcidAdded);
});

/**
 * Reload invitation to update ORCID saved server-side, then go to next step.
 */
async function orcidAdded() {
	await store.receiveInvitation();
	nextStepWithoutRefine();
}

/**
 * Go to the next step
 */
function nextStepWithoutRefine() {
	store.openStep(store.steps[1 + store.currentStepIndex].id);
}

/**
 * Initiates ORCID OAuth granting flow
 */
function verifyOrcid() {
	const oauthWindow = window.open(
		props.orcidOAuthUrl,
		'_blank',
		'toolbar=no, scrollbars=yes, width=540, height=700, top=500, left=500',
	);
	oauthWindow.opener = self;
}
</script>
