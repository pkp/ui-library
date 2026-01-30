<template>
	<pkp-textarea
		:class="cn('newInput')"
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
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const {cn} = usePkpStyles('PkpComments');

const {t} = usePkpLocalize();
const commentsStore = usePkpCommentsStore();
</script>
