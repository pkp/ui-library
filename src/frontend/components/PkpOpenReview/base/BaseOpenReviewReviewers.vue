<template>
	<AccordionRoot
		class="BaseOpenReviewReviewers"
		type="single"
		collapsible
		:default-value="defaultValue"
	>
		<template
			v-for="(reviewer, index) in reviewerGroups"
			:key="reviewer.reviewerId"
		>
			<slot
				:reviewer="reviewer"
				:index="index"
				:review-count="store.getReviewCount(reviewer)"
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
const {reviewerGroups} = storeToRefs(store);

const defaultValue = computed(() => {
	if (props.defaultExpanded !== null) {
		return props.defaultExpanded;
	}
	return reviewerGroups.value.length > 0
		? reviewerGroups.value[0].reviewerId
		: null;
});
</script>
