<template>
	<span v-if="alertLabel">{{ alertLabel }}</span>
	<PkpButton
		v-if="actionName"
		size-variant="compact"
		@click="emit('action', actionName, {})"
	>
		{{ actionLabel }}
	</PkpButton>
</template>

<script setup>
import PkpButton from '@/components/Button/Button.vue';

const emit = defineEmits('action');

defineProps({
	actionName: {type: String, required: false, default: null},
	actionLabel: {type: String, required: false, default: null},
	alertLabel: {type: String, required: false, default: null},
});
</script>
