<template>
	<component :is="headingElement" class="mb-1 inline-block text-xl-bold">
		{{ field.label }}
	</component>
	<div class="flex flex-col gap-y-2">
		<div
			v-for="(option, i) of selectedValues"
			:key="option.value"
			class="flex flex-col text-lg-normal"
		>
			<span>
				<template v-if="field.showNumberedList">{{ i + 1 }}.</template>
				{{ option.label }}
			</span>
			<span v-if="option.subLabel">
				{{ option.subLabel }}
			</span>
		</div>
	</div>
</template>

<script setup>
import {computed} from 'vue';

const props = defineProps({
	field: {type: Object, required: true},
	headingElement: {required: true, type: String},
});

const selectedValues = computed(() => {
	if (!props.field?.value?.length) {
		return [];
	}

	return props.field.options.filter((option) =>
		props.field.value.includes(option.value),
	);
});
</script>
