<template>
	<div class="flex items-center justify-center">
		<button
			class="inline-flex items-center justify-center rounded text-primary hover:bg-primary hover:text-on-dark"
			@click="emit('up')"
		>
			<Icon class="h-6 w-6" icon="ChevronUp"></Icon>
		</button>
		<button
			class="inline-flex items-center justify-center rounded text-primary hover:bg-primary hover:text-on-dark"
			@click="emit('down')"
		>
			<Icon class="h-6 w-6" icon="ChevronDown"></Icon>
		</button>
	</div>
</template>
<script setup>
import Icon from '@/components/Icon/Icon.vue';

const emit = defineEmits(['up', 'down']);
</script>
