<template>
	<DialogBody>
		<p v-strip-unsafe-html="registeredMessage" class="whitespace-pre-line"></p>
	</DialogBody>
</template>

<script setup>
import DialogBody from '@/components/Modal/DialogBody.vue';

defineProps({
	registeredMessage: {type: String, required: true},
});
</script>
