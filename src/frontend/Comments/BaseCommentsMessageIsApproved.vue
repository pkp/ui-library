<template>
	<div
		v-if="
			versionApi.currentUser &&
			messageProps.message.userId === versionApi.currentUser.id &&
			!messageProps.message.isApproved
		"
		class="pkpUserCommentsList__item--approvalNotice"
	>
		<PkpIcon icon="Help" class="pkpUserCommentsList__item--helpIcon"></PkpIcon>
		{{ t('userComment.awaitingApprovalNotice') }}
	</div>
</template>
<script setup>
import {inject} from 'vue';
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpLocalize} from '../composables/usePkpLocalize';
const messageProps = inject('messageProps');
const versionProps = inject('versionProps');

const {t} = usePkpLocalize();
const commentsStore = usePkpCommentsStore();

const versionApi = commentsStore.getApiPerVersion(versionProps.publicationId);
</script>
