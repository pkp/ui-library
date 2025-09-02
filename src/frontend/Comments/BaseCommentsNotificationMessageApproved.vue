<template>
	<div
		v-if="
			commentsVersionStore.currentUser &&
			messageProps.message.userId === commentsVersionStore.currentUser.id &&
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
import {usePkpCommentsVersionStore} from './usePkpCommentsVersionStore';
import {usePkpLocalize} from '../composables/usePkpLocalize';
const messageProps = inject('messageProps');

const {t} = usePkpLocalize();

const commentsVersionStore = usePkpCommentsVersionStore();
</script>
