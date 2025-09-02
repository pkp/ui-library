<template>
	<PkpTextarea
		:placeholder="t('userComment.addYourComment')"
		:label="t('userComment.addYourComment')"
		:is-label-sr-only="true"
		:model-value="versionApi.commentText"
		@update:model-value="versionApi.updateCommentText"
	/>
</template>
<script setup>
import {inject} from 'vue';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

import PkpTextarea from '../components/PkpTextarea/PkpTextarea.vue';
import {usePkpCommentsStore} from './usePkpCommentsStore';

const {t} = usePkpLocalize();

const versionProps = inject('versionProps');

const commentsStore = usePkpCommentsStore();

const versionApi = commentsStore.getApiPerVersion(versionProps.publicationId);
</script>
