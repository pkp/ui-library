<template>
	<div :class="cn('reviewerDetails')">
		<span :class="cn('reviewerDetailName')">
			<span>{{ review.reviewerFullName }}</span>
			<PkpOrcidDisplay
				v-if="review.reviewerOrcid"
				variant="icon"
				:class="cn('reviewerDetailOrcid')"
				:orcid-url="review.reviewerOrcid"
				:is-verified="review.reviewerHasVerifiedOrcid"
			/>
		</span>
		<span
			v-if="review.reviewerAffiliation"
			:class="cn('reviewerDetailAffiliation')"
		>
			{{ review.reviewerAffiliation }}
		</span>
	</div>
	<div v-if="review.doiUrl" :class="cn('reviewDoi')">
		<a :href="review.doiUrl" target="_blank" :class="cn('reviewDoiLink')">
			{{ review.doiUrl }}
		</a>
	</div>
</template>

<script setup>
import PkpOrcidDisplay from '@/frontend/components/PkpOrcidDisplay/PkpOrcidDisplay.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	review: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewReviewDetails', props.styles);
</script>
