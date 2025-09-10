<template>
	<div
		v-if="!commentsStore.isLatestPublication(publicationId)"
		class="BaseCommentsNotificationNotLatest"
	>
		<PkpIcon icon="Error" />
		{{ t('userComment.discussionClosed') }}
	</div>
</template>
<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {inject} from 'vue';
import {usePkpCommentsStore} from '../usePkpCommentsStore';

const {t} = usePkpLocalize();
const publicationId = inject('publicationId');
const commentsStore = usePkpCommentsStore();
</script>
