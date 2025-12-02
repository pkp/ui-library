<template>
	<AccordionRoot
		class="BaseOpenReviewRounds"
		type="single"
		collapsible
		:default-value="defaultValue"
	>
		<template v-for="(round, index) in reviewRounds" :key="round.roundId">
			<slot
				:round="round"
				:index="index"
				:review-count="store.getReviewCount(round)"
				:summary="store.getRoundSummary(round)"
			/>
		</template>
	</AccordionRoot>
</template>
<script setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {AccordionRoot} from 'reka-ui';
import {usePkpOpenReviewStore} from '../usePkpOpenReviewStore';

const props = defineProps({
	defaultExpanded: {type: [Number, String], default: null},
});

const store = usePkpOpenReviewStore();
const {reviewRounds} = storeToRefs(store);

const defaultValue = computed(() => {
	if (props.defaultExpanded !== null) {
		return props.defaultExpanded;
	}
	return reviewRounds.value.length > 0 ? reviewRounds.value[0].roundId : null;
});
</script>
