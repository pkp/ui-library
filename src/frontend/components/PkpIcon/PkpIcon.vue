<script setup>
import {computed} from 'vue';
import Cancel from './icons/Cancel.vue';
import MoreOptions from './icons/MoreOptions.vue';

const svgIcons = {
	Cancel,
	MoreOptions,
};

const props = defineProps({
	/** Which icon to use from our [Icon Gallery](?path=/story/components-icon--icon-gallery) */
	icon: {type: String, required: true},
});

const classes = computed(() => {
	return ['pkp-icon', props.icon === 'Error' ? 'pkp-icon--error' : ''];
});
</script>

<template>
	<span :class="classes">
		<component :is="svgIcons[icon]"></component>
	</span>
</template>

<style>
.pkp-icon {
	display: inline-block;
	vertical-align: middle;
}

[dir='rtl'] .pkp-icon {
	transform: scaleX(-1);
}

.pkp-icon--error {
	color: var(--pkp-color-negative);
}
</style>
