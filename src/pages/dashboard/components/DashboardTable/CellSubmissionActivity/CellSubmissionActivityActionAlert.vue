<template>
	<div class="flex items-center space-x-2">
		<div v-if="alert">{{ alert }}</div>
		<PkpButton
			v-if="actionName"
			class="-ms-3"
			size-variant="compact"
			@click="() => emit('action', actionName, {})"
		>
			{{ actionLabel }}
		</PkpButton>
	</div>
</template>

<script setup>
defineProps({
	alert: {type: String, required: false, default: null},
	actionLabel: {type: String, required: false, default: null},
	actionName: {type: String, required: false, default: null},
});

const emit = defineEmits(['action']);
</script>
