<template>
	<pkp-textarea
		class="pkpComments__new-input"
		:placeholder="t('userComment.addYourComment')"
		:label="t('userComment.addYourComment')"
		:is-label-sr-only="true"
		:model-value="commentsStore.commentText"
		@update:model-value="commentsStore.updateCommentText($event)"
	/>
</template>
<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpCommentsStore} from '../usePkpCommentsStore';

const {t} = usePkpLocalize();
const commentsStore = usePkpCommentsStore();
</script>
