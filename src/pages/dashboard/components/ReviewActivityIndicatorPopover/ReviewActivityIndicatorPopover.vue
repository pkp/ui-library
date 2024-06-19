<template>
	<div v-if="title" class="mb-5 flex">
		<Badge v-bind="titleBadgeProps">
			{{ title }}
		</Badge>
	</div>
	<div class="flex items-center justify-between">
		<span class="text-lg-bold">{{ reviewerName }}</span>
		<span class="space-x-2">
			<Icon
				v-for="icon in reviewMethodIcons"
				:key="icon"
				class="h-6 w-6"
				:icon="icon"
			/>
		</span>
	</div>
	<div
		v-if="description"
		class="mt-1 border-t border-light pt-4 text-start text-base-normal"
	>
		<p v-html="description"></p>
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
import Icon from '@/components/Icon/Icon.vue';
import PkpButton from '@/components/Button/Button.vue';
defineProps({
	title: {type: String, required: false, default: null},
	description: {type: String, required: false, default: null},
	reviewMethodIcons: {type: Array, required: true},
	reviewerName: {type: String, required: true, default: ''},
	primaryButton: {type: Object, required: false, default: null},
	negativeButton: {type: Object, required: false, default: null},
	textButton: {type: Object, required: false, default: null},
	titleBadgeProps: {type: Object, required: false, default: null},
});
const emit = defineEmits([
	'action',
	'resendReviewRequest',
	'viewDetails',
	'editDueDate',
	'unassignReviewer',
	'cancelReviewer',
	'viewRecommendation',
]);

function triggerEmit(action) {
	emit('action', action, {});
}
</script>
