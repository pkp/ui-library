<template>
	<a
		v-if="orcidUrl"
		:class="cn('root')"
		:href="orcidUrl"
		target="_blank"
		rel="noopener noreferrer"
		:aria-label="variant === 'icon' ? 'ORCID iD' : null"
	>
		<PkpIcon
			:icon="isVerified ? 'Orcid' : 'OrcidUnauthenticated'"
			:class="cn('icon')"
		/>
		<span v-if="variant !== 'icon'" :class="cn('value')">{{ orcidUrl }}</span>
	</a>
</template>

<script setup>
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	orcidUrl: {type: String, required: true},
	isVerified: {type: Boolean, default: false},
	variant: {
		type: String,
		default: 'full',
		validator: (value) => ['full', 'icon'].includes(value),
	},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOrcidDisplay', props.styles);
</script>
