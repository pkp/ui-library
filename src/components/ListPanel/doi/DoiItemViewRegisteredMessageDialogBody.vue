<template>
	<PkpDialogBody>
		<p>{{ registeredMessageAgencyPreamble }}</p>
		<p>{{ registeredMessage }}</p>
	</PkpDialogBody>
</template>

<script setup>
import PkpDialogBody from '@/components/Modal/DialogBody.vue';

defineProps({
	registeredMessageAgencyPreamble: {type: String, required: true},
	registeredMessage: {type: String, required: true},
});
</script>
