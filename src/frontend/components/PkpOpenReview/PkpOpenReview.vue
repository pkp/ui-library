<template>
	<div :class="cn('root')">
		<PkpTabRoot default-value="byRecord">
			<div :class="cn('tabsHeader')">
				<span :id="sortLabelId" :class="cn('tabsLabel')">
					{{ t('openReview.sortBy') }}
				</span>
				<PkpTabList :aria-labelledby="sortLabelId" :class="cn('tabsList')">
					<PkpTabTrigger value="byRecord">
						{{ t('publication.versionStage.versionOfRecord') }}
					</PkpTabTrigger>
					<PkpTabTrigger value="byReviewer">
						{{ t('openReview.sortByReviewerName') }}
					</PkpTabTrigger>
				</PkpTabList>
			</div>

			<PkpTabContent value="byRecord">
				<PkpOpenReviewByRecord>
					<template #roundHeader="slotProps">
						<slot name="roundHeader" v-bind="slotProps" />
					</template>
					<template #authorResponseHeader="slotProps">
						<slot name="authorResponseHeader" v-bind="slotProps" />
					</template>
					<template #authorResponseContent="slotProps">
						<slot name="authorResponseContent" v-bind="slotProps" />
					</template>
					<template #reviewHeader="slotProps">
						<slot name="reviewHeader" v-bind="slotProps" />
					</template>
					<template #reviewContent="slotProps">
						<slot name="reviewContent" v-bind="slotProps" />
					</template>
				</PkpOpenReviewByRecord>
			</PkpTabContent>

			<PkpTabContent value="byReviewer">
				<PkpOpenReviewByReviewer>
					<template #reviewerHeader="slotProps">
						<slot name="reviewerHeader" v-bind="slotProps" />
					</template>
					<template #reviewHeader="slotProps">
						<slot name="reviewHeader" v-bind="slotProps" />
					</template>
					<template #reviewContent="slotProps">
						<slot name="reviewContent" v-bind="slotProps" />
					</template>
				</PkpOpenReviewByReviewer>
			</PkpTabContent>
		</PkpTabRoot>
	</div>
</template>

<script setup>
import PkpTabRoot from '@/frontend/components/PkpTab/PkpTabRoot.vue';
import PkpTabList from '@/frontend/components/PkpTab/PkpTabList.vue';
import PkpTabTrigger from '@/frontend/components/PkpTab/PkpTabTrigger.vue';
import PkpTabContent from '@/frontend/components/PkpTab/PkpTabContent.vue';
import PkpOpenReviewByRecord from './PkpOpenReviewByRecord.vue';
import PkpOpenReviewByReviewer from './PkpOpenReviewByReviewer.vue';
import {useId, onMounted} from 'vue';
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

const props = defineProps({
	publicationsPeerReviews: {type: Array, required: true},
	submissionPeerReviewSummary: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReview', props.styles);
const {t} = usePkpLocalize();
const sortLabelId = useId();

const store = usePkpOpenReviewStore();
store.initialize({
	publicationsPeerReviews: props.publicationsPeerReviews,
	submissionPeerReviewSummary: props.submissionPeerReviewSummary,
});

onMounted(() => store.scrollToReviewFromUrl());
</script>
