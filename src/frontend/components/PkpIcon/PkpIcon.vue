<template>
	<svg
		class="PkpIcon"
		:width="size"
		:height="size"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<use :href="`#icon-${icon}`" />
	</svg>
</template>

<script setup>
defineProps({
	/** Which icon to use from our [Icon Gallery](?path=/story/components-icon--icon-gallery) */
	icon: {type: String, required: true},
	/** Size of the icon in pixels (width and height) */
	size: {type: [String, Number], default: 24},
});
</script>
<style>
[dir='rtl'] .PkpIcon {
	transform: scaleX(-1);
}
</style>
