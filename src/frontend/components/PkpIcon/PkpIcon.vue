<template>
	<svg
		:class="cn('root')"
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
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	/** Which icon to use from our [Icon Gallery](?path=/story/components-icon--icon-gallery) */
	icon: {type: String, required: true},
	/** Size of the icon in pixels (width and height) */
	size: {type: [String, Number], default: 24},
	styles: {
		type: Object,
		default: () => ({}),
	},
});

const {cn} = usePkpStyles(props.styles);
</script>
<style>
[dir='rtl'] .pkpIcon {
	transform: scaleX(-1);
}
</style>
