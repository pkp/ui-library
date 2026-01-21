<template>
	<div class="flex items-center justify-between border border-light p-4">
		<div>
			<h4 class="mb-2">
				{{ t('submission.reviewRound.authorResponse') }}
			</h4>
			<p class="text-sm-normal">
				<template v-if="!!reviewRound.authorResponse">
					{{
						t('editor.submission.reviewRound.responseWasSubmitted', {
							userFullName: reviewRound.authorResponse.submittedByUser.fullName,
						})
					}}
				</template>
				<template v-else>
					{{ t('submission.reviewRound.respondToReviews') }}
				</template>
			</p>
		</div>

		<PkpButton :is-secondary="true" @click="openReviewResponseFormModal">
			<template v-if="!!reviewRound.authorResponse">
				{{
					t('submission.reviewRound.authorReviewResponse.viewSubmittedResponse')
				}}
			</template>
			<template v-else>
				{{ t('submission.reviewRound.authorReviewResponse.submit') }}
			</template>
		</PkpButton>
	</div>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import {useQueryParams} from '@/composables/useQueryParams';
import {useModal} from '@/composables/useModal';
import AuthorResponseFormModal from '@/managers/ReviewRoundResponseManager/AuthorResponseFormModal.vue';
import {useDataChanged} from '@/composables/useDataChanged';
import {computed, toRefs, watch} from 'vue';
import PkpButton from '@/components/Button/Button.vue';

const {t} = useLocalize();

const props = defineProps({
	stageId: {type: Number, required: true},
	submission: {type: Object, required: true},
	publication: {type: Object, required: true},
	reviewRound: {type: Object, required: true},
});
const {stageId, submission, reviewRound, publication} = toRefs(props);

const {triggerDataChange} = useDataChanged();
const queryParamsUrl = useQueryParams();

async function openReviewResponseFormModal() {
	const {openSideModal} = useModal();
	openSideModal(
		AuthorResponseFormModal,
		{
			submission: submission,
			reviewRound: reviewRound,
			stageId: stageId,
			authorOptions: publication.value?.authors,
			onSuccessFn: (...args) => {
				const {closeSideModal} = useModal();

				triggerDataChange();
				closeSideModal(AuthorResponseFormModal);
				cleanQueryParams();
			},
		},
		{
			onClose: async () => {
				// Refresh data
				triggerDataChange();

				cleanQueryParams();
			},
		},
	);
}

/**
 * Clean any review response related query params that triggers automatic opening of the response form modal.
 */
function cleanQueryParams() {
	if (queryParamsUrl?.reviewResponseAction) {
		queryParamsUrl.reviewResponseAction = null;
	}
}

/**
 * When coming from email link the response form modal may at times open before the necessary data is ready.
 * The `isReady` computed property along with the watcher guards against that.
 */
const isReady = computed(() => {
	return reviewRound.value && publication.value && submission.value;
});

watch(
	isReady,
	(ready) => {
		if (ready && queryParamsUrl?.reviewResponseAction === 'respond') {
			openReviewResponseFormModal();
		}
	},
	{immediate: true},
);
</script>
