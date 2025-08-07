<template>
	<div class="pkpModalLayoutBasic">
		<div class="pkpModalLayoutBasic__inner">
			<slot></slot>
		</div>
	</div>
</template>

<script setup>
// No props or logic needed based on the source
</script>

<style>
.pkpModalLayoutBasic {
	padding: var(--pkp-spacing-4);
}

.pkpModalLayoutBasic__inner {
	background-color: var(--pkp-background-color-secondary);
	padding: var(--pkp-spacing-4);
}
</style>
