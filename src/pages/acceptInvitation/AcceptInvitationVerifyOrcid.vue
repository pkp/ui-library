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
import {defineProps, onMounted} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useAcceptInvitationPageStore} from './AcceptInvitationPageStore';

const props = defineProps({
	orcidUrl: {type: String, required: true},
	orcidOAuthUrl: {type: String, required: true},
});

const store = useAcceptInvitationPageStore();
const {t} = useLocalize();

onMounted(() => {
	pkp.eventBus.$on('addOrcidInvitationData', (data) => setOrcidData(data));
});

/**
 * Processes ORCID data for an invitation.
 *
 * @param {Object|null} data - The ORCID OAuth data object.
 * @param {string} data.orcid - The ORCID URL of the user.
 * @param {boolean} data.orcidIsVerified - Indicates if the user's ORCID is verified.
 * @param {null|string} data.orcidAccessDenied - Indicates if access to ORCID is denied (null if not denied).
 * @param {string} data.orcidAccessToken - The access token for ORCID API.
 * @param {string} data.orcidAccessScope - The scope of access for the ORCID API.
 * @param {string} data.orcidRefreshToken - The refresh token for obtaining new access tokens.
 * @param {string} data.orcidAccessExpiresOn - The expiration date and time of the access token in ISO format.
 *
 * @returns {void}
 */
async function setOrcidData(data) {
	store.setOrcidData(data);
	await store.nextStep();
}

/**
 * Go to the next step
 */
function skipOrcid() {
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
