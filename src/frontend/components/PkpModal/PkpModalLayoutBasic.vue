<template>
	<div class="pkp-modal-layout-basic">
		<div class="pkp-modal-layout-basic__inner">
			<slot></slot>
		</div>
	</div>
</template>

<script setup>
// No props or logic needed based on the source
</script>

<style>
.pkp-modal-layout-basic {
	padding: var(--pkp-spacing-4);
}

.pkp-modal-layout-basic__inner {
	background-color: var(--pkp-background-color-secondary);
	padding: var(--pkp-spacing-4);
}
</style>
