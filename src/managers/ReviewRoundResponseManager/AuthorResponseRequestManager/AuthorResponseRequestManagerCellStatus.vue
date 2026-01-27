<template>
	<TableCell>
		<div v-if="store.canRequestReviewRoundAuthorResponse">
			<p class="text-base-bold capitalize">
				{{ t('editor.submission.reviewRound.authorResponse.readyToInvite') }}
			</p>
			<p>
				{{ t('editor.submission.reviewRound.authorResponse.editorCanRequest') }}
			</p>
		</div>
		<span v-else-if="store.reviewHasResponse" class="text-base-bold">
			{{
				t('editor.submission.reviewRound.responseWasSubmitted', {
					userFullName: reviewRound.authorResponse.submittedByUser.fullName,
				})
			}}
		</span>
		<span v-else>{{ t('submission.dashboard.view.awaitingReviews') }}</span>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useReviewRoundAuthorResponseRequestStore} from '@/managers/ReviewRoundResponseManager/AuthorResponseRequestManager/AuthorResponseRequestManagerStore';

const {t} = useLocalize();
defineProps({
	author: {type: Object, required: true},
	reviewRound: {type: Object, required: true},
});

const store = useReviewRoundAuthorResponseRequestStore();
</script>
