<template>
	<PkpButton
		:is-primary="isPrimary"
		:is-secondary="isSecondary"
		:is-warnable="isWarnable"
		:is-link="isLink"
		@click="() => reviewerManagerStore[action](actionArgs)"
	>
		{{ label }}
	</PkpButton>
</template>
<script setup>
import PkpButton from '@/components/Button/Button.vue';

import {useReviewerManagerStore} from './reviewerManagerStore';

const reviewerManagerStore = useReviewerManagerStore();

defineProps({
	isPrimary: {type: Boolean, required: false, default: false},
	isSecondary: {type: Boolean, required: false, default: false},
	isWarnable: {type: Boolean, required: false, default: false},
	action: {type: String, required: true},
	actionArgs: {type: Object, required: false, default: () => {}},
	isLink: {type: Boolean, default: false},
	label: {type: String, required: true},
});
</script>
