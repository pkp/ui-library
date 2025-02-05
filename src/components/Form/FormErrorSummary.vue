<template>
	<div
		v-if="errorsCount"
		class="inline-flex w-full gap-x-1 rounded border border-s-4 border-attention p-2"
	>
		<div class="leading-none">
			<Icon icon="Error" class="h-5 w-5" :inline="true" />
		</div>
		<span class="text-lg-normal">
			{{ message }}
		</span>
	</div>
</template>

<script setup>
import {computed} from 'vue';
import Icon from '@/components/Icon/Icon.vue';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();

const props = defineProps({
	errors: {
		type: Object,
		default: () => {},
	},
});

const errorsCount = computed(() => Object.keys(props.errors).length);

const message = computed(() => {
	const count = errorsCount.value;
	if (count > 1) {
		return t('form.errorSummaryMany', {count});
	}
	return t('form.errorSummaryOne');
});
</script>
