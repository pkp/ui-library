<template>
	<div v-if="title" class="mb-5 flex">
		<Badge v-bind="titleBadgeProps">
			{{ title }}
		</Badge>
	</div>
	<div class="flex items-center justify-between">
		<span class="text-lg-bold">{{ reviewerName }}</span>
		<ReviewMethodIcons size-variants="large" :review-method="reviewMethod" />
	</div>
	<div
		v-if="description"
		class="mt-1 border-t border-light pt-4 text-start text-base-normal"
	>
		<p v-strip-unsafe-html="description"></p>
	</div>
	<div v-if="textButton" class="-ms-3 text-start">
		<PkpButton
			v-if="textButton"
			:is-link="true"
			@click="() => triggerEmit(textButton.action)"
		>
			{{ textButton.label }}
		</PkpButton>
	</div>
	<div v-if="primaryButton || negativeButton" class="mt-4 flex">
		<PkpButton
			v-if="primaryButton"
			@click="() => triggerEmit(primaryButton.action)"
		>
			{{ primaryButton.label }}
		</PkpButton>
		<PkpButton
			v-if="negativeButton"
			class="ms-4"
			:is-warnable="true"
			@click="() => triggerEmit(negativeButton.action)"
		>
			{{ negativeButton.label }}
		</PkpButton>
	</div>
</template>
<script>
export default {};
</script>
<script setup>
import {defineProps} from 'vue';
import Badge from '@/components/Badge/Badge.vue';
import PkpButton from '@/components/Button/Button.vue';
import ReviewMethodIcons from '@/components/ReviewMethodIcons/ReviewMethodIcons.vue';

defineProps({
	title: {type: String, required: false, default: null},
	description: {type: String, required: false, default: null},
	reviewMethod: {type: Number, required: true},
	reviewerName: {type: String, required: true, default: ''},
	primaryButton: {type: Object, required: false, default: null},
	negativeButton: {type: Object, required: false, default: null},
	textButton: {type: Object, required: false, default: null},
	titleBadgeProps: {type: Object, required: false, default: null},
});
const emit = defineEmits(['action']);

function triggerEmit(action) {
	emit('action', action, {});
}
</script>
