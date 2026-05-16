<template>
	<component :is="headingElement" class="mb-1 inline-block text-xl-bold">
		{{ field.label }}
	</component>
	<div class="text-lg-normal">{{ selectedLabels }}</div>
</template>

<script setup>
import {computed} from 'vue';
import {t} from '@/utils/i18n';

const props = defineProps({
	field: {type: Object, required: true},
	headingElement: {required: true, type: String},
});

const selectedLabels = computed(() => {
	const value = Array.isArray(props.field?.value) ? props.field.value : [];
	return (props.field.options || [])
		.filter((option) => value.includes(option.value))
		.map((option) => option.label)
		.join(t('common.commaListSeparator'));
});
</script>
