<template>
	<div
		v-if="
			commentsStore.getCurrentUser() &&
			message.userId === commentsStore.getCurrentUser().id &&
			!message.isApproved
		"
		class="pkpComments__notification-needs-approval"
	>
		<PkpIcon icon="Help" />
		{{ t('userComment.awaitingApprovalNotice') }}
	</div>
</template>
<script setup>
import {usePkpCommentsStore} from '../usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

defineProps({
	message: {type: Object, required: true},
});

const commentsStore = usePkpCommentsStore();
const {t} = usePkpLocalize();
</script>

<style>
.pkpComments__notification-needs-approval {
	display: flex;
	align-items: center;
}
</style>
