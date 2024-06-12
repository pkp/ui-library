<template>
	<span class="flex w-auto items-center gap-x-2">
		<span
			class="h-[1em] w-[1em] rounded-full"
			:class="stageColorClass"
			aria-hidden="true"
		/>
		<span class="whitespace-nowrap">
			<slot />
		</span>
	</span>
</template>
<script>
export const ExtendedStagesColorClass = {
	incomplete: 'bg-stage-incomplete-submission',
	submission: 'bg-stage-desk-review',
	externalReview: 'bg-stage-in-review',
	editing: 'bg-stage-copyediting',
	productionQueued: 'bg-stage-production',
	productionScheduled: 'bg-stage-scheduled-for-publishing',
	productionPublished: 'bg-stage-published',
	declined: 'bg-stage-declined',
};
</script>
<script setup>
import {computed} from 'vue';

const props = defineProps({
	extendedStage: {
		type: Number,
		required: true,
		validator: function (value) {
			return Object.keys(ExtendedStagesColorClass).includes(value);
		},
	},
});

const stageColorClass = computed(
	() => ExtendedStagesColorClass[props.extendedStage],
);
</script>
