<template>
	<Icon :icon="resolvedIcon" />
</template>

<script setup>
import {computed} from 'vue';
import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({
	/** e.g. 'image', 'pdf', 'video' */
	documentType: {
		type: String,
		default: 'default',
	},
});

const resolvedIcon = computed(
	() => pkp.documentTypeIcons?.[props.documentType] || 'DefaultDocument',
);
</script>
