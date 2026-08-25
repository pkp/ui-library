<template>
	<div class="flex flex-col items-start gap-y-1">
		<label
			v-for="option in options"
			:key="option.value"
			class="flex cursor-pointer items-center gap-x-2 text-lg-normal"
			:class="isSaving && 'text-disabled'"
		>
			<input
				v-model="quality"
				type="radio"
				name="quality"
				:value="option.value"
				:disabled="isSaving"
				:aria-describedby="describedBy"
				@change="emit('change', quality)"
			/>
			<span v-if="!option.stars">{{ option.label }}</span>
			<span v-else class="flex items-center">
				<span class="sr-only">{{ option.label }}</span>
				<Icon
					v-for="star in option.stars"
					:key="star"
					icon="StarTicked"
					class="h-4 w-4 text-stage-in-review"
					aria-hidden="true"
				/>
			</span>
		</label>
	</div>
</template>

<script setup>
import {ref, watch} from 'vue';
import {t} from '@/utils/i18n';

import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({
	reviewAssignment: {
		type: Object,
		required: true,
	},
	/** Disables the options while the parent stores the rating. */
	isSaving: {
		type: Boolean,
		default: () => false,
	},
	/** This value will be used as the `aria-describedby` attribute for the rating options. */
	describedBy: {
		type: String,
		default: () => null,
	},
});

const emit = defineEmits(['change']);

const options = [
	{value: 0, label: t('editor.review.reviewerRating.none'), stars: 0},
	...[5, 4, 3, 2, 1].map((stars) => ({
		value: stars,
		label: t('editor.review.reviewerRating.stars', {count: stars}),
		stars,
	})),
];

// Undefined until the review loads, when null means the editor left it unrated
function toSelection(rating) {
	return rating === undefined ? null : (rating ?? 0);
}

const quality = ref(toSelection(props.reviewAssignment.quality));

// The whole assignment, not quality: a rejected save leaves quality as it was, but the options still need resetting
watch(
	() => props.reviewAssignment,
	(newReviewAssignment) => {
		quality.value = toSelection(newReviewAssignment.quality);
	},
);
</script>
