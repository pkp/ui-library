<template>
	<TableCell class="capitalize">
		<div v-if="store.canRequestReviewRoundAuthorResponse && !hasResponse">
			<p class="text-base-bold">
				{{ t('editor.submission.reviewRound.authorResponse.readyToInvite') }}
			</p>
			<p>
				{{ t('editor.submission.reviewRound.authorResponse.editorCanRequest') }}
			</p>
		</div>
		<span v-else-if="hasResponse" class="text-base-bold">
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
import {computed} from 'vue';

const {t} = useLocalize();
const props = defineProps({
	author: {type: Object, required: true},
	reviewRound: {type: Object, required: true},
	canRequestResponse: {type: Boolean, required: true},
});

const store = useReviewRoundAuthorResponseRequestStore();
const hasResponse = computed(() => !!props.reviewRound.authorResponse);
</script>
