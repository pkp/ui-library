<template>
	<DialogBody>
		<p>{{ registeredMessageAgencyPreamble }}</p>
		<p v-strip-unsafe-html="registeredMessage" class="whitespace-pre-line"></p>
	</DialogBody>
</template>

<script setup>
import DialogBody from '@/components/Modal/DialogBody.vue';

defineProps({
	registeredMessageAgencyPreamble: {type: String, required: true},
	registeredMessage: {type: String, required: true},
});
</script>
