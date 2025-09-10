<template>
	<pkp-textarea
		class="BaseCommentsNewInput"
		:placeholder="t('userComment.addYourComment')"
		:label="t('userComment.addYourComment')"
		:is-label-sr-only="true"
		:model-value="commentsStore.getCommentText(publicationId)"
		@update:model-value="commentsStore.updateCommentText(publicationId, $event)"
	/>
</template>
<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {inject} from 'vue';
import {usePkpCommentsStore} from '../usePkpCommentsStore';

const {t} = usePkpLocalize();
const publicationId = inject('publicationId');
const commentsStore = usePkpCommentsStore();
</script>
