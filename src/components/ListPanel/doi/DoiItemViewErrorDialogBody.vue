<template>
	<PkpDialogBody>
		<p>{{ errorMessageAgencyPreamble }}</p>
		<div class="depositErrorMessage">
			<pre>{{ errorMessage }}</pre>
		</div>
	</PkpDialogBody>
</template>

<script setup>
import PkpDialogBody from '@/components/Modal/DialogBody.vue';

defineProps({
	errorMessageAgencyPreamble: {type: String, required: true},
	errorMessage: {type: String, required: true},
});
</script>

<style lang="less">
@import '../../../styles/_import';
.depositErrorMessage {
	background: rgb(234, 237, 238);
	> pre {
		white-space: pre-wrap;
	}
}
</style>
