<template>
	<PkpTextarea
		:placeholder="t('userComment.addYourComment')"
		:label="t('userComment.addYourComment')"
		:is-label-sr-only="true"
		:model-value="commentsVersionStore.commentText"
		@update:model-value="commentsVersionStore.updateCommentText"
	/>
</template>
<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

import PkpTextarea from '../components/PkpTextarea/PkpTextarea.vue';
import {usePkpCommentsVersionStore} from './usePkpCommentsVersionStore';

const {t} = usePkpLocalize();

const commentsVersionStore = usePkpCommentsVersionStore();
</script>
../usePkpCommentsVersionStore
