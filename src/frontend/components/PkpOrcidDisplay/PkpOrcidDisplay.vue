<template>
	<a v-if="orcidUrl" class="pkpOrcidDisplay" :href="orcidUrl" target="_blank">
		<PkpIcon :icon="isVerified ? 'Orcid' : 'OrcidUnauthenticated'" />
		<span class="pkpOrcidDisplay__value">{{ orcidUrl }}</span>
	</a>
</template>

<script setup>
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';

defineProps({
	orcidUrl: {type: String, required: true},
	isVerified: {type: Boolean, default: false},
});
</script>
