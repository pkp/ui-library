<template>
	<div class="flex">
		<Badge v-bind="titleBadgeProps">
			{{ title }}
		</Badge>
	</div>
	<div class="flex items-start justify-between pt-5">
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
	<div class="mt-1 border-t border-light pt-4 text-start text-base-normal">
		<p v-html="description"></p>
	</div>
	<div class="-ms-3 text-start">
		<PkpButton
			v-if="textButton"
			:is-link="true"
			@click="() => triggerEmit(textButton.action)"
		>
			{{ textButton.label }}
		</PkpButton>
	</div>
	<div class="mt-4 flex">
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
	title: {type: String, required: true},
	description: {type: String, required: true},
	reviewMethodIcons: {type: Array, required: true},
	reviewerName: {type: String, required: false, default: 'TODO'},
	primaryButton: {type: Object, required: false, default: null},
	negativeButton: {type: Object, required: false, default: null},
	textButton: {type: Object, required: false, default: null},
	titleBadgeProps: {type: Object, required: true},
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
