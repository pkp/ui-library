<template>
	<fieldset class="border-none p-0">
		<legend class="mb-1 text-xl-bold text-heading">
			{{ t('editor.review.rateReviewer') }}
		</legend>
		<p :id="descriptionId" class="text-lg-normal">
			{{ t('editor.review.rateReviewer.description') }}
		</p>
		<div class="mt-2 flex flex-col items-start gap-y-1">
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
					:aria-describedby="descriptionId"
					@change="saveRating"
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
	</fieldset>
</template>

<script setup>
import {computed, ref, useId, watch} from 'vue';
import {t} from '@/utils/i18n';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useNotify} from '@/composables/useNotify';

import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({
	submissionId: {
		type: Number,
		required: true,
	},
	reviewAssignment: {
		type: Object,
		required: true,
	},
});

const options = [
	{value: 0, label: t('editor.review.reviewerRating.none'), stars: 0},
	...[5, 4, 3, 2, 1].map((stars) => ({
		value: stars,
		label: t('editor.review.reviewerRating.stars', {count: stars}),
		stars,
	})),
];

const {notify} = useNotify();

const descriptionId = useId();

// Undefined until the review loads, when null means the editor left it unrated
function toSelection(rating) {
	return rating === undefined ? null : (rating ?? 0);
}

const quality = ref(toSelection(props.reviewAssignment.quality));

watch(
	() => props.reviewAssignment.quality,
	(newQuality) => {
		quality.value = toSelection(newQuality);
	},
);

const {apiUrl: reviewAssignmentApiUrl} = useUrl(
	`submissions/${encodeURIComponent(props.submissionId)}/reviewAssignments/${props.reviewAssignment.id}`,
);

const {
	fetch: sendRating,
	isLoading: isSaving,
	isSuccess,
} = useFetch(reviewAssignmentApiUrl, {
	method: 'PUT',
	body: computed(() => ({quality: quality.value})),
});

async function saveRating() {
	await sendRating();

	if (isSuccess.value) {
		notify(t('editor.review.reviewerRating.saved'), 'success');
	} else if (isSuccess.value === false) {
		quality.value = toSelection(props.reviewAssignment.quality);
	}
}
</script>
