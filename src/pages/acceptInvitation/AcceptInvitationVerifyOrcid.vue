<template>
	<div class="p-8">
		<div class="m-4">
			<PkpButton @click="verifyOrcid">
				{{ t('acceptInvitation.verifyOrcid') }}
			</PkpButton>
		</div>
		<div class="m-4">
			<PkpButton @click="skipOrcid">
				{{ t('acceptInvitation.skipVerifyOrcid') }}
			</PkpButton>
		</div>
	</div>
</template>

<script setup>
import PkpButton from '@/components/Button/Button.vue';
import {defineProps} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useAcceptInvitationPageStore} from './AcceptInvitationPageStore';

const props = defineProps({
	orcidUrl: {type: String, required: true},
	orcidOAuthUrl: {type: String, required: true},
});

const store = useAcceptInvitationPageStore();
const {t} = useLocalize();

/**
 * Go to the next step
 */
function skipOrcid() {
	// TODO: See how this should be handled given updated ORCID fields
	// delete store.acceptInvitationPayload.userOrcid;
	store.openStep(store.steps[1 + store.currentStepIndex].id);
}

function verifyOrcid() {
	openOrcidOAuth();
	store.openStep(store.steps[1 + store.currentStepIndex].id);
}

function openOrcidOAuth() {
	const oauthWindow = window.open(
		props.orcidOAuthUrl,
		'_blank',
		'toolbar=no, scrollbars=yes, width=540, height=700, top=500, left=500',
	);
	oauthWindow.opener = self;
}
</script>
