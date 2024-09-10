<template>
	<div class="flex items-center space-x-2">
		<div v-if="alert">{{ alert }}</div>
		<PkpButton
			v-if="actionName"
			class="-ms-3"
			size-variant="compact"
			@click="() => emit('action', actionName, actionArgs)"
		>
			{{ actionLabel }}
		</PkpButton>
	</div>
</template>

<script setup>
import PkpButton from '@/components/Button/Button.vue';

defineProps({
	alert: {type: String, required: false, default: null},
	actionLabel: {type: String, required: false, default: null},
	actionName: {type: String, required: false, default: null},
	actionArgs: {type: String, required: false, default: () => {}},
});

const emit = defineEmits(['action']);
</script>
