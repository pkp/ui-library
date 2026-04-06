<template>
	<a v-if="orcidUrl" :class="cn('root')" :href="orcidUrl" target="_blank">
		<PkpIcon :icon="isVerified ? 'Orcid' : 'OrcidUnauthenticated'" />
		<span :class="cn('value')">{{ orcidUrl }}</span>
	</a>
</template>

<script setup>
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	orcidUrl: {type: String, required: true},
	isVerified: {type: Boolean, default: false},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOrcidDisplay', props.styles);
</script>
