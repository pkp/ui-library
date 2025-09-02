<template>
	<div
		v-if="!versionApi.isLatestPublication"
		class="pkpUserCommentsList__commentNotAllowed"
	>
		<PkpIcon class="pkpUserCommentsList__errorIcon" icon="Error" />
		<span>{{ t('userComment.discussionClosed') }}</span>
	</div>
</template>
<script setup>
import {inject} from 'vue';
import {usePkpLocalize} from '../composables/usePkpLocalize';
import {usePkpCommentsStore} from './usePkpCommentsStore';

const versionProps = inject('versionProps');

const {t} = usePkpLocalize();
const commentsStore = usePkpCommentsStore();

const versionApi = commentsStore.getApiPerVersion(versionProps.publicationId);
</script>
